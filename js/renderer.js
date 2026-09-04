/**
 * renderer.js
 * Renders the responsive 16-slot weekly timetable grid, subject-colored session cards,
 * prohibited/blocked times (e.g. training), gap highlights, stats banners, and solution navigation.
 */

const ScheduleRenderer = (() => {
  const DAYS = [
    { key: 'Saturday', en: 'Saturday', ar: 'السبت' },
    { key: 'Sunday', en: 'Sunday', ar: 'الأحد' },
    { key: 'Monday', en: 'Monday', ar: 'الاثنين' },
    { key: 'Tuesday', en: 'Tuesday', ar: 'الثلاثاء' },
    { key: 'Wednesday', en: 'Wednesday', ar: 'الأربعاء' },
    { key: 'Thursday', en: 'Thursday', ar: 'الخميس' },
    { key: 'Friday', en: 'Friday', ar: 'الجمعة' }
  ];

  // Default Egyptian/AASTMT university period times
  const PERIOD_TIMES = {
    1: '08:30 - 09:20',
    2: '09:30 - 10:20',
    3: '10:30 - 11:20',
    4: '11:30 - 12:20',
    5: '12:30 - 13:20',
    6: '13:30 - 14:20',
    7: '14:30 - 15:20',
    8: '15:30 - 16:20',
    9: '16:30 - 17:20',
    10: '17:30 - 18:20',
    11: '18:30 - 19:20',
    12: '19:30 - 20:20',
    13: '20:30 - 21:20',
    14: '21:30 - 22:20',
    15: '22:30 - 23:20',
    16: '23:30 - 00:20'
  };

  /**
   * Helper to convert HEX to RGBA for prominent subject color highlighting
   */
  function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string') return `rgba(59, 130, 246, ${alpha})`;
    if (hex.startsWith('rgb')) return hex;
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    if (c.length !== 6) return `rgba(59, 130, 246, ${alpha})`;
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
  }

  /**
   * Helper to format time range for slot interval
   */
  function formatSlotTimeRange(startSlot, endSlot) {
    const t1 = (PERIOD_TIMES[startSlot] || '').split(' - ')[0] || `Slot ${startSlot}`;
    const t2 = (PERIOD_TIMES[endSlot] || '').split(' - ')[1] || `Slot ${endSlot}`;
    return `${t1} - ${t2}`;
  }

  let activeViewMode = 'auto'; // 'auto' (agenda on mobile <= 768, grid on desktop), 'agenda', 'grid'

  function getEffectiveViewMode() {
    if (activeViewMode === 'agenda' || activeViewMode === 'grid') {
      return activeViewMode;
    }
    return (typeof window !== 'undefined' && window.innerWidth <= 768) ? 'agenda' : 'grid';
  }

  function setViewMode(mode) {
    activeViewMode = mode;
    const agendaEl = document.getElementById('timetable-view-agenda');
    const gridEl = document.getElementById('timetable-view-grid');
    const btnAgenda = document.getElementById('btn-view-agenda');
    const btnGrid = document.getElementById('btn-view-grid');

    const effective = getEffectiveViewMode();

    if (agendaEl && gridEl) {
      agendaEl.style.display = (effective === 'agenda') ? 'block' : 'none';
      gridEl.style.display = (effective === 'grid') ? 'block' : 'none';
    }
    if (btnAgenda && btnGrid) {
      btnAgenda.classList.toggle('active', effective === 'agenda');
      btnGrid.classList.toggle('active', effective === 'grid');
    }
  }

  /**
   * Checks if a session is a lecture
   */
  function isLectureSession(session) {
    if (!session || !session.type) return false;
    const t = session.type.toLowerCase();
    return t.includes('lect') || t.includes('محاضرة');
  }

  /**
   * Normalizes doctor name by removing honorific titles and extra spaces
   */
  function normalizeDoctorName(doc) {
    if (!doc || typeof doc !== 'string') return '';
    const clean = doc.trim();
    if (!clean || clean === 'Not Specified' || clean === 'غير محدد') return '';
    return clean
      .replace(/^(د\.|د\/|د\s+|dr\.|dr\s+|doctor\s+|prof\.|أ\.د\.?)\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  /**
   * Determines if two instructors refer to the same doctor
   */
  function isSameDoctor(doc1, doc2) {
    const n1 = normalizeDoctorName(doc1);
    const n2 = normalizeDoctorName(doc2);
    return n1.length > 0 && n1 === n2;
  }

  /**
   * Merges overlapping lectures of the same subject and same doctor into a single session
   */
  function mergeSameDoctorLectures(sessions) {
    if (!sessions || sessions.length <= 1) return [...(sessions || [])];

    const result = [];
    const processed = new Set();

    for (let i = 0; i < sessions.length; i++) {
      if (processed.has(i)) continue;
      const s1 = sessions[i];

      const isLect1 = isLectureSession(s1);
      const hasDoc1 = s1.instructor && s1.instructor !== 'Not Specified';

      if (!isLect1 || !hasDoc1) {
        result.push(s1);
        continue;
      }

      const matchingIndices = [i];
      for (let j = i + 1; j < sessions.length; j++) {
        if (processed.has(j)) continue;
        const s2 = sessions[j];
        const isLect2 = isLectureSession(s2);
        const sameCourse = (s1.courseId && s2.courseId && s1.courseId === s2.courseId) ||
                           (s1.courseCode && s2.courseCode && s1.courseCode === s2.courseCode);
        const sameDoc = isSameDoctor(s1.instructor, s2.instructor);
        const timeOverlap = (s1.startSlot <= s2.endSlot && s1.endSlot >= s2.startSlot);

        if (isLect2 && sameCourse && sameDoc && timeOverlap) {
          matchingIndices.push(j);
        }
      }

      if (matchingIndices.length === 1) {
        result.push(s1);
      } else {
        matchingIndices.forEach(idx => processed.add(idx));
        const matched = matchingIndices.map(idx => sessions[idx]);

        const allGroups = [];
        matched.forEach(s => {
          if (s.groups && Array.isArray(s.groups)) {
            s.groups.forEach(g => { if (!allGroups.includes(g)) allGroups.push(g); });
          } else if (s.group) {
            s.group.toString().split(/,\s*/).forEach(g => {
              const trimmed = g.trim();
              if (trimmed && !allGroups.includes(trimmed)) allGroups.push(trimmed);
            });
          }
        });
        allGroups.sort();

        const minStart = Math.min(...matched.map(s => parseInt(s.startSlot, 10)));
        const maxEnd = Math.max(...matched.map(s => parseInt(s.endSlot, 10)));

        let mergedPref = 'neutral';
        if (matched.some(s => s.doctorPref === 'mandate')) mergedPref = 'mandate';
        else if (matched.some(s => s.doctorPref === 'love')) mergedPref = 'love';
        else if (matched.some(s => s.doctorPref === 'avoid')) mergedPref = 'avoid';

        const merged = {
          ...s1,
          id: `merged_${s1.courseId || s1.courseCode}_${allGroups.join('_')}_${s1.day}_${minStart}`,
          group: allGroups.join(', '),
          groups: allGroups,
          startSlot: minStart,
          endSlot: maxEnd,
          duration: maxEnd - minStart + 1,
          doctorPref: mergedPref,
          isMergedLecture: true,
          isWarning: true,
          originalSessions: matched
        };

        result.push(merged);
      }
    }

    return result;
  }

  /**
   * Renders the complete timetable view for a solution.
   * Provides both a Mobile-Friendly Daily Agenda and a Full 16-Period Grid.
   */
  function renderTimetable(solution, containerEl, lang = 'en', customBlockedTimes = []) {
    if (!containerEl) return;
    if (!solution || !solution.sessions) {
      containerEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>No Schedule Selected</h3>
          <p>Generate or select a schedule option to view the timetable.</p>
        </div>
      `;
      return;
    }

    const isAr = lang === 'ar';
    const effectiveView = getEffectiveViewMode();
    const canDeselect = !!(solution.isManual || solution.id === 'sol_manual_custom');

    // Count selected groups per course to flag subjects with >1 group selected
    const courseGroupCounts = {};
    (solution.selectedGroups || []).forEach(g => {
      if (g && g.courseId) {
        courseGroupCounts[g.courseId] = (courseGroupCounts[g.courseId] || 0) + 1;
      }
    });
    const isMultiCourse = (cid) => (courseGroupCounts[cid] || 0) > 1;

    function getRedErrorTriangleSvg(customTitle) {
      const title = customTitle || (isAr ? 'تم اختيار أكثر من مجموعة لنفس المقرر' : 'Multiple groups selected for this subject');
      return `<span class="red-error-triangle-icon" title="${title}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: -2px; margin-inline: 2px;">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#EF4444"></path>
          <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"></line>
          <circle cx="12" cy="17" r="1.2" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.5"></circle>
        </svg>
      </span>`;
    }

    // Group sessions by day
    const sessionsByDay = {};
    DAYS.forEach(d => { sessionsByDay[d.key] = []; });
    solution.sessions.forEach(s => {
      if (sessionsByDay[s.day]) {
        sessionsByDay[s.day].push(s);
      }
    });

    // Merge overlapping lectures of the same subject & doctor for each day
    DAYS.forEach(d => {
      sessionsByDay[d.key] = mergeSameDoctorLectures(sessionsByDay[d.key]);
    });

    // Group blocked times by day
    const allBlockedTimes = (solution.blockedTimes && solution.blockedTimes.length > 0)
      ? solution.blockedTimes
      : customBlockedTimes;

    const blockedByDay = {};
    DAYS.forEach(d => { blockedByDay[d.key] = []; });
    allBlockedTimes.forEach(b => {
      const s1 = parseInt(b.startSlot || b.slot, 10);
      const s2 = parseInt(b.endSlot || b.slot, 10);
      if (b.day && blockedByDay[b.day]) {
        blockedByDay[b.day].push({
          startSlot: s1,
          endSlot: s2,
          label: b.label || (isAr ? 'وقت محظور (تدريب)' : 'Prohibited Time')
        });
      }
    });

    // Detect max slot used to optimize column display (default min 12, max 16)
    let maxSlotUsed = 12;
    solution.sessions.forEach(s => {
      if (s.endSlot > maxSlotUsed) maxSlotUsed = s.endSlot;
    });
    allBlockedTimes.forEach(b => {
      const s2 = parseInt(b.endSlot || b.slot, 10);
      if (s2 > maxSlotUsed) maxSlotUsed = s2;
    });
    maxSlotUsed = Math.min(16, Math.max(12, maxSlotUsed));

    // ==========================================
    // 1. BUILD DAILY AGENDA CARDS (MOBILE OPTIMIZED)
    // ==========================================
    let agendaHtml = `<div class="agenda-cards-container">`;
    DAYS.forEach(dayObj => {
      const dayKey = dayObj.key;
      const dayLabel = isAr ? dayObj.ar : dayObj.en;
      const daySessions = sessionsByDay[dayKey] || [];
      const dayBlocked = blockedByDay[dayKey] || [];
      const isActiveDay = daySessions.length > 0 || dayBlocked.length > 0;

      if (!isActiveDay) {
        agendaHtml += `
          <div class="agenda-day-card is-off-day">
            <div class="agenda-day-header">
              <span class="agenda-day-name">${dayLabel}</span>
              <span class="agenda-day-badge" style="background: rgba(16, 185, 129, 0.15); color: #34D399; padding: 3px 10px; border-radius: 999px; font-weight: 700; font-size: 0.78rem;">
                🏖️ ${isAr ? 'يوم إجازة كامل (Day Off)' : 'Full Day Off'}
              </span>
            </div>
          </div>
        `;
        return;
      }

      // Sort sessions by startSlot
      const sortedSessions = [...daySessions].sort((a, b) => a.startSlot - b.startSlot);
      const timeSpanText = sortedSessions.length > 0
        ? formatSlotTimeRange(sortedSessions[0].startSlot, sortedSessions[sortedSessions.length - 1].endSlot)
        : '';

      agendaHtml += `
        <div class="agenda-day-card">
          <div class="agenda-day-header">
            <div class="agenda-day-name">
              <span>📅</span> <span>${dayLabel}</span>
            </div>
            <div class="agenda-day-meta">
              ${sortedSessions.length > 0 ? `<span>${sortedSessions.length} ${isAr ? 'حصص' : 'Classes'} • ${timeSpanText}</span>` : ''}
            </div>
          </div>
          <div class="agenda-day-body">
      `;

      // Render any blocked times for this day
      dayBlocked.forEach(b => {
        const bTime = formatSlotTimeRange(b.startSlot, b.endSlot);
        agendaHtml += `
          <div class="agenda-blocked-badge">
            <span>🚫</span>
            <span>${b.label} (${bTime})</span>
          </div>
        `;
      });

      // Render each session with gap detector & clash detector
      let lastEnd = 0;
      sortedSessions.forEach(s => {
        if (lastEnd > 0 && s.startSlot > lastEnd + 1) {
          const gapCount = s.startSlot - lastEnd - 1;
          const gapFromTime = (PERIOD_TIMES[lastEnd] || '').split(' - ')[1] || '';
          const gapToTime = (PERIOD_TIMES[s.startSlot] || '').split(' - ')[0] || '';
          agendaHtml += `
            <div class="agenda-gap-badge">
              <span>☕</span>
              <span>${isAr ? `بريك / فترة فراغ: ${gapCount} فترات (${gapFromTime} إلى ${gapToTime})` : `Break: ${gapCount} gap period(s) (${gapFromTime} - ${gapToTime})`}</span>
            </div>
          `;
        }
        lastEnd = Math.max(lastEnd, s.endSlot);

        const timeRange = formatSlotTimeRange(s.startSlot, s.endSlot);
        const typeClass = s.type === 'Lab.' ? 'type-lab' : (s.type === 'Sec.' ? 'type-sec' : 'type-lect');
        const typeLabel = isAr ? (s.type === 'Lab.' ? 'معمل' : (s.type === 'Sec.' ? 'سكشن' : 'محاضرة')) : s.type;
        const isMulti = isMultiCourse(s.courseId);
        const isClashing = sortedSessions.some(other =>
          other !== s &&
          (other.courseId !== s.courseId || other.group !== s.group) &&
          s.startSlot <= other.endSlot && s.endSlot >= other.startSlot
        );

        agendaHtml += `
          <div class="agenda-session-card ${isClashing ? 'is-clashing-session' : (s.isMergedLecture ? 'is-merged-lecture' : '')}" style="border-inline-start: 4px solid ${s.isMergedLecture ? '#F59E0B' : (s.color || '#3B82F6')};">
            <div class="agenda-session-top">
              <div class="agenda-session-code" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="color: ${s.color || 'var(--text-primary)'}; font-weight: 800;">${s.courseName}</span>
                ${s.courseCode && s.courseCode !== s.courseName ? `<span style="font-size: 0.8rem; color: var(--text-muted);">(${s.courseCode})</span>` : ''}
                ${isMulti ? getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لهذه المادة' : 'Multiple groups selected for this subject') : ''}
                ${isClashing ? `<span class="agenda-clash-tag">⚠️ ${isAr ? 'تعارض' : 'CLASH'}</span>` : ''}
                ${s.isMergedLecture && !isClashing ? `<span class="agenda-clash-tag is-warning">⚠️ ${isAr ? 'محاضرة مشتركة' : 'Combined Lecture'}</span>` : ''}
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="session-badge ${typeClass}">${typeLabel}</span>
                ${canDeselect ? (
                  s.isMergedLecture && s.groups && s.groups.length > 1 ? `
                    <div style="display: flex; align-items: center; gap: 4px;">
                      ${s.groups.map(grpName => `
                        <button class="agenda-deselect-btn" 
                                title="${isAr ? `إلغاء اختيار مجموعة ${grpName}` : `Deselect Group ${grpName}`}"
                                onclick="App.deselectManualGroupFromTimetable('${s.courseId}', '${grpName}', event)">
                          ✕ ${grpName}
                        </button>
                      `).join('')}
                    </div>
                  ` : `
                    <button class="agenda-deselect-btn" 
                            title="${isAr ? `إلغاء اختيار مجموعة ${s.group}` : `Deselect Group ${s.group}`}"
                            onclick="App.deselectManualGroupFromTimetable('${s.courseId}', '${s.group}', event)">
                      ✕ ${isAr ? 'إلغاء' : 'Deselect'}
                    </button>
                  `
                ) : ''}
              </div>
            </div>
            <div class="agenda-session-info">
              <span class="agenda-info-pill">
                <strong>Group ${s.group}</strong>
              </span>
              <span class="agenda-info-pill">
                ⏰ ${timeRange} (P${s.startSlot}${s.endSlot !== s.startSlot ? `-P${s.endSlot}` : ''})
              </span>
              ${s.instructor && sessionHasInstructor(s) ? `
                <span class="agenda-info-pill">
                  🎓 <strong>${s.instructor}</strong>
                  ${s.doctorPref === 'avoid' ? `<span class="session-pref-badge badge-avoid">🚫 ${isAr ? 'مستبعد' : 'Avoided'}</span>` : ''}
                  ${s.doctorPref === 'mandate' ? `<span class="session-pref-badge badge-mandate">🌟🔒 ${isAr ? 'إجباري' : 'Mandated'}</span>` : ''}
                  ${s.doctorPref === 'love' ? `<span class="session-pref-badge badge-prefer">⭐ ${isAr ? 'مفضل' : 'Preferred'}</span>` : ''}
                </span>
              ` : ''}
            </div>
          </div>
        `;
      });

      agendaHtml += `
          </div>
        </div>
      `;
    });
    agendaHtml += `</div>`;

    // ==========================================
    // 2. BUILD FULL 16-PERIOD TIMETABLE GRID
    // ==========================================
    let gridHtml = `
      <div class="timetable-wrapper">
        <div class="mobile-scroll-hint" style="margin: 8px 10px;">
          <span>👈</span> <span>${isAr ? 'اسحب أفقياً لتصفح جميع الفترات الـ 16' : 'Swipe horizontally to view all 16 periods'}</span> <span>👉</span>
        </div>
        <div class="timetable-grid" style="grid-template-columns: minmax(85px, 105px) repeat(${maxSlotUsed}, minmax(68px, 1fr));">
          <!-- Header Corner -->
          <div class="grid-header-corner">
            <span>${isAr ? 'اليوم / الفترة' : 'Day / Slot'}</span>
          </div>
    `;

    // Period Slot Headers (1 to maxSlotUsed)
    for (let slot = 1; slot <= maxSlotUsed; slot++) {
      const timeStr = PERIOD_TIMES[slot] || '';
      const periodNum = Math.ceil(slot / 2);
      const isPeriodStart = slot % 2 === 1;

      gridHtml += `
        <div class="grid-slot-header ${isPeriodStart ? 'period-start' : ''}">
          <div class="slot-num">${slot}</div>
          <div class="period-badge">P${periodNum}</div>
          <div class="slot-time">${timeStr.split(' - ')[0]}</div>
        </div>
      `;
    }

    // Day Rows (Saturday to Friday)
    DAYS.forEach(dayObj => {
      const dayKey = dayObj.key;
      const dayLabel = isAr ? dayObj.ar : dayObj.en;
      const daySessions = sessionsByDay[dayKey] || [];
      const dayBlocked = blockedByDay[dayKey] || [];
      const isActiveDay = daySessions.length > 0;

      gridHtml += `
        <!-- Day Label -->
        <div class="grid-day-header ${isActiveDay ? 'active-day' : 'day-off'}">
          <div class="day-title">${dayLabel}</div>
          <div class="day-status">
            ${isActiveDay ? `${daySessions.length} ${isAr ? 'حصص' : 'classes'}` : (isAr ? 'يوم إجازة' : 'Day Off')}
            ${dayBlocked.length > 0 ? `<div style="color: var(--danger); font-size: 0.68rem; margin-top: 2px;">🚫 ${dayBlocked.length} ${isAr ? 'محظور' : 'blocked'}</div>` : ''}
          </div>
        </div>
      `;

      // Connected components of overlapping sessions for this day
      const clusters = [];
      daySessions.forEach(s => {
        const sStart = parseInt(s.startSlot, 10);
        const sEnd = parseInt(s.endSlot, 10);
        const overlappingIndices = [];

        clusters.forEach((cl, idx) => {
          const clStart = Math.min(...cl.map(item => parseInt(item.startSlot, 10)));
          const clEnd = Math.max(...cl.map(item => parseInt(item.endSlot, 10)));
          if (sStart <= clEnd && sEnd >= clStart) {
            overlappingIndices.push(idx);
          }
        });

        if (overlappingIndices.length === 0) {
          clusters.push([s]);
        } else {
          const primaryIdx = overlappingIndices[0];
          clusters[primaryIdx].push(s);
          for (let k = overlappingIndices.length - 1; k >= 1; k--) {
            const mergeIdx = overlappingIndices[k];
            clusters[primaryIdx].push(...clusters[mergeIdx]);
            clusters.splice(mergeIdx, 1);
          }
        }
      });

      clusters.forEach(cl => {
        cl.sort((a, b) => a.startSlot - b.startSlot);
      });
      clusters.sort((a, b) => {
        const aStart = Math.min(...a.map(s => s.startSlot));
        const bStart = Math.min(...b.map(s => s.startSlot));
        return aStart - bStart;
      });

      // Render cells along this row
      let currSlot = 1;
      while (currSlot <= maxSlotUsed) {
        // Find cluster that covers currSlot
        const matchingCluster = clusters.find(cl => {
          const clStart = Math.min(...cl.map(s => s.startSlot));
          const clEnd = Math.max(...cl.map(s => s.endSlot));
          return currSlot >= clStart && currSlot <= clEnd;
        });

        // Find blocked time that covers currSlot
        const matchingBlocked = dayBlocked.find(b => currSlot >= b.startSlot && currSlot <= b.endSlot);

        if (matchingCluster) {
          const clStart = Math.min(...matchingCluster.map(s => s.startSlot));
          const clEnd = Math.max(...matchingCluster.map(s => s.endSlot));
          const span = Math.min(clEnd, maxSlotUsed) - currSlot + 1;

          if (matchingCluster.length > 1) {
            // CLASH: Multiple overlapping sessions in this slot!
            const timeRange = formatSlotTimeRange(clStart, clEnd);

            gridHtml += `
              <div class="grid-clash-container"
                   style="grid-column: span ${span};"
                   title="${matchingCluster.length} clashing sessions">
                <div class="clash-cell-header">
                  <span class="clash-badge-pulse">⚠️ ${isAr ? 'تعارض' : 'CLASH'} (${matchingCluster.length})</span>
                  <span class="clash-cell-time">${timeRange}</span>
                </div>
                <div class="clash-sessions-stack">
                  ${matchingCluster.map(s => {
                    const sTime = formatSlotTimeRange(s.startSlot, s.endSlot);
                    const typeClass = s.type === 'Lab.' ? 'type-lab' : (s.type === 'Sec.' ? 'type-sec' : 'type-lect');
                    const typeLabel = isAr ? (s.type === 'Lab.' ? 'معمل' : (s.type === 'Sec.' ? 'سكشن' : 'محاضرة')) : s.type;
                    const isMulti = isMultiCourse(s.courseId);

                    return `
                      <div class="clash-mini-card" style="border-inline-start: 4px solid ${s.isMergedLecture ? '#F59E0B' : (s.color || '#EF4444')};">
                        <div class="clash-mini-top">
                          <div style="display: flex; align-items: center; gap: 4px; overflow: hidden;">
                            <span class="clash-mini-code" style="color: ${s.color || 'var(--text-primary)'};" title="${s.courseName}">
                              ${s.courseCode || s.courseName}
                            </span>
                            ${isMulti ? getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لهذه المادة' : 'Multiple groups selected for this subject') : ''}
                          </div>
                          <div style="display: flex; align-items: center; gap: 4px;">
                            <span class="mini-group-pill">Grp ${s.group}</span>
                            ${canDeselect ? (
                              s.isMergedLecture && s.groups && s.groups.length > 1 ? `
                                <div style="display: flex; gap: 2px;">
                                  ${s.groups.map(grpName => `
                                    <button class="clash-mini-deselect-btn" 
                                            title="${isAr ? `إلغاء اختيار مجموعة ${grpName}` : `Deselect Group ${grpName}`}"
                                            onclick="App.deselectManualGroupFromTimetable('${s.courseId}', '${grpName}', event)">
                                      ✕ ${grpName}
                                    </button>
                                  `).join('')}
                                </div>
                              ` : `
                                <button class="clash-mini-deselect-btn" 
                                        title="${isAr ? `إلغاء اختيار مجموعة ${s.group}` : `Deselect Group ${s.group}`}"
                                        onclick="App.deselectManualGroupFromTimetable('${s.courseId}', '${s.group}', event)">
                                  ✕
                                </button>
                              `
                            ) : ''}
                          </div>
                        </div>
                        <div class="clash-mini-meta">
                          <span class="session-badge ${typeClass}">${typeLabel}</span>
                          ${s.instructor && sessionHasInstructor(s) ? `<span class="clash-mini-doc" title="${s.instructor}">👨‍🏫 ${s.instructor}</span>` : ''}
                          <span class="clash-mini-time">⏰ ${sTime}</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          } else {
            // Single non-clashing session (or merged same-doctor lecture)
            const session = matchingCluster[0];
            const timeRange = formatSlotTimeRange(session.startSlot, session.endSlot);
            const typeClass = session.type === 'Lab.' ? 'type-lab' : (session.type === 'Sec.' ? 'type-sec' : 'type-lect');
            const typeLabel = isAr ? (session.type === 'Lab.' ? 'معمل' : (session.type === 'Sec.' ? 'سكشن' : 'محاضرة')) : session.type;
            const isMulti = isMultiCourse(session.courseId);

            gridHtml += `
              <div class="grid-session-card ${typeClass} ${session.isMergedLecture ? 'is-merged-lecture' : ''}"
                   style="grid-column: span ${span}; border-inline-start-color: ${session.isMergedLecture ? '#F59E0B' : (session.color || '#3B82F6')};"
                   title="${session.courseName} (Group ${session.group})">
                ${canDeselect ? (
                  session.isMergedLecture && session.groups && session.groups.length > 1 ? `
                    <div class="timetable-deselect-group-btns">
                      ${session.groups.map(grpName => `
                        <button class="timetable-deselect-btn is-merged" 
                                title="${isAr ? `إلغاء اختيار مجموعة ${grpName}` : `Deselect Group ${grpName}`}"
                                onclick="App.deselectManualGroupFromTimetable('${session.courseId}', '${grpName}', event)">
                          ✕ ${grpName}
                        </button>
                      `).join('')}
                    </div>
                  ` : `
                    <button class="timetable-deselect-btn" 
                            title="${isAr ? `إلغاء اختيار مجموعة ${session.group}` : `Deselect Group ${session.group}`}"
                            onclick="App.deselectManualGroupFromTimetable('${session.courseId}', '${session.group}', event)">
                      ✕
                    </button>
                  `
                ) : ''}
                <div class="session-top">
                  <div style="display: flex; align-items: center; gap: 4px; overflow: hidden;">
                    <span class="session-code">${session.courseCode || session.courseName}</span>
                    ${isMulti ? getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لهذه المادة' : 'Multiple groups selected for this subject') : ''}
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    ${session.isMergedLecture ? `<span class="session-pref-badge badge-mandate" style="background: rgba(245, 158, 11, 0.2); color: #D97706; border-color: rgba(245, 158, 11, 0.45); font-size: 0.65rem;">⚠️ ${isAr ? 'محاضرة مشتركة' : 'Combined'}</span>` : ''}
                    <span class="session-badge ${typeClass}">${typeLabel}</span>
                  </div>
                </div>
                <div class="session-group">Group ${session.group}</div>
                ${session.instructor && sessionHasInstructor(session) ? `
                  <div class="session-doc" title="${session.instructor}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>${session.instructor}</span>
                    ${session.doctorPref === 'avoid' ? `<span class="session-pref-badge badge-avoid">🚫 ${isAr ? 'مستبعد' : 'Avoided'}</span>` : ''}
                    ${session.doctorPref === 'mandate' ? `<span class="session-pref-badge badge-mandate">🌟🔒 ${isAr ? 'إجباري' : 'Mandated'}</span>` : ''}
                    ${session.doctorPref === 'love' ? `<span class="session-pref-badge badge-prefer">⭐ ${isAr ? 'مفضل' : 'Preferred'}</span>` : ''}
                  </div>
                ` : ''}
                <div class="session-time">${timeRange}</div>
              </div>
            `;
          }
          currSlot += span;
        } else if (matchingBlocked) {
          const span = Math.min(matchingBlocked.endSlot, maxSlotUsed) - currSlot + 1;
          const timeRange = formatSlotTimeRange(matchingBlocked.startSlot, matchingBlocked.endSlot);

          gridHtml += `
            <div class="grid-blocked-cell"
                 style="grid-column: span ${span};"
                 title="${matchingBlocked.label} (${timeRange})">
              <div class="blocked-badge">🚫 ${matchingBlocked.label}</div>
              <div class="blocked-time">${timeRange}</div>
            </div>
          `;
          currSlot += span;
        } else {
          const isGap = isSlotInGap(dayKey, currSlot, solution.gapDetails);
          gridHtml += `
            <div class="grid-empty-cell ${isGap ? 'gap-highlight' : ''}"
                 title="${isGap ? 'Break / Gap between lectures' : ''}">
              ${isGap ? `<span class="gap-icon">☕</span>` : ''}
            </div>
          `;
          currSlot++;
        }
      }
    });

    gridHtml += `
        </div>
      </div>
    `;

    // Combine views with view switcher
    containerEl.innerHTML = `
      <div class="timetable-display-wrapper">
        <!-- View Mode Switcher -->
        <div class="timetable-view-switcher">
          <button id="btn-view-agenda" class="view-switch-btn ${effectiveView === 'agenda' ? 'active' : ''}" onclick="ScheduleRenderer.setViewMode('agenda')">
            <span>📱</span> <span>${isAr ? 'جدول يومي (مخصص للموبايل)' : 'Daily Agenda (Mobile View)'}</span>
          </button>
          <button id="btn-view-grid" class="view-switch-btn ${effectiveView === 'grid' ? 'active' : ''}" onclick="ScheduleRenderer.setViewMode('grid')">
            <span>🗓️</span> <span>${isAr ? 'الجدول الأسبوعي الكامل (16 فترة)' : 'Full 16-Period Grid'}</span>
          </button>
        </div>

        <!-- View 1: Mobile-Optimized Daily Agenda -->
        <div id="timetable-view-agenda" class="timetable-view-panel" style="display: ${effectiveView === 'agenda' ? 'block' : 'none'};">
          ${agendaHtml}
        </div>

        <!-- View 2: Full 16-Period Timetable Grid -->
        <div id="timetable-view-grid" class="timetable-view-panel" style="display: ${effectiveView === 'grid' ? 'block' : 'none'};">
          ${gridHtml}
        </div>
      </div>
    `;
  }

  function sessionHasInstructor(s) {
    return s.instructor && s.instructor !== 'Not Specified' && s.instructor.trim() !== '';
  }

  function isSlotInGap(day, slot, gapDetails) {
    if (!gapDetails || gapDetails.length === 0) return false;
    return gapDetails.some(g => g.day === day && slot > g.fromSlot && slot < g.toSlot);
  }

  /**
   * Renders the summary cards and badges for a solution.
   */
  function renderSolutionSummary(solution, containerEl, lang = 'en') {
    if (!containerEl || !solution) return;
    const isAr = lang === 'ar';

    const badgesHtml = (solution.badges || []).map(b => `
      <span class="solution-badge badge-${b.type}">${(isAr && b.textAr) ? b.textAr : b.text}</span>
    `).join('');

    const groupsHtml = solution.selectedGroups.map(g => `
      <div class="group-pill" style="border-left: 3px solid ${g.color};">
        <span class="group-course" style="color: ${g.color}; font-weight: 700;">${g.courseCode || g.courseName}:</span>
        <strong class="group-letter">Group ${g.group}</strong>
      </div>
    `).join('');

    const blockedCount = (solution.blockedTimes || []).length;

    containerEl.innerHTML = `
      <div class="solution-header-card">
        <div class="header-left">
          <div class="rank-title">
            <h3>${isAr ? `الخيار رقم ${solution.rank}` : `Schedule Option #${solution.rank}`}</h3>
            <div class="badges-row">
              ${badgesHtml}
              ${blockedCount > 0 ? `<span class="solution-badge" style="background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid var(--danger);">🚫 ${blockedCount} ${isAr ? 'أوقات محظورة محترمة' : 'Blocked Times Respected'}</span>` : ''}
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-val ${solution.totalGapSlots === 0 ? 'text-success' : 'text-warning'}">${solution.totalGapSlots}</span>
              <span class="stat-lbl">${isAr ? 'فترات فراغ (Gaps)' : 'Gap Slots'}</span>
            </div>
            <div class="stat-box">
              <span class="stat-val text-primary">${solution.activeDaysCount}</span>
              <span class="stat-lbl">${isAr ? 'أيام بالكلية' : 'Campus Days'}</span>
            </div>
            <div class="stat-box">
              <span class="stat-val text-info">${solution.sessions.length}</span>
              <span class="stat-lbl">${isAr ? 'حصص أسبوعية' : 'Total Sessions'}</span>
            </div>
          </div>
        </div>
        <div class="header-groups">
          <div class="groups-title">${isAr ? 'المجموعات المختارة لهذا الجدول:' : 'Selected Groups for this Schedule:'}</div>
          <div class="groups-list">${groupsHtml}</div>
        </div>
      </div>
    `;
  }

  return {
    DAYS,
    PERIOD_TIMES,
    renderTimetable,
    renderSolutionSummary,
    formatSlotTimeRange,
    hexToRgba,
    setViewMode,
    getEffectiveViewMode,
    isLectureSession,
    normalizeDoctorName,
    isSameDoctor,
    mergeSameDoctorLectures
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleRenderer;
}
