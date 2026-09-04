/**
 * app.js
 * Main application coordinator: state management, local storage, user events,
 * tab switching, bilingual dictionary, and component integration.
 *
 * 🤲 متنساش تدعيلي دعوة حلوة ❤️
 */

const App = (() => {
  // متنساش تدعيلي دعوة حلوة
  // Application State
  const state = {
    courses: [],
    doctorPreferences: {},
    preferences: {
      gapWeight: 50,
      daysWeight: 30,
      doctorWeight: 40,
      earlyWeight: 10,
      uniformGroupWeight: 20,
      maxDaysAllowed: 7,
      freeDays: []
    },
    solutions: [],
    activeSolutionIndex: 0,
    blockedTimes: [],
    currentTab: 'courses',
    currentLang: 'en',
    currentTheme: 'dark',
    imageDetectionDraft: null
  };

  // Translations
  const TRANSLATIONS = {
    en: {
      appTitle: 'College Schedule Optimizer',
      appSubtitle: 'Convert college HTML & photos into optimal clash-free schedules',
      tabCourses: '1. Add Courses',
      tabPreferences: '2. Doctor & Goals',
      tabTimetable: '3. Timetable Results',
      loadSampleBtn: 'Load Example Courses',
      findSchedulesBtn: 'Find Best Schedules',
      pasteHtmlTab: 'Paste HTML Code',
      uploadPhotoTab: 'Upload Schedule Photo',
      manualTab: 'Manual Quick Entry',
      htmlPlaceholder: 'Paste HTML schedule content from your college portal here...',
      parseBtn: 'Parse & Add Course',
      dropzoneTitle: 'Drag & drop schedule photo here, or click to browse',
      dropzoneSub: 'Supports PNG, JPG screenshots of schedule tables',
      noCoursesTitle: 'No Courses Added Yet',
      noCoursesDesc: 'Paste college HTML above or click "Load Example Courses" to test.',
      doctorPrefTitle: 'Doctor & Instructor Preferences',
      doctorPrefDesc: 'Prioritize your favorite professors or avoid instructors you do not want.',
      goalsTitle: 'Optimization Weights & Goals',
      gapWeightLabel: 'Minimize Gaps between lectures',
      daysWeightLabel: 'Minimize Campus Days (More Days Off)',
      doctorWeightLabel: 'Prioritize Preferred Doctors',
      freeDaysLabel: 'Target Free Days (Days Completely Off):',
      blockedTimesTitle: 'Prohibited / Blocked Times (Training & Busy Hours)',
      blockedTimesDesc: 'Prohibit specific times (e.g. Saturday 8 AM training). The optimizer will guarantee zero classes are scheduled during these times!',
      blockedPresetsLabel: 'Quick Presets:',
      presetSatTraining: '⚽ Block Saturday 08:30 - 10:20 (Training)',
      presetEvenings: '🌙 Block All Slots After 4 PM',
      presetClearBlocked: 'Clear All Blocked Slots',
      exportPng: 'Export PNG Image',
      printSchedule: 'Print Schedule',
      exportIcs: 'Export to Google Calendar (.ics)',
      exportJson: 'Save Courses (JSON)',
      importJson: 'Import Courses (JSON)',
      zeroGapsBadge: '⚡ Zero Gaps (No Waiting)',
      clearAllCourses: 'Clear All Courses',
      doctorBadge: '🎓 Doctor',
      instructorBadge: '🔬 TA / Instructor',
      doctorsSubheading: '🎓 Doctors & Professors (Lectures)',
      instructorsSubheading: '🔬 Teaching Assistants (Labs & Sections)',
      guideBtn: 'Guide ❓',
      guideModalTitle: 'Quick Guide: How to Use the Optimizer',
      dontShowAgain: "Don't show automatically on startup",
      guideGotItBtn: "Got it, Let's Start! 🚀",
      mobileSwipeHint: 'Swipe horizontally to view all 16 periods 👈👉'
    },
    ar: {
      appTitle: 'محول ومحسن الجداول الجامعية',
      appSubtitle: 'تحويل كود HTML وصور الجدول إلى أفضل جدول دراسي بدون تعارض وبأقل فترات فراغ',
      tabCourses: '١. المقررات والسكاشن',
      tabPreferences: '٢. اختيار الدكاترة والأهداف',
      tabTimetable: '٣. الجدول النهائي',
      loadSampleBtn: 'تحميل المقررات التجريبية',
      findSchedulesBtn: 'توليد أفضل الجداول',
      pasteHtmlTab: 'نسخ ولصق كود HTML',
      uploadPhotoTab: 'رفع صورة / سكرين شوت للجدول',
      manualTab: 'إدخال يدوي سريع',
      htmlPlaceholder: 'الصق كود HTML لجدول المقرر من موقع الأكاديمية أو كليتك هنا...',
      parseBtn: 'استخراج وإضافة المقرر',
      dropzoneTitle: 'اسحب صورة الجدول هنا أو اضغط للاختيار',
      dropzoneSub: 'يدعم صور وسكرين شوت الجداول الدراسية (PNG, JPG)',
      noCoursesTitle: 'لم يتم إضافة مقررات حتى الآن',
      noCoursesDesc: 'الصق كود HTML من موقع الكلية أو اضغط "تحميل المقررات التجريبية" للتجربة الفورية.',
      doctorPrefTitle: 'تفضيلات الدكاترة والمعيدين',
      doctorPrefDesc: 'اختر دكاترتك المفضلين لكل مادة أو تجنب الدكاترة غير المرغوب فيهم.',
      goalsTitle: 'أولويات وأهداف الجدول',
      gapWeightLabel: 'تقليل فترات الفراغ بين المحاضرات (Gaps)',
      daysWeightLabel: 'تقليل أيام النزول للكلية (أيام إجازة أكثر)',
      doctorWeightLabel: 'الأولوية للدكاترة المفضلين',
      freeDaysLabel: 'أيام إجازة مطلوبة بالكامل (بدون نزول):',
      blockedTimesTitle: 'الأوقات المحظورة (مواعيد التمرين والانشغالات)',
      blockedTimesDesc: 'احظر أوقات محددة (مثل تدريب السبت الساعة 8 صباحاً). يضمن المحسن عدم وضع أي حصة في هذه الفترات نهائياً!',
      blockedPresetsLabel: 'إعدادات سريعة جاهزة:',
      presetSatTraining: '⚽ حظر تدريب السبت 08:30 - 10:20',
      presetEvenings: '🌙 حظر الفترات المسائية بعد 4 عصراً',
      presetClearBlocked: 'مسح جميع الأوقات المحظورة',
      exportPng: 'تصدير صورة عالية الجودة (PNG)',
      printSchedule: 'طباعة الجدول',
      exportIcs: 'تصدير لتقويم جوجل (Google Calendar)',
      exportJson: 'حفظ المقررات (JSON)',
      importJson: 'استيراد المقررات (JSON)',
      zeroGapsBadge: '⚡ بدون أي فترات فراغ (Zero Gaps)',
      clearAllCourses: 'مسح جميع المقررات',
      doctorBadge: '🎓 دكتور / أستاذ',
      instructorBadge: '🔬 معيد / مساعد تدريس',
      doctorsSubheading: '🎓 الدكاترة والأساتذة (المحاضرات)',
      instructorsSubheading: '🔬 المعيدون ومساعدو التدريس (المعامل والتمارين)',
      guideBtn: 'دليل الاستخدام ❓',
      guideModalTitle: 'دليل الاستخدام السريع: كيف تستخدم الموقع؟',
      dontShowAgain: 'عدم الإظهار تلقائياً عند فتح الموقع',
      guideGotItBtn: 'فهمت، لنبدأ الآن! 🚀',
      mobileSwipeHint: 'اسحب أفقياً لتصفح جميع الفترات الـ 16 👉👈'
    }
  };

  /**
   * Initializes the application
   */
  function init() {
    loadStateFromStorage();
    setupEventListeners();
    updateTheme();
    updateLanguage();

    // If no courses yet, automatically load the default sample courses
    if (state.courses.length === 0) {
      loadSampleCourses();
    } else {
      renderCoursesList();
      renderDoctorPreferences();
      // Pre-calculate schedules in background so Tab 3 is always ready
      if (state.solutions.length === 0) {
        calculateInitialSolutions();
      }
    }
    renderBlockedPainter();
    renderBlockedList();

    // Automatically show onboarding guide on startup if not dismissed
    const guideDismissed = localStorage.getItem('sched_guide_dismissed');
    if (!guideDismissed) {
      setTimeout(() => {
        openGuideModal();
      }, 500);
    }
  }

  /**
   * Precalculate initial optimal solutions in background
   */
  function calculateInitialSolutions() {
    if (!state.courses || state.courses.length === 0) return;
    try {
      const result = ScheduleOptimizer.findOptimalSchedules(state.courses, {
        doctorPreferences: state.doctorPreferences,
        gapWeight: state.preferences.gapWeight,
        daysWeight: state.preferences.daysWeight,
        doctorWeight: state.preferences.doctorWeight,
        earlyWeight: state.preferences.earlyWeight,
        freeDays: state.preferences.freeDays,
        blockedTimes: state.blockedTimes
      });
      if (result && result.solutions && result.solutions.length > 0) {
        state.solutions = result.solutions;
        state.activeSolutionIndex = 0;
        renderSolutionsSelector();
        renderCurrentSolution();
      }
    } catch (err) {
      console.warn('Initial solve background task error:', err);
    }
  }

  /**
   * Storage helpers
   */
  function saveStateToStorage() {
    try {
      localStorage.setItem('sched_courses', JSON.stringify(state.courses));
      localStorage.setItem('sched_doc_prefs', JSON.stringify(state.doctorPreferences));
      localStorage.setItem('sched_prefs', JSON.stringify(state.preferences));
      localStorage.setItem('sched_blocked_times', JSON.stringify(state.blockedTimes));
      localStorage.setItem('sched_theme', state.currentTheme);
      localStorage.setItem('sched_lang', state.currentLang);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  function loadStateFromStorage() {
    try {
      const storedCourses = localStorage.getItem('sched_courses');
      if (storedCourses) {
        state.courses = JSON.parse(storedCourses);
        normalizeCourseDoctorTitles(state.courses);
      }

      const storedDocPrefs = localStorage.getItem('sched_doc_prefs');
      if (storedDocPrefs) state.doctorPreferences = JSON.parse(storedDocPrefs);

      const storedPrefs = localStorage.getItem('sched_prefs');
      if (storedPrefs) state.preferences = Object.assign(state.preferences, JSON.parse(storedPrefs));

      const storedBlocked = localStorage.getItem('sched_blocked_times');
      if (storedBlocked) state.blockedTimes = JSON.parse(storedBlocked);

      const storedTheme = localStorage.getItem('sched_theme');
      if (storedTheme) state.currentTheme = storedTheme;

      const storedLang = localStorage.getItem('sched_lang');
      if (storedLang) state.currentLang = storedLang;
    } catch (e) {
      console.warn('Storage load failed:', e);
    }
  }

  /**
   * Theme and Language
   */
  function toggleTheme() {
    state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    updateTheme();
    saveStateToStorage();
  }

  function updateTheme() {
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = state.currentTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  function toggleLanguage() {
    state.currentLang = state.currentLang === 'en' ? 'ar' : 'en';
    updateLanguage();
    saveStateToStorage();
  }

  function updateLanguage() {
    const lang = state.currentLang;
    const isAr = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.innerHTML = isAr ? 'English 🌐' : 'العربية 🌐';
    }

    // Update static UI elements
    const t = TRANSLATIONS[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // Re-render guide modal content if open
    const guideModal = document.getElementById('guide-modal');
    if (guideModal && guideModal.style.display !== 'none') {
      renderGuideModalContent();
    }

    // Re-render components in current language
    renderCoursesList();
    renderDoctorPreferences();
    if (state.solutions.length > 0) {
      renderCurrentSolution();
    }
  }

  /**
   * Setup UI Event Listeners
   */
  function setupEventListeners() {
    // Top bar actions
    document.getElementById('btn-show-guide')?.addEventListener('click', openGuideModal);
    document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('btn-lang-toggle')?.addEventListener('click', toggleLanguage);
    document.getElementById('btn-load-sample')?.addEventListener('click', loadSampleCourses);
    document.getElementById('btn-find-schedules')?.addEventListener('click', runOptimizer);
    document.getElementById('btn-find-schedules-header')?.addEventListener('click', runOptimizer);

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    // Subtab buttons (HTML vs Image vs Manual)
    document.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const subtab = btn.getAttribute('data-subtab');
        document.querySelectorAll('.subtab-panel').forEach(p => p.style.display = 'none');
        const target = document.getElementById(`panel-${subtab}`);
        if (target) target.style.display = 'block';
      });
    });

    // Parse HTML Button
    document.getElementById('btn-parse-html')?.addEventListener('click', handleParseHtml);

    // HTML File Input
    document.getElementById('input-html-file')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        document.getElementById('html-input-text').value = evt.target.result;
        handleParseHtml();
      };
      reader.readAsText(file);
    });

    // Image Upload & Dropzone
    const dropzone = document.getElementById('image-dropzone');
    const imageInput = document.getElementById('input-schedule-image');

    dropzone?.addEventListener('click', () => imageInput?.click());
    dropzone?.addEventListener('dragover', e => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone?.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    });

    imageInput?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handleImageUpload(file);
    });

    // Free Day Chips
    document.querySelectorAll('.day-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const day = chip.getAttribute('data-day');
        chip.classList.toggle('selected');
        const idx = state.preferences.freeDays.indexOf(day);
        if (idx > -1) {
          state.preferences.freeDays.splice(idx, 1);
        } else {
          state.preferences.freeDays.push(day);
        }
        saveStateToStorage();
      });
    });

    // Weight Sliders
    ['gapWeight', 'daysWeight', 'doctorWeight'].forEach(id => {
      const input = document.getElementById(`slider-${id}`);
      if (input) {
        input.value = state.preferences[id] || 50;
        input.addEventListener('input', e => {
          state.preferences[id] = parseInt(e.target.value, 10);
          saveStateToStorage();
        });
      }
    });

    // Export Actions
    document.getElementById('btn-export-png')?.addEventListener('click', () => {
      const sol = state.solutions[state.activeSolutionIndex];
      if (sol) ScheduleExporter.exportToPng(sol);
      else showToast('No schedule selected to export', 'error');
    });

    document.getElementById('btn-print')?.addEventListener('click', () => {
      ScheduleExporter.printTimetable();
    });

    document.getElementById('btn-export-ics')?.addEventListener('click', () => {
      const sol = state.solutions[state.activeSolutionIndex];
      if (sol) ScheduleExporter.downloadIcsFile(sol);
      else showToast('No schedule selected to export', 'error');
    });

    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      ScheduleExporter.exportCoursesJson(state.courses);
    });

    document.getElementById('btn-import-json')?.addEventListener('click', () => {
      document.getElementById('input-json-file')?.click();
    });

    document.getElementById('input-json-file')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (Array.isArray(parsed)) {
            state.courses = parsed;
            saveStateToStorage();
            renderCoursesList();
            renderDoctorPreferences();
            showToast(`Imported ${parsed.length} courses!`, 'success');
          }
        } catch (err) {
          showToast('Invalid JSON file.', 'error');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-clear-courses')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all added courses?')) {
        state.courses = [];
        state.solutions = [];
        saveStateToStorage();
        renderCoursesList();
        renderDoctorPreferences();
        renderCurrentSolution();
        showToast('Courses cleared.', 'info');
      }
    });
  }

  function switchTab(tabId) {
    state.currentTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(c => {
      c.style.display = c.id === `tab-${tabId}` ? 'block' : 'none';
    });

    // When switching to Timetable Results tab, ensure content is rendered
    if (tabId === 'timetable') {
      if (state.solutions.length === 0 && state.courses.length > 0) {
        runOptimizer();
      } else {
        renderSolutionsSelector();
        renderCurrentSolution();
      }
    }
  }

  /**
   * HTML Parsing Action
   */
  function handleParseHtml() {
    const rawHtml = document.getElementById('html-input-text')?.value || '';
    if (!rawHtml.trim()) {
      showToast('Please paste HTML content into the text box.', 'error');
      return;
    }

    const result = ScheduleParser.parseHtml(rawHtml);
    if (!result.success || result.courses.length === 0) {
      showToast(result.message || 'Failed to parse table from HTML.', 'error');
      return;
    }

    // Add courses to state, avoiding duplicate IDs
    let addedCount = 0;
    result.courses.forEach(newCourse => {
      const existingIdx = state.courses.findIndex(c => c.code === newCourse.code || c.id === newCourse.id);
      if (existingIdx > -1) {
        state.courses[existingIdx] = newCourse; // Update
      } else {
        state.courses.push(newCourse);
        addedCount++;
      }
    });

    saveStateToStorage();
    renderCoursesList();
    renderDoctorPreferences();
    showToast(result.message, 'success');

    // Clear textarea
    document.getElementById('html-input-text').value = '';
  }

  /**
   * Schedule Photo Upload & Canvas Visual Calibration
   */
  async function handleImageUpload(file) {
    try {
      showToast('Loading image for grid analysis...', 'info');
      const img = await ScheduleImageExtractor.loadImage(file);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Analyze grid bounds (default: table spans majority of image)
      const gridBounds = {
        left: canvas.width * 0.12, // Skip day label column on left
        top: canvas.height * 0.08,  // Skip top slot header row
        width: canvas.width * 0.86,
        height: canvas.height * 0.90
      };

      const detected = ScheduleImageExtractor.autoDetectColoredBlocks(canvas, gridBounds);

      // Open interactive calibration modal
      openImageCalibrationModal(file.name, detected, canvas);
    } catch (err) {
      console.error(err);
      showToast(`Image processing error: ${err.message}`, 'error');
    }
  }

  /**
   * Modal for verifying and editing detected image cells
   */
  function openImageCalibrationModal(fileName, detectedBlocks, canvas) {
    const isAr = state.currentLang === 'ar';
    const modalEl = document.getElementById('image-calibration-modal');
    if (!modalEl) return;

    state.imageDetectionDraft = {
      courseName: fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      code: 'CRS' + Math.floor(1000 + Math.random() * 9000),
      blocks: detectedBlocks
    };

    renderCalibrationModalContent();
    modalEl.style.display = 'flex';
  }

  function renderCalibrationModalContent() {
    const draft = state.imageDetectionDraft;
    if (!draft) return;
    const isAr = state.currentLang === 'ar';

    const container = document.getElementById('calibration-blocks-list');
    if (!container) return;

    let html = `
      <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 200px;">
          <label style="font-size: 0.85rem; font-weight: 600;">${isAr ? 'اسم المقرر:' : 'Course Name:'}</label>
          <input type="text" id="draft-course-name" class="textarea-input" style="height: 38px;" value="${draft.courseName}" />
        </div>
        <div style="width: 140px;">
          <label style="font-size: 0.85rem; font-weight: 600;">${isAr ? 'كود المقرر:' : 'Course Code:'}</label>
          <input type="text" id="draft-course-code" class="textarea-input" style="height: 38px;" value="${draft.code}" />
        </div>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
        ${isAr ? `تم اكتشاف ${draft.blocks.length} حصة ملونة في الصورة. يمكنك تعديل المجموعة واسم الدكتور لكل حصة أدناه:` :
                 `Detected ${draft.blocks.length} colored session slots from image. You can adjust group letters and doctor names below:`}
      </p>
      <div style="max-height: 320px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
          <thead>
            <tr style="background: var(--bg-card); border-bottom: 1px solid var(--border-color); text-align: left;">
              <th style="padding: 8px;">Day</th>
              <th style="padding: 8px;">Slots</th>
              <th style="padding: 8px;">Group</th>
              <th style="padding: 8px;">Type</th>
              <th style="padding: 8px;">Doctor / TA</th>
              <th style="padding: 8px;">Action</th>
            </tr>
          </thead>
          <tbody>
    `;

    draft.blocks.forEach((b, idx) => {
      html += `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 8px; font-weight: 600;">${b.day}</td>
          <td style="padding: 8px;">Slots ${b.startSlot}-${b.endSlot}</td>
          <td style="padding: 8px;">
            <input type="text" value="${b.group}" style="width: 50px; padding: 3px; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px;"
                   onchange="App.updateDraftBlock(${idx}, 'group', this.value.toUpperCase())" />
          </td>
          <td style="padding: 8px;">
            <select style="padding: 3px; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px;"
                    onchange="App.updateDraftBlock(${idx}, 'type', this.value)">
              <option value="Lect." ${b.type === 'Lect.' ? 'selected' : ''}>Lect.</option>
              <option value="Lab." ${b.type === 'Lab.' ? 'selected' : ''}>Lab.</option>
              <option value="Sec." ${b.type === 'Sec.' ? 'selected' : ''}>Sec.</option>
            </select>
          </td>
          <td style="padding: 8px;">
            <input type="text" placeholder="${isAr ? 'اسم الدكتور' : 'Doctor Name'}" value="${b.instructor || ''}" style="width: 100%; padding: 3px; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px;"
                   onchange="App.updateDraftBlock(${idx}, 'instructor', this.value)" />
          </td>
          <td style="padding: 8px;">
            <button class="btn btn-sm btn-outline" style="color: var(--danger); padding: 2px 6px;" onclick="App.deleteDraftBlock(${idx})">✕</button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  function updateDraftBlock(idx, field, value) {
    if (state.imageDetectionDraft && state.imageDetectionDraft.blocks[idx]) {
      state.imageDetectionDraft.blocks[idx][field] = value;
    }
  }

  function deleteDraftBlock(idx) {
    if (state.imageDetectionDraft) {
      state.imageDetectionDraft.blocks.splice(idx, 1);
      renderCalibrationModalContent();
    }
  }

  function saveImageDraftCourse() {
    const draft = state.imageDetectionDraft;
    if (!draft || draft.blocks.length === 0) {
      showToast('No blocks to add.', 'error');
      return;
    }

    const nameInput = document.getElementById('draft-course-name');
    const codeInput = document.getElementById('draft-course-code');
    const courseName = nameInput ? nameInput.value.trim() : draft.courseName;
    const courseCode = codeInput ? codeInput.value.trim() : draft.code;

    // Group blocks by Group Letter
    const groupsMap = {};
    const instructorsSet = new Set();

    draft.blocks.forEach(b => {
      const g = b.group || 'A';
      if (!groupsMap[g]) {
        groupsMap[g] = {
          group: g,
          sessions: [],
          instructors: []
        };
      }
      const session = {
        type: b.type || 'Lect.',
        day: b.day,
        startSlot: b.startSlot,
        endSlot: b.endSlot,
        duration: b.endSlot - b.startSlot + 1,
        instructor: b.instructor || 'Not Specified'
      };
      groupsMap[g].sessions.push(session);

      if (session.instructor && session.instructor !== 'Not Specified') {
        if (!groupsMap[g].instructors.includes(session.instructor)) {
          groupsMap[g].instructors.push(session.instructor);
        }
        instructorsSet.add(session.instructor);
      }
    });

    const newCourse = {
      id: courseCode,
      name: courseName,
      code: courseCode,
      color: ScheduleParser.generateCourseColor(courseCode),
      instructors: Array.from(instructorsSet),
      groups: Object.values(groupsMap)
    };

    state.courses.push(newCourse);
    saveStateToStorage();
    renderCoursesList();
    renderDoctorPreferences();

    document.getElementById('image-calibration-modal').style.display = 'none';
    showToast(`Successfully added course: ${courseName}`, 'success');
  }

  /**
   * Load Default Sample Courses (including user's Applied Programming)
   */
  function loadSampleCourses() {
    state.courses = JSON.parse(JSON.stringify(SampleScheduleData.DEFAULT_COURSE_SET));
    normalizeCourseDoctorTitles(state.courses);
    saveStateToStorage();
    renderCoursesList();
    renderDoctorPreferences();
    calculateInitialSolutions();
    showToast(`Loaded ${state.courses.length} sample courses (including Applied Programming - ECE2102)!`, 'success');
  }

  /**
   * Render Added Courses Cards
   */
  function renderCoursesList() {
    const container = document.getElementById('courses-list-container');
    const countBadge = document.getElementById('courses-count-badge');
    if (countBadge) countBadge.textContent = state.courses.length;

    if (!container) return;

    if (state.courses.length === 0) {
      container.innerHTML = `
        <div class="dropzone" style="grid-column: 1 / -1; cursor: default;">
          <div class="dropzone-icon">📚</div>
          <div class="dropzone-title" data-i18n="noCoursesTitle">${TRANSLATIONS[state.currentLang].noCoursesTitle}</div>
          <div class="dropzone-subtitle" data-i18n="noCoursesDesc">${TRANSLATIONS[state.currentLang].noCoursesDesc}</div>
        </div>
      `;
      return;
    }

    let html = '';
    state.courses.forEach((c, idx) => {
      const groupsCount = (c.groups || []).length;
      const instructorsCount = (c.instructors || []).length;
      const groupsTags = (c.groups || []).slice(0, 8).map(g => `<span class="mini-group-tag">Grp ${g.group}</span>`).join('');

      html += `
        <div class="course-item-card" style="border-top: 4px solid ${c.color || '#3B82F6'};">
          <div class="course-item-header">
            <div>
              <span class="course-code-badge">${c.code || 'COURSE'}</span>
              <div class="course-item-title">${c.name}</div>
            </div>
            <button class="btn-remove-course" title="Remove course" onclick="App.removeCourse(${idx})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
          <div class="course-stats-line">
            <span><strong>${groupsCount}</strong> ${state.currentLang === 'ar' ? 'مجموعات' : 'Groups'}</span> •
            <span><strong>${instructorsCount}</strong> ${state.currentLang === 'ar' ? 'أعضاء هيئة تدريس' : 'Faculty/Staff'}</span>
          </div>
          <div class="groups-pill-preview">${groupsTags}${groupsCount > 8 ? `<span class="mini-group-tag">+${groupsCount - 8}</span>` : ''}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function updateCourseColor(idx, newColor) {
    if (state.courses[idx]) {
      state.courses[idx].color = newColor;
      if (state.courses[idx].groups) {
        state.courses[idx].groups.forEach(g => {
          if (g.sessions) g.sessions.forEach(s => s.color = newColor);
        });
      }
      saveStateToStorage();
      renderCoursesList();
      renderDoctorPreferences();
      if (state.solutions.length > 0) renderCurrentSolution();
      showToast(`Updated color for ${state.courses[idx].name}!`, 'success');
    }
  }

  function removeCourse(idx) {
    if (idx >= 0 && idx < state.courses.length) {
      const removed = state.courses.splice(idx, 1);
      saveStateToStorage();
      renderCoursesList();
      renderDoctorPreferences();
      showToast(`Removed course: ${removed[0]?.name}`, 'info');
    }
  }

  /**
   * Cleans prefixes for pure alphabetical sorting of names
   */
  function getCleanSortName(name) {
    return (name || '')
      .replace(/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?|م\.|Eng\.)\s*/i, '')
      .trim();
  }

  /**
   * Determines if a person is a Doctor or an Instructor.
   * True if has doctor prefix or teaches any lecture session.
   */
  function isPersonDoctor(personName, course) {
    if (!personName || personName === 'Not Specified') return false;

    // 1. Explicit doctor title prefix (د. / د / Dr. / Dr / Doctor / Prof. / أ.د)
    if (/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?)/i.test(personName)) {
      return true;
    }

    const cleanPerson = getCleanSortName(personName);

    // 2. Check sessions in groups
    if (course && course.groups) {
      for (const grp of course.groups) {
        if (grp.sessions) {
          for (const sess of grp.sessions) {
            const sInst = sess.instructor || '';
            const cleanSInst = getCleanSortName(sInst);
            if (sInst && (sInst === personName || cleanSInst === cleanPerson || sInst.includes(personName) || personName.includes(sInst))) {
              if (sess.type === 'Lect.' || /Lect|محاضرة/i.test(sess.type || '')) {
                return true;
              }
            }
          }
        }
      }
    }

    // 3. Check slots
    if (course && course.slots) {
      for (const slot of course.slots) {
        const sInst = slot.instructor || '';
        const cleanSInst = getCleanSortName(sInst);
        if (sInst && (sInst === personName || cleanSInst === cleanPerson || sInst.includes(personName) || personName.includes(sInst))) {
          if (slot.type === 'Lect.' || /Lect|محاضرة/i.test(slot.type || '')) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Formats a person's display name, prepending 'د. ' or 'Dr. ' if doctor.
   */
  function formatDoctorName(name, isDoc) {
    if (!name || name === 'Not Specified') return name;
    if (!isDoc) return name;

    // If already starts with title, return as is
    if (/^(د\.|د\/|د\s+|Dr\.|Dr\s+|Doctor\s+|Prof\.|أ\.د\.?)/i.test(name)) {
      return name;
    }

    const isArabic = /[\u0600-\u06FF]/.test(name);
    const prefix = isArabic ? 'د. ' : 'Dr. ';
    return `${prefix}${name.trim()}`;
  }

  /**
   * Normalizes doctor titles on courses and their sessions
   */
  function normalizeCourseDoctorTitles(courses) {
    if (!courses || !Array.isArray(courses)) return;
    courses.forEach(course => {
      const doctorsSet = new Set();

      if (course.groups) {
        course.groups.forEach(grp => {
          if (grp.sessions) {
            grp.sessions.forEach(sess => {
              const inst = sess.instructor || '';
              if (inst && inst !== 'Not Specified') {
                if (sess.type === 'Lect.' || /Lect|محاضرة/i.test(sess.type || '')) {
                  const docFormatted = formatDoctorName(inst, true);
                  sess.instructor = docFormatted;
                  doctorsSet.add(docFormatted);
                }
              }
            });
          }

          if (grp.instructors && Array.isArray(grp.instructors)) {
            grp.instructors = grp.instructors.map(name => {
              if (doctorsSet.has(name) || isPersonDoctor(name, course)) {
                return formatDoctorName(name, true);
              }
              return name;
            });
          }
        });
      }

      if (course.slots) {
        course.slots.forEach(slot => {
          const inst = slot.instructor || '';
          if (inst && inst !== 'Not Specified') {
            if (slot.type === 'Lect.' || /Lect|محاضرة/i.test(slot.type || '')) {
              slot.instructor = formatDoctorName(inst, true);
            }
          }
        });
      }

      if (course.instructors && Array.isArray(course.instructors)) {
        course.instructors = course.instructors.map(name => {
          if (isPersonDoctor(name, course)) {
            return formatDoctorName(name, true);
          }
          return name;
        });
      }
    });
  }

  function getRatingForPerson(courseCode, formatted, original) {
    const prefs = state.doctorPreferences[courseCode];
    if (!prefs) return 'neutral';
    if (prefs[formatted]) return prefs[formatted];
    if (original && prefs[original]) return prefs[original];
    const clean = getCleanSortName(formatted);
    if (clean && prefs[clean]) return prefs[clean];
    return 'neutral';
  }

  /**
   * Render Doctor Preferences
   * Doctors are highlighted, prefixed with Dr./د., and ordered first alphabetically,
   * followed by Instructors ordered alphabetically.
   */
  function renderDoctorPreferences() {
    const container = document.getElementById('doctor-preferences-container');
    if (!container) return;

    const t = TRANSLATIONS[state.currentLang];

    if (state.courses.length === 0) {
      container.innerHTML = `<p style="color: var(--text-secondary);">${state.currentLang === 'ar' ? 'لم يتم إضافة مقررات حتى الآن.' : 'No courses added yet.'}</p>`;
      return;
    }

    let html = '';

    state.courses.forEach(course => {
      // Collect all instructors from course, groups, and sessions
      const rawInstructors = new Set(course.instructors || []);
      if (course.groups) {
        course.groups.forEach(g => {
          (g.instructors || []).forEach(inst => rawInstructors.add(inst));
          (g.sessions || []).forEach(s => {
            if (s.instructor && s.instructor !== 'Not Specified') rawInstructors.add(s.instructor);
          });
        });
      }

      if (rawInstructors.size === 0) return;

      const courseCode = course.code || course.id;
      if (!state.doctorPreferences[courseCode]) {
        state.doctorPreferences[courseCode] = {};
      }

      // Partition into Doctors and Instructors
      const doctors = [];
      const instructors = [];

      rawInstructors.forEach(person => {
        if (!person || person === 'Not Specified') return;
        const isDoc = isPersonDoctor(person, course);
        const formatted = formatDoctorName(person, isDoc);
        if (isDoc) {
          doctors.push({ original: person, formatted, isDoctor: true });
        } else {
          instructors.push({ original: person, formatted, isDoctor: false });
        }
      });

      // Deduplicate by formatted name
      const uniqueDocs = Array.from(new Map(doctors.map(d => [d.formatted, d])).values());
      const uniqueInsts = Array.from(new Map(instructors.map(i => [i.formatted, i])).values());

      // 1. Sort Doctors in alphabetical order
      uniqueDocs.sort((a, b) => {
        const nameA = getCleanSortName(a.formatted);
        const nameB = getCleanSortName(b.formatted);
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      });

      // 2. Sort Instructors in alphabetical order
      uniqueInsts.sort((a, b) => {
        const nameA = getCleanSortName(a.formatted);
        const nameB = getCleanSortName(b.formatted);
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      });

      html += `
        <div class="pref-box" style="margin-bottom: 20px;">
          <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 10px; color: ${course.color}; display: flex; align-items: center; justify-content: space-between;">
            <span>${course.name} (${courseCode})</span>
            <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">
              ${uniqueDocs.length} ${state.currentLang === 'ar' ? 'دكاترة' : 'Doctors'} • ${uniqueInsts.length} ${state.currentLang === 'ar' ? 'معيدين' : 'TAs'}
            </span>
          </div>
          <div>
      `;

      // Render Doctors first (alphabetical order & highlighted)
      if (uniqueDocs.length > 0) {
        html += `<div class="pref-subgroup-header">${t.doctorsSubheading}</div>`;
        uniqueDocs.forEach(item => {
          const currentPref = getRatingForPerson(courseCode, item.formatted, item.original);
          html += `
            <div class="doctor-pref-item is-doctor">
              <div class="doctor-name-col">
                <span style="font-size: 16px;">🎓</span>
                <span style="font-weight: 700; color: var(--text-primary);">${item.formatted}</span>
                <span class="role-badge doctor-badge">${t.doctorBadge}</span>
              </div>
              <div class="doctor-rating-group">
                <button class="rating-btn ${currentPref === 'love' ? 'active-love' : ''}"
                        title="${state.currentLang === 'ar' ? 'دكتور مفضل (أولوية قصوى)' : 'Favorite doctor'}"
                        onclick="App.setDoctorPreference('${courseCode}', '${escapeQuotes(item.formatted)}', 'love')">
                  ⭐ ${state.currentLang === 'ar' ? 'مفضل' : 'Favorite'}
                </button>
                <button class="rating-btn ${currentPref === 'neutral' ? 'active-neutral' : ''}"
                        title="${state.currentLang === 'ar' ? 'عادي' : 'Neutral'}"
                        onclick="App.setDoctorPreference('${courseCode}', '${escapeQuotes(item.formatted)}', 'neutral')">
                  ⚪ ${state.currentLang === 'ar' ? 'عادي' : 'Neutral'}
                </button>
                <button class="rating-btn ${currentPref === 'avoid' ? 'active-avoid' : ''}"
                        title="${state.currentLang === 'ar' ? 'تجنب هذا الدكتور' : 'Avoid doctor'}"
                        onclick="App.setDoctorPreference('${courseCode}', '${escapeQuotes(item.formatted)}', 'avoid')">
                  🚫 ${state.currentLang === 'ar' ? 'تجنب' : 'Avoid'}
                </button>
              </div>
            </div>
          `;
        });
      }

      // Render Instructors second (alphabetical order)
      if (uniqueInsts.length > 0) {
        html += `<div class="pref-subgroup-header">${t.instructorsSubheading}</div>`;
        uniqueInsts.forEach(item => {
          const currentPref = getRatingForPerson(courseCode, item.formatted, item.original);
          html += `
            <div class="doctor-pref-item">
              <div class="doctor-name-col">
                <span style="font-size: 16px;">🔬</span>
                <span style="font-weight: 600; color: var(--text-secondary);">${item.formatted}</span>
                <span class="role-badge instructor-badge">${t.instructorBadge}</span>
              </div>
              <div class="doctor-rating-group">
                <button class="rating-btn ${currentPref === 'love' ? 'active-love' : ''}"
                        title="${state.currentLang === 'ar' ? 'معيد مفضل' : 'Favorite instructor'}"
                        onclick="App.setDoctorPreference('${courseCode}', '${escapeQuotes(item.formatted)}', 'love')">
                  ⭐ ${state.currentLang === 'ar' ? 'مفضل' : 'Favorite'}
                </button>
                <button class="rating-btn ${currentPref === 'neutral' ? 'active-neutral' : ''}"
                        title="${state.currentLang === 'ar' ? 'عادي' : 'Neutral'}"
                        onclick="App.setDoctorPreference('${courseCode}', '${escapeQuotes(item.formatted)}', 'neutral')">
                  ⚪ ${state.currentLang === 'ar' ? 'عادي' : 'Neutral'}
                </button>
                <button class="rating-btn ${currentPref === 'avoid' ? 'active-avoid' : ''}"
                        title="${state.currentLang === 'ar' ? 'تجنب هذا المعيد' : 'Avoid instructor'}"
                        onclick="App.setDoctorPreference('${courseCode}', '${escapeQuotes(item.formatted)}', 'avoid')">
                  🚫 ${state.currentLang === 'ar' ? 'تجنب' : 'Avoid'}
                </button>
              </div>
            </div>
          `;
        });
      }

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function setDoctorPreference(courseCode, doctorName, rating) {
    if (!state.doctorPreferences[courseCode]) {
      state.doctorPreferences[courseCode] = {};
    }
    state.doctorPreferences[courseCode][doctorName] = rating;

    // Also store under cleaned name so both match in optimizer
    const cleanName = getCleanSortName(doctorName);
    if (cleanName && cleanName !== doctorName) {
      state.doctorPreferences[courseCode][cleanName] = rating;
    }

    saveStateToStorage();
    renderDoctorPreferences();
  }

  function escapeQuotes(str) {
    return (str || '').replace(/'/g, "\\'");
  }

  /**
   * Run Optimizer Engine
   */
  function runOptimizer() {
    if (state.courses.length === 0) {
      showToast('Please add at least one course first.', 'error');
      return;
    }

    showToast('Solving schedule constraints and minimizing gaps...', 'info');

    setTimeout(() => {
      const result = ScheduleOptimizer.findOptimalSchedules(state.courses, {
        doctorPreferences: state.doctorPreferences,
        gapWeight: state.preferences.gapWeight,
        daysWeight: state.preferences.daysWeight,
        doctorWeight: state.preferences.doctorWeight,
        earlyWeight: state.preferences.earlyWeight,
        freeDays: state.preferences.freeDays,
        blockedTimes: state.blockedTimes
      });

      if (!result.success || result.solutions.length === 0) {
        showToast(result.message || 'No clash-free schedules found. Try relaxing free days or unblocking some times.', 'error');
        return;
      }

      state.solutions = result.solutions;
      state.activeSolutionIndex = 0;

      // Switch to Timetable tab
      switchTab('timetable');
      renderSolutionsSelector();
      renderCurrentSolution();

      showToast(`Success! Found ${result.validCount} clash-free schedules. Top options ranked below.`, 'success');
    }, 100);
  }

  /**
   * Render solution chips / selector
   */
  function renderSolutionsSelector() {
    const container = document.getElementById('solutions-chips-container');
    if (!container) return;

    const isAr = state.currentLang === 'ar';
    const topSolutions = state.solutions.slice(0, 15);

    let html = '';
    topSolutions.forEach((sol, idx) => {
      const isActive = idx === state.activeSolutionIndex;

      html += `
        <button class="sol-chip ${isActive ? 'active' : ''}" onclick="App.selectSolution(${idx})">
          <span>${isAr ? `الخيار ${sol.rank}` : `Option #${sol.rank}`}</span>
          ${sol.totalGapSlots === 0 ? '⚡ 0 Gaps' : `☕ ${sol.totalGapSlots} Gaps`} •
          <span>${sol.activeDaysCount} Days</span>
        </button>
      `;
    });

    container.innerHTML = html;
  }

  function selectSolution(index) {
    if (index >= 0 && index < state.solutions.length) {
      state.activeSolutionIndex = index;
      renderSolutionsSelector();
      renderCurrentSolution();
    }
  }

  function renderCurrentSolution() {
    const solution = state.solutions[state.activeSolutionIndex];
    const summaryContainer = document.getElementById('solution-summary-container');
    const timetableContainer = document.getElementById('timetable-render-container');

    if (solution) {
      ScheduleRenderer.renderSolutionSummary(solution, summaryContainer, state.currentLang);
      ScheduleRenderer.renderTimetable(solution, timetableContainer, state.currentLang, state.blockedTimes);
    } else {
      if (summaryContainer) summaryContainer.innerHTML = '';
      if (timetableContainer) {
        timetableContainer.innerHTML = `
          <div class="empty-state" style="text-align: center; padding: 40px;">
            <div style="font-size: 48px; margin-bottom: 12px;">📅</div>
            <h3>${state.currentLang === 'ar' ? 'لا يوجد جدول مولّد حالياً' : 'No Schedule Generated Yet'}</h3>
            <p style="color: var(--text-secondary);">${state.currentLang === 'ar' ? 'اضغط على زر "توليد أفضل الجداول" في الأعلى للبدء.' : 'Click "Find Best Schedules" to compute conflict-free options.'}</p>
          </div>
        `;
      }
    }
  }

  /**
   * Prohibited / Blocked Times Management (e.g. Training Saturday 8 AM)
   */
  function toggleBlockedSlot(day, slot) {
    const s = parseInt(slot, 10);
    const existingIdx = state.blockedTimes.findIndex(b => b.day === day && b.slot === s);
    const isAr = state.currentLang === 'ar';
    const defaultLabel = (day === 'Saturday' && (s === 1 || s === 2))
      ? (isAr ? 'تدريب ⚽' : 'Training ⚽')
      : (isAr ? 'وقت محظور 🚫' : 'Blocked Time 🚫');

    if (existingIdx > -1) {
      state.blockedTimes.splice(existingIdx, 1);
    } else {
      state.blockedTimes.push({
        id: `${day}_${s}`,
        day,
        slot: s,
        startSlot: s,
        endSlot: s,
        label: defaultLabel
      });
    }
    saveStateToStorage();
    renderBlockedPainter();
    renderBlockedList();
    if (state.solutions.length > 0) renderCurrentSolution();
  }

  function applyBlockedPreset(type) {
    const isAr = state.currentLang === 'ar';
    if (type === 'sat_training') {
      // User's exact request: Training Saturday 8 o'clock (Slots 1 & 2: 08:30 - 10:20)
      [1, 2].forEach(sl => {
        if (!state.blockedTimes.some(b => b.day === 'Saturday' && b.slot === sl)) {
          state.blockedTimes.push({
            id: `Saturday_${sl}`,
            day: 'Saturday',
            slot: sl,
            startSlot: sl,
            endSlot: sl,
            label: isAr ? 'تدريب السبت ⚽' : 'Saturday Training ⚽'
          });
        }
      });
      showToast(isAr ? 'تم حظر وقت تدريب السبت (الساعة 8)' : 'Blocked Saturday 08:30 - 10:20 (Training)!', 'success');
    } else if (type === 'evenings') {
      ScheduleParser.STANDARD_DAYS.forEach(day => {
        for (let sl = 9; sl <= 16; sl++) {
          if (!state.blockedTimes.some(b => b.day === day && b.slot === sl)) {
            state.blockedTimes.push({
              id: `${day}_${sl}`,
              day,
              slot: sl,
              startSlot: sl,
              endSlot: sl,
              label: isAr ? 'مساءً محظور' : 'Evening Blocked'
            });
          }
        }
      });
      showToast(isAr ? 'تم حظر الفترات المسائية بعد 4 عصراً' : 'Blocked all evening slots after 4 PM!', 'info');
    } else if (type === 'clear') {
      state.blockedTimes = [];
      showToast(isAr ? 'تم مسح جميع الأوقات المحظورة' : 'Cleared all blocked times.', 'info');
    }
    saveStateToStorage();
    renderBlockedPainter();
    renderBlockedList();
    if (state.solutions.length > 0) renderCurrentSolution();
  }

  function removeBlockedTime(idx) {
    if (idx >= 0 && idx < state.blockedTimes.length) {
      state.blockedTimes.splice(idx, 1);
      saveStateToStorage();
      renderBlockedPainter();
      renderBlockedList();
      if (state.solutions.length > 0) renderCurrentSolution();
    }
  }

  function renderBlockedPainter() {
    const container = document.getElementById('blocked-painter-grid');
    if (!container) return;

    const isAr = state.currentLang === 'ar';
    const days = ScheduleParser.STANDARD_DAYS;
    const maxSlots = 16;

    container.style.gridTemplateColumns = `100px repeat(${maxSlots}, minmax(48px, 1fr))`;

    let html = `
      <div class="painter-header-cell">${isAr ? 'اليوم' : 'Day'}</div>
    `;

    for (let sl = 1; sl <= maxSlots; sl++) {
      const timeStr = (ScheduleRenderer.PERIOD_TIMES[sl] || '').split(' - ')[0] || '';
      html += `
        <div class="painter-header-cell" title="${ScheduleRenderer.PERIOD_TIMES[sl] || ''}">
          <div>P${sl}</div>
          <div style="font-size: 0.58rem; color: var(--text-muted);">${timeStr}</div>
        </div>
      `;
    }

    days.forEach(day => {
      const dayLabel = isAr ? (ScheduleRenderer.DAYS.find(d => d.key === day)?.ar || day) : day;
      html += `<div class="painter-day-cell">${dayLabel}</div>`;

      for (let sl = 1; sl <= maxSlots; sl++) {
        const isBlocked = state.blockedTimes.some(b => b.day === day && b.slot === sl);
        const timeStr = ScheduleRenderer.PERIOD_TIMES[sl] || '';
        html += `
          <div class="painter-slot-cell ${isBlocked ? 'is-blocked' : ''}"
               title="${day} Slot ${sl} (${timeStr}) - Click to toggle prohibited"
               onclick="App.toggleBlockedSlot('${day}', ${sl})">
            ${isBlocked ? '🚫' : ''}
          </div>
        `;
      }
    });

    container.innerHTML = html;
  }

  function renderBlockedList() {
    const container = document.getElementById('blocked-chips-container');
    if (!container) return;

    const isAr = state.currentLang === 'ar';
    if (state.blockedTimes.length === 0) {
      container.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted);">${isAr ? 'لا توجد أوقات محظورة حالياً. اضغط على أي خانة في الجدول أعلاه لحظرها.' : 'No prohibited times set. Click any cell in the grid above to block it.'}</span>`;
      return;
    }

    let html = '';
    state.blockedTimes.forEach((b, idx) => {
      const timeStr = (ScheduleRenderer.PERIOD_TIMES[b.slot] || '').split(' - ')[0];
      const dayLabel = isAr ? (ScheduleRenderer.DAYS.find(d => d.key === b.day)?.ar || b.day) : b.day;
      html += `
        <div class="blocked-chip-tag">
          <span>🚫 ${dayLabel} Slot ${b.slot} (${timeStr}) - ${b.label}</span>
          <button class="btn-remove-blocked" title="Remove" onclick="App.removeBlockedTime(${idx})">✕</button>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Toast notification helper
   */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * Guide Modal Controller
   */
  function openGuideModal() {
    const modal = document.getElementById('guide-modal');
    if (!modal) return;
    renderGuideModalContent();
    modal.style.display = 'flex';
  }

  function closeGuideModal() {
    const modal = document.getElementById('guide-modal');
    if (modal) modal.style.display = 'none';

    const chk = document.getElementById('chk-dont-show-guide');
    if (chk && chk.checked) {
      localStorage.setItem('sched_guide_dismissed', 'true');
    }
  }

  function renderGuideModalContent() {
    const container = document.getElementById('guide-modal-body');
    if (!container) return;

    const isAr = state.currentLang === 'ar';

    if (isAr) {
      container.innerHTML = `
        <div class="guide-steps-container">
          <!-- Step 1 -->
          <div class="guide-step-card">
            <div class="guide-step-badge">١</div>
            <div class="guide-step-content">
              <div class="guide-step-title">
                <span>🏛️</span>
                <span>نسخ كود الجدول من موقع الكلية (بوابة طالب الأكاديمية)</span>
              </div>
              <div class="guide-step-desc">
                <ul>
                  <li>ادخل على موقع الأكاديمية أو كليتك <strong>(Student Portal ➔ جدول دراسي)</strong>.</li>
                  <li>اختر الفصل الدراسي واضغط على خيار <strong>"جدول مقرر"</strong> (لعرض كافة مواعيد ومجموعات المادة).</li>
                  <li>اختر القسم ثم اسم المادة المطلوبة (مثل <em>Applied Programming - ECE2102</em>).</li>
                  <li>اضغط <strong>كليك يمين</strong> على جدول المواعيد واختر <strong>Inspect</strong> (أو اضغط <code>F12</code> أو <code>Ctrl+Shift+I</code>).</li>
                  <li>في نافذة شجرة العناصر (Elements)، اضغط كليك يمين على وسم <code>&lt;table&gt;</code> أو وسم <code>&lt;html&gt;</code> بالكامل، ثم اختر <strong>Copy ➔ Copy element</strong>.</li>
                </ul>
                <div class="guide-pro-tip">
                  💡 <strong>نصيحة ذهبية:</strong> يمكنك نسخ كود الصفحة بالكامل (<code>Ctrl+A</code> ثم <code>Ctrl+C</code> من نافذة Inspect) وموقعنا سيتولى استخراج الجدول بذكاء!
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="guide-step-card">
            <div class="guide-step-badge">٢</div>
            <div class="guide-step-content">
              <div class="guide-step-title">
                <span>📥</span>
                <span>لصق وإضافة المقررات في الموقع</span>
              </div>
              <div class="guide-step-desc">
                <ul>
                  <li>ارجع إلى تبويب <strong>"١. المقررات والسكاشن"</strong> هنا في الموقع.</li>
                  <li>الصق الكود المنسوخ داخل مربع النص بالضغط على <code>Ctrl + V</code>.</li>
                  <li>اضغط الزر البنفسجي <strong>"استخراج وإضافة المقرر"</strong>.</li>
                  <li>سيتعرف الموقع فوراً على جميع المجموعات (B إلى L)، ودكاترة المحاضرات بلقب <code>د.</code> والمعامل!</li>
                  <li>كرر نفس الخطوة لباقي المواد التي تنوي تسجيلها هذا الترم.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="guide-step-card">
            <div class="guide-step-badge">٣</div>
            <div class="guide-step-content">
              <div class="guide-step-title">
                <span>👨‍🏫</span>
                <span>تحديد مواعيد التمرين وتفضيلات الدكاترة</span>
              </div>
              <div class="guide-step-desc">
                <ul>
                  <li>انتقل لتبويب <strong>"٢. اختيار الدكاترة والأهداف"</strong>.</li>
                  <li><strong>حظر الأوقات غير المناسبة:</strong> اضغط واسحب على شبكة الـ 16 فترة لحظر أي وقت (مثل تدريب السبت 8:30 صباحاً أو مواعيد المواصلات). الموقع يضمن 100% عدم وضع أي حصة فيها!</li>
                  <li><strong>ترتيب الدكاترة:</strong> يظهر دكاترة المحاضرات في البداية مرتبين أبجدياً ومميزين بعلامة <code>🎓 دكتور</code>. اضغط <strong>⭐ مفضل</strong> للدكتور الأفضل لديك، أو <strong>🚫 تجنب</strong> لمن لا ترغب به.</li>
                  <li><strong>أيام الإجازة:</strong> اختر يوماً ترغب بجعله إجازة بالكامل (مثل الثلاثاء) وسيقوم المحسن بضغط جدولك بأقل فترات فراغ.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="guide-step-card">
            <div class="guide-step-badge">٤</div>
            <div class="guide-step-content">
              <div class="guide-step-title">
                <span>⚡</span>
                <span>توليد واختيار أفضل جدول وتصديره</span>
              </div>
              <div class="guide-step-desc">
                <ul>
                  <li>اضغط الزر الرئيسي <strong>"⚡ توليد أفضل الجداول"</strong>.</li>
                  <li>تصفح الخيارات المقترحة بدون أي تعارض (مثل <strong>جدول #5: ⚡ بدون فترات فراغ • 4 أيام نزول</strong>).</li>
                  <li>راجع جدولك الأسبوعي مع ألوان المواد وأسماء القاعات والدكاترة واستراحات القهوة (<code>☕</code>).</li>
                  <li>صدّر جدولك كصورة <strong>PNG</strong> عالية الجودة لهاتفك، أو تقويم جوجل <strong>Google Calendar (.ics)</strong>، أو اطبعه مباشرة ليوم التسجيل!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="guide-quick-action-box">
          <div>
            <div style="font-weight: 700; color: var(--text-primary);">💡 تريد تجربة سريعة الآن؟</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">يمكنك تحميل مقررات هندسية تجريبية بضغطة زر لرؤية كيف يعمل المحسن فوراً.</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="App.loadSampleCourses(); App.closeGuideModal();">
            📚 تحميل مواد تجريبية فوراً
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="guide-steps-container">
          <!-- Step 1 -->
          <div class="guide-step-card">
            <div class="guide-step-badge">1</div>
            <div class="guide-step-content">
              <div class="guide-step-title">
                <span>🏛️</span>
                <span>Copy Schedule HTML from College Portal</span>
              </div>
              <div class="guide-step-desc">
                <ul>
                  <li>Log in to your university portal (e.g. <strong>AASTMT Student Portal ➔ Schedule</strong>).</li>
                  <li>Select your term and choose <strong>"Course Schedule (جدول مقرر)"</strong> to view all class groups.</li>
                  <li>Select your Department and Subject (e.g. <em>Applied Programming - ECE2102</em>).</li>
                  <li><strong>Right-click</strong> on the schedule table and select <strong>Inspect</strong> (or press <code>F12</code> / <code>Ctrl+Shift+I</code>).</li>
                  <li>In the Elements DOM tree, right-click the <code>&lt;table&gt;</code> or the root <code>&lt;html&gt;</code> tag ➔ choose <strong>Copy ➔ Copy element</strong>.</li>
                </ul>
                <div class="guide-pro-tip">
                  💡 <strong>Pro Tip:</strong> You can copy the entire page HTML code (<code>Ctrl+A</code> then <code>Ctrl+C</code> in DevTools) and our smart parser will detect the schedule automatically!
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="guide-step-card">
            <div class="guide-step-badge">2</div>
            <div class="guide-step-content">
              <div class="guide-step-title">
                <span>📥</span>
                <span>Paste & Add Courses into the Optimizer</span>
              </div>
              <div class="guide-step-desc">
                <ul>
                  <li>Return to Tab <strong>"1. Add Courses"</strong> here in the optimizer.</li>
                  <li>Paste the copied HTML into the text box using <code>Ctrl + V</code>.</li>
                  <li>Click the purple <strong>"Parse & Add Course"</strong> button.</li>
                  <li>The app extracts all groups (B to L), lecture doctors with <code>Dr.</code> title, labs, and time periods!</li>
                  <li>Repeat for the other courses you want to register this semester.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="guide-step-card">
            <div class="guide-step-badge">3</div>
            <div class="guide-step-content">
              <div class="guide-step-title">
                <span>👨‍🏫</span>
                <span>Set Busy Hours & Doctor Preferences</span>
              </div>
              <div class="guide-step-desc">
                <ul>
                  <li>Switch to Tab <strong>"2. Doctor & Goals"</strong>.</li>
                  <li><strong>Block Busy Times:</strong> Click or drag across the 16-period weekly grid to prohibit slots (e.g. sports training on Saturday 8:30 AM or commutes). Zero classes will ever be placed there!</li>
                  <li><strong>Rank Doctors:</strong> Lecture professors are highlighted in alphabetical order at the top with a <code>🎓 Doctor</code> badge. Click <strong>⭐ Favorite</strong> for preferred professors or <strong>🚫 Avoid</strong> to skip unwanted instructors.</li>
                  <li><strong>Days Off:</strong> Select a target free day (e.g. Tuesday off) and set your gap minimization priority slider.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="guide-step-card">
            <div class="guide-step-badge">4</div>
            <div class="guide-step-content">
              <div class="guide-step-title">
                <span>⚡</span>
                <span>Generate & Export Your Ideal Timetable</span>
              </div>
              <div class="guide-step-desc">
                <ul>
                  <li>Click the primary button <strong>"⚡ Find Best Schedules"</strong>.</li>
                  <li>Browse clash-free options in the top carousel (e.g. <strong>Option #5: ⚡ 0 Gaps • 4 Days</strong>).</li>
                  <li>Inspect your weekly calendar with doctor names, period times, and coffee-break gap indicators (<code>☕</code>).</li>
                  <li>Export as <strong>PNG image</strong> for your phone, <strong>Google Calendar (.ics)</strong>, or <strong>Print</strong> for registration!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="guide-quick-action-box">
          <div>
            <div style="font-weight: 700; color: var(--text-primary);">💡 Want to test it immediately?</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">Load pre-configured university courses with one click to see how the optimizer works right now.</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="App.loadSampleCourses(); App.closeGuideModal();">
            📚 Load Example Courses Now
          </button>
        </div>
      `;
    }
  }

  return {
    init,
    removeCourse,
    updateCourseColor,
    setDoctorPreference,
    selectSolution,
    updateDraftBlock,
    deleteDraftBlock,
    saveImageDraftCourse,
    toggleBlockedSlot,
    applyBlockedPreset,
    removeBlockedTime,
    openGuideModal,
    closeGuideModal,
    loadSampleCourses
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
