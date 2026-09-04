/**
 * optimizer.js
 * High-performance constraint satisfaction problem (CSP) solver for student timetables.
 * Guarantees zero time clashes, minimizes gaps between classes, prioritizes preferred doctors,
 * and allows optimizing for days off and uniform group letters.
 */

const ScheduleOptimizer = (() => {
  /**
   * Checks if two time intervals on the same day overlap.
   */
  function hasTimeOverlap(s1, s2) {
    if (s1.day !== s2.day) return false;
    return Math.max(s1.startSlot, s2.startSlot) <= Math.min(s1.endSlot, s2.endSlot);
  }

  /**
   * Checks if a new group's sessions clash with any already accepted session.
   */
  function checkGroupClash(groupSessions, acceptedSessions) {
    for (const gSession of groupSessions) {
      for (const aSession of acceptedSessions) {
        if (hasTimeOverlap(gSession, aSession)) {
          return true; // Clash found
        }
      }
    }
    return false; // No clash
  }

  /**
   * Computes gaps on each day for a given list of sessions.
   * A gap is defined as empty slots between the end of one class and start of the next class.
   */
  function calculateGaps(sessions) {
    const daySessions = {};
    sessions.forEach(s => {
      if (!daySessions[s.day]) daySessions[s.day] = [];
      daySessions[s.day].push(s);
    });

    const gapDetails = [];
    let totalGapSlots = 0;

    for (const [day, dayList] of Object.entries(daySessions)) {
      if (dayList.length <= 1) continue;

      // Sort chronologically by start slot
      dayList.sort((a, b) => a.startSlot - b.startSlot);

      for (let i = 0; i < dayList.length - 1; i++) {
        const current = dayList[i];
        const next = dayList[i + 1];

        // If next class starts after current ends + 1, there is a gap!
        if (next.startSlot > current.endSlot + 1) {
          const gapSize = next.startSlot - current.endSlot - 1;
          totalGapSlots += gapSize;
          gapDetails.push({
            day,
            fromSlot: current.endSlot,
            toSlot: next.startSlot,
            slots: gapSize,
            afterCourse: current.courseName,
            beforeCourse: next.courseName
          });
        }
      }
    }

    return { totalGapSlots, gapDetails };
  }

  /**
   * Normalizes doctor name for robust comparison
   */
  function cleanDoctorName(name) {
    return (name || '')
      .toLowerCase()
      .replace(/^(د\.|د\/|د\s+|dr\.|dr\s+|doctor\s+|prof\.|أ\.د\.?|م\.|eng\.)\s*/i, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Checks if doctor name matches target preference name
   */
  function matchesDoctor(docName, targetName) {
    if (!docName || !targetName) return false;
    if (docName === targetName) return true;
    const c1 = cleanDoctorName(docName);
    const c2 = cleanDoctorName(targetName);
    if (!c1 || !c2) return false;
    return c1 === c2 || c1.includes(c2) || c2.includes(c1);
  }

  /**
   * Evaluates doctor preference score.
   */
  function evaluateDoctorScore(selectedGroups, preferences) {
    const docPrefs = preferences.doctorPreferences || {};
    let score = 0;
    let matchedFavorites = 0;
    let matchedMandates = 0;
    let totalDoctorChoices = 0;

    selectedGroups.forEach(item => {
      const coursePrefs = docPrefs[item.courseCode] || docPrefs[item.courseId] || {};
      const instructors = item.instructors || item.groupData.instructors || [];

      instructors.forEach(doc => {
        totalDoctorChoices++;
        let pref = coursePrefs[doc];
        if (!pref) {
          for (const key of Object.keys(coursePrefs)) {
            if (matchesDoctor(doc, key)) {
              pref = coursePrefs[key];
              break;
            }
          }
        }
        if (!pref) pref = 'neutral';

        if (pref === 'mandate' || pref === 'mandated') {
          score += 10000;
          matchedMandates++;
          matchedFavorites++;
        } else if (pref === 'love') {
          score += 30;
          matchedFavorites++;
        } else if (pref === 'avoid') {
          score -= 500;
        } else {
          score += 5;
        }
      });
    });

    return { score, matchedFavorites, matchedMandates, totalDoctorChoices };
  }

  /**
   * Main Optimizer Function
   * @param {Array} courses - Selected course objects
   * @param {Object} options - User settings, weights, and constraints
   */
  function findOptimalSchedules(courses, options = {}) {
    if (!courses || courses.length === 0) {
      return { success: false, message: 'No courses selected.', solutions: [] };
    }

    const weights = {
      gapWeight: options.gapWeight !== undefined ? options.gapWeight : 50,
      daysWeight: options.daysWeight !== undefined ? options.daysWeight : 30,
      doctorWeight: options.doctorWeight !== undefined ? options.doctorWeight : 40,
      earlyWeight: options.earlyWeight !== undefined ? options.earlyWeight : 10,
      uniformGroupWeight: options.uniformGroupWeight !== undefined ? options.uniformGroupWeight : 20
    };

    const requestedFreeDays = new Set(options.freeDays || []);
    const maxDaysAllowed = options.maxDaysAllowed || 7;
    const requiredDoctors = options.requiredDoctors || {};

    // Build Set of Prohibited / Blocked Times (e.g. Saturday 8 o'clock training)
    const blockedSet = new Set();
    const blockedRules = options.blockedTimes || [];
    blockedRules.forEach(item => {
      if (typeof item === 'string') {
        blockedSet.add(item);
      } else if (item.day && item.slot) {
        blockedSet.add(`${item.day}:${item.slot}`);
      } else if (item.day && item.startSlot && item.endSlot) {
        for (let sl = item.startSlot; sl <= item.endSlot; sl++) {
          blockedSet.add(`${item.day}:${sl}`);
        }
      }
    });

    // Filter courses to those with available groups
    const activeCourses = courses.filter(c => c.groups && c.groups.length > 0);
    if (activeCourses.length === 0) {
      return { success: false, message: 'Selected courses have no group data.', solutions: [] };
    }

    // Identify all unique mandated and avoided instructors across courses
    const uniqueMandatedMap = {};
    const uniqueAvoidedMap = {};
    let totalUniqueMandated = 0;
    let totalUniqueAvoided = 0;

    activeCourses.forEach(c => {
      const cp = (options.doctorPreferences && (options.doctorPreferences[c.code] || options.doctorPreferences[c.id])) || {};
      const courseReq = requiredDoctors[c.code] || requiredDoctors[c.id];
      Object.keys(cp).forEach(raw => {
        const rating = cp[raw];
        const clean = cleanDoctorName(raw);
        if (rating === 'mandate' || rating === 'mandated') {
          if (!uniqueMandatedMap[`${c.code}:::${clean}`]) {
            uniqueMandatedMap[`${c.code}:::${clean}`] = { code: c.code, target: raw };
            totalUniqueMandated++;
          }
        } else if (rating === 'avoid') {
          if (!uniqueAvoidedMap[`${c.code}:::${clean}`]) {
            uniqueAvoidedMap[`${c.code}:::${clean}`] = { code: c.code, target: raw };
            totalUniqueAvoided++;
          }
        }
      });
      if (courseReq) {
        const clean = cleanDoctorName(courseReq);
        if (!uniqueMandatedMap[`${c.code}:::${clean}`]) {
          uniqueMandatedMap[`${c.code}:::${clean}`] = { code: c.code, target: courseReq };
          totalUniqueMandated++;
        }
      }
    });

    const MAX_SOLUTIONS_POOL = 2500;

    function runSearch(isStrictMandate) {
      const solutions = [];
      let evaluated = 0;

      function backtrack(courseIndex, currentSchedule, currentSessions) {
        if (solutions.length >= MAX_SOLUTIONS_POOL) return;

        if (courseIndex === activeCourses.length) {
          evaluated++;

          // 1. Check Max Days Allowed
          const activeDays = new Set(currentSessions.map(s => s.day));
          if (activeDays.size > maxDaysAllowed) return;

          // 2. Calculate Gaps
          const { totalGapSlots, gapDetails } = calculateGaps(currentSessions);

          // 3. Evaluate Doctor Score
          const docEval = evaluateDoctorScore(currentSchedule, options);

          // 4. Calculate Group Uniformity
          const groupCounts = {};
          currentSchedule.forEach(item => {
            groupCounts[item.group] = (groupCounts[item.group] || 0) + 1;
          });
          let maxSameGroupCount = 0;
          for (const k in groupCounts) {
            if (groupCounts[k] > maxSameGroupCount) maxSameGroupCount = groupCounts[k];
          }

          // 5. Calculate Early/Late preference
          let earlyFinishScore = 0;
          currentSessions.forEach(s => {
            earlyFinishScore += (16 - s.endSlot);
          });

          // 6. Overall Composite Score (higher is better)
          const compositeScore =
            (docEval.score * (weights.doctorWeight / 20)) -
            (totalGapSlots * (weights.gapWeight / 5) * 8) -
            (activeDays.size * (weights.daysWeight / 5) * 12) +
            (maxSameGroupCount * (weights.uniformGroupWeight / 5) * 10) +
            (earlyFinishScore * (weights.earlyWeight / 50));

          solutions.push({
            id: `sol_${solutions.length + 1}`,
            compositeScore,
            totalGapSlots,
            gapDetails,
            activeDaysCount: activeDays.size,
            activeDays: Array.from(activeDays),
            docEval,
            maxSameGroupCount,
            selectedGroups: currentSchedule.map(s => ({
              courseId: s.courseId,
              courseName: s.courseName,
              courseCode: s.courseCode,
              group: s.group,
              color: s.color,
              instructors: s.instructors
            })),
            sessions: currentSessions.slice(),
            blockedTimes: blockedRules
          });

          return;
        }

        const course = activeCourses[courseIndex];
        const groups = course.groups;

        // Extract course doctor preferences (Avoid & Mandate)
        const coursePrefs = (options.doctorPreferences && (options.doctorPreferences[course.code] || options.doctorPreferences[course.id])) || {};
        const avoidedDocs = Object.keys(coursePrefs).filter(k => coursePrefs[k] === 'avoid');
        const mandatedDocs = Object.keys(coursePrefs).filter(k => coursePrefs[k] === 'mandate' || coursePrefs[k] === 'mandated');
        const courseReqDoc = requiredDoctors[course.code] || requiredDoctors[course.id];
        if (courseReqDoc && !mandatedDocs.includes(courseReqDoc)) {
          mandatedDocs.push(courseReqDoc);
        }

        for (const grp of groups) {
          if (solutions.length >= MAX_SOLUTIONS_POOL) break;

          // Collect all instructors associated with this group
          const grpInstructors = Array.from(new Set([
            ...(grp.instructors || []),
            ...((grp.sessions || []).map(s => s.instructor).filter(Boolean))
          ]));

          // Constraint 1: Avoided Doctor (Strict Pruning ALWAYS - Never in any schedule)
          if (avoidedDocs.length > 0) {
            let hasAvoided = false;
            for (const av of avoidedDocs) {
              if (grpInstructors.some(inst => matchesDoctor(inst, av))) {
                hasAvoided = true;
                break;
              }
            }
            if (hasAvoided) continue;
          }

          // Constraint 2: Mandated Doctor (Strict Pruning in strict mode)
          if (isStrictMandate && mandatedDocs.length > 0) {
            let hasMandated = false;
            for (const req of mandatedDocs) {
              if (grpInstructors.some(inst => matchesDoctor(inst, req))) {
                hasMandated = true;
                break;
              }
            }
            if (!hasMandated) continue;
          }

          // Constraint: Free Days
          let landsOnFreeDay = false;
          for (const s of grp.sessions) {
            if (requestedFreeDays.has(s.day)) {
              landsOnFreeDay = true;
              break;
            }
          }
          if (landsOnFreeDay) continue;

          // Constraint: Blocked Times (e.g. Training/Work)
          let clashesWithBlockedTime = false;
          if (blockedSet.size > 0) {
            for (const s of grp.sessions) {
              for (let sl = s.startSlot; sl <= s.endSlot; sl++) {
                if (blockedSet.has(`${s.day}:${sl}`)) {
                  clashesWithBlockedTime = true;
                  break;
                }
              }
              if (clashesWithBlockedTime) break;
            }
          }
          if (clashesWithBlockedTime) continue;

          // Constraint: No Clashes with already accepted sessions
          const clashes = checkGroupClash(grp.sessions, currentSessions);
          if (clashes) continue;

          // Attach course details to sessions for display
          const enrichedSessions = grp.sessions.map(s => ({
            ...s,
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            group: grp.group,
            color: course.color
          }));

          currentSchedule.push({
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            group: grp.group,
            color: course.color,
            instructors: grpInstructors,
            groupData: grp
          });

          backtrack(
            courseIndex + 1,
            currentSchedule,
            currentSessions.concat(enrichedSessions)
          );

          currentSchedule.pop();
        }
      }

      backtrack(0, [], []);
      return { solutions, evaluated };
    }

    // Step 1: Attempt search with Strict Mandates
    let isFallback = false;
    let searchResult = runSearch(totalUniqueMandated > 0);

    // Step 2: If strict search found 0 solutions due to mandate overlaps, run fallback with maximum mandate scoring
    if (searchResult.solutions.length === 0 && totalUniqueMandated > 0) {
      isFallback = true;
      searchResult = runSearch(false);
    }

    const validSolutions = searchResult.solutions;
    const totalEvaluated = searchResult.evaluated;

    if (validSolutions.length === 0) {
      let message = 'No clash-free schedules found for this combination of courses.';
      if (totalUniqueMandated > 0 || totalUniqueAvoided > 0) {
        message = `No clash-free schedules found. You have ${totalUniqueMandated > 0 ? `${totalUniqueMandated} mandated doctor(s) (🌟🔒) ` : ''}${totalUniqueAvoided > 0 ? `${totalUniqueAvoided} avoided doctor(s) (🚫) ` : ''}which might be eliminating all available combinations. Try setting some to Neutral or relaxing free days.`;
      } else {
        message = 'No clash-free schedules found for this combination of courses. Try unchecking some free days or unblocking some times.';
      }

      return {
        success: false,
        totalEvaluated,
        message,
        solutions: []
      };
    }

    // Sort solutions descending by composite score
    validSolutions.sort((a, b) => b.compositeScore - a.compositeScore);

    // Identify minimum days and minimum gaps safely without spread operator to prevent call stack overflow
    let minDays = Infinity;
    let minGaps = Infinity;
    let maxDocScore = -Infinity;
    let maxMandatesMatched = 0;

    for (let i = 0; i < validSolutions.length; i++) {
      const s = validSolutions[i];
      if (s.activeDaysCount < minDays) minDays = s.activeDaysCount;
      if (s.totalGapSlots < minGaps) minGaps = s.totalGapSlots;
      if (s.docEval && s.docEval.score > maxDocScore) maxDocScore = s.docEval.score;
      if (s.docEval && s.docEval.matchedMandates > maxMandatesMatched) maxMandatesMatched = s.docEval.matchedMandates;
    }

    // Assign contextual badges
    validSolutions.forEach((sol, idx) => {
      sol.rank = idx + 1;
      sol.badges = [];

      if (idx === 0) {
        sol.badges.push({ text: '⭐ Best Overall', type: 'best' });
      }

      if (sol.docEval && sol.docEval.matchedMandates > 0) {
        if (totalUniqueMandated > 0 && sol.docEval.matchedMandates >= totalUniqueMandated) {
          sol.badges.push({ text: '🌟🔒 100% Mandated Doctors Included', type: 'mandate' });
        } else {
          sol.badges.push({ text: `🌟🔒 ${sol.docEval.matchedMandates}/${totalUniqueMandated} Mandated Included`, type: 'mandate' });
        }
      }

      if (sol.totalGapSlots === 0) {
        sol.badges.push({ text: '⚡ Zero Gaps (No Waiting)', type: 'zero-gap' });
      } else if (sol.totalGapSlots === minGaps && minGaps > 0) {
        sol.badges.push({ text: `👌 Minimal Gaps (${minGaps} slots)`, type: 'min-gap' });
      }

      if (sol.activeDaysCount === minDays) {
        sol.badges.push({ text: `🏖️ Only ${minDays} Days On Campus`, type: 'min-days' });
      }

      if (sol.docEval.score === maxDocScore && maxDocScore > 0) {
        sol.badges.push({ text: '👨‍🏫 Top Doctor Match', type: 'doctor' });
      }

      if (sol.maxSameGroupCount === activeCourses.length && activeCourses.length > 1) {
        sol.badges.push({ text: '🎯 100% Same Group Letter', type: 'uniform' });
      }
    });

    let fallbackNotice = null;
    if (isFallback && totalUniqueMandated > 0) {
      fallbackNotice = `Some mandated doctors have conflicting lecture hours. Showing the best clash-free schedules containing ${maxMandatesMatched} of your ${totalUniqueMandated} mandated doctors.`;
    }

    return {
      success: true,
      totalEvaluated,
      validCount: validSolutions.length,
      solutions: validSolutions,
      fallbackNotice,
      minGaps,
      minDays
    };
  }

  return {
    findOptimalSchedules,
    calculateGaps,
    hasTimeOverlap
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleOptimizer;
}
