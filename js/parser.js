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

  return {
    parseHtml,
    detectScheduleType,
    extractGroupCode,
    normalizeDay,
    STANDARD_DAYS,
    generateCourseColor
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleParser;
}
