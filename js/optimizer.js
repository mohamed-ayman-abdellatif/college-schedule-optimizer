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
   * Evaluates doctor preference score.
   */
  function evaluateDoctorScore(selectedGroups, preferences) {
    const docPrefs = preferences.doctorPreferences || {};
    let score = 0;
    let matchedFavorites = 0;
    let totalDoctorChoices = 0;

    selectedGroups.forEach(item => {
      const coursePrefs = docPrefs[item.courseCode] || docPrefs[item.courseId] || {};
      const instructors = item.groupData.instructors || [];

      instructors.forEach(doc => {
        totalDoctorChoices++;
        let pref = coursePrefs[doc];
        if (!pref) {
          const cleanDoc = (doc || '').replace(/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?|م\.|Eng\.)\s*/i, '').trim();
          for (const key of Object.keys(coursePrefs)) {
            const cleanKey = key.replace(/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?|م\.|Eng\.)\s*/i, '').trim();
            if (cleanKey && cleanDoc && (cleanKey === cleanDoc || cleanDoc.includes(cleanKey) || cleanKey.includes(cleanDoc))) {
              pref = coursePrefs[key];
              break;
            }
          }
        }
        if (!pref) pref = 'neutral';

        if (pref === 'love') {
          score += 30;
          matchedFavorites++;
        } else if (pref === 'avoid') {
          score -= 50;
        } else {
          score += 5;
        }
      });
    });

    return { score, matchedFavorites, totalDoctorChoices };
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

    const validSolutions = [];
    let totalEvaluated = 0;

    // Filter courses to those with available groups
    const activeCourses = courses.filter(c => c.groups && c.groups.length > 0);
    if (activeCourses.length === 0) {
      return { success: false, message: 'Selected courses have no group data.', solutions: [] };
    }

    /**
     * Recursive Backtracking Search with Early Branch Pruning
     */
    function backtrack(courseIndex, currentSchedule, currentSessions) {
      if (courseIndex === activeCourses.length) {
        // All courses scheduled clash-free!
        totalEvaluated++;

        // 1. Calculate Active Days
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
        const maxSameGroupCount = Math.max(...Object.values(groupCounts), 0);

        // 5. Calculate Early/Late preference
        // Early finish: penalize higher slot numbers
        let earlyFinishScore = 0;
        currentSessions.forEach(s => {
          earlyFinishScore += (16 - s.endSlot);
        });

        // 6. Overall Composite Score
        // Higher is better
        const compositeScore =
          (docEval.score * (weights.doctorWeight / 20)) -
          (totalGapSlots * (weights.gapWeight / 5) * 8) -
          (activeDays.size * (weights.daysWeight / 5) * 12) +
          (maxSameGroupCount * (weights.uniformGroupWeight / 5) * 10) +
          (earlyFinishScore * (weights.earlyWeight / 50));

        validSolutions.push({
          id: `sol_${validSolutions.length + 1}`,
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
            instructors: s.groupData.instructors || []
          })),
          sessions: currentSessions.slice(),
          blockedTimes: blockedRules
        });

        return;
      }

      const course = activeCourses[courseIndex];
      const groups = course.groups;

      for (const grp of groups) {
        // Constraint: Check Required Doctor
        const courseReqDoc = requiredDoctors[course.code] || requiredDoctors[course.id];
        if (courseReqDoc && (!grp.instructors || !grp.instructors.includes(courseReqDoc))) {
          continue; // Skip group that doesn't have the required doctor
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

        // Constraint: Check Prohibited / Blocked Times (e.g. Saturday 8 o'clock training)
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
        if (clashesWithBlockedTime) continue; // Prune group that conflicts with training/busy time!

        // Constraint: No Clashes with already accepted sessions
        const clashes = checkGroupClash(grp.sessions, currentSessions);
        if (clashes) continue; // Prune branch immediately!

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

    // Launch Solver
    backtrack(0, [], []);

    if (validSolutions.length === 0) {
      return {
        success: false,
        totalEvaluated,
        message: 'No clash-free schedules found for this combination of courses. Try unchecking some free days or allowing all doctors.',
        solutions: []
      };
    }

    // Sort solutions descending by composite score
    validSolutions.sort((a, b) => b.compositeScore - a.compositeScore);

    // Identify minimum days and minimum gaps among all solutions
    const minDays = Math.min(...validSolutions.map(s => s.activeDaysCount));
    const minGaps = Math.min(...validSolutions.map(s => s.totalGapSlots));
    const maxDocScore = Math.max(...validSolutions.map(s => s.docEval.score));

    // Assign contextual badges
    validSolutions.forEach((sol, idx) => {
      sol.rank = idx + 1;
      sol.badges = [];

      if (idx === 0) {
        sol.badges.push({ text: '⭐ Best Overall', type: 'best' });
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

    return {
      success: true,
      totalEvaluated,
      validCount: validSolutions.length,
      solutions: validSolutions,
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
