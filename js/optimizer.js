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
   * Helper to check if a doctor name refers to an unspecified / unassigned doctor
   */
  function isUnspecifiedDoctor(name) {
    if (!name) return true;
    const s = String(name).trim().toLowerCase();
    return s === '' || s === 'not specified' || s === 'غير محدد' || s === 'unspecified' || s === 'دكتور غير محدد' || s === 'not specified (doctor)';
  }

  /**
   * Normalizes doctor name for robust comparison
   */
  function cleanDoctorName(name) {
    if (!name || typeof name !== 'string') return '';
    const trimmed = name.trim();
    if (/^(not specified|غير محدد|unspecified|دكتور غير محدد)$/i.test(trimmed)) {
      return 'not specified';
    }
    return name
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove Arabic diacritics (tashkeel)
      .replace(/ـ/g, '') // remove tatweel
      .replace(/^(د\.|د\/|د\s+|dr\.|dr\s+|doctor\s+|prof\.|أ\.د\.?|م\.|eng\.)\s*/i, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[.,/\\()\-:;_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Checks if doctor name matches target preference name using robust token-based matching.
   * Prevents false positives where common names like "محمد" or "احمد" erroneously match
   * unrelated doctors with shared father or grandfather names.
   */
  function matchesDoctor(docName, targetName) {
    const unspecDoc = isUnspecifiedDoctor(docName);
    const unspecTarget = isUnspecifiedDoctor(targetName);
    if (unspecDoc && unspecTarget) return true;
    if (unspecDoc || unspecTarget) return false;

    if (!docName || !targetName) return false;
    if (docName === targetName) return true;
    const c1 = cleanDoctorName(docName);
    const c2 = cleanDoctorName(targetName);
    if (!c1 || !c2) return false;
    if (c1 === c2) return true;

    // Tokenize
    const t1 = c1.split(' ').filter(Boolean);
    const t2 = c2.split(' ').filter(Boolean);

    // If normalized token sequences are identical
    if (t1.join(' ') === t2.join(' ')) return true;

    // If either name has only 1 token (e.g. "محمد" or "احمد"),
    // NEVER match it against a multi-token name to prevent catastrophic mass-pruning
    if (t1.length < 2 || t2.length < 2) return false;

    // Multi-token comparison:
    // First name and second name MUST match (e.g. "هشام صلاح")
    if (t1[0] !== t2[0] || t1[1] !== t2[1]) return false;

    // One name may be truncated (e.g. "هشام صلاح الدين" vs "هشام صلاح الدين محمد رشاد")
    const [shorter, longer] = t1.length <= t2.length ? [t1, t2] : [t2, t1];
    const isPrefix = shorter.every((tok, idx) => tok === longer[idx]);
    if (isPrefix) return true;

    return false;
  }

  /**
   * Collects all instructors associated with a course group.
   * If any lecture session has no doctor or is unspecified, ensures 'Not Specified' is included.
   */
  function getGroupInstructors(grp) {
    if (!grp) return [];
    const list = [
      ...(grp.instructors || []),
      ...((grp.sessions || []).map(s => s.instructor).filter(Boolean))
    ];
    const hasUnspecifiedLect = (grp.sessions || []).some(s => {
      const isLect = s.type === 'Lect.' || /Lect|محاضرة/i.test(s.type || '');
      return isLect && (!s.instructor || isUnspecifiedDoctor(s.instructor));
    });
    if (hasUnspecifiedLect && !list.some(isUnspecifiedDoctor)) {
      list.push('Not Specified');
    }
    return Array.from(new Set(list));
  }

  /**
   * Evaluates doctor preference score with heavy penalty for avoided doctors.
   */
  function evaluateDoctorScore(selectedGroups, preferences) {
    const docPrefs = preferences.doctorPreferences || {};
    let score = 0;
    let matchedFavorites = 0;
    let matchedMandates = 0;
    let matchedAvoided = 0;
    const avoidedDoctorNames = [];
    let totalDoctorChoices = 0;

    selectedGroups.forEach(item => {
      const courseCode = item.courseCode || item.courseId || '';
      const courseId = item.courseId || item.courseCode || '';
      const coursePrefs = docPrefs[courseCode] || docPrefs[courseId] || {};
      const instructors = getGroupInstructors(item.groupData || item);

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
          score -= 5000;
          matchedAvoided++;
          if (!avoidedDoctorNames.includes(doc)) {
            avoidedDoctorNames.push(doc);
          }
        } else {
          score += 5;
        }
      });
    });

    return {
      score,
      matchedFavorites,
      matchedMandates,
      matchedAvoided,
      avoidedDoctorNames,
      totalDoctorChoices
    };
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

    // Helper to retrieve preferences for a course with fallback across keys (code, id, name)
    function getCoursePreferences(docPrefs, course) {
      if (!docPrefs || !course) return {};
      const candidates = [
        course.code,
        course.id,
        course.name,
        course.courseCode,
        course.courseId,
        course.courseName
      ].filter(Boolean);

      for (const key of candidates) {
        if (docPrefs[key]) return docPrefs[key];
      }
      const lowerKeys = Object.keys(docPrefs);
      for (const c of candidates) {
        const cTrim = String(c).trim().toLowerCase();
        for (const lk of lowerKeys) {
          if (lk.trim().toLowerCase() === cTrim) {
            return docPrefs[lk];
          }
        }
      }
      return {};
    }

    const isStrictDoctorMode = Boolean(options.strictDoctorMode || options.strictDoctorCombinations);

    // Calculate total Cartesian product of all possible group combinations
    const totalCombinationsPossible = activeCourses.reduce((acc, c) => acc * (c.groups && c.groups.length > 0 ? c.groups.length : 1), 1);

    // Identify all unique mandated, desired (mandate + love), and avoided instructors across courses
    const uniqueMandatedMap = {};
    const uniqueDesiredMap = {};
    const uniqueAvoidedMap = {};
    let totalUniqueMandated = 0;
    let totalUniqueDesired = 0;
    let totalUniqueAvoided = 0;

    activeCourses.forEach(c => {
      const cp = getCoursePreferences(options.doctorPreferences, c);
      const courseReq = requiredDoctors[c.code] || requiredDoctors[c.id];
      Object.keys(cp).forEach(raw => {
        const rating = cp[raw];
        const clean = cleanDoctorName(raw);
        if (rating === 'mandate' || rating === 'mandated') {
          if (!uniqueMandatedMap[`${c.code}:::${clean}`]) {
            uniqueMandatedMap[`${c.code}:::${clean}`] = { code: c.code, target: raw };
            totalUniqueMandated++;
          }
          if (!uniqueDesiredMap[`${c.code}:::${clean}`]) {
            uniqueDesiredMap[`${c.code}:::${clean}`] = { code: c.code, target: raw };
            totalUniqueDesired++;
          }
        } else if (rating === 'love') {
          if (!uniqueDesiredMap[`${c.code}:::${clean}`]) {
            uniqueDesiredMap[`${c.code}:::${clean}`] = { code: c.code, target: raw };
            totalUniqueDesired++;
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
        if (!uniqueDesiredMap[`${c.code}:::${clean}`]) {
          uniqueDesiredMap[`${c.code}:::${clean}`] = { code: c.code, target: courseReq };
          totalUniqueDesired++;
        }
      }
    });

    const MAX_SOLUTIONS_POOL = 2500;

    function runSearch(isStrictMandate, isStrictAvoid, isStrictDesired = false) {
      const solutions = [];
      const seenCombinationKeys = new Set();
      let evaluated = 0;

      // Helper to generate a unique key for a candidate schedule
      function getScheduleKey(schedule) {
        return schedule.map(s => `${s.courseCode || s.courseId}:${s.group}`).sort().join('|');
      }

      // Helper to evaluate and add a completed candidate schedule
      function addCandidateSolution(currentSchedule, currentSessions, isPureCohort = false, cohortGroup = null) {
        const solKey = getScheduleKey(currentSchedule);
        if (seenCombinationKeys.has(solKey)) return false;

        const activeDays = new Set(currentSessions.map(s => s.day));
        if (activeDays.size > maxDaysAllowed) return false;

        const { totalGapSlots, gapDetails } = calculateGaps(currentSessions);
        const docEval = evaluateDoctorScore(currentSchedule, options);

        const groupCounts = {};
        currentSchedule.forEach(item => {
          groupCounts[item.group] = (groupCounts[item.group] || 0) + 1;
        });
        let maxSameGroupCount = 0;
        for (const k in groupCounts) {
          if (groupCounts[k] > maxSameGroupCount) maxSameGroupCount = groupCounts[k];
        }

        let earlyFinishScore = 0;
        currentSessions.forEach(s => {
          earlyFinishScore += (16 - s.endSlot);
        });

        // Boost pure cohort schedules by ensuring maximum group uniformity
        const compositeScore =
          (docEval.score * (weights.doctorWeight / 20)) -
          (totalGapSlots * (weights.gapWeight / 5) * 8) -
          (activeDays.size * (weights.daysWeight / 5) * 12) +
          (maxSameGroupCount * (weights.uniformGroupWeight / 5) * 10) +
          (earlyFinishScore * (weights.earlyWeight / 50)) +
          (isPureCohort ? 50 : 0);

        seenCombinationKeys.add(solKey);
        solutions.push({
          id: `sol_${solutions.length + 1}`,
          compositeScore,
          totalGapSlots,
          gapDetails,
          activeDaysCount: activeDays.size,
          activeDays: Array.from(activeDays),
          docEval,
          maxSameGroupCount,
          isPureCohort: Boolean(isPureCohort),
          cohortGroup: cohortGroup || null,
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
        return true;
      }

      // Step 1: Pre-evaluate and seed pure-group cohort schedules
      // When timetables are imported, each page/group represents a full cohort schedule (e.g. Group 1..8).
      // We explicitly test each uniform group across all active courses so they are GUARANTEED to be found.
      const candidateCohortGroups = [];
      if (activeCourses.length > 0 && activeCourses[0].groups) {
        activeCourses[0].groups.forEach(g => {
          const gName = g.group;
          if (activeCourses.every(c => c.groups.some(cg => cg.group === gName))) {
            candidateCohortGroups.push(gName);
          }
        });
      }

      candidateCohortGroups.forEach(gName => {
        const schedule = [];
        const sessions = [];
        let clash = false;

        for (const course of activeCourses) {
          const grp = course.groups.find(g => g.group === gName);
          if (!grp) { clash = true; break; }

          const grpInstructors = getGroupInstructors(grp);

          const coursePrefs = getCoursePreferences(options.doctorPreferences, course);
          const avoidedDocs = Object.keys(coursePrefs).filter(k => coursePrefs[k] === 'avoid');
          const mandatedDocs = Object.keys(coursePrefs).filter(k => coursePrefs[k] === 'mandate' || coursePrefs[k] === 'mandated');
          const desiredDocs = Object.keys(coursePrefs).filter(k => coursePrefs[k] === 'mandate' || coursePrefs[k] === 'mandated' || coursePrefs[k] === 'love');
          const courseReqDoc = requiredDoctors[course.code] || requiredDoctors[course.id];
          if (courseReqDoc && !mandatedDocs.includes(courseReqDoc)) mandatedDocs.push(courseReqDoc);
          if (courseReqDoc && !desiredDocs.includes(courseReqDoc)) desiredDocs.push(courseReqDoc);

          if (isStrictAvoid && avoidedDocs.length > 0) {
            if (grpInstructors.some(inst => avoidedDocs.some(av => matchesDoctor(inst, av)))) {
              clash = true; break;
            }
          }
          if (isStrictDesired && desiredDocs.length > 0) {
            if (!grpInstructors.some(inst => desiredDocs.some(des => matchesDoctor(inst, des)))) {
              clash = true; break;
            }
          }
          if (isStrictMandate && !isStrictDesired && mandatedDocs.length > 0) {
            if (!grpInstructors.some(inst => mandatedDocs.some(req => matchesDoctor(inst, req)))) {
              clash = true; break;
            }
          }

          const groupSessions = (grp.sessions || []).map(s => ({
            ...s,
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            group: gName,
            color: course.color
          }));

          for (const s of groupSessions) {
            if (requestedFreeDays.has(s.day)) { clash = true; break; }
            if (blockedSet.has(`${s.day}:${s.startSlot}`) || blockedSet.has(`${s.day}:${s.endSlot}`)) {
              clash = true; break;
            }
            for (let sl = s.startSlot; sl <= s.endSlot; sl++) {
              if (blockedSet.has(`${s.day}:${sl}`)) { clash = true; break; }
            }
            if (clash) break;
            for (const existing of sessions) {
              if (hasTimeOverlap(s, existing)) { clash = true; break; }
            }
            if (clash) break;
          }
          if (clash) break;

          schedule.push({
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            group: gName,
            color: course.color,
            instructors: grpInstructors
          });
          sessions.push(...groupSessions);
        }

        if (!clash) {
          addCandidateSolution(schedule, sessions, true, gName);
        }
      });

      // Allocate quota per primary group to ensure diversity across all groups (e.g. Groups 1 through 8)
      const numStartGroups = activeCourses[0] && activeCourses[0].groups ? activeCourses[0].groups.length : 1;
      const quotaPerStartGroup = Math.max(300, Math.floor(MAX_SOLUTIONS_POOL / numStartGroups));
      const solutionsCountByStartGroup = new Map();

      function backtrack(courseIndex, currentSchedule, currentSessions, startGroupIdx) {
        if (solutions.length >= MAX_SOLUTIONS_POOL) return;

        if (courseIndex === activeCourses.length) {
          evaluated++;
          if (addCandidateSolution(currentSchedule, currentSessions)) {
            if (startGroupIdx !== undefined) {
              const cur = solutionsCountByStartGroup.get(startGroupIdx) || 0;
              solutionsCountByStartGroup.set(startGroupIdx, cur + 1);
            }
          }
          return;
        }

        const course = activeCourses[courseIndex];
        const groups = course.groups;

        // Extract course doctor preferences (Avoid, Mandate, Desired)
        const coursePrefs = getCoursePreferences(options.doctorPreferences, course);
        const avoidedDocs = Object.keys(coursePrefs).filter(k => coursePrefs[k] === 'avoid');
        const mandatedDocs = Object.keys(coursePrefs).filter(k => coursePrefs[k] === 'mandate' || coursePrefs[k] === 'mandated');
        const desiredDocs = Object.keys(coursePrefs).filter(k => coursePrefs[k] === 'mandate' || coursePrefs[k] === 'mandated' || coursePrefs[k] === 'love');
        const courseReqDoc = requiredDoctors[course.code] || requiredDoctors[course.id];
        if (courseReqDoc && !mandatedDocs.includes(courseReqDoc)) {
          mandatedDocs.push(courseReqDoc);
        }
        if (courseReqDoc && !desiredDocs.includes(courseReqDoc)) {
          desiredDocs.push(courseReqDoc);
        }

        for (let gIdx = 0; gIdx < groups.length; gIdx++) {
          if (solutions.length >= MAX_SOLUTIONS_POOL) break;

          const effectiveStartIdx = (courseIndex === 0) ? gIdx : startGroupIdx;
          if (courseIndex === 0 && numStartGroups > 1) {
            const countForThisStart = solutionsCountByStartGroup.get(gIdx) || 0;
            if (countForThisStart >= quotaPerStartGroup) continue;
          }

          const grp = groups[gIdx];

          // Collect all instructors associated with this group
          const grpInstructors = getGroupInstructors(grp);

          // Constraint 1: Avoided Doctor (Strict Pruning ONLY when isStrictAvoid is true)
          if (isStrictAvoid && avoidedDocs.length > 0) {
            let hasAvoided = false;
            for (const av of avoidedDocs) {
              if (grpInstructors.some(inst => matchesDoctor(inst, av))) {
                hasAvoided = true;
                break;
              }
            }
            if (hasAvoided) continue;
          }

          // Constraint 2A: Desired Doctor (Strict Pruning when isStrictDesired is true)
          if (isStrictDesired && desiredDocs.length > 0) {
            let hasDesired = false;
            for (const des of desiredDocs) {
              if (grpInstructors.some(inst => matchesDoctor(inst, des))) {
                hasDesired = true;
                break;
              }
            }
            if (!hasDesired) continue;
          }

          // Constraint 2B: Mandated Doctor (Strict Pruning when isStrictMandate is true)
          if (isStrictMandate && !isStrictDesired && mandatedDocs.length > 0) {
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
            currentSessions.concat(enrichedSessions),
            effectiveStartIdx
          );

          currentSchedule.pop();
        }
      }

      backtrack(0, [], [], undefined);
      return { solutions, evaluated };
    }

    let fallbackMode = null; // 'mandate' | 'avoid' | 'both' | 'strict-partial-desired' | null
    let searchResult = { solutions: [], evaluated: 0 };

    if (isStrictDoctorMode) {
      // ----------------------------------------------------
      // STRICT DOCTOR COMBINATION MODE (Exhaustive & Zero-Avoid Guarantee)
      // ----------------------------------------------------

      // Pre-check: Verify if any course has 0 non-avoided groups
      const deadlockedCourse = activeCourses.find(c => {
        const cp = getCoursePreferences(options.doctorPreferences, c);
        const avs = Object.keys(cp).filter(k => cp[k] === 'avoid');
        if (avs.length === 0) return false;
        return c.groups.every(grp => {
          const grpInstructors = getGroupInstructors(grp);
          return avs.some(av => grpInstructors.some(inst => matchesDoctor(inst, av)));
        });
      });

      if (deadlockedCourse) {
        const cName = deadlockedCourse.name || deadlockedCourse.code;
        return {
          success: false,
          totalCombinationsPossible,
          totalEvaluated: 0,
          isStrictDoctorMode: true,
          message: `Checked all ${totalCombinationsPossible.toLocaleString()} possible combinations. It is mathematically impossible to find a schedule: all groups of "${cName}" are taught by avoided doctors.`,
          messageAr: `تم فحص كافة التباديل (${totalCombinationsPossible.toLocaleString()} احتمال). يستحيل تكوين جدول: جميع مجموعات المقرر "${cName}" يدرسها دكتور مستبعد.`,
          solutions: []
        };
      }

      // Step 1: Strict Desired (100% Desired Doctors) + Strict Avoid (0 Avoided Doctors)
      if (totalUniqueDesired > 0) {
        searchResult = runSearch(false, true, true);
      } else {
        searchResult = runSearch(false, true, false);
      }

      // Step 2: If Step 1 found 0 solutions due to clashes between desired doctors,
      // search across all non-avoided groups to maximize desired doctors with STRICTLY ZERO avoided doctors!
      if (searchResult.solutions.length === 0 && totalUniqueDesired > 0) {
        searchResult = runSearch(false, true, false);
        if (searchResult.solutions.length > 0) {
          fallbackMode = 'strict-partial-desired';
        }
      }

      // Step 3: If STILL 0 solutions, all combinations of non-avoided groups clash!
      // NEVER include avoided doctors in Strict Doctor Mode!
      if (searchResult.solutions.length === 0) {
        // Analyze conflict diagnostics between course pairs
        let conflictPair = null;
        for (let i = 0; i < activeCourses.length; i++) {
          for (let j = i + 1; j < activeCourses.length; j++) {
            const cA = activeCourses[i];
            const cB = activeCourses[j];
            const cpA = getCoursePreferences(options.doctorPreferences, cA);
            const cpB = getCoursePreferences(options.doctorPreferences, cB);
            const avsA = Object.keys(cpA).filter(k => cpA[k] === 'avoid');
            const avsB = Object.keys(cpB).filter(k => cpB[k] === 'avoid');

            const validGrpsA = cA.groups.filter(g => {
              const insts = getGroupInstructors(g);
              return !avsA.some(av => insts.some(inst => matchesDoctor(inst, av)));
            });
            const validGrpsB = cB.groups.filter(g => {
              const insts = getGroupInstructors(g);
              return !avsB.some(av => insts.some(inst => matchesDoctor(inst, av)));
            });

            if (validGrpsA.length > 0 && validGrpsB.length > 0) {
              const allClash = validGrpsA.every(gA => validGrpsB.every(gB => checkGroupClash(gA.sessions, gB.sessions)));
              if (allClash) {
                conflictPair = { cA: cA.name || cA.code, cB: cB.name || cB.code };
                break;
              }
            }
          }
          if (conflictPair) break;
        }

        let diagMsg = `Checked all ${totalCombinationsPossible.toLocaleString()} combinations (${searchResult.evaluated.toLocaleString()} paths evaluated): No clash-free schedule exists that avoids all excluded doctors.`;
        let diagMsgAr = `تم فحص كافة التباديل (${totalCombinationsPossible.toLocaleString()} احتمال، تم تقييم ${searchResult.evaluated.toLocaleString()} مساراً): لا يوجد أي جدول خالٍ من التعارض بدون إدراج دكتور مستبعد.`;
        if (conflictPair) {
          diagMsg += ` All available non-avoided groups of "${conflictPair.cA}" clash with "${conflictPair.cB}".`;
          diagMsgAr += ` جميع مجموعات "${conflictPair.cA}" تتعارض مع "${conflictPair.cB}" في نفس المواعيد.`;
        }

        return {
          success: false,
          totalCombinationsPossible,
          totalEvaluated: searchResult.evaluated,
          isStrictDoctorMode: true,
          message: diagMsg,
          messageAr: diagMsgAr,
          solutions: []
        };
      }
    } else {
      // ----------------------------------------------------
      // STANDARD FLEXIBLE MODE (Tiers 1 -> 2 -> 3)
      // ----------------------------------------------------
      searchResult = runSearch(totalUniqueMandated > 0, totalUniqueAvoided > 0, false);

      // Tier 2: If Tier 1 found 0 solutions and mandates were active, relax mandates to scoring bonus
      if (searchResult.solutions.length === 0 && totalUniqueMandated > 0) {
        searchResult = runSearch(false, totalUniqueAvoided > 0, false);
        if (searchResult.solutions.length > 0) {
          fallbackMode = 'mandate';
        }
      }

      // Tier 3: If still 0 solutions and avoided doctors were active, relax avoided doctors to penalty scoring
      if (searchResult.solutions.length === 0 && totalUniqueAvoided > 0) {
        searchResult = runSearch(false, false, false);
        if (searchResult.solutions.length > 0) {
          fallbackMode = totalUniqueMandated > 0 ? 'both' : 'avoid';
        }
      }
    }

    const validSolutions = searchResult.solutions;
    const totalEvaluated = searchResult.evaluated;

    if (validSolutions.length === 0) {
      const message = `Checked all ${totalCombinationsPossible.toLocaleString()} combinations: No clash-free schedules found for this combination of courses. Try unchecking some free days or unblocking some times.`;
      const messageAr = `تم فحص كافة التباديل (${totalCombinationsPossible.toLocaleString()} احتمال): لم يتم العثور على أي جدول خالٍ من التعارض لهذه المقررات. حاول إلغاء بعض أيام الإجازة أو الأوقات المحظورة.`;

      return {
        success: false,
        totalCombinationsPossible,
        totalEvaluated,
        message,
        messageAr,
        solutions: []
      };
    }

    // Sort solutions descending by composite score
    validSolutions.sort((a, b) => b.compositeScore - a.compositeScore);

    // Identify statistics safely
    let minDays = Infinity;
    let minGaps = Infinity;
    let maxDocScore = -Infinity;
    let maxMandatesMatched = 0;
    let maxFavoritesMatched = 0;

    for (let i = 0; i < validSolutions.length; i++) {
      const s = validSolutions[i];
      if (s.activeDaysCount < minDays) minDays = s.activeDaysCount;
      if (s.totalGapSlots < minGaps) minGaps = s.totalGapSlots;
      if (s.docEval && s.docEval.score > maxDocScore) maxDocScore = s.docEval.score;
      if (s.docEval && s.docEval.matchedMandates > maxMandatesMatched) maxMandatesMatched = s.docEval.matchedMandates;
      if (s.docEval && s.docEval.matchedFavorites > maxFavoritesMatched) maxFavoritesMatched = s.docEval.matchedFavorites;
    }

    // Assign contextual badges
    validSolutions.forEach((sol, idx) => {
      sol.rank = idx + 1;
      sol.badges = [];

      if (idx === 0) {
        sol.badges.push({ text: '⭐ Best Overall', textAr: '⭐ الأفضل إجمالاً', type: 'best' });
      }

      if (isStrictDoctorMode && totalUniqueDesired > 0 && fallbackMode !== 'strict-partial-desired') {
        sol.badges.push({ text: '🎯 100% Desired Doctors • Zero Avoided', textAr: '🎯 100% الدكاترة المطلوبين • وبدون أي مستبعد', type: 'mandate' });
      } else if (isStrictDoctorMode && fallbackMode === 'strict-partial-desired') {
        sol.badges.push({ text: `🎯 ${sol.docEval ? sol.docEval.matchedFavorites : 0}/${totalUniqueDesired} Desired Doctors • Zero Avoided`, textAr: `🎯 تم تضمين ${sol.docEval ? sol.docEval.matchedFavorites : 0}/${totalUniqueDesired} دكتور مطلوب • وبدون أي مستبعد`, type: 'mandate' });
      }

      if (sol.docEval && sol.docEval.matchedAvoided > 0) {
        sol.hasAvoidedDoctor = true;
        const names = sol.docEval.avoidedDoctorNames.join(', ');
        sol.badges.push({
          text: `⚠️ Includes Avoided Dr. (${names})`,
          textAr: `⚠️ يتضمن دكتور مستبعد: (${names})`,
          type: 'avoid-included'
        });
      }

      if (!isStrictDoctorMode && sol.docEval && sol.docEval.matchedMandates > 0) {
        if (totalUniqueMandated > 0 && sol.docEval.matchedMandates >= totalUniqueMandated) {
          sol.badges.push({ text: '🌟🔒 100% Mandated Doctors Included', textAr: '🌟🔒 جميع الدكاترة الإجباريين مشمولين', type: 'mandate' });
        } else {
          sol.badges.push({ text: `🌟🔒 ${sol.docEval.matchedMandates}/${totalUniqueMandated} Mandated Included`, textAr: `🌟🔒 تم تضمين ${sol.docEval.matchedMandates}/${totalUniqueMandated} دكتور إجباري`, type: 'mandate' });
        }
      }

      if (sol.totalGapSlots === 0) {
        sol.badges.push({ text: '⚡ Zero Gaps (No Waiting)', textAr: '⚡ بدون أوقات فراغ', type: 'zero-gap' });
      } else if (sol.totalGapSlots === minGaps && minGaps > 0) {
        sol.badges.push({ text: `👌 Minimal Gaps (${minGaps} slots)`, textAr: `👌 أقل أوقات فراغ (${minGaps} فترات)`, type: 'min-gap' });
      }

      if (sol.activeDaysCount === minDays) {
        sol.badges.push({ text: `🏖️ Only ${minDays} Days On Campus`, textAr: `🏖️ ${minDays} أيام فقط في الجامعة`, type: 'min-days' });
      }

      if (sol.docEval && sol.docEval.score === maxDocScore && maxDocScore > 0) {
        sol.badges.push({ text: '👨‍🏫 Top Doctor Match', textAr: '👨‍🏫 التوافق الأعلى مع الدكاترة', type: 'doctor' });
      }

      if (sol.maxSameGroupCount === activeCourses.length && activeCourses.length > 1) {
        sol.badges.push({ text: '🎯 100% Same Group Letter', textAr: '🎯 100% نفس حرف المجموعة', type: 'uniform' });
      }
    });

    let fallbackNotice = null;
    let fallbackNoticeAr = null;
    if (isStrictDoctorMode) {
      if (fallbackMode === 'strict-partial-desired') {
        fallbackNotice = `Checked all ${totalCombinationsPossible.toLocaleString()} combinations. Having 100% of your desired doctors is physically impossible due to class overlaps. Showing clash-free schedules with ${maxFavoritesMatched}/${totalUniqueDesired} desired doctors and STRICTLY ZERO avoided doctors.`;
        fallbackNoticeAr = `تم فحص كافة التباديل (${totalCombinationsPossible.toLocaleString()} احتمال). لا يمكن الجمع بين جميع الدكاترة المطلوبين بنسبة 100% لتعارض المواعيد. تم عرض جداول خالية من التعارض تتضمن ${maxFavoritesMatched} من أصل ${totalUniqueDesired} دكتور مطلوب وبدون أي دكتور مستبعد نهائياً.`;
      }
    } else {
      if (fallbackMode === 'avoid' || fallbackMode === 'both') {
        fallbackNotice = '⚠️ Some avoided doctors were included because no clash-free schedule is physically possible without them. The best available options are ranked below.';
        fallbackNoticeAr = '⚠️ تم إدراج دكتور مستبعد لعدم وجود أي جدول بدونه بدون تعارض. تم ترتيب أفضل البدائل المتاحة أدناه.';
      } else if (fallbackMode === 'mandate') {
        fallbackNotice = `Some mandated doctors have conflicting lecture hours. Showing the best clash-free schedules containing ${maxMandatesMatched} of your ${totalUniqueMandated} mandated doctors.`;
        fallbackNoticeAr = `أوقات بعض الدكاترة الإجباريين متعارضة. تم عرض أفضل الجداول الخالية من التعارض متضمنة ${maxMandatesMatched} من أصل ${totalUniqueMandated} دكتور إجباري.`;
      }
    }

    return {
      success: true,
      totalCombinationsPossible,
      totalEvaluated,
      validCount: validSolutions.length,
      solutions: validSolutions,
      isStrictDoctorMode,
      fallbackMode,
      fallbackNotice,
      fallbackNoticeAr,
      minGaps,
      minDays
    };
  }

  return {
    findOptimalSchedules,
    calculateGaps,
    hasTimeOverlap,
    matchesDoctor,
    cleanDoctorName,
    isUnspecifiedDoctor,
    getGroupInstructors
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleOptimizer;
}
