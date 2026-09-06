/**
 * exporter.js
 * Handles exporting timetable solutions to PNG image, iCalendar (.ics),
 * browser printing, and JSON save/load.
 */

const ScheduleExporter = (() => {
  const DAY_ICS_MAP = {
    Saturday: 'SA',
    Sunday: 'SU',
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR'
  };

  /**
   * Generates standard iCalendar (.ics) string for Google/Apple Calendar.
   */
  function generateIcs(solution) {
    if (!solution || !solution.sessions) return null;

    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//College Schedule Optimizer//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:College Timetable - Option ' + (solution.rank || 1),
      'X-WR-TIMEZONE:Africa/Cairo'
    ];

    solution.sessions.forEach((session, idx) => {
      const dayByDay = DAY_ICS_MAP[session.day] || 'MO';
      const timeRange = ScheduleRenderer.formatSlotTimeRange(session.startSlot, session.endSlot);
      const startParts = (ScheduleRenderer.PERIOD_TIMES[session.startSlot] || '08:30').split(' - ')[0].split(':');
      const endParts = (ScheduleRenderer.PERIOD_TIMES[session.endSlot] || '10:20').split(' - ')[1].split(':');

      const startH = (startParts[0] || '08').padStart(2, '0');
      const startM = (startParts[1] || '30').padStart(2, '0');
      const endH = (endParts[0] || '10').padStart(2, '0');
      const endM = (endParts[1] || '20').padStart(2, '0');

      // Reference date: start of upcoming semester week
      const refDate = '20261003'; // Arbitrary reference Saturday

      ics.push('BEGIN:VEVENT');
      ics.push(`UID:session_${idx}_${Date.now()}@scheduleoptimizer.local`);
      ics.push(`DTSTAMP:20261001T000000Z`);
      ics.push(`DTSTART;TZID=Africa/Cairo:${refDate}T${startH}${startM}00`);
      ics.push(`DTEND;TZID=Africa/Cairo:${refDate}T${endH}${endM}00`);
      ics.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayByDay}`);
      ics.push(`SUMMARY:${session.courseCode || session.courseName} (${session.type} - Group ${session.group})`);
      ics.push(`DESCRIPTION:Course: ${session.courseName}\\nType: ${session.type}\\nGroup: ${session.group}\\nDoctor: ${session.instructor || 'N/A'}\\nTime: ${timeRange}`);
      ics.push(`LOCATION:Campus`);
      ics.push('STATUS:CONFIRMED');
      ics.push('END:VEVENT');
    });

    ics.push('END:VCALENDAR');
    return ics.join('\r\n');
  }

  /**
   * Triggers download of an ICS calendar file.
   */
  function downloadIcsFile(solution) {
    const icsContent = generateIcs(solution);
    if (!icsContent) return;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Schedule_Option_${solution.rank || 1}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export timetable to PNG image using an HTML5 Canvas rendering pipeline.
   */
  function exportToPng(solution, fileName = 'timetable.png') {
    if (!solution || !solution.sessions) return;

    const canvas = document.createElement('canvas');
    const width = 1600;
    const height = 900;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1E293B'; // Dark Slate background
    ctx.fillRect(0, 0, width, height);

    // Title banner
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "Segoe UI", Tahoma, sans-serif';
    ctx.fillText(`College Timetable - Option #${solution.rank || 1}`, 50, 50);

    ctx.font = '16px "Segoe UI", Tahoma, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(
      `Gaps: ${solution.totalGapSlots} slots | Campus Days: ${solution.activeDaysCount} | Zero Clashes Guaranteed`,
      50,
      80
    );

    // Grid coordinates
    const gridLeft = 140;
    const gridTop = 110;
    const gridWidth = width - gridLeft - 50;
    const gridHeight = height - gridTop - 50;

    const maxSlots = 16;
    const slotW = gridWidth / maxSlots;
    const dayH = gridHeight / 7;

    const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Draw Slot Headers
    for (let s = 1; s <= maxSlots; s++) {
      const x = gridLeft + (s - 1) * slotW;
      ctx.fillStyle = s % 2 === 1 ? '#334155' : '#1E293B';
      ctx.fillRect(x, gridTop - 35, slotW, 30);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Slot ${s}`, x + slotW / 2, gridTop - 15);
    }

    // Draw Day Rows
    DAYS.forEach((day, dIdx) => {
      const y = gridTop + dIdx * dayH;

      // Day Label
      ctx.fillStyle = '#334155';
      ctx.fillRect(40, y, gridLeft - 45, dayH - 4);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(day, 50, y + dayH / 2 + 5);

      // Grid background slots
      for (let s = 1; s <= maxSlots; s++) {
        const x = gridLeft + (s - 1) * slotW;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, slotW, dayH - 4);
      }
    });

    // Draw Sessions
    solution.sessions.forEach(session => {
      const dayIdx = DAYS.indexOf(session.day);
      if (dayIdx === -1) return;

      const y = gridTop + dayIdx * dayH + 2;
      const x = gridLeft + (session.startSlot - 1) * slotW + 2;
      const spanW = (session.endSlot - session.startSlot + 1) * slotW - 4;
      const spanH = dayH - 8;

      // Session Box
      ctx.fillStyle = session.color || '#3B82F6';
      ctx.beginPath();
      ctx.roundRect(x, y, spanW, spanH, 6);
      ctx.fill();

      // Card Content
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`${session.courseCode || session.courseName}`, x + 8, y + 20);

      ctx.font = '12px sans-serif';
      ctx.fillText(`${session.type} - Group ${session.group}`, x + 8, y + 40);

      if (session.instructor && session.instructor !== 'Not Specified') {
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#E0F2FE';
        ctx.fillText(session.instructor, x + 8, y + 60);
      }
    });

    // Export as download
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  /**
   * Triggers native browser print
   */
  function printTimetable() {
    window.print();
  }

  /**
   * Exports courses data as JSON file.
   */
  function exportCoursesJson(courses, filename = 'courses_data.json') {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(courses, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /**
   * Generates formatted text content for a timetable solution.
   * Format: <Course Code/ID>: <Group>
   * Example:
   * CCS3203: F
   * CIT3200: F
   * CCS3501: A
   * CSE3402: C
   * CGM3101: A
   * CAI3101: 6
   */
  function generateScheduleText(solution, allCourses = []) {
    if (!solution) return '';

    const courseMap = new Map();

    const findCourse = (id, code, name) => {
      return (allCourses || []).find(c =>
        (id && c.id === id) ||
        (code && c.code === code) ||
        (name && c.name === name)
      );
    };

    // Priority 1: solution.selectedGroups (standard optimizer solutions)
    if (solution.selectedGroups && Array.isArray(solution.selectedGroups) && solution.selectedGroups.length > 0) {
      solution.selectedGroups.forEach(sg => {
        const matching = findCourse(sg.courseId, sg.courseCode, sg.courseName);
        const code = extractCleanCourseCode(sg.courseCode, sg.courseId, sg.courseName, matching);
        const grp = cleanGroupName(sg.group);
        const key = sg.courseId || code;
        courseMap.set(key, { code, grp, courseId: sg.courseId, courseName: sg.courseName });
      });
    } else if (solution.sessions && Array.isArray(solution.sessions) && solution.sessions.length > 0) {
      // Priority 2: Derive from sessions
      const grouped = new Map();
      solution.sessions.forEach(s => {
        const cKey = s.courseId || s.courseCode || s.courseName;
        if (!cKey) return;
        if (!grouped.has(cKey)) {
          grouped.set(cKey, {
            courseId: s.courseId,
            courseCode: s.courseCode,
            courseName: s.courseName,
            sessions: []
          });
        }
        grouped.get(cKey).sessions.push(s);
      });

      grouped.forEach((data, cKey) => {
        const matching = findCourse(data.courseId, data.courseCode, data.courseName);
        const code = extractCleanCourseCode(data.courseCode, data.courseId, data.courseName, matching);

        const grpSet = new Set(data.sessions.map(s => cleanGroupName(s.group)).filter(Boolean));
        let grpStr = '';
        if (grpSet.size === 1) {
          grpStr = Array.from(grpSet)[0];
        } else if (grpSet.size > 1) {
          const parts = [];
          const lectSess = data.sessions.filter(s => (s.type || '').toLowerCase().includes('lect'));
          const secSess = data.sessions.filter(s => (s.type || '').toLowerCase().includes('sec'));
          const labSess = data.sessions.filter(s => (s.type || '').toLowerCase().includes('lab'));

          if (lectSess.length > 0) parts.push(`Lect ${cleanGroupName(lectSess[0].group)}`);
          if (secSess.length > 0) parts.push(`Sec ${cleanGroupName(secSess[0].group)}`);
          if (labSess.length > 0) parts.push(`Lab ${cleanGroupName(labSess[0].group)}`);

          grpStr = parts.length > 0 ? parts.join(', ') : Array.from(grpSet).join(', ');
        }
        courseMap.set(cKey, { code, grp: grpStr, courseId: data.courseId, courseName: data.courseName });
      });
    }

    const entries = Array.from(courseMap.values());
    if (allCourses && allCourses.length > 0) {
      entries.sort((a, b) => {
        const idxA = allCourses.findIndex(c => c.id === a.courseId || c.code === a.code || c.name === a.courseName);
        const idxB = allCourses.findIndex(c => c.id === b.courseId || c.code === b.code || c.name === b.courseName);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });
    }

    return entries.map(e => `${e.code}: ${e.grp}`).join('\r\n');
  }

  function extractCleanCourseCode(code, id, name, matchingCourse) {
    const candidates = [
      code,
      matchingCourse?.code,
      id,
      matchingCourse?.id,
      name,
      matchingCourse?.name
    ];

    for (const cand of candidates) {
      if (!cand || typeof cand !== 'string') continue;
      const trimmed = cand.trim();
      const m = trimmed.match(/\b([A-Za-z]{2,5})\s*(\d{3,4}[A-Za-z]?)\b/);
      if (m) {
        return `${m[1].toUpperCase()}${m[2].toUpperCase()}`;
      }
    }

    if (matchingCourse && matchingCourse.code) return matchingCourse.code.trim();
    if (code) return code.trim();
    if (matchingCourse && matchingCourse.name) return matchingCourse.name.trim();
    if (name) return name.trim();
    if (id && !id.startsWith('course_')) return id.trim();
    return 'COURSE';
  }

  function cleanGroupName(grp) {
    if (!grp) return '';
    return String(grp).replace(/^(?:Group|Grp|مجموعة|مجموعه)\s*[:\-]?\s*/i, '').trim();
  }

  /**
   * Triggers download of schedule as a .txt file.
   */
  function downloadTxtFile(solution, fileName = null, allCourses = []) {
    const textContent = generateScheduleText(solution, allCourses);
    if (!textContent) return false;

    const rank = solution.rank || 1;
    const name = fileName || `Schedule_Option_${rank}_Groups.txt`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  }

  /**
   * Generates and downloads all solutions formatted into a single text file.
   */
  function downloadAllSchedulesTxt(solutions, fileName = 'All_Schedules_Groups.txt', allCourses = []) {
    if (!solutions || !solutions.length) return false;

    const blocks = solutions.map((sol, idx) => {
      const rank = sol.rank || (idx + 1);
      const text = generateScheduleText(sol, allCourses);
      return `=== Schedule Option #${rank} ===\r\n${text}`;
    });

    const fullContent = blocks.join('\r\n\r\n');
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  }

  return {
    downloadIcsFile,
    exportToPng,
    printTimetable,
    exportCoursesJson,
    generateScheduleText,
    downloadTxtFile,
    downloadAllSchedulesTxt,
    cleanGroupName,
    extractCleanCourseCode
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleExporter;
}
