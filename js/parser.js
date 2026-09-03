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
   * Main function: Parses an HTML string and returns structured course schedules.
   * @param {string} htmlString - Raw HTML input
   * @returns {Object} { success: boolean, courses: Array, totalSlots: number, message: string }
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
          return text.includes('saturday') || text.includes('السبت') || text.includes('group:');
        });
      }

      if (scheduleTables.length === 0) {
        // Try fallback: look for any table with at least 5 rows
        const fallback = Array.from(doc.querySelectorAll('table')).filter(t => t.querySelectorAll('tr').length >= 4);
        if (fallback.length > 0) scheduleTables = [fallback[0]];
      }

      if (scheduleTables.length === 0) {
        return { success: false, courses: [], message: 'No college schedule table found in HTML.' };
      }

      const courses = [];
      let globalSlotCounter = 0;

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

      if (courses.length === 0) {
        return {
          success: false,
          courses: [],
          message: 'Found table structure, but no Group or Lecture/Lab slots could be identified.'
        };
      }

      return {
        success: true,
        courses,
        totalSlots: globalSlotCounter,
        message: `Successfully parsed ${courses.length} course(s) with ${globalSlotCounter} total class slots.`
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
    normalizeDay,
    STANDARD_DAYS,
    generateCourseColor
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScheduleParser;
}
