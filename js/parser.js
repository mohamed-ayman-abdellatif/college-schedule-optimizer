/**
 * parser.js
 * Comprehensive parser for College Timetable HTML (AASTMT and similar ASP.NET table grids).
 * Accurately extracts Course info, Days (Sat-Fri), Slots (1-16), Groups (A-Z), Session Types (Lect/Lab/Sec),
 * and Instructor/Doctor names using a dynamic 2D grid matrix that handles colspans and rowspans.
 */

const ScheduleParser = (() => {
  // Day mappings (English & Arabic)
  const DAY_ALIASES = {
    saturday: 'Saturday',
    السبت: 'Saturday',
    sunday: 'Sunday',
    الاحد: 'Sunday',
    الأحد: 'Sunday',
    monday: 'Monday',
    الاثنين: 'Monday',
    الإثنين: 'Monday',
    tuesday: 'Tuesday',
    الثلاثاء: 'Tuesday',
    wednesday: 'Wednesday',
    الاربعاء: 'Wednesday',
    الأربعاء: 'Wednesday',
    thursday: 'Thursday',
    الخميس: 'Thursday',
    friday: 'Friday',
    الجمعة: 'Friday'
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
   * Normalize day string to standard English day name.
   */
  function normalizeDay(text) {
    if (!text) return null;
    const clean = text.trim().toLowerCase();
    for (const [alias, standard] of Object.entries(DAY_ALIASES)) {
      if (clean.includes(alias.toLowerCase())) {
        return standard;
      }
    }
    return null;
  }

  /**
   * Extracts clean course title and code from text or element.
   */
  function extractCourseInfo(doc) {
    let rawTitle = '';

    // Check specific ASP.NET label ID
    const titleEl = doc.querySelector('[id$="lbl_Title"]');
    if (titleEl && titleEl.textContent.trim()) {
      rawTitle = titleEl.textContent.trim();
    }

    // Fallback 1: selected course dropdown
    if (!rawTitle) {
      const courseDdl = doc.querySelector('select[name$="ddl_Course"], select[id$="ddl_Course"]');
      if (courseDdl) {
        const selectedOpt = courseDdl.querySelector('option[selected]') || courseDdl.options[courseDdl.selectedIndex];
        if (selectedOpt && selectedOpt.value !== '-1' && selectedOpt.text.trim()) {
          rawTitle = selectedOpt.text.trim();
        }
      }
    }

    // Fallback 2: Header label
    if (!rawTitle) {
      const headerEl = doc.querySelector('[id$="lbl_Header"]');
      if (headerEl) rawTitle = headerEl.textContent.trim();
    }

    // Fallback 3: Page title or h1/h2
    if (!rawTitle) {
      const h = doc.querySelector('h1, h2, h3, .title');
      if (h) rawTitle = h.textContent.trim();
    }

    // Clean up prefix e.g. "جدول المقرر :" or "Course Schedule:"
    let cleanName = rawTitle.replace(/^.*?(?:جدول\s+المقرر|جدول\s+مقرر|Course\s*Schedule)\s*[:\-]?\s*/i, '').trim();
    if (!cleanName) cleanName = 'College Course';

    // Extract course code if present, e.g. "Applied Programming - ECE2102" -> Code: ECE2102
    let code = '';
    const codeMatch = cleanName.match(/(?:-|–|\/|\()\s*([A-Za-z]{2,5}\s*\d{3,4}[A-Za-z]?)\s*\)?$/i);
    if (codeMatch) {
      code = codeMatch[1].replace(/\s+/g, '');
    } else {
      // Try to find any uppercase code pattern
      const anyCode = cleanName.match(/\b([A-Za-z]{2,5}\d{3,4})\b/);
      if (anyCode) code = anyCode[1];
    }

    return { rawTitle, cleanName, code };
  }

  /**
   * Detects whether the HTML document or table represents a Group Schedule (جدول مجموعة)
   * or a single Course Schedule (جدول مقرر).
   */
  function detectScheduleType(doc, tableEl) {
    if (!doc) return 'course';

    // 1. Radio button rbl_Schedule_Type (0 = جدول مجموعة, 1 = جدول مقرر)
    const radioGroup = doc.querySelector('input[id*="rbl_Schedule_Type_0"][checked], input[name*="rbl_Schedule_Type"][value="0"][checked]');
    const radioCourse = doc.querySelector('input[id*="rbl_Schedule_Type_1"][checked], input[name*="rbl_Schedule_Type"][value="1"][checked]');
    if (radioGroup) return 'group';
    if (radioCourse) return 'course';

    // 2. Title Label (lbl_Title)
    const titleEl = doc.querySelector('[id$="lbl_Title"]');
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    if (/جدول\s+المقرر/i.test(titleText) || /^Course\s*Schedule/i.test(titleText)) {
      return 'course';
    }
    if (/المجموعة|جدول\s+مجموعة/i.test(titleText) || /Group\s*Schedule/i.test(titleText)) {
      return 'group';
    }

    // 3. Dropdowns visibility in form
    const groupRow = doc.querySelector('[id$="TR_Group"]');
    const courseRow = doc.querySelector('[id$="TR_Course"]');
    if (groupRow && groupRow.style.display !== 'none' && courseRow && courseRow.style.display === 'none') {
      return 'group';
    }
    if (courseRow && courseRow.style.display !== 'none' && groupRow && groupRow.style.display === 'none') {
      return 'course';
    }

    // 4. Content heuristic on table cells
    if (tableEl) {
      const allText = tableEl.textContent || '';
      const courseCodeMatches = allText.match(/\([A-Za-z]{2,5}\s*\d{3,4}[A-Za-z]?\)/g);
      const uniqueCodes = new Set((courseCodeMatches || []).map(m => m.replace(/[\s()]/g, '')));
      if (uniqueCodes.size >= 2) {
        return 'group';
      }
      if (/Group:\s*[A-Za-z0-9]+/i.test(allText)) {
        return 'course';
      }
    }

    return 'course';
  }

  /**
   * Extracts group code for a group schedule (e.g. "03CE01_144").
   */
  function extractGroupCode(doc, tableEl) {
    if (!doc) return 'Group_1';

    // 1. From ddl_Group selected option
    const groupDdl = doc.querySelector('select[name$="ddl_Group"], select[id$="ddl_Group"]');
    if (groupDdl) {
      const selectedOpt = groupDdl.querySelector('option[selected]') ||
                          (groupDdl.selectedIndex >= 0 ? groupDdl.options[groupDdl.selectedIndex] : null);
      if (selectedOpt && selectedOpt.value !== '-1' && selectedOpt.text.trim()) {
        const val = selectedOpt.text.trim();
        if (val && !val.startsWith('--')) return val;
      }
    }

    // 2. From lbl_Title e.g. "جدول هندسة الحاسبات ق.م // - الفترة 3 - المجموعة 03CE01_144"
    const titleEl = doc.querySelector('[id$="lbl_Title"]');
    if (titleEl) {
      const m = titleEl.textContent.match(/(?:المجموعة|Group)\s*[:\-]?\s*([A-Za-z0-9_]+)/i);
      if (m) return m[1].trim();
    }

    // 3. From text preceding table
    let prev = tableEl ? tableEl.previousElementSibling : null;
    while (prev) {
      const m = (prev.textContent || '').match(/(?:المجموعة|Group)\s*[:\-]?\s*([A-Za-z0-9_]+)/i);
      if (m) return m[1].trim();
      prev = prev.previousElementSibling;
    }

    // 4. From body text
    const bodyText = doc.body ? doc.body.textContent : '';
    const bodyMatch = bodyText.match(/(?:المجموعة|Group)\s*[:\-]?\s*([A-Za-z0-9_]+)/i);
    if (bodyMatch) return bodyMatch[1].trim();

    return 'Group_1';
  }

  /**
   * Extracts official color mappings per course code from legend table (grd_Group_Color).
   */
  function extractCourseColors(doc) {
    const map = {};
    if (!doc) return map;
    const colorTable = doc.querySelector('[id$="grd_Group_Color"]');
    if (colorTable) {
      const rows = colorTable.querySelectorAll('tr');
      rows.forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells.length >= 2) {
          let color = '';
          let code = '';
          for (let i = 0; i < cells.length; i++) {
            const style = cells[i].getAttribute('style') || '';
            const span = cells[i].querySelector('span[style*="background-color"]');
            const spanStyle = span ? span.getAttribute('style') || '' : '';
            const m = (style + ' ' + spanStyle).match(/background-color\s*:\s*([^;]+)/i);
            if (m && !color) {
              color = m[1].trim();
            }
            const txt = cells[i].textContent.trim();
            if (/^[A-Za-z0-9_]{3,10}$/.test(txt) && !code) {
              code = txt;
            }
          }
          if (code && color) {
            map[code] = color;
          }
        }
      });
    }
    return map;
  }

  /**
   * Extracts official course names and codes from ddl_Course dropdown if available.
   */
  function extractCourseNamesFromDropdown(doc) {
    const map = {};
    if (!doc) return map;
    const ddl = doc.querySelector('select[name$="ddl_Course"], select[id$="ddl_Course"]');
    if (ddl) {
      Array.from(ddl.options).forEach(opt => {
        const text = opt.text.trim();
        const m = text.match(/^(.*?)\s*[-–\/]\s*([A-Za-z0-9_]+)\s*$/);
        if (m) {
          const name = m[1].trim();
          const code = m[2].trim();
          map[code] = name;
        }
      });
    }
    return map;
  }

  /**
   * Parses an individual cell inside a Group Schedule table.
   */
  function parseGroupCell(cell, currentDay, slotColOffset, cIdx, colspan, groupCode, colorMap = {}, courseNamesMap = {}) {
    if (!currentDay) return null;

    const htmlContent = cell.innerHTML || '';
    const textWithBreaks = htmlContent.replace(/<br\b[^>]*>/gi, '\n');
    const cleanText = textWithBreaks.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
    const lines = cleanText.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);

    if (lines.length === 0) return null;

    let courseName = '';
    let courseCode = '';
    let courseLineIdx = -1;

    // Check hidden input hd_Group first (in group schedule it holds the course code)
    const groupInput = cell.querySelector('input[id$="_hd_Group"], input[name$="_hd_Group"]');
    const inputVal = groupInput ? groupInput.value.trim() : '';
    if (inputVal && /[A-Za-z]{2,5}\d{2,4}/.test(inputVal)) {
      courseCode = inputVal;
    }

    // Check lines for "(CODE)" pattern e.g. "Electrical Circuits I (EEE2304)"
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^(.*?)\s*\(\s*([A-Za-z0-9_]+)\s*\)\s*$/);
      if (m) {
        courseLineIdx = i;
        if (!courseName) courseName = m[1].trim();
        if (!courseCode) courseCode = m[2].trim();
        break;
      }
    }

    // If courseCode was from input but courseLineIdx not set
    if (courseCode && courseLineIdx === -1) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(courseCode)) {
          courseLineIdx = i;
          courseName = lines[i].replace(courseCode, '').replace(/[()]/g, '').trim();
          break;
        }
      }
      if (courseLineIdx === -1 && lines.length > 0) {
        courseLineIdx = 0;
        courseName = lines[0].replace(/[()]/g, '').trim();
      }
    }

    if (!courseCode) return null;
    if (courseNamesMap[courseCode]) {
      courseName = courseNamesMap[courseCode];
    }
    if (!courseName) courseName = courseCode;

    // Determine session type
    let type = 'Lect.';
    let typeLineIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (i === courseLineIdx) continue;
      if (/Lab\.?|معمل/i.test(lines[i])) {
        type = 'Lab.';
        typeLineIdx = i;
        break;
      } else if (/Sec\.?|سكشن|تمارين/i.test(lines[i])) {
        type = 'Sec.';
        typeLineIdx = i;
        break;
      } else if (/Lect\.?|محاضرة/i.test(lines[i])) {
        type = 'Lect.';
        typeLineIdx = i;
        break;
      }
    }

    // Determine instructor
    const instructorLines = lines.filter((line, idx) => {
      if (idx === courseLineIdx || idx === typeLineIdx) return false;
      const l = line.toLowerCase();
      if (/^(lab|lect|sec)\.?$/i.test(l)) return false;
      if (/^(محاضرة|معمل|سكشن)$/i.test(l)) return false;
      if (/^\d+$/.test(l)) return false;
      if (line === courseCode) return false;
      if (/^(hall|room|lab|theater|auditorium|قاعة|مدرج|فصل|معمل)\s*\d*/i.test(l)) return false;
      if (/^[A-Za-z]{1,2}\s*\d{2,4}[A-Za-z]?$/.test(line) && line !== courseCode) return false;
      return true;
    });

    let instructor = instructorLines.length > 0
      ? instructorLines.join(' ').replace(/\s+/g, ' ').trim()
      : 'Not Specified';

    if (type === 'Lect.' && instructor && instructor !== 'Not Specified') {
      if (!/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?)/i.test(instructor)) {
        const isArabic = /[\u0600-\u06FF]/.test(instructor);
        instructor = (isArabic ? 'د. ' : 'Dr. ') + instructor;
      }
    }

    const startSlot = Math.max(1, Math.min(16, 1 + (cIdx - slotColOffset)));
    const endSlot = Math.max(startSlot, Math.min(16, startSlot + colspan - 1));
    const duration = endSlot - startSlot + 1;

    const cellBg = cell.style.backgroundColor || getComputedStyleColor(cell) || '';
    const color = colorMap[courseCode] || cellBg || generateCourseColor(courseCode);

    return {
      id: `${courseCode}_${groupCode}_${type}_${currentDay}_${startSlot}`,
      courseName,
      courseCode,
      group: groupCode,
      type,
      day: currentDay,
      startSlot,
      endSlot,
      duration,
      instructor,
      color
    };
  }

  /**
   * Parses a Group Schedule table and returns an array of Course objects with the given group code.
   */
  function parseGroupScheduleTable(tableEl, groupCode, colorMap = {}, courseNamesMap = {}) {
    const rows = Array.from(tableEl.querySelectorAll('tr'));
    if (rows.length < 2) return [];

    let slotColOffset = 2;

    for (let r = 0; r < Math.min(3, rows.length); r++) {
      const ths = Array.from(rows[r].children);
      for (let c = 0; c < ths.length; c++) {
        const text = ths[c].textContent.trim();
        if (/^1$/i.test(text)) {
          slotColOffset = c;
          break;
        }
      }
    }

    const grid = [];
    let currentDay = '';
    const extractedSlots = [];

    rows.forEach((tr, rIdx) => {
      if (!grid[rIdx]) grid[rIdx] = [];
      let cIdx = 0;

      const cells = Array.from(tr.children);
      cells.forEach(cell => {
        while (grid[rIdx][cIdx]) {
          cIdx++;
        }

        const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
        const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);

        for (let r = 0; r < rowspan; r++) {
          if (!grid[rIdx + r]) grid[rIdx + r] = [];
          for (let c = 0; c < colspan; c++) {
            grid[rIdx + r][cIdx + c] = cell;
          }
        }

        const cleanCellText = (cell.innerText || cell.textContent || '').replace(/\s+/g, ' ').trim();

        const dayCandidate = normalizeDay(cleanCellText);
        if (dayCandidate && (cell.tagName === 'TH' || cIdx === 0)) {
          currentDay = dayCandidate;
        } else if (cleanCellText && cleanCellText !== '&nbsp;') {
          const slot = parseGroupCell(cell, currentDay, slotColOffset, cIdx, colspan, groupCode, colorMap, courseNamesMap);
          if (slot) {
            extractedSlots.push(slot);
          }
        }

        cIdx += colspan;
      });
    });

    // Group extracted slots by courseCode
    const courseMap = new Map();

    extractedSlots.forEach(slot => {
      if (!courseMap.has(slot.courseCode)) {
        const officialName = courseNamesMap[slot.courseCode] || slot.courseName;
        const color = colorMap[slot.courseCode] || slot.color || generateCourseColor(slot.courseCode);
        courseMap.set(slot.courseCode, {
          id: slot.courseCode,
          code: slot.courseCode,
          name: officialName,
          color,
          sessions: [],
          instructorsSet: new Set()
        });
      }

      const c = courseMap.get(slot.courseCode);
      c.sessions.push(slot);
      if (slot.instructor && slot.instructor !== 'Not Specified') {
        c.instructorsSet.add(slot.instructor);
      }
    });

    const courses = [];
    courseMap.forEach(c => {
      const hasLecture = c.sessions.some(s => s.type === 'Lect.');
      const hasLab = c.sessions.some(s => s.type === 'Lab.' || s.type === 'Sec.');
      const instList = Array.from(c.instructorsSet);

      const groupObj = {
        group: groupCode,
        sessions: c.sessions,
        hasLecture,
        hasLab,
        instructors: instList
      };

      courses.push({
        id: c.code,
        name: c.name,
        code: c.code,
        instructors: instList,
        groups: [groupObj],
        slots: c.sessions,
        color: c.color,
        scheduleType: 'group'
      });
    });

    return courses;
  }

  /**
   * Main function: Parses an HTML string and returns structured course schedules.
   * Accurately distinguishes between Course Schedules (جدول مقرر) and Group Schedules (جدول مجموعة).
   * @param {string} htmlString - Raw HTML input
   * @returns {Object} { success: boolean, scheduleType: string, groupCode: string|null, courses: Array, totalSlots: number, message: string }
   */
  function parseHtml(htmlString) {
    if (!htmlString || typeof htmlString !== 'string' || !htmlString.trim()) {
      return { success: false, courses: [], message: 'Empty HTML input provided.' };
    }

    try {
      const parser = new DOMParser();
      // Handle HTML entities and encoding
      const doc = parser.parseFromString(htmlString, 'text/html');

      // Find all schedule tables (supports multiple tables in one document)
      let scheduleTables = Array.from(doc.querySelectorAll('span[id$="Schedule1"] table, table[id$="Schedule1"]'));
      if (scheduleTables.length === 0) {
        // Fallback: look for any table with rows containing days
        const allTables = Array.from(doc.querySelectorAll('table'));
        scheduleTables = allTables.filter(tbl => {
          const text = tbl.textContent.toLowerCase();
          return text.includes('saturday') || text.includes('السبت') || text.includes('group:') || text.includes('lect.') || text.includes('sec.') || text.includes('lab.');
        });
      }

      if (scheduleTables.length === 0) {
        // Try fallback: look for any table with at least 4 rows
        const fallback = Array.from(doc.querySelectorAll('table')).filter(t => t.querySelectorAll('tr').length >= 4);
        if (fallback.length > 0) scheduleTables = [fallback[0]];
      }

      if (scheduleTables.length === 0) {
        return { success: false, courses: [], message: 'No college schedule table found in HTML.' };
      }

      const firstTable = scheduleTables[0];
      const schedType = detectScheduleType(doc, firstTable);
      const isGroupSchedule = schedType === 'group';

      const courses = [];
      let globalSlotCounter = 0;
      let primaryGroupCode = '';

      if (isGroupSchedule) {
        primaryGroupCode = extractGroupCode(doc, firstTable);
        const colorMap = extractCourseColors(doc);
        const courseNamesMap = extractCourseNamesFromDropdown(doc);

        scheduleTables.forEach(table => {
          const groupCourses = parseGroupScheduleTable(table, primaryGroupCode, colorMap, courseNamesMap);
          groupCourses.forEach(gc => {
            const existing = courses.find(c => c.code === gc.code || c.id === gc.id);
            if (existing) {
              gc.groups.forEach(newG => {
                const exG = existing.groups.find(g => g.group === newG.group);
                if (exG) {
                  exG.sessions = exG.sessions.concat(newG.sessions);
                } else {
                  existing.groups.push(newG);
                }
              });
              existing.slots = existing.slots.concat(gc.slots);
              existing.instructors = Array.from(new Set([...existing.instructors, ...gc.instructors]));
            } else {
              courses.push(gc);
            }
            globalSlotCounter += gc.slots.length;
          });
        });
      } else {
        scheduleTables.forEach((table, tIdx) => {
          // Find closest title or course context
          let courseInfo = extractCourseInfo(doc);
          if (scheduleTables.length > 1) {
            // Look for title preceding this specific table
            let prev = table.previousElementSibling;
            while (prev) {
              if (prev.textContent && (prev.textContent.includes('جدول') || prev.textContent.includes('Course'))) {
                const localName = prev.textContent.replace(/^.*?(?:جدول\s+المقرر|Course\s*Schedule)\s*[:\-]?\s*/i, '').trim();
                if (localName) {
                  courseInfo.cleanName = localName;
                  const m = localName.match(/(?:-|–|\/|\()\s*([A-Za-z]{2,5}\s*\d{3,4}[A-Za-z]?)\s*\)?$/i);
                  if (m) courseInfo.code = m[1].replace(/\s+/g, '');
                }
                break;
              }
              prev = prev.previousElementSibling;
            }
          }

          const tableResult = parseSingleScheduleTable(table, courseInfo);
          if (tableResult && tableResult.slots.length > 0) {
            courses.push(tableResult);
            globalSlotCounter += tableResult.slots.length;
          }
        });
      }

      if (courses.length === 0) {
        return {
          success: false,
          courses: [],
          message: 'Found table structure, but no Group or Lecture/Lab slots could be identified.'
        };
      }

      return {
        success: true,
        scheduleType: isGroupSchedule ? 'group' : 'course',
        groupCode: isGroupSchedule ? primaryGroupCode : null,
        courses,
        totalSlots: globalSlotCounter,
        message: isGroupSchedule
          ? `Successfully parsed group schedule (${primaryGroupCode}) with ${courses.length} course(s).`
          : `Successfully parsed ${courses.length} course(s) with ${globalSlotCounter} total class slots.`
      };
    } catch (err) {
      console.error('Error in ScheduleParser.parseHtml:', err);
      return {
        success: false,
        courses: [],
        message: `Parsing error: ${err.message}`
      };
    }
  }

  /**
   * Parses a single table element using 2D grid matrix layout.
   */
  function parseSingleScheduleTable(tableEl, defaultCourseInfo) {
    const rows = Array.from(tableEl.querySelectorAll('tr'));
    if (rows.length < 2) return null;

    // Detect header row and map column index to slot number
    let slotColOffset = 2; // default: col 0 = Day, col 1 = spacer, col 2 = slot 1
    let maxSlotNumber = 16;

    // Analyze first 1-2 rows to locate slot headers (1, 2, 3, ... 16)
    for (let r = 0; r < Math.min(3, rows.length); r++) {
      const ths = Array.from(rows[r].children);
      for (let c = 0; c < ths.length; c++) {
        const text = ths[c].textContent.trim();
        if (/^1$/i.test(text)) {
          slotColOffset = c; // Column index where Slot 1 starts
          break;
        }
      }
    }

    // 2D grid matrix tracking cell occupation (handles rowspan & colspan)
    const grid = [];
    let currentDay = '';
    const extractedSlots = [];

    rows.forEach((tr, rIdx) => {
      if (!grid[rIdx]) grid[rIdx] = [];
      let cIdx = 0;

      const cells = Array.from(tr.children);
      cells.forEach(cell => {
        // Advance to next unallocated column in this row
        while (grid[rIdx][cIdx]) {
          cIdx++;
        }

        const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
        const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);

        // Occupy cells in grid matrix
        for (let r = 0; r < rowspan; r++) {
          if (!grid[rIdx + r]) grid[rIdx + r] = [];
          for (let c = 0; c < colspan; c++) {
            grid[rIdx + r][cIdx + c] = cell;
          }
        }

        const rawCellText = cell.innerText || cell.textContent || '';
        const cleanCellText = rawCellText.replace(/\s+/g, ' ').trim();

        // 1. Check if this cell is a Day Header
        const dayCandidate = normalizeDay(cleanCellText);
        if (dayCandidate && (cell.tagName === 'TH' || cIdx === 0)) {
          currentDay = dayCandidate;
        }

        // 2. Check if this cell contains class/schedule item
        const groupInput = cell.querySelector('input[id$="_hd_Group"], input[name$="_hd_Group"]');
        let groupLetter = groupInput ? groupInput.value.trim() : null;

        if (!groupLetter) {
          const gm = cleanCellText.match(/Group:\s*([A-Za-z0-9]+)/i);
          if (gm) groupLetter = gm[1].trim();
        }

        // Also check if text has "Lect" or "Lab" or "Sec" even if Group: is formatted slightly differently
        const hasSessionType = /(?:Lab|Lect|Sec|محاضرة|معمل|سكشن)\.?/i.test(cleanCellText);

        if (groupLetter || hasSessionType) {
          // If group letter is still missing, attempt to extract any isolated letter
          if (!groupLetter) {
            const letterMatch = cleanCellText.match(/\b([A-Z])\b/);
            if (letterMatch) groupLetter = letterMatch[1];
            else groupLetter = 'General';
          }

          // Slot number calculation:
          // startSlot = 1 + (cIdx - slotColOffset)
          const startSlot = Math.max(1, Math.min(16, 1 + (cIdx - slotColOffset)));
          const endSlot = Math.max(startSlot, Math.min(16, startSlot + colspan - 1));

          // Determine session type
          let type = 'Lect.';
          if (/Lab\.?|معمل/i.test(cleanCellText)) {
            type = 'Lab.';
          } else if (/Sec\.?|سكشن|تمارين/i.test(cleanCellText)) {
            type = 'Sec.';
          } else if (/Lect\.?|محاضرة/i.test(cleanCellText)) {
            type = 'Lect.';
          }

          // Extract Doctor / Instructor Name
          // Replace any <br...> tag (including ASP.NET <br \="">) with newline
          let instructor = '';
          const htmlContent = cell.innerHTML || '';
          const textWithBreaks = htmlContent.replace(/<br\b[^>]*>/gi, '\n');
          const cleanText = textWithBreaks.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
          const rawLines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

          const candidateLines = rawLines.filter(line => {
            const l = line.toLowerCase();
            if (l.startsWith('group:')) return false;
            if (/^(lab|lect|sec)\.?$/i.test(l)) return false;
            if (/^(محاضرة|معمل|سكشن)$/i.test(l)) return false;
            if (/^\d+$/.test(l)) return false;
            return true;
          });

          if (candidateLines.length > 0) {
            instructor = candidateLines.join(' ').replace(/\s+/g, ' ').trim();
          }

          // If session is a Lecture, ensure doctor title prefix is present
          if (type === 'Lect.' && instructor && instructor !== 'Not Specified') {
            if (!/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?)/i.test(instructor)) {
              const isArabic = /[\u0600-\u06FF]/.test(instructor);
              instructor = (isArabic ? 'د. ' : 'Dr. ') + instructor;
            }
          }

          // Background color for visual styling
          const bgColor = cell.style.backgroundColor || getComputedStyleColor(cell) || '';

          // Validate slot data
          if (currentDay && startSlot >= 1 && startSlot <= 16) {
            extractedSlots.push({
              id: `${defaultCourseInfo.code || 'CRS'}_${groupLetter}_${type}_${currentDay}_${startSlot}`,
              courseName: defaultCourseInfo.cleanName,
              courseCode: defaultCourseInfo.code,
              group: groupLetter.toUpperCase(),
              type,
              day: currentDay,
              startSlot,
              endSlot,
              duration: endSlot - startSlot + 1,
              instructor: instructor || 'Not Specified',
              color: bgColor
            });
          }
        }

        cIdx += colspan;
      });
    });

    // Group the slots by Group Letter
    const groupsMap = {};
    const instructorsSet = new Set();

    extractedSlots.forEach(slot => {
      if (!groupsMap[slot.group]) {
        groupsMap[slot.group] = {
          group: slot.group,
          sessions: [],
          hasLecture: false,
          hasLab: false,
          instructors: new Set()
        };
      }
      groupsMap[slot.group].sessions.push(slot);
      if (slot.type === 'Lect.') groupsMap[slot.group].hasLecture = true;
      if (slot.type === 'Lab.' || slot.type === 'Sec.') groupsMap[slot.group].hasLab = true;

      if (slot.instructor && slot.instructor !== 'Not Specified') {
        groupsMap[slot.group].instructors.add(slot.instructor);
        instructorsSet.add(slot.instructor);
      }
    });

    // Convert sets to arrays
    const groupsList = Object.values(groupsMap).map(g => ({
      ...g,
      instructors: Array.from(g.instructors)
    }));

    return {
      id: defaultCourseInfo.code || `course_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: defaultCourseInfo.cleanName,
      code: defaultCourseInfo.code || defaultCourseInfo.cleanName.split(' ')[0],
      instructors: Array.from(instructorsSet),
      groups: groupsList,
      slots: extractedSlots,
      color: generateCourseColor(defaultCourseInfo.code || defaultCourseInfo.cleanName)
    };
  }

  function getComputedStyleColor(el) {
    if (el.getAttribute('bgcolor')) return el.getAttribute('bgcolor');
    const style = el.getAttribute('style') || '';
    const m = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
    return m ? m[1].trim() : '';
  }

  /**
   * Deterministic distinct pastel color generation for courses.
   */
  const PALETTE = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#6366F1', // Indigo
    '#84CC16'  // Lime
  ];

  function generateCourseColor(key) {
    let hash = 0;
    const str = String(key);
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % PALETTE.length;
    return PALETTE[idx];
  }

  /**
   * Checks if an object represents a college schedules catalog manifest (index.json).
   */
  function isCatalogManifest(data) {
    return Boolean(data && typeof data === 'object' && Array.isArray(data.majors));
  }

  /**
   * Parses and normalizes a college schedules catalog manifest.
   */
  function parseCatalogManifest(data) {
    if (!isCatalogManifest(data)) return null;
    return {
      version: data.version || '1.0',
      updatedAt: data.updatedAt || '',
      defaultMajorId: data.defaultMajorId || (data.majors[0] ? data.majors[0].id : ''),
      majors: data.majors.map(m => ({
        id: m.id || m.file || 'major_' + Math.random().toString(36).substr(2, 6),
        title: m.title || m.titleEn || 'College Timetable',
        titleEn: m.titleEn || m.title || 'College Timetable',
        semester: m.semester || m.semesterEn || '',
        semesterEn: m.semesterEn || m.semester || '',
        file: m.file || '',
        totalDepartments: typeof m.totalDepartments === 'number' ? m.totalDepartments : (Array.isArray(m.departments) ? m.departments.length : 0),
        totalSchedules: m.totalSchedules || 0,
        departments: Array.isArray(m.departments) ? m.departments : [],
        updatedAt: m.updatedAt || ''
      }))
    };
  }

  /**
   * Checks if an object represents a college/major schedule export JSON.
   */
  function isMajorScheduleJson(data) {
    if (!data || typeof data !== 'object') return false;
    return Boolean(
      data.departmentsTree ||
      data.departmentsSummary ||
      data.allSchedules ||
      data.allClassSessions ||
      data.courses ||
      (data.metadata && (data.metadata.exportTitle || data.metadata.portalHeader || data.metadata.totalDepartments)) ||
      (Array.isArray(data.groups) && data.groups.length > 0 && Array.isArray(data.groups[0].classes))
    );
  }

  /**
   * Extracts metadata summary from a major schedule JSON.
   */
  function getMajorMetadata(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') return null;
    const meta = jsonData.metadata || {};
    const depts = getMajorDepartments(jsonData);

    if (!jsonData.metadata && Array.isArray(jsonData.groups) && jsonData.groups.length > 0) {
      let title = 'College Timetable (الجدول الدراسي)';
      if (Array.isArray(jsonData.subjects) && jsonData.subjects.length > 0) {
        title = 'Engineering Schedule (جدول الهندسة)';
      }
      return {
        title,
        portalHeader: title,
        batch: 'Term Schedule',
        scrapedAt: new Date().toISOString(),
        totalDepartments: 1,
        totalSchedules: jsonData.groups.length,
        totalClassesFound: jsonData.groups.reduce((acc, g) => acc + (Array.isArray(g.classes) ? g.classes.length : 0), 0)
      };
    }

    let title = meta.exportTitle || meta.portalHeader || 'College Timetable';
    if (meta.portalHeader && meta.portalHeader.includes('--')) {
      const parts = meta.portalHeader.split('--');
      if (parts[1] && parts[1].trim()) {
        title = parts[1].trim();
      }
    } else if (meta.exportTitle && meta.exportTitle.includes('--')) {
      const parts = meta.exportTitle.split('--');
      if (parts.length >= 2 && parts[parts.length - 1].trim().startsWith('كلية')) {
        title = parts[parts.length - 1].trim();
      }
    }

    return {
      title,
      portalHeader: meta.portalHeader || '',
      batch: meta.batch ? (typeof meta.batch === 'object' ? meta.batch.text : String(meta.batch)) : '',
      scrapedAt: meta.scrapedAt || '',
      totalDepartments: depts.length,
      totalSchedules: meta.totalSchedules || 0,
      totalClassesFound: meta.totalClassesFound || 0
    };
  }

  /**
   * Cleans department name (removes trailing slashes or symbols e.g. "علوم الحاسب ق.م //" -> "علوم الحاسب ق.م").
   */
  function cleanDeptName(name) {
    if (!name || typeof name !== 'string') return '';
    return name.replace(/[\/\\–-]+$/, '').trim();
  }

  /**
   * Checks if a department entry matches the target department query.
   * Handles variations with "//", "*", "_", and whitespace.
   */
  function isDepartmentMatch(deptKey, deptObj, target) {
    if (!target) return false;
    const norm = str => String(str || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const t = norm(target);
    const tClean = norm(cleanDeptName(target));
    const tStar = norm(target.replace(/_+$/, '*'));
    const tUnderscore = norm(target.replace(/\*+$/, '_'));

    const candidates = [
      norm(deptKey),
      norm(cleanDeptName(deptKey)),
      norm(String(deptKey || '').replace(/_+$/, '*')),
      norm(String(deptKey || '').replace(/\*+$/, '_'))
    ];

    if (deptObj && typeof deptObj === 'object') {
      if (deptObj.departmentName) {
        candidates.push(norm(deptObj.departmentName));
        candidates.push(norm(cleanDeptName(deptObj.departmentName)));
        candidates.push(norm(deptObj.departmentName.replace(/_+$/, '*')));
        candidates.push(norm(deptObj.departmentName.replace(/\*+$/, '_')));
      }
      if (deptObj.rawDepartmentLabel) {
        candidates.push(norm(deptObj.rawDepartmentLabel));
        candidates.push(norm(cleanDeptName(deptObj.rawDepartmentLabel)));
        candidates.push(norm(deptObj.rawDepartmentLabel.replace(/_+$/, '*')));
        candidates.push(norm(deptObj.rawDepartmentLabel.replace(/\*+$/, '_')));
      }
    }

    return candidates.some(c => c && (c === t || c === tClean || c === tStar || c === tUnderscore));
  }

  /**
   * Retrieves the list of departments from a major schedule JSON.
   */
  function getMajorDepartments(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') return [];

    const map = new Map();

    // Helper to format visible label ensuring "//" and "*" are visible
    function formatVisibleDeptLabel(label, fallbackKey = '') {
      let str = String(label || fallbackKey || '').trim();
      if (!str.endsWith('*') && (str.endsWith('_') || String(fallbackKey).endsWith('_'))) {
        str = str.replace(/_+$/, '*');
      }
      return str;
    }

    // 1. From departmentsTree (authoritative structure with rawDepartmentLabel)
    if (jsonData.departmentsTree && typeof jsonData.departmentsTree === 'object') {
      Object.keys(jsonData.departmentsTree).forEach(rawKey => {
        const item = jsonData.departmentsTree[rawKey];
        const cName = cleanDeptName(item.departmentName || rawKey);
        let rawLabel = formatVisibleDeptLabel(item.rawDepartmentLabel || item.departmentName || rawKey, rawKey);
        if (item.rawDepartmentLabel && item.rawDepartmentLabel.includes('//') && !rawLabel.includes('//')) {
          rawLabel = rawLabel.trim() + ' //';
        }

        const deptKey = rawKey;
        if (!map.has(deptKey)) {
          map.set(deptKey, {
            name: cName,
            key: deptKey,
            rawLabel: rawLabel,
            displayLabel: rawLabel,
            value: item.departmentValue || '',
            totalSchedules: item.totalSchedules || (item.periods ? Object.keys(item.periods).length : 0),
            totalClasses: 0
          });
        }
      });
    }

    // 2. From departmentsSummary if present (supplements any missing in tree)
    if (Array.isArray(jsonData.metadata?.departmentsSummary)) {
      jsonData.metadata.departmentsSummary.forEach(d => {
        const rawDept = d.department || d.departmentName || '';
        const cName = cleanDeptName(rawDept);
        let existing = null;
        for (const val of map.values()) {
          if (val.key === rawDept || isDepartmentMatch(val.key, val, rawDept)) {
            existing = val;
            break;
          }
        }
        if (!existing) {
          const rawLabel = formatVisibleDeptLabel(rawDept);
          map.set(rawDept, {
            name: cName,
            key: rawDept,
            rawLabel: rawLabel,
            displayLabel: rawLabel,
            value: d.departmentValue || '',
            totalSchedules: d.totalSchedules || 0,
            totalClasses: d.totalClasses || 0
          });
        } else {
          if (d.totalSchedules && !existing.totalSchedules) existing.totalSchedules = d.totalSchedules;
          if (d.totalClasses && !existing.totalClasses) existing.totalClasses = d.totalClasses;
          if (d.departmentValue && !existing.value) existing.value = d.departmentValue;
        }
      });
    }

    // 3. From allSchedules
    if (Array.isArray(jsonData.allSchedules)) {
      jsonData.allSchedules.forEach(item => {
        const rawName = item.department?.rawLabel || item.department?.name || '';
        const cName = cleanDeptName(rawName);
        let existing = null;
        for (const val of map.values()) {
          if (val.key === rawName || isDepartmentMatch(val.key, val, rawName)) {
            existing = val;
            break;
          }
        }
        if (!existing) {
          const rawLabel = formatVisibleDeptLabel(rawName);
          map.set(rawName, {
            name: cName,
            key: rawName,
            rawLabel: rawLabel,
            displayLabel: rawLabel,
            value: item.department?.value || '',
            totalSchedules: 1,
            totalClasses: 0
          });
        } else {
          existing.totalSchedules++;
        }
      });
    }

    // 4. From groups array (e.g. CE S3.json, CE S5.json)
    if (map.size === 0 && Array.isArray(jsonData.groups) && jsonData.groups.length > 0) {
      const deptName = 'General Engineering / Major Timetable (جدول الكلية)';
      map.set(deptName, {
        name: deptName,
        key: deptName,
        rawLabel: deptName,
        displayLabel: deptName,
        value: '1',
        totalSchedules: jsonData.groups.length,
        totalClasses: jsonData.groups.reduce((acc, g) => acc + (Array.isArray(g.classes) ? g.classes.length : 0), 0)
      });
    }

    return Array.from(map.values());
  }

  /**
   * Retrieves periods available for a given department.
   */
  function getMajorPeriodsForDepartment(jsonData, deptName) {
    if (!jsonData || typeof jsonData !== 'object' || !deptName) return [];
    const cleanTarget = cleanDeptName(deptName).toLowerCase();
    const periodMap = new Map();

    // Helper to register period
    function registerPeriod(pKey, pVal, groupCount = 0, activeCount = 0, courseCount = 0, actCourseCount = 0) {
      if (!pKey) return;
      const keyStr = String(pKey).trim();
      if (!periodMap.has(keyStr)) {
        periodMap.set(keyStr, {
          periodName: keyStr,
          periodValue: pVal || keyStr,
          totalGroups: groupCount,
          activeGroups: activeCount,
          totalCourses: courseCount,
          activeCourses: actCourseCount
        });
      } else {
        const p = periodMap.get(keyStr);
        p.totalGroups += groupCount;
        p.activeGroups += activeCount;
        p.totalCourses = (p.totalCourses || 0) + courseCount;
        p.activeCourses = (p.activeCourses || 0) + actCourseCount;
      }
    }

    // 1. Check departmentsTree
    if (jsonData.departmentsTree) {
      for (const [dKey, dObj] of Object.entries(jsonData.departmentsTree)) {
        if (isDepartmentMatch(dKey, dObj, deptName)) {
          if (dObj.periods && typeof dObj.periods === 'object') {
            for (const [pKey, pObj] of Object.entries(dObj.periods)) {
              let grpCount = 0;
              let actCount = 0;
              let courseCount = 0;
              let actCourseCount = 0;

              if (pObj.courses && typeof pObj.courses === 'object') {
                for (const cObj of Object.values(pObj.courses)) {
                  courseCount++;
                  const hasGroups = Array.isArray(cObj.groups) && cObj.groups.length > 0;
                  const hasSessions = hasGroups && cObj.groups.some(g => Array.isArray(g.sessions) && g.sessions.length > 0);
                  const hasTable = Array.isArray(cObj.schedule) && cObj.schedule.some(d => Array.isArray(d.sessions) && d.sessions.length > 0);
                  if (hasSessions || hasTable || hasGroups) actCourseCount++;
                  if (hasGroups) {
                    grpCount += cObj.groups.length;
                    actCount += cObj.groups.filter(g => Array.isArray(g.sessions) && g.sessions.length > 0).length;
                  }
                }
              }

              if (pObj.groups && typeof pObj.groups === 'object') {
                for (const gObj of Object.values(pObj.groups)) {
                  if (gObj.groupName && !gObj.groupName.includes('--اختر')) {
                    grpCount++;
                    const hasSessions = Array.isArray(gObj.schedule) && gObj.schedule.some(d => Array.isArray(d.sessions) && d.sessions.length > 0);
                    if (hasSessions) actCount++;
                  }
                }
              }
              registerPeriod(pObj.periodName || pKey, pObj.periodValue || pKey, grpCount, actCount, courseCount, actCourseCount);
            }
          }
        }
      }
    }

    // 2. Check allSchedules
    if (Array.isArray(jsonData.allSchedules)) {
      jsonData.allSchedules.forEach(item => {
        if (isDepartmentMatch(item.department?.name, item.department, deptName) && item.period) {
          const pLabel = item.period.label || item.period.value;
          const isRealGroup = item.group?.label && !item.group.label.includes('--اختر');
          const isCourse = Boolean(item.course || item.courseCode || item.code);
          const hasSessions = (Array.isArray(item.schedule) && item.schedule.some(d => Array.isArray(d.sessions) && d.sessions.length > 0)) ||
                              (Array.isArray(item.groups) && item.groups.some(g => Array.isArray(g.sessions) && g.sessions.length > 0));
          registerPeriod(
            pLabel,
            item.period.value || pLabel,
            isRealGroup ? 1 : (item.groups ? item.groups.length : 0),
            hasSessions ? 1 : 0,
            isCourse ? 1 : 0,
            (isCourse && hasSessions) ? 1 : 0
          );
        }
      });
    }

    // 3. Check groups array (e.g. CE S3.json, CE S5.json)
    if (periodMap.size === 0 && Array.isArray(jsonData.groups) && jsonData.groups.length > 0) {
      const pMapCounts = new Map();
      jsonData.groups.forEach(g => {
        const m = (g.name || '').match(/^0?(\d+)/);
        const pNum = m ? m[1] : '1';
        const hasClasses = Array.isArray(g.classes) && g.classes.length > 0;
        if (!pMapCounts.has(pNum)) {
          pMapCounts.set(pNum, { total: 0, active: 0 });
        }
        const c = pMapCounts.get(pNum);
        c.total++;
        if (hasClasses) c.active++;
      });
      pMapCounts.forEach((counts, pKey) => {
        registerPeriod(pKey, pKey, counts.total, counts.active);
      });
    }

    // Sort periods numerically: 1, 2, 3...
    const result = Array.from(periodMap.values());
    result.sort((a, b) => {
      const numA = parseInt(a.periodName, 10);
      const numB = parseInt(b.periodName, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.periodName.localeCompare(b.periodName);
    });

    return result;
  }

  /**
   * Helper to map slot indices or names to the 16-slot grid matrix.
   */
  function mapSlotToGridMatrix(slotIndex, slotName, colspan = 1, totalPeriodsCount = 4) {
    const sName = String(slotName || '').toLowerCase();

    // Check time strings
    let startSlot = 1;
    if (sName.includes('08:30') || sName.includes('8:30')) startSlot = 1;
    else if (sName.includes('09:30') || sName.includes('9:30')) startSlot = 2;
    else if (sName.includes('10:30')) startSlot = 3;
    else if (sName.includes('11:30')) startSlot = 4;
    else if (sName.includes('12:30')) startSlot = 5;
    else if (sName.includes('13:30') || sName.includes('01:30') || sName.includes('1:30')) startSlot = 6;
    else if (sName.includes('14:30') || sName.includes('02:30') || sName.includes('2:30')) startSlot = 7;
    else if (sName.includes('15:30') || sName.includes('03:30') || sName.includes('3:30')) startSlot = 8;
    else if (sName.includes('16:30') || sName.includes('04:30') || sName.includes('4:30')) startSlot = 9;
    else if (sName.includes('17:30') || sName.includes('05:30') || sName.includes('5:30')) startSlot = 10;
    else if (sName.includes('18:30') || sName.includes('06:30') || sName.includes('6:30')) startSlot = 11;
    else if (sName.includes('19:30') || sName.includes('07:30') || sName.includes('7:30')) startSlot = 12;
    else if (sName.includes('20:30') || sName.includes('08:30 pm') || sName.includes('8:30 pm')) startSlot = 13;
    else if (sName.includes('21:30') || sName.includes('09:30 pm') || sName.includes('9:30 pm')) startSlot = 14;
    else if (sName.includes('22:30') || sName.includes('10:30 pm') || sName.includes('10:30 pm')) startSlot = 15;
    else if (typeof slotIndex === 'number' && slotIndex > 0) {
      if (totalPeriodsCount <= 8 && slotIndex <= 8) {
        startSlot = (slotIndex - 1) * 2 + 1;
      } else {
        startSlot = Math.min(16, slotIndex);
      }
    }

    const span = (totalPeriodsCount <= 8 && (!colspan || colspan === 1)) ? 2 : Math.max(1, (colspan || 1) * (totalPeriodsCount <= 8 ? 2 : 1));
    const endSlot = Math.min(16, startSlot + span - 1);
    const duration = endSlot - startSlot + 1;

    return { startSlot, endSlot, duration };
  }

  /**
   * Extracts clean course subjects with all their discovered groups from a major schedule JSON.
   */
  function extractCoursesFromMajor(jsonData, deptName, periodKey) {
    if (!jsonData || !deptName || !periodKey) {
      return { success: false, courses: [], message: 'Invalid arguments.' };
    }

    const cleanTargetDept = cleanDeptName(deptName).toLowerCase();
    const cleanTargetPeriod = String(periodKey).trim();

    // Map of courseCode -> { id, code, name, color, groupsMap, instructorsSet, slots }
    const coursesMap = new Map();
    const colorMap = {};
    let totalGroupsFound = 0;

    // Helper to register a session
    function addSessionToCourse(sessData) {
      const {
        courseCode,
        courseName,
        groupCode,
        type,
        day,
        startSlot,
        endSlot,
        duration,
        instructor,
        room,
        color
      } = sessData;

      if (!courseCode || !groupCode || !day) return;

      if (!coursesMap.has(courseCode)) {
        coursesMap.set(courseCode, {
          id: courseCode,
          code: courseCode,
          name: courseName || courseCode,
          color: color || colorMap[courseCode] || generateCourseColor(courseCode),
          groupsMap: new Map(),
          instructorsSet: new Set(),
          slots: []
        });
      }

      const c = coursesMap.get(courseCode);
      if (color) c.color = color;
      if (courseName && (!c.name || c.name === c.code)) c.name = courseName;

      if (!c.groupsMap.has(groupCode)) {
        c.groupsMap.set(groupCode, {
          group: groupCode,
          sessions: [],
          hasLecture: false,
          hasLab: false,
          instructors: new Set()
        });
      }

      const g = c.groupsMap.get(groupCode);
      const sessionObj = {
        id: `${courseCode}_${groupCode}_${type}_${day}_${startSlot}`,
        courseName: c.name,
        courseCode: courseCode,
        group: groupCode,
        type: type,
        day: day,
        startSlot: startSlot,
        endSlot: endSlot,
        duration: duration,
        instructor: instructor || 'Not Specified',
        color: c.color,
        room: room || ''
      };

      g.sessions.push(sessionObj);
      c.slots.push(sessionObj);

      if (type === 'Lect.') g.hasLecture = true;
      if (type === 'Lab.' || type === 'Sec.') g.hasLab = true;

      if (instructor && instructor !== 'Not Specified') {
        g.instructors.add(instructor);
        c.instructorsSet.add(instructor);
      }
    }

    // Process a schedule object (groups with days and sessions)
    function processScheduleDays(groupLabel, scheduleDays, groupTimeSlots = [], groupColors = []) {
      if (!Array.isArray(scheduleDays) || scheduleDays.length === 0) return;
      if (!groupLabel || groupLabel.includes('--اختر')) return;

      totalGroupsFound++;

      // Register course colors
      if (Array.isArray(groupColors)) {
        groupColors.forEach(cc => {
          if (cc.courseCode && cc.color) colorMap[cc.courseCode] = cc.color;
        });
      }

      scheduleDays.forEach(dayItem => {
        const normDay = normalizeDay(dayItem.day);
        if (!normDay) return;

        (dayItem.sessions || []).forEach(sess => {
          // Extract course code
          let cCode = sess.courseCode ? sess.courseCode.trim() : '';
          let cName = sess.courseName ? sess.courseName.trim() : '';

          if (!cCode && sess.rawContent) {
            // Try (CODE) pattern
            const cm = sess.rawContent.match(/\(\s*([A-Za-z0-9_]{3,10})\s*\)/);
            if (cm) cCode = cm[1];
            else {
              const codeMatch = sess.rawContent.match(/\b([A-Za-z]{2,5}\s*\d{2,4}[A-Za-z]?)\b/);
              if (codeMatch) cCode = codeMatch[1].replace(/\s+/g, '');
            }
          }

          if (!cCode) return; // Cannot add without code

          if (!cName && sess.rawContent) {
            const lines = sess.rawContent.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length > 0) {
              cName = lines[0].replace(cCode, '').replace(/[()]/g, '').trim();
            }
          }
          if (!cName) cName = cCode;

          // Determine type
          let type = 'Lect.';
          const typeStr = (sess.type || sess.rawContent || '').toLowerCase();
          if (/lab\.?|معمل/i.test(typeStr)) type = 'Lab.';
          else if (/sec\.?|سكشن|تمارين/i.test(typeStr)) type = 'Sec.';
          else if (/lect\.?|محاضرة/i.test(typeStr)) type = 'Lect.';

          // Determine instructor
          let instructor = sess.instructor || '';
          if (!instructor && sess.rawContent) {
            const rawLines = sess.rawContent.split('\n').map(l => l.trim()).filter(Boolean);
            const cand = rawLines.filter(line => {
              const l = line.toLowerCase();
              if (l.startsWith('group:')) return false;
              if (/^(lab|lect|sec)\.?$/i.test(l)) return false;
              if (/^(محاضرة|معمل|سكشن)$/i.test(l)) return false;
              if (/^\d+$/.test(l)) return false;
              if (line === cCode) return false;
              if (/^(hall|room|lab|theater|auditorium|قاعة|مدرج|فصل|معمل)\s*\d*/i.test(l)) return false;
              return true;
            });
            if (cand.length > 0) instructor = cand.join(' ').trim();
          }

          if (type === 'Lect.' && instructor && instructor !== 'Not Specified') {
            if (!/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?)/i.test(instructor)) {
              const isAr = /[\u0600-\u06FF]/.test(instructor);
              instructor = (isAr ? 'د. ' : 'Dr. ') + instructor;
            }
          }

          const slotCoords = mapSlotToGridMatrix(
            sess.slotIndex,
            sess.slotName || sess.timeSlot,
            sess.colspan || 1,
            groupTimeSlots.length || 4
          );

          addSessionToCourse({
            courseCode: cCode,
            courseName: cName,
            groupCode: sess.group || groupLabel,
            type: type,
            day: normDay,
            startSlot: slotCoords.startSlot,
            endSlot: slotCoords.endSlot,
            duration: slotCoords.duration,
            instructor: instructor || 'Not Specified',
            room: sess.room || '',
            color: sess.bgColor || colorMap[cCode] || generateCourseColor(cCode)
          });
        });
      });
    }

    // 1. Scan departmentsTree
    if (jsonData.departmentsTree) {
      for (const [dKey, dObj] of Object.entries(jsonData.departmentsTree)) {
        if (isDepartmentMatch(dKey, dObj, deptName)) {
          if (dObj.periods && typeof dObj.periods === 'object') {
            for (const [pKey, pObj] of Object.entries(dObj.periods)) {
              if (String(pObj.periodName || pKey).trim() === cleanTargetPeriod) {
                // Course mode: pObj.courses (جدول مقرر)
                if (pObj.courses && typeof pObj.courses === 'object') {
                  for (const [cKey, cVal] of Object.entries(pObj.courses)) {
                    const cCode = (cVal.code || cVal.courseCode || cKey).trim();
                    const cName = (cVal.name || cVal.courseName || cCode).trim();
                    if (!cCode) continue;

                    if (Array.isArray(cVal.groups) && cVal.groups.length > 0) {
                      cVal.groups.forEach(grp => {
                        const gName = grp.group || grp.groupCode || grp.name || 'Group_1';
                        totalGroupsFound++;
                        (grp.sessions || []).forEach(sess => {
                          const normDay = normalizeDay(sess.day);
                          if (!normDay) return;

                          let startSlot = sess.startSlot;
                          let endSlot = sess.endSlot;
                          let duration = sess.duration;
                          if (!startSlot || !endSlot) {
                            const slotCoords = mapSlotToGridMatrix(
                              sess.slotIndex,
                              sess.slotName || sess.timeSlot,
                              sess.colspan || 1,
                              4
                            );
                            startSlot = slotCoords.startSlot;
                            endSlot = slotCoords.endSlot;
                            duration = slotCoords.duration;
                          }
                          if (!duration) duration = (endSlot - startSlot + 1);

                          let t = sess.type || 'Lect.';
                          if (/lab\.?|معمل/i.test(t)) t = 'Lab.';
                          else if (/sec\.?|سكشن|تمارين/i.test(t)) t = 'Sec.';
                          else if (/lect\.?|محاضرة/i.test(t)) t = 'Lect.';

                          let inst = sess.instructor || '';
                          if (t === 'Lect.' && inst && inst !== 'Not Specified') {
                            if (!/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?)/i.test(inst)) {
                              const isAr = /[\u0600-\u06FF]/.test(inst);
                              inst = (isAr ? 'د. ' : 'Dr. ') + inst;
                            }
                          }

                          addSessionToCourse({
                            courseCode: cCode,
                            courseName: cName,
                            groupCode: gName,
                            type: t,
                            day: normDay,
                            startSlot: startSlot,
                            endSlot: endSlot,
                            duration: duration,
                            instructor: inst || 'Not Specified',
                            room: sess.room || '',
                            color: sess.bgColor || colorMap[cCode] || generateCourseColor(cCode)
                          });
                        });
                      });

                      if (coursesMap.has(cCode) && Array.isArray(cVal.instructors)) {
                        const c = coursesMap.get(cCode);
                        cVal.instructors.forEach(inst => {
                          if (inst && inst !== 'Not Specified') c.instructorsSet.add(inst);
                        });
                      }
                    } else if (Array.isArray(cVal.schedule) && cVal.schedule.length > 0) {
                      processScheduleDays(
                        cVal.group || cVal.name || cKey,
                        cVal.schedule,
                        cVal.timeSlots || [],
                        cVal.courseColors || []
                      );
                    }
                  }
                }

                // Group mode: pObj.groups (جدول مجموعة)
                if (pObj.groups && typeof pObj.groups === 'object') {
                  for (const [gKey, gObj] of Object.entries(pObj.groups)) {
                    processScheduleDays(
                      gObj.groupName || gKey,
                      gObj.schedule,
                      gObj.timeSlots || [],
                      gObj.courseColors || []
                    );
                  }
                }
              }
            }
          }
        }
      }
    }

    // 2. Scan allSchedules if coursesMap is empty or as supplement
    if (coursesMap.size === 0 && Array.isArray(jsonData.allSchedules)) {
      jsonData.allSchedules.forEach(item => {
        const itemPeriod = String(item.period?.label || item.period?.value || '').trim();
        if (isDepartmentMatch(item.department?.name, item.department, deptName) && itemPeriod === cleanTargetPeriod) {
          if (Array.isArray(item.groups) && item.groups.length > 0) {
            const cCode = (item.course?.code || item.courseCode || item.code || '').trim();
            const cName = (item.course?.name || item.courseName || item.name || cCode).trim();
            if (cCode) {
              item.groups.forEach(grp => {
                const gName = grp.group || grp.groupCode || grp.name || 'Group_1';
                totalGroupsFound++;
                (grp.sessions || []).forEach(sess => {
                  const normDay = normalizeDay(sess.day);
                  if (!normDay) return;
                  let startSlot = sess.startSlot;
                  let endSlot = sess.endSlot;
                  let duration = sess.duration;
                  if (!startSlot || !endSlot) {
                    const slotCoords = mapSlotToGridMatrix(
                      sess.slotIndex,
                      sess.slotName || sess.timeSlot,
                      sess.colspan || 1,
                      4
                    );
                    startSlot = slotCoords.startSlot;
                    endSlot = slotCoords.endSlot;
                    duration = slotCoords.duration;
                  }
                  if (!duration) duration = (endSlot - startSlot + 1);

                  let t = sess.type || 'Lect.';
                  if (/lab\.?|معمل/i.test(t)) t = 'Lab.';
                  else if (/sec\.?|سكشن|تمارين/i.test(t)) t = 'Sec.';
                  else if (/lect\.?|محاضرة/i.test(t)) t = 'Lect.';

                  let inst = sess.instructor || '';
                  if (t === 'Lect.' && inst && inst !== 'Not Specified') {
                    if (!/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?)/i.test(inst)) {
                      const isAr = /[\u0600-\u06FF]/.test(inst);
                      inst = (isAr ? 'د. ' : 'Dr. ') + inst;
                    }
                  }

                  addSessionToCourse({
                    courseCode: cCode,
                    courseName: cName,
                    groupCode: gName,
                    type: t,
                    day: normDay,
                    startSlot: startSlot,
                    endSlot: endSlot,
                    duration: duration,
                    instructor: inst || 'Not Specified',
                    room: sess.room || '',
                    color: sess.bgColor || colorMap[cCode] || generateCourseColor(cCode)
                  });
                });
              });
            }
          } else {
            processScheduleDays(
              item.group?.label || item.group?.value,
              item.schedule,
              item.timeSlots || [],
              item.courseColors || []
            );
          }
        }
      });
    }

    // 3. Scan allClassSessions if still empty
    if (coursesMap.size === 0 && Array.isArray(jsonData.allClassSessions)) {
      jsonData.allClassSessions.forEach(sess => {
        const sPeriod = String(sess.period || '').trim();
        if (isDepartmentMatch(sess.department, null, deptName) && sPeriod === cleanTargetPeriod) {
          const normDay = normalizeDay(sess.day);
          if (normDay && sess.courseCode) {
            const slotCoords = mapSlotToGridMatrix(sess.slotIndex, sess.timeSlot, 1, 4);
            addSessionToCourse({
              courseCode: sess.courseCode,
              courseName: sess.courseName || sess.courseCode,
              groupCode: sess.group || 'Group_1',
              type: sess.type || 'Lect.',
              day: normDay,
              startSlot: slotCoords.startSlot,
              endSlot: slotCoords.endSlot,
              duration: slotCoords.duration,
              instructor: sess.instructor || 'Not Specified',
              room: sess.room || '',
              color: sess.bgColor || generateCourseColor(sess.courseCode)
            });
          }
        }
      });
    }

    // 4. Scan direct groups array (e.g. CE S3.json, CE S5.json)
    if (coursesMap.size === 0 && Array.isArray(jsonData.groups)) {
      const cleanTargetPeriod = String(periodKey).trim();
      const filteredGroups = jsonData.groups.filter(g => {
        const m = (g.name || '').match(/^0?(\d+)/);
        return m ? (m[1] === cleanTargetPeriod) : true;
      });
      const groupsToProcess = filteredGroups.length > 0 ? filteredGroups : jsonData.groups;

      if (Array.isArray(jsonData.subjects)) {
        jsonData.subjects.forEach(s => {
          if (s.name && s.color) {
            const m = s.name.match(/\(([A-Za-z0-9_]+)\)/);
            const code = m ? m[1] : s.name.trim();
            colorMap[code] = s.color.dark || s.color.light || '#3B82F6';
          }
        });
      }

      groupsToProcess.forEach(grp => {
        const gName = grp.name || `Group_${grp.id || 1}`;
        (grp.classes || []).forEach(cls => {
          const sub = cls.subject || '';
          const codeMatch = sub.match(/\(([A-Za-z0-9_]+)\)/);
          const cCode = codeMatch ? codeMatch[1] : sub.trim();
          const cName = sub.replace(/\s*\([^\)]+\)/, '').trim() || cCode;
          if (!cCode) return;

          const normDay = normalizeDay(cls.day);
          if (!normDay) return;

          let slotIdx = 1;
          if (typeof cls.start === 'number') {
            if (cls.start <= 570) slotIdx = 1;
            else if (cls.start <= 690) slotIdx = 2;
            else if (cls.start <= 810) slotIdx = 3;
            else if (cls.start <= 930) slotIdx = 4;
            else if (cls.start <= 1050) slotIdx = 5;
            else slotIdx = 6;
          } else if (typeof cls.timeSlot === 'number') {
            slotIdx = cls.timeSlot + 1;
          }

          const slotMatrix = mapSlotToGridMatrix(slotIdx, '', 1, 4);

          let t = 'Lect.';
          const rawType = (cls.type || '').toLowerCase();
          if (rawType.includes('lab') || rawType.includes('معمل')) t = 'Lab.';
          else if (rawType.includes('sec') || rawType.includes('سكشن')) t = 'Sec.';
          else if (rawType.includes('lect') || rawType.includes('محاضرة')) t = 'Lect.';

          let inst = cls.name && cls.name !== 'Not Specified' ? cls.name.trim() : 'Not Specified';
          if (t === 'Lect.' && inst !== 'Not Specified' && !inst.startsWith('د.') && !inst.startsWith('Dr.') && !inst.startsWith('Prof.')) {
            inst = 'د. ' + inst;
          }

          addSessionToCourse({
            courseCode: cCode,
            courseName: cName,
            groupCode: gName,
            type: t,
            day: normDay,
            startSlot: slotMatrix.startSlot,
            endSlot: slotMatrix.endSlot,
            duration: slotMatrix.duration,
            instructor: inst,
            room: cls.room || '',
            color: colorMap[cCode] || generateCourseColor(cCode)
          });
        });
      });
    }

    // 5. Scan direct courses object/array if coursesMap is still empty
    if (coursesMap.size === 0 && jsonData.courses) {
      const courseEntries = Array.isArray(jsonData.courses)
        ? jsonData.courses
        : Object.values(jsonData.courses);

      courseEntries.forEach(cVal => {
        const cCode = (cVal.code || cVal.courseCode || cVal.id || '').trim();
        const cName = (cVal.name || cVal.courseName || cCode).trim();
        if (!cCode) return;

        if (Array.isArray(cVal.groups)) {
          cVal.groups.forEach(grp => {
            const gName = grp.group || grp.groupCode || grp.name || 'Group_1';
            totalGroupsFound++;
            (grp.sessions || []).forEach(sess => {
              const normDay = normalizeDay(sess.day);
              if (!normDay) return;
              let startSlot = sess.startSlot || 1;
              let endSlot = sess.endSlot || startSlot;
              let duration = sess.duration || (endSlot - startSlot + 1);
              let t = sess.type || 'Lect.';
              let inst = sess.instructor || 'Not Specified';

              addSessionToCourse({
                courseCode: cCode,
                courseName: cName,
                groupCode: gName,
                type: t,
                day: normDay,
                startSlot: startSlot,
                endSlot: endSlot,
                duration: duration,
                instructor: inst,
                room: sess.room || '',
                color: sess.bgColor || colorMap[cCode] || generateCourseColor(cCode)
              });
            });
          });
        }
      });
    }

    // Convert coursesMap to array
    const courses = [];
    coursesMap.forEach(c => {
      const groupsList = Array.from(c.groupsMap.values()).map(g => ({
        group: g.group,
        sessions: g.sessions,
        hasLecture: g.hasLecture,
        hasLab: g.hasLab,
        instructors: Array.from(g.instructors)
      }));

      courses.push({
        id: c.code,
        name: c.name,
        code: c.code,
        instructors: Array.from(c.instructorsSet),
        groups: groupsList,
        slots: c.slots,
        color: c.color,
        scheduleType: 'group'
      });
    });

    const success = courses.length > 0;
    return {
      success,
      departmentName: deptName,
      period: periodKey,
      courses,
      totalCourses: courses.length,
      totalGroups: totalGroupsFound,
      totalSlots: courses.reduce((acc, c) => acc + c.slots.length, 0),
      message: success
        ? `Successfully loaded ${courses.length} subjects with ${courses.reduce((acc, c) => acc + c.groups.length, 0)} groups.`
        : `No active timetable sessions found for ${deptName} (Period ${periodKey}).`
    };
  }

  return {
    parseHtml,
    detectScheduleType,
    extractGroupCode,
    normalizeDay,
    STANDARD_DAYS,
    generateCourseColor,
    isCatalogManifest,
    parseCatalogManifest,
    isMajorScheduleJson,
    getMajorMetadata,
    getMajorDepartments,
    getMajorPeriodsForDepartment,
    extractCoursesFromMajor,
    mapSlotToGridMatrix,
    isDepartmentMatch
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleParser;
}
