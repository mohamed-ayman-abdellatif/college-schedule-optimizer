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

  /**
   * Renders the complete timetable view for a solution.
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

    // Group sessions by day
    const sessionsByDay = {};
    DAYS.forEach(d => { sessionsByDay[d.key] = []; });
    solution.sessions.forEach(s => {
      if (sessionsByDay[s.day]) {
        sessionsByDay[s.day].push(s);
      }
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

    let html = `
      <div class="timetable-wrapper">
        <div class="timetable-grid" style="grid-template-columns: 110px repeat(${maxSlotUsed}, minmax(75px, 1fr));">
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

      html += `
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

      html += `
        <!-- Day Label -->
        <div class="grid-day-header ${isActiveDay ? 'active-day' : 'day-off'}">
          <div class="day-title">${dayLabel}</div>
          <div class="day-status">
            ${isActiveDay ? `${daySessions.length} ${isAr ? 'حصص' : 'classes'}` : (isAr ? 'يوم إجازة' : 'Day Off')}
            ${dayBlocked.length > 0 ? `<div style="color: var(--danger); font-size: 0.68rem; margin-top: 2px;">🚫 ${dayBlocked.length} ${isAr ? 'محظور' : 'blocked'}</div>` : ''}
          </div>
        </div>
      `;

      // Build daily row content using a 16-slot tracker
      // Slot tracker can hold: { kind: 'session', data } or { kind: 'blocked', data }
      const rowSlots = new Array(maxSlotUsed + 1).fill(null);

      // Place sessions
      daySessions.forEach(s => {
        for (let i = s.startSlot; i <= s.endSlot; i++) {
          rowSlots[i] = { kind: 'session', data: s };
        }
      });

      // Place blocked slots
      dayBlocked.forEach(b => {
        for (let i = b.startSlot; i <= b.endSlot; i++) {
          if (!rowSlots[i]) {
            rowSlots[i] = { kind: 'blocked', data: b };
          }
        }
      });

      // Render cells along this row
      let currSlot = 1;
      while (currSlot <= maxSlotUsed) {
        const item = rowSlots[currSlot];

        if (item && item.kind === 'session' && item.data.startSlot === currSlot) {
          // This slot begins a session block!
          const session = item.data;
          const span = Math.min(session.endSlot, maxSlotUsed) - session.startSlot + 1;
          const timeRange = formatSlotTimeRange(session.startSlot, session.endSlot);
          const typeClass = session.type === 'Lab.' ? 'type-lab' : (session.type === 'Sec.' ? 'type-sec' : 'type-lect');
          const typeLabel = isAr ? (session.type === 'Lab.' ? 'معمل' : (session.type === 'Sec.' ? 'سكشن' : 'محاضرة')) : session.type;
          const courseColor = session.color || '#3B82F6';

          html += `
            <div class="grid-session-card ${typeClass}"
                 style="grid-column: span ${span}; border-left-color: ${session.color || '#3B82F6'};"
                 title="${session.courseName} (Group ${session.group})">
              <div class="session-top">
                <span class="session-code">${session.courseCode || session.courseName}</span>
                <span class="session-badge ${typeClass}">${typeLabel}</span>
              </div>
              <div class="session-group">Group ${session.group}</div>
              ${session.instructor && session.instructor !== 'Not Specified' ? `
                <div class="session-doc" title="${session.instructor}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>${session.instructor}</span>
                </div>
              ` : ''}
              <div class="session-time">${timeRange}</div>
            </div>
          `;
          currSlot += span;
        } else if (item && item.kind === 'blocked' && item.data.startSlot === currSlot) {
          // This slot begins a blocked / training block!
          const bData = item.data;
          const span = Math.min(bData.endSlot, maxSlotUsed) - bData.startSlot + 1;
          const timeRange = formatSlotTimeRange(bData.startSlot, bData.endSlot);

          html += `
            <div class="grid-blocked-cell"
                 style="grid-column: span ${span};"
                 title="${bData.label} (${timeRange})">
              <div class="blocked-badge">🚫 ${bData.label}</div>
              <div class="blocked-time">${timeRange}</div>
            </div>
          `;
          currSlot += span;
        } else if (!item) {
          // Empty slot - check if gap
          const isGap = isSlotInGap(dayKey, currSlot, solution.gapDetails);

          html += `
            <div class="grid-empty-cell ${isGap ? 'gap-highlight' : ''}"
                 title="${isGap ? 'Break / Gap between lectures' : ''}">
              ${isGap ? `<span class="gap-icon">☕</span>` : ''}
            </div>
          `;
          currSlot++;
        } else {
          currSlot++;
        }
      }
    });

    html += `
        </div>
      </div>
    `;

    containerEl.innerHTML = html;
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
      <span class="solution-badge badge-${b.type}">${b.text}</span>
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
    hexToRgba
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleRenderer;
}
