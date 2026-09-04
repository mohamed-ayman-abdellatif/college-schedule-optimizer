/**
 * pdfParser.js
 * Comprehensive PDF and Text Timetable Parser for College Schedules (aSc Timetables and AASTMT formats).
 * Performs client-side spatial 2D grid extraction using Mozilla's pdf.js,
 * maps 2-hour university periods to the 16-slot schedule engine, extracts course codes,
 * session types, and instructors/doctors, strips all room numbers, and uses ONLY the course number/code.
 */

const PdfScheduleParser = (() => {
  // Day normalization mappings
  const DAY_ALIASES = {
    'سبت': 'Saturday',
    'السبت': 'Saturday',
    'saturday': 'Saturday',
    'sat': 'Saturday',
    'احد': 'Sunday',
    'الأحد': 'Sunday',
    'الاحد': 'Sunday',
    'sunday': 'Sunday',
    'sun': 'Sunday',
    'اثنين': 'Monday',
    'اثنین': 'Monday',
    'الإثنين': 'Monday',
    'الاثنين': 'Monday',
    'monday': 'Monday',
    'mon': 'Monday',
    'ثلاثاء': 'Tuesday',
    'الثلاثاء': 'Tuesday',
    'tuesday': 'Tuesday',
    'tue': 'Tuesday',
    'اربعاء': 'Wednesday',
    'الأربعاء': 'Wednesday',
    'الاربعاء': 'Wednesday',
    'wednesday': 'Wednesday',
    'wed': 'Wednesday',
    'خميس': 'Thursday',
    'خمیس': 'Thursday',
    'الخميس': 'Thursday',
    'الخمیس': 'Thursday',
    'thursday': 'Thursday',
    'thu': 'Thursday',
    'جمعة': 'Friday',
    'الجمعة': 'Friday',
    'friday': 'Friday',
    'fri': 'Friday'
  };

  const STANDARD_DAYS = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  /**
   * Maps 2-hour university periods to 16-slot grid intervals
   * Period 1: 08:30 - 10:10/10:20 -> Slots 1, 2
   * Period 2: 10:30 - 12:10/12:20 -> Slots 3, 4
   * Period 3: 12:30 - 14:10/14:20 -> Slots 5, 6
   * Period 4: 14:30 - 16:10/16:20 -> Slots 7, 8
   * Period 5: 16:30 - 18:10/18:20 -> Slots 9, 10
   * Period 6: 18:30 - 20:10/20:20 -> Slots 11, 12
   * Period 7: 20:30 - 22:10/22:20 -> Slots 13, 14
   * Period 8: 22:30 - 00:10/00:20 -> Slots 15, 16
   */
  function mapPeriodToSlots(periodNum) {
    const p = parseInt(periodNum, 10);
    if (isNaN(p) || p < 1) return { startSlot: 1, endSlot: 2 };
    const startSlot = (p - 1) * 2 + 1;
    const endSlot = startSlot + 1;
    return {
      startSlot: Math.min(15, startSlot),
      endSlot: Math.min(16, endSlot)
    };
  }

  /**
   * Normalize Arabic/English day names
   */
  function normalizeDay(text) {
    if (!text) return null;
    const clean = text.trim().toLowerCase().replace(/[^\u0600-\u06FFa-zA-Z]/g, '');
    for (const [alias, std] of Object.entries(DAY_ALIASES)) {
      if (clean === alias || clean.includes(alias)) {
        return std;
      }
    }
    return null;
  }

  /**
   * Tests if a line of text represents a classroom or room number to discard
   */
  function isRoomLine(line) {
    if (!line) return false;
    const l = line.trim();
    if (/\|Class\s*room|\|Classroom|\|ME\s*Lab|\|EC\s*Lab|\|PC\s*Lab|\|AR\s*Lab|\|Lab|Class\s*room|Classroom/i.test(l)) {
      return true;
    }
    if (/^(?:ICE\s*Lab|PC\s*Lab|ME\s*Lab|EC\s*Lab|AR\s*Lab)$/i.test(l)) {
      return true;
    }
    if (/^[A-Z0-9\s\-]+(?:\||\/)[A-Za-z\s]+$/i.test(l)) {
      return true;
    }
    // Specific room patterns like "B 202", "121", "401", "221", "B 106", "102", "B005", "311", "415", "220", "203", "323", "405", "202", "320"
    if (/^[A-Z]?\s*\d{2,4}(?:\s*\|.*)?$/i.test(l)) {
      return true;
    }
    return false;
  }

  /**
   * Cleans and formats instructor / doctor names, stripping department prefixes and any room numbers
   */
  function formatInstructorName(rawName, sessionType) {
    if (!rawName || rawName === 'Not Specified') return 'Not Specified';
    let name = rawName.trim().replace(/\s+/g, ' ');

    // Normalize slashes with spaces
    name = name.replace(/\s*\/\s*/g, ' / ');

    // Strip any room remnants that might have been merged
    name = name.replace(/\|(?:Class\s*room|Classroom|ME\s*Lab|EC\s*Lab|PC\s*Lab|AR\s*Lab|Lab)/gi, '');
    name = name.replace(/\b[A-Z]?\s*\d{2,4}\b(?=\s*\||\s*$)/g, '');

    let isDoctor = false;
    if (/\b(?:ME|BA|EC|EE|CE|CS|IS|AI)\s+D\b/i.test(name)) {
      isDoctor = true;
      name = name.replace(/\b(?:ME|BA|EC|EE|CE|CS|IS|AI)\s+D\s+/gi, '');
    } else if (/\b(?:ME|BA|EC|EE|CE|CS|IS|AI)\s+E\b/i.test(name)) {
      name = name.replace(/\b(?:ME|BA|EC|EE|CE|CS|IS|AI)\s+E\s+/gi, '');
    }

    if (sessionType === 'Lect.' || isDoctor) {
      if (!/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?)/i.test(name)) {
        const isArabic = /[\u0600-\u06FF]/.test(name);
        name = (isArabic ? 'د. ' : 'Dr. ') + name;
      }
    }

    return name.trim();
  }

  /**
   * Extracts group name from page header or element text
   * e.g. "05EME01_144" -> "1", "05EME08_144" -> "8"
   */
  function extractGroupFromHeader(text) {
    if (!text) return null;
    const str = text.trim();

    // Specific AAST / aSc format: 05EME01_144 -> Group 1
    const aastMatch = str.match(/\b\d{2}[A-Za-z]{2,5}(\d{1,2})_\d+\b/i);
    if (aastMatch) {
      return String(parseInt(aastMatch[1], 10));
    }

    // Standard Arabic pattern: المجموعة: B
    const arMatch = str.match(/(?:المجموعة|مجموعة)\s*[:\-_]?\s*([A-Za-z0-9]+)/);
    if (arMatch) {
      return arMatch[1];
    }

    // Standard English pattern: Group 1, Group A, Sec 03
    const enMatch = str.match(/\b(?:Group|Sec|Section)\s*[:\-_]?\s*([A-Za-z0-9]+)\b/i);
    if (enMatch) {
      return enMatch[1];
    }

    return null;
  }

  /**
   * Parse a single cell's text into session info.
   * Strips room numbers completely and uses ONLY the course number (code).
   */
  function parseCellContent(cellText, day, periodNum, group) {
    if (!cellText || typeof cellText !== 'string' || !cellText.trim()) return null;

    const lines = cellText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    let courseCode = '';
    let sessionType = 'Lect.';
    let instructor = '';

    // Check all lines to find the course code line (e.g. EEC3301, EBA3208, EME3901, etc.)
    let courseLineIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/\b([A-Za-z]{2,5}\s*\d{3,4}[A-Za-z]?)\b/);
      if (m) {
        courseCode = m[1].replace(/\s+/g, '').toUpperCase();
        courseLineIdx = i;
        break;
      }
    }

    if (!courseCode) {
      return null; // Not a valid course slot
    }

    const courseLine = lines[courseLineIdx];

    // Detect session type
    if (/(?:_Sec|\bSec\.?|\bSec\b|سكشن|تمارين)/i.test(cellText)) {
      sessionType = 'Sec.';
    } else if (/(?:_Lab|\bLab\.?|\bLab\b|معمل)/i.test(cellText)) {
      sessionType = 'Lab.';
    } else if (/(?:_Lec|\bLec\.?|\bLec\b|محاضرة)/i.test(cellText)) {
      sessionType = 'Lect.';
    }

    // Remaining lines: Filter out all room lines completely
    const instructorLines = [];
    for (let i = 0; i < lines.length; i++) {
      if (i === courseLineIdx) continue;
      const l = lines[i];
      if (isRoomLine(l)) continue; // Discard room number
      instructorLines.push(l);
    }

    if (instructorLines.length > 0) {
      instructor = instructorLines.join(' / ').replace(/\s+/g, ' ').trim();
    }

    if (sessionType === 'Lect.') {
      if (/\b(?:ME|BA|EC)\s+E\b/i.test(instructor)) {
        sessionType = 'Sec.';
      }
    }

    instructor = formatInstructorName(instructor, sessionType);
    const slotRange = mapPeriodToSlots(periodNum);

    // USE ONLY THE COURSE NUMBER (CODE)
    return {
      courseCode,
      courseName: courseCode, // Use ONLY course number / code as requested!
      sessionType,
      day,
      periodNum,
      startSlot: slotRange.startSlot,
      endSlot: slotRange.endSlot,
      duration: slotRange.endSlot - slotRange.startSlot + 1,
      instructor: instructor || 'Not Specified',
      room: '', // Room number completely eliminated
      group
    };
  }

  /**
   * Parses text items extracted from a single PDF page with 2D spatial coordinates (scale 1.0)
   */
  function parsePageSpatialGrid(items, viewport, pageNum) {
    if (!items || items.length === 0) return null;

    // In PDF.js with scale 1.0:
    // item.transform[4] is X in points
    // item.transform[5] is Y in points from bottom (0 = bottom)
    // top-down Y = viewport.height - item.transform[5]
    const elements = items.map(item => ({
      str: (item.str || '').trim(),
      x: item.transform[4],
      y: viewport.height - item.transform[5],
      w: item.width || 0,
      h: item.height || 0
    })).filter(el => el.str.length > 0);

    if (elements.length === 0) return null;

    // 1. Group assignment: Page 1 -> Group 1, Page 2 -> Group 2, etc.
    // As requested: every subject in the first page is Group 1, in the 2nd page is Group 2, etc.
    const group = String(pageNum || 1);
    let headerText = `Group ${group}`;

    // Capture explicit header if present for info
    for (const el of elements) {
      const g = extractGroupFromHeader(el.str);
      if (g) {
        headerText = el.str;
        break;
      }
    }

    // 2. Detect Day Labels (rows) on left side (x < 0.25 * viewport.width)
    const dayRows = [];
    elements.forEach(el => {
      if (el.x < viewport.width * 0.25) {
        const stdDay = normalizeDay(el.str);
        if (stdDay && !dayRows.some(d => d.day === stdDay)) {
          dayRows.push({
            day: stdDay,
            y: el.y,
            raw: el.str
          });
        }
      }
    });

    dayRows.sort((a, b) => a.y - b.y);

    // 3. Detect Period Columns (x coordinates)
    const periodHeaders = [];
    elements.forEach(el => {
      if (el.y > viewport.height * 0.05 && el.y < viewport.height * 0.25) {
        const pNum = parseInt(el.str, 10);
        if (pNum >= 1 && pNum <= 8 && !periodHeaders.some(p => p.num === pNum)) {
          periodHeaders.push({
            num: pNum,
            x: el.x
          });
        }
      }
    });

    periodHeaders.sort((a, b) => a.x - b.x);

    // Define column boundaries
    const colBounds = [];
    const tableLeft = viewport.width * 0.12;
    const tableRight = viewport.width * 0.98;

    if (periodHeaders.length >= 4) {
      for (let i = 0; i < periodHeaders.length; i++) {
        const left = (i === 0) ? tableLeft : (periodHeaders[i - 1].x + periodHeaders[i].x) / 2;
        const right = (i === periodHeaders.length - 1) ? tableRight : (periodHeaders[i].x + periodHeaders[i + 1].x) / 2;
        colBounds.push({ period: periodHeaders[i].num, left, right });
      }
    } else {
      // Standard 6 equal columns
      const colW = (tableRight - tableLeft) / 6;
      for (let i = 1; i <= 6; i++) {
        colBounds.push({
          period: i,
          left: tableLeft + (i - 1) * colW,
          right: tableLeft + i * colW
        });
      }
    }

    // Define row boundaries
    const rowBounds = [];
    const tableTop = viewport.height * 0.18;
    const tableBottom = viewport.height * 0.95;

    if (dayRows.length >= 4) {
      for (let i = 0; i < dayRows.length; i++) {
        const top = (i === 0) ? tableTop : (dayRows[i - 1].y + dayRows[i].y) / 2;
        const bottom = (i === dayRows.length - 1) ? tableBottom : (dayRows[i].y + dayRows[i + 1].y) / 2;
        rowBounds.push({ day: dayRows[i].day, top, bottom });
      }
    } else {
      // Standard 6 days: Saturday through Thursday
      const defaultDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
      const rowH = (tableBottom - tableTop) / 6;
      defaultDays.forEach((d, i) => {
        rowBounds.push({
          day: d,
          top: tableTop + i * rowH,
          bottom: tableTop + (i + 1) * rowH
        });
      });
    }

    // 4. Assign text elements to Grid Cells (Day x Period)
    const cellMatrix = {};

    elements.forEach(el => {
      // Skip top headers and bottom footer
      if (el.y < tableTop - 15 || el.y > tableBottom + 5) return;
      if (el.x < tableLeft - 10) return; // Day column

      const row = rowBounds.find(r => el.y >= r.top && el.y < r.bottom);
      const col = colBounds.find(c => el.x >= c.left && el.x < c.right);

      if (row && col) {
        const key = row.day + '_' + col.period;
        if (!cellMatrix[key]) {
          cellMatrix[key] = {
            day: row.day,
            period: col.period,
            items: []
          };
        }
        cellMatrix[key].items.push(el);
      }
    });

    // 5. Parse sessions from occupied cells
    const pageSessions = [];

    Object.values(cellMatrix).forEach(cell => {
      cell.items.sort((a, b) => {
        const yDiff = a.y - b.y;
        if (Math.abs(yDiff) > 4) return yDiff;
        return a.x - b.x;
      });

      const lines = [];
      let currentLine = [];
      let lastY = null;

      cell.items.forEach(it => {
        if (lastY === null || Math.abs(it.y - lastY) < 6) {
          currentLine.push(it.str);
          lastY = it.y;
        } else {
          lines.push(currentLine.join(' '));
          currentLine = [it.str];
          lastY = it.y;
        }
      });
      if (currentLine.length > 0) lines.push(currentLine.join(' '));

      const combinedText = lines.join('\n');
      const session = parseCellContent(combinedText, cell.day, cell.period, group);
      if (session) {
        pageSessions.push(session);
      }
    });

    return {
      group,
      headerText,
      sessions: pageSessions
    };
  }

  /**
   * Parses an uploaded PDF file across ALL pages using PDF.js (scale: 1.0)
   */
  async function parsePdfFile(file, progressCallback) {
    if (typeof pdfjsLib === 'undefined') {
      throw new Error('PDF.js library is not loaded. Please ensure js/pdf.min.js is included.');
    }

    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';
    }

    let arrayBuffer;
    if (file instanceof ArrayBuffer) {
      arrayBuffer = file;
    } else if (file instanceof Blob) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      throw new Error('Invalid PDF file provided.');
    }

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      disableWorker: false
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const allSessions = [];
    const detectedGroups = new Set();

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (progressCallback) {
        progressCallback(pageNum, numPages);
      }

      const page = await pdfDoc.getPage(pageNum);
      // Critical: Scale 1.0 ensures viewport dimensions match text transform coordinates
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();

      const pageResult = parsePageSpatialGrid(textContent.items, viewport, pageNum);
      if (pageResult && pageResult.sessions.length > 0) {
        detectedGroups.add(pageResult.group);
        allSessions.push(...pageResult.sessions);
      }
    }

    if (allSessions.length === 0) {
      return {
        success: false,
        courses: [],
        message: 'No timetable sessions found in the PDF. Please check that the PDF contains class schedules.'
      };
    }

    const courses = aggregateSessionsIntoCourses(allSessions);

    return {
      success: true,
      courses,
      totalSessions: allSessions.length,
      groupsCount: detectedGroups.size,
      detectedGroups: Array.from(detectedGroups).sort(),
      message: `Extracted ${courses.length} courses across ${detectedGroups.size} groups (${Array.from(detectedGroups).sort().join(', ')}) with ${allSessions.length} total sessions.`
    };
  }

  /**
   * Fallback: Parses copied text or OCR text from PDF timetables across multiple pages/groups
   */
  function parsePdfText(rawText) {
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return { success: false, courses: [], message: 'Empty text provided.' };
    }

    const allSessions = [];
    const detectedGroups = new Set();

    // Match page separators: e.g. 05EME01_144, 05EME02_144, or Group 1, Group 2, or Page 1, Page 2
    const pageChunks = rawText.split(/(?=\b\d{2}[A-Za-z]{2,5}\d{2}_\d+\b|(?:\bGroup\s*[:\-_]?\s*\d+\b)|(?:\bPage\s*\d+\b))/i);

    pageChunks.forEach((chunk, idx) => {
      const trimmed = chunk.trim();
      if (!trimmed) return;

      const headerMatch = trimmed.match(/\b\d{2}[A-Za-z]{2,5}(\d{1,2})_\d+\b/i) ||
                          trimmed.match(/\b(?:Group|المجموعة|Sec|Section)\s*[:\-_]?\s*([A-Za-z0-9]+)\b/i);
      const group = headerMatch ? String(parseInt(headerMatch[1], 10) || headerMatch[1]) : String(idx + 1);
      detectedGroups.add(group);

      const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
      let currentDay = 'Saturday';
      let currentPeriod = 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const dayCand = normalizeDay(line);
        if (dayCand) {
          currentDay = dayCand;
          currentPeriod = 1;
          continue;
        }

        const periodMatch = line.match(/^(\d)\s*$/) || line.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
        if (periodMatch) {
          if (periodMatch[1] && periodMatch[1].length === 1) {
            currentPeriod = parseInt(periodMatch[1], 10);
          }
          continue;
        }

        // Match course code line
        const codeMatch = line.match(/\b([A-Za-z]{2,5}\s*\d{3,4}[A-Za-z]?)\b/);
        if (codeMatch) {
          const cellLines = [line];
          if (i + 1 < lines.length && !lines[i + 1].match(/\b[A-Za-z]{2,5}\s*\d{3,4}\b/) && !normalizeDay(lines[i + 1])) {
            cellLines.push(lines[i + 1]);
            if (i + 2 < lines.length && !lines[i + 2].match(/\b[A-Za-z]{2,5}\s*\d{3,4}\b/) && !normalizeDay(lines[i + 2])) {
              cellLines.push(lines[i + 2]);
            }
          }

          const cellText = cellLines.join('\n');
          const session = parseCellContent(cellText, currentDay, currentPeriod, group);
          if (session) {
            allSessions.push(session);
            currentPeriod = Math.min(6, currentPeriod + 1);
          }
        }
      }
    });

    if (allSessions.length === 0) {
      return {
        success: false,
        courses: [],
        message: 'Could not identify any timetable courses. Ensure course codes (e.g. EEC3301) and days are present.'
      };
    }

    const courses = aggregateSessionsIntoCourses(allSessions);

    return {
      success: true,
      courses,
      totalSessions: allSessions.length,
      groupsCount: detectedGroups.size,
      detectedGroups: Array.from(detectedGroups).sort(),
      message: `Parsed ${courses.length} courses across ${detectedGroups.size} groups with ${allSessions.length} sessions.`
    };
  }

  /**
   * Aggregates session records across all groups and pages into structured course objects.
   * Sets course name to ONLY the course number (code), and eliminates all room numbers.
   */
  function aggregateSessionsIntoCourses(allSessions) {
    const coursesMap = {};

    allSessions.forEach(session => {
      const code = session.courseCode;
      if (!coursesMap[code]) {
        coursesMap[code] = {
          id: code,
          code: code,
          name: code, // Use ONLY the course number (code) as requested!
          cleanName: code,
          groupsMap: {},
          allSlots: [],
          instructorsSet: new Set(),
          color: ScheduleParser.generateCourseColor(code)
        };
      }

      const course = coursesMap[code];

      const slotItem = {
        id: `${code}_${session.group}_${session.sessionType}_${session.day}_${session.startSlot}`,
        courseName: code, // Use ONLY course number
        courseCode: code,
        group: session.group,
        type: session.sessionType,
        day: session.day,
        startSlot: session.startSlot,
        endSlot: session.endSlot,
        duration: session.duration,
        instructor: session.instructor,
        room: '', // Room number completely eliminated
        color: course.color
      };

      course.allSlots.push(slotItem);

      if (session.instructor && session.instructor !== 'Not Specified') {
        course.instructorsSet.add(session.instructor);
      }

      if (!course.groupsMap[session.group]) {
        course.groupsMap[session.group] = {
          group: session.group,
          sessions: [],
          hasLecture: false,
          hasLab: false,
          instructors: new Set()
        };
      }

      const groupObj = course.groupsMap[session.group];
      groupObj.sessions.push(slotItem);

      if (session.sessionType === 'Lect.') groupObj.hasLecture = true;
      if (session.sessionType === 'Lab.' || session.sessionType === 'Sec.') groupObj.hasLab = true;

      if (session.instructor && session.instructor !== 'Not Specified') {
        groupObj.instructors.add(session.instructor);
      }
    });

    const courseList = Object.values(coursesMap).map(c => {
      const groupsList = Object.values(c.groupsMap).map(g => ({
        group: g.group,
        sessions: g.sessions,
        hasLecture: g.hasLecture,
        hasLab: g.hasLab,
        instructors: Array.from(g.instructors)
      })).sort((a, b) => a.group.localeCompare(b.group, undefined, { numeric: true }));

      return {
        id: c.code,
        code: c.code,
        name: c.code, // ONLY course number
        instructors: Array.from(c.instructorsSet),
        groups: groupsList,
        slots: c.allSlots,
        color: c.color
      };
    });

    courseList.sort((a, b) => a.code.localeCompare(b.code));

    return courseList;
  }

  return {
    parsePdfFile,
    parsePdfText,
    parseCellContent,
    mapPeriodToSlots,
    normalizeDay,
    extractGroupFromHeader,
    aggregateSessionsIntoCourses
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PdfScheduleParser;
}
