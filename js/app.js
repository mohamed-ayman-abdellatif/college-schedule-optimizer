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
      freeDays: [],
      strictDoctorCombinations: true
    },
    solutions: [],
    activeSolutionIndex: 0,
    blockedTimes: [],
    currentTab: 'courses',
    currentLang: 'en',
    currentTheme: 'dark',
    imageDetectionDraft: null,
    manualSchedule: {},
    manualSelectedDoctor: '',
    manualSearchQuery: ''
  };

  // Translations
  const TRANSLATIONS = {
    en: {
      appTitle: 'College Schedule Optimizer',
      appSubtitle: 'Convert college HTML & photos into optimal clash-free schedules',
      tabCourses: '1. Add Courses',
      tabPreferences: '2. Doctor & Goals',
      tabTimetable: '3. Timetable Results',
      tabManual: '4. Manual Mode',
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
      doctorPrefDesc: 'Prioritize preferred professors, triple-click "Favorite" to mandate (guarantee) a doctor (🌟🔒), or click "Avoid" to strictly exclude them from all schedules (🚫).',
      strictDoctorModeTitle: 'Exhaustive Strict Doctor Search',
      strictDoctorModeDesc: 'Exhaustively checks 100% of schedule combinations. Guarantees ZERO avoided doctors (🚫) and strictly seeks your desired professors (⭐/🌟). If no combination exists, it verifies all combinations to be mathematically certain.',
      strictDoctorToggleLabel: 'Active (Strict)',
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
      mobileSwipeHint: 'Swipe horizontally to view all 16 periods 👈👉',
      rankedOptionsTitle: '🎯 Ranked Clash-Free Options:',
      onlineNow: 'Online',
      visitsShort: 'Visits',
      activeUsersNow: 'Active Users Online',
      totalVisitors: 'Total Unique Visits',
      activeUsersDesc: 'Students currently browsing & optimizing schedules',
      totalVisitorsDesc: 'All-time unique visitor sessions',
      statsModalTitle: 'Live Users & Traffic Overview',
      sessionDurationLabel: 'Your current session time:',
      privacyLabel: 'Privacy & Safety:',
      privacyDesc: '🔒 100% Anonymous & Zero Cookies',
      howItWorksTitle: '⚡ How is this tracked?',
      howItWorksDesc: 'This counter runs completely serverlessly on GitHub Pages using an atomic presence heartbeat. When anyone opens the website, their browser sends a privacy-safe presence ping every 45s. When they close the tab, the active count updates in real-time.',
      closeBtn: 'Close',
      manualTitle: 'Manual Schedule Builder',
      manualSubtitle: 'Select your favorite doctors to see all their groups, pick groups manually, and build your custom schedule with instant clash detection.',
      clearManualSchedule: 'Reset Schedule',
      viewInTimetable: 'View in Timetable Results',
      manualDocSearchTitle: 'Explore by Doctor / Professor',
      manualDocSearchDesc: 'Choose any doctor to reveal all their lecture groups, days, times, and quickly add them to your schedule',
      selectDoctorLabel: 'Select Doctor / Professor:',
      searchDoctorLabel: 'Or Search Doctor / Course:',
      manualCourseGroupsTitle: 'Course Groups & Instant Conflict Checker',
      manualCourseGroupsDesc: 'Pick one group for each course. Groups with time clashes with your current picks will be highlighted in red.',
      manualTimetableTitle: 'Your Custom Timetable Preview',
      manualTimetableDesc: 'Interactive 16-period schedule showing your custom selections and any time overlaps',
      loadingTitle: 'Generating Optimal Schedules...',
      loadingStep1: 'Analyzing course combinations and lecture groups...',
      loadingStep2: 'Filtering blocked times and free days...',
      loadingStep3: 'Applying doctor preferences and calculating gaps...',
      loadingStep4: 'Ranking clash-free schedules...',
      loadingFooterTip: '⚡ Please wait a moment while the optimizer computes the best clash-free schedules for you!'
    },
    ar: {
      appTitle: 'محول ومحسن الجداول الجامعية',
      appSubtitle: 'تحويل كود HTML وصور الجدول إلى أفضل جدول دراسي بدون تعارض وبأقل فترات فراغ',
      tabCourses: '١. المقررات والسكاشن',
      tabPreferences: '٢. اختيار الدكاترة والأهداف',
      tabTimetable: '٣. الجدول النهائي',
      tabManual: '٤. الوضع اليدوي',
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
      doctorPrefDesc: 'اختر دكاترتك المفضلين، اضغط 3 مرات سريعاً على "مفضل" لتثبيت دكتور كإجباري (🌟🔒)، أو اضغط "تجنب" لاستبعاده نهائياً من كافة الجداول (🚫).',
      strictDoctorModeTitle: 'فحص شامل وصارم لكافة التباديل',
      strictDoctorModeDesc: 'فحص شامل لكافة التباديل بنسبة 100%. يضمن عدم إدراج أي دكتور مستبعد نهائياً (🚫) واستيفاء الدكاترة المطلوبين (⭐/🌟). وفي حال الاستحالة يتم فحص كامل الاحتمالات للتأكد رياضياً.',
      strictDoctorToggleLabel: 'مفعل (صارم)',
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
      mobileSwipeHint: 'اسحب أفقياً لتصفح جميع الفترات الـ 16 👉👈',
      rankedOptionsTitle: '🎯 الخيارات الأفضل مرتبة (بدون تعارض):',
      onlineNow: 'متصل الآن',
      visitsShort: 'زيارة',
      activeUsersNow: 'المستخدمون المتواجدون حالياً',
      totalVisitors: 'إجمالي الزيارات',
      activeUsersDesc: 'طلاب يتصفحون وينظمون جداولهم في الوقت الحالي',
      totalVisitorsDesc: 'إجمالي جلسات الزوار الفريدة منذ انطلاق الموقع',
      statsModalTitle: 'المتواجدون حالياً وإحصائيات الزيارات',
      sessionDurationLabel: 'مدة جلستك الحالية:',
      privacyLabel: 'الخصوصية والأمان:',
      privacyDesc: '🔒 مجهول 100% وبدون أي ملفات تعريف ارتباط (Cookies)',
      howItWorksTitle: '⚡ كيف يتم حساب هذا العداد؟',
      howItWorksDesc: 'يعمل هذا العداد بدون خادم تماماً (Serverless) على GitHub Pages عبر نبضات تواجد لحظية. بمجرد فتح الموقع، يرسل المتصفح إشارة نشاط كل 45 ثانية بأمان وخصوصية تامة، وتتحدث الأرقام لحظياً لجميع الطلاب.',
      closeBtn: 'إغلاق',
      manualTitle: 'صانع الجدول اليدوي',
      manualSubtitle: 'اختر دكتورك المفضل لرؤية كافة مجموعاته ومواعيد محاضراته، واختر المجموعات بنفسك لتكوين جدولك مع فحص فوري لأي تعارض.',
      clearManualSchedule: 'إعادة ضبط الجدول',
      viewInTimetable: 'عرض في شاشة الجداول',
      manualDocSearchTitle: 'استكشاف المجموعات حسب الدكتور',
      manualDocSearchDesc: 'اختر أي دكتور لمعرفة كافة المجموعات التي يقوم بتدريسها ومواعيدها وإضافتها لجدولك بضغطة واحدة',
      selectDoctorLabel: 'اختر الدكتور / الأستاذ:',
      searchDoctorLabel: 'أو ابحث بالاسم / المادة:',
      manualCourseGroupsTitle: 'مجموعات المقررات والفحص الفوري للتعارض',
      manualCourseGroupsDesc: 'اختر مجموعة واحدة لكل مادة. المجموعات التي تتعارض مع اختياراتك الحالية ستظهر باللون الأحمر فوراً.',
      manualTimetableTitle: 'معاينة جدولك اليدوي المخصص',
      manualTimetableDesc: 'جدول تفاعلي 16 فترة يعرض اختياراتك اليدوية وأي تعارضات بالألوان الفورية',
      loadingTitle: 'جاري حساب أفضل الجداول الدراسية...',
      loadingStep1: 'فحص وتجميع مجموعات المواد والمحاضرات...',
      loadingStep2: 'استبعاد أوقات التدريب المحظورة وأيام الفراغ...',
      loadingStep3: 'تطبيق تفضيلات الدكاترة وحساب فترات الفراغ...',
      loadingStep4: 'ترتيب أفضل الجداول الخالية من التعارض...',
      loadingFooterTip: '⚡ انتظر لحظات بينما يقوم المحسن باكتشاف أفضل توافقات الجداول بدون تعارض!'
    }
  };

  /**
   * Initializes the application
   */
  function init() {
    try {
      localStorage.setItem('sched_guide_dismissed', 'true');
      const gm = document.getElementById('guide-modal');
      if (gm) gm.style.setProperty('display', 'none', 'important');
    } catch(e) {}

    loadStateFromStorage();
    setupEventListeners();
    updateTheme();
    updateLanguage();

    // If no courses or old sample set, load the updated 7-course set without calculating
    const hasUpdatedCourses = state.courses.some(c => c.code === 'EEC2220' || c.code === 'ECE2402');
    if (state.courses.length === 0 || (!hasUpdatedCourses && state.courses.length <= 5)) {
      loadSampleCourses();
    } else {
      renderCoursesList();
      renderDoctorPreferences();
    }
    renderBlockedPainter();
    renderBlockedList();
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
      localStorage.setItem('sched_manual_schedule', JSON.stringify(state.manualSchedule || {}));
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
      if (storedDocPrefs) {
        try {
          state.doctorPreferences = sanitizeDoctorPreferencesObj(JSON.parse(storedDocPrefs));
          localStorage.setItem('sched_doc_prefs', JSON.stringify(state.doctorPreferences));
        } catch (e) {
          state.doctorPreferences = {};
        }
      }

      const storedManual = localStorage.getItem('sched_manual_schedule');
      if (storedManual) {
        try {
          const parsed = JSON.parse(storedManual) || {};
          const migrated = {};
          for (const [k, v] of Object.entries(parsed)) {
            if (v && v.courseId && v.group) {
              const properKey = `${v.courseId}:::${v.group}`;
              migrated[properKey] = v;
            }
          }
          state.manualSchedule = migrated;
        } catch (e) {
          state.manualSchedule = {};
        }
      }

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

    // Refresh live stats formatting with new locale
    if (window.SiteAnalytics && typeof window.SiteAnalytics.updateUI === 'function') {
      window.SiteAnalytics.updateUI();
    }

    updateStrictDoctorToggleLabel();
  }

  function updateStrictDoctorToggleLabel() {
    const label = document.getElementById('label-strict-doctor-toggle');
    const cb = document.getElementById('check-strict-doctor-combinations');
    if (!label || !cb) return;
    const isAr = state.currentLang === 'ar';
    if (cb.checked) {
      label.textContent = isAr ? 'مفعل (صارم)' : 'Active (Strict)';
      label.style.color = 'var(--accent-primary)';
    } else {
      label.textContent = isAr ? 'مرن' : 'Flexible';
      label.style.color = 'var(--text-muted)';
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

    // Strict Doctor Mode Checkbox
    const strictCheckbox = document.getElementById('check-strict-doctor-combinations');
    if (strictCheckbox) {
      strictCheckbox.checked = state.preferences.strictDoctorCombinations !== false;
      updateStrictDoctorToggleLabel();
      strictCheckbox.addEventListener('change', e => {
        state.preferences.strictDoctorCombinations = e.target.checked;
        saveStateToStorage();
        updateStrictDoctorToggleLabel();
        showToast(
          state.currentLang === 'ar'
            ? (e.target.checked
                ? 'تم تفعيل الفحص الصارم والشامل لجميع التباديل (بدون أي دكتور مستبعد نهائياً) 🎯'
                : 'تم تفعيل الوضع المرن (السماح بأفضل التوفيقات الممكنة) 🔄')
            : (e.target.checked
                ? 'Strict Doctor Mode Enabled: Checking 100% of combinations with ZERO avoided doctors 🎯'
                : 'Flexible Mode Enabled: Best-effort combinations allowed 🔄'),
          'info'
        );
      });
    }

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

    // Close guide modal when clicking backdrop or pressing Escape
    document.getElementById('guide-modal')?.addEventListener('click', e => {
      if (e.target.id === 'guide-modal') closeGuideModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeGuideModal();
    });

    // Manual Mode Listeners
    document.getElementById('manual-doctor-select')?.addEventListener('change', e => {
      state.manualSelectedDoctor = e.target.value;
      renderManualDoctorGroups();
      renderManualCoursesPicker();
    });

    document.getElementById('manual-doctor-search-input')?.addEventListener('input', e => {
      state.manualSearchQuery = e.target.value.trim().toLowerCase();
      renderManualDoctorGroups();
      renderManualCoursesPicker();
    });

    document.getElementById('btn-clear-manual')?.addEventListener('click', clearManualSchedule);
    document.getElementById('btn-apply-manual-to-opt')?.addEventListener('click', applyManualToTimetableTab);

    document.getElementById('btn-manual-export-png')?.addEventListener('click', () => exportManualTimetable('png'));
    document.getElementById('btn-manual-export-ics')?.addEventListener('click', () => exportManualTimetable('ics'));
    document.getElementById('btn-manual-print')?.addEventListener('click', () => exportManualTimetable('print'));
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
    } else if (tabId === 'manual') {
      renderManualMode();
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
    state.solutions = [];
    state.activeSolutionIndex = 0;
    saveStateToStorage();
    renderCoursesList();
    renderDoctorPreferences();
    if (state.currentTab === 'manual') renderManualMode();
    const isAr = state.currentLang === 'ar';
    showToast(isAr
      ? `تم تحميل ${state.courses.length} مقررات دراسية بنجاح!`
      : `Loaded ${state.courses.length} courses!`, 'success');
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
      if (removed[0]) {
        const cid = removed[0].id;
        const code = removed[0].code;
        for (const key of Object.keys(state.manualSchedule)) {
          const item = state.manualSchedule[key];
          if (item && (item.courseId === cid || item.courseId === code || item.courseCode === code)) {
            delete state.manualSchedule[key];
          }
        }
      }
      saveStateToStorage();
      renderCoursesList();
      renderDoctorPreferences();
      if (state.currentTab === 'manual') renderManualMode();
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
   * Helper to retrieve preference for a doctor in a course, checking all possible keys
   */
  function getDoctorPrefForCourse(course, doctorName) {
    if (!doctorName) return 'neutral';
    const doc = String(doctorName).trim();
    if (!doc || doc === 'Not Specified' || doc === 'غير محدد') return 'neutral';

    const courseObj = (typeof course === 'object' && course !== null) ? course : {};
    const courseKeys = [courseObj.code, courseObj.id, courseObj.name, course].filter(k => typeof k === 'string' && k.trim());

    for (const key of courseKeys) {
      const rating = getRatingForPerson(key, doc, doc);
      if (rating && rating !== 'neutral') return rating;
    }

    // Direct check in state.doctorPreferences
    for (const [cKey, prefs] of Object.entries(state.doctorPreferences || {})) {
      if (courseKeys.includes(cKey)) {
        if (prefs[doc]) return prefs[doc];
        const clean = getCleanSortName(doc);
        if (clean && prefs[clean]) return prefs[clean];
        for (const [pDoc, pRating] of Object.entries(prefs)) {
          if (typeof ScheduleOptimizer !== 'undefined' && ScheduleOptimizer.matchesDoctor) {
            if (ScheduleOptimizer.matchesDoctor(doc, pDoc)) return pRating;
          } else if (pDoc.includes(doc) || doc.includes(pDoc)) {
            return pRating;
          }
        }
      }
    }
    return 'neutral';
  }

  /**
   * Summarizes doctor preferences present in a course group.
   */
  function getGroupDoctorPrefSummary(course, grp) {
    const courseDocs = new Set();
    (grp.instructors || []).forEach(i => {
      const s = (i || '').trim();
      if (s && s !== 'Not Specified' && s !== 'غير محدد') courseDocs.add(s);
    });
    (grp.sessions || []).forEach(sess => {
      const s = (sess.instructor || '').trim();
      if (s && s !== 'Not Specified' && s !== 'غير محدد') courseDocs.add(s);
    });

    const ratedDocs = [];
    courseDocs.forEach(doc => {
      const r = getDoctorPrefForCourse(course, doc);
      if (r && r !== 'neutral') {
        ratedDocs.push({ doctor: doc, rating: r });
      }
    });

    const hasMandate = ratedDocs.some(r => r.rating === 'mandate');
    const hasAvoid = ratedDocs.some(r => r.rating === 'avoid');
    const hasLove = ratedDocs.some(r => r.rating === 'love');

    return {
      ratedDocs,
      hasMandate,
      hasAvoid,
      hasLove
    };
  }

  function getGroupDoctorPrefBadgesHtml(prefSummary, isAr) {
    let html = '';
    if (prefSummary.hasMandate) {
      html += `<span class="manual-pref-badge badge-mandate" title="${isAr ? 'تحتوي هذه المجموعة على دكتور محدد كإجباري' : 'This group includes a mandated doctor'}">🌟🔒 ${isAr ? 'دكتور إجباري' : 'Mandated Doctor'}</span>`;
    }
    if (prefSummary.hasAvoid) {
      html += `<span class="manual-pref-badge badge-avoid" title="${isAr ? 'تحتوي هذه المجموعة على دكتور قمت باستبعاده (يمكنك اختياره يدوياً دون أي قيود)' : 'This group includes an avoided doctor (you can still select it manually)'}">🚫 ${isAr ? 'دكتور مستبعد' : 'Avoided Doctor'}</span>`;
    }
    if (prefSummary.hasLove && !prefSummary.hasMandate) {
      html += `<span class="manual-pref-badge badge-prefer" title="${isAr ? 'تحتوي هذه المجموعة على دكتور مفضل لديك' : 'This group includes a preferred doctor'}">⭐ ${isAr ? 'دكتور مفضل' : 'Preferred Doctor'}</span>`;
    }
    return html;
  }

  function getSessionDoctorPrefBadgeHtml(course, instructor, isAr) {
    if (!instructor) return '';
    const rating = getDoctorPrefForCourse(course, instructor);
    if (rating === 'avoid') {
      return `<span class="manual-pref-badge badge-avoid" title="${isAr ? 'دكتور مستبعد في تفضيلاتك (مسموح باختياره يدوياً)' : 'Avoided Doctor (Allowed in manual mode)'}">🚫 ${isAr ? 'مستبعد' : 'Avoided'}</span>`;
    }
    if (rating === 'mandate') {
      return `<span class="manual-pref-badge badge-mandate" title="${isAr ? 'دكتور إجباري في تفضيلاتك' : 'Mandated Doctor'}">🌟🔒 ${isAr ? 'إجباري' : 'Mandated'}</span>`;
    }
    if (rating === 'love') {
      return `<span class="manual-pref-badge badge-prefer" title="${isAr ? 'دكتور مفضل في تفضيلاتك' : 'Preferred Doctor'}">⭐ ${isAr ? 'مفضل' : 'Preferred'}</span>`;
    }
    return '';
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
          const isMandated = currentPref === 'mandate';
          const isAvoided = currentPref === 'avoid';
          const isLove = currentPref === 'love';

          html += `
            <div class="doctor-pref-item is-doctor ${isMandated ? 'is-mandated' : ''} ${isAvoided ? 'is-avoided' : ''}">
              <div class="doctor-name-col">
                <span style="font-size: 16px;">${isMandated ? '🌟' : '🎓'}</span>
                <span style="font-weight: 700; color: var(--text-primary); ${isAvoided ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${item.formatted}</span>
                <span class="role-badge doctor-badge">${t.doctorBadge}</span>
                ${isMandated ? `<span class="role-badge badge-mandated" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white; font-weight: 800; box-shadow: 0 1px 6px rgba(245, 158, 11, 0.4);">🌟🔒 ${state.currentLang === 'ar' ? 'إجباري في الجدول' : 'Mandated'}</span>` : ''}
                ${isAvoided ? `<span class="role-badge" style="background: rgba(239, 68, 68, 0.15); color: #EF4444; font-weight: 700;">🚫 ${state.currentLang === 'ar' ? 'مستبعد نهائياً' : 'Excluded'}</span>` : ''}
              </div>
              <div class="doctor-rating-group">
                <button class="rating-btn ${isMandated ? 'active-mandate' : (isLove ? 'active-love' : '')}"
                        title="${isMandated 
                          ? (state.currentLang === 'ar' ? 'دكتور إجباري ومفروض في جميع الجداول (انقر للإلغاء)' : 'Mandated doctor: Guaranteed in all schedules (click to unmandate)')
                          : (state.currentLang === 'ar' ? 'دكتور مفضل - انقر 3 مرات سريعاً لتثبيته كإجباري 🌟🔒' : 'Favorite doctor - Triple-click to mandate 🌟🔒')}"
                        onclick="App.handleDoctorPrefClick(event, '${courseCode}', '${escapeQuotes(item.formatted)}', 'love')">
                  ${isMandated ? `🌟🔒 ${state.currentLang === 'ar' ? 'إجباري' : 'Mandated'}` : `⭐ ${state.currentLang === 'ar' ? 'مفضل' : 'Favorite'}`}
                </button>
                <button class="rating-btn ${currentPref === 'neutral' ? 'active-neutral' : ''}"
                        title="${state.currentLang === 'ar' ? 'عادي' : 'Neutral'}"
                        onclick="App.handleDoctorPrefClick(event, '${courseCode}', '${escapeQuotes(item.formatted)}', 'neutral')">
                  ⚪ ${state.currentLang === 'ar' ? 'عادي' : 'Neutral'}
                </button>
                <button class="rating-btn ${isAvoided ? 'active-avoid' : ''}"
                        title="${state.currentLang === 'ar' ? 'استبعاد وحظر هذا الدكتور نهائياً من كافة الجداول 🚫' : 'Strictly exclude this doctor from all schedules 🚫'}"
                        onclick="App.handleDoctorPrefClick(event, '${courseCode}', '${escapeQuotes(item.formatted)}', 'avoid')">
                  🚫 ${state.currentLang === 'ar' ? 'تجنب (مستبعد)' : 'Avoid'}
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
          const isMandated = currentPref === 'mandate';
          const isAvoided = currentPref === 'avoid';
          const isLove = currentPref === 'love';

          html += `
            <div class="doctor-pref-item ${isMandated ? 'is-mandated' : ''} ${isAvoided ? 'is-avoided' : ''}">
              <div class="doctor-name-col">
                <span style="font-size: 16px;">${isMandated ? '🌟' : '🔬'}</span>
                <span style="font-weight: 600; color: var(--text-secondary); ${isAvoided ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${item.formatted}</span>
                <span class="role-badge instructor-badge">${t.instructorBadge}</span>
                ${isMandated ? `<span class="role-badge badge-mandated" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white; font-weight: 800;">🌟🔒 ${state.currentLang === 'ar' ? 'إجباري' : 'Mandated'}</span>` : ''}
                ${isAvoided ? `<span class="role-badge" style="background: rgba(239, 68, 68, 0.15); color: #EF4444; font-weight: 700;">🚫 ${state.currentLang === 'ar' ? 'مستبعد' : 'Excluded'}</span>` : ''}
              </div>
              <div class="doctor-rating-group">
                <button class="rating-btn ${isMandated ? 'active-mandate' : (isLove ? 'active-love' : '')}"
                        title="${isMandated 
                          ? (state.currentLang === 'ar' ? 'معيد إجباري في جميع الجداول (انقر للإلغاء)' : 'Mandated instructor (click to unmandate)')
                          : (state.currentLang === 'ar' ? 'معيد مفضل - انقر 3 مرات سريعاً لتثبيته كإجباري 🌟🔒' : 'Favorite instructor - Triple-click to mandate 🌟🔒')}"
                        onclick="App.handleDoctorPrefClick(event, '${courseCode}', '${escapeQuotes(item.formatted)}', 'love')">
                  ${isMandated ? `🌟🔒 ${state.currentLang === 'ar' ? 'إجباري' : 'Mandated'}` : `⭐ ${state.currentLang === 'ar' ? 'مفضل' : 'Favorite'}`}
                </button>
                <button class="rating-btn ${currentPref === 'neutral' ? 'active-neutral' : ''}"
                        title="${state.currentLang === 'ar' ? 'عادي' : 'Neutral'}"
                        onclick="App.handleDoctorPrefClick(event, '${courseCode}', '${escapeQuotes(item.formatted)}', 'neutral')">
                  ⚪ ${state.currentLang === 'ar' ? 'عادي' : 'Neutral'}
                </button>
                <button class="rating-btn ${isAvoided ? 'active-avoid' : ''}"
                        title="${state.currentLang === 'ar' ? 'استبعاد هذا المعيد نهائياً من كافة الجداول 🚫' : 'Strictly exclude this instructor from all schedules 🚫'}"
                        onclick="App.handleDoctorPrefClick(event, '${courseCode}', '${escapeQuotes(item.formatted)}', 'avoid')">
                  🚫 ${state.currentLang === 'ar' ? 'تجنب (مستبعد)' : 'Avoid'}
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

  // Click tracker for multi-clicks and triple-clicks
  const doctorClickTracker = {};

  /**
   * Handles click events on doctor preference buttons.
   * Supports single-click (Favorite / Avoid / Neutral),
   * rapid triple-click (Mandate doctor 🌟🔒),
   * and clicking a mandated doctor to toggle back to Favorite.
   */
  function handleDoctorPrefClick(event, courseCode, doctorName, ratingType) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const key = `${courseCode}:::${doctorName}`;
    const now = Date.now();
    const isAr = state.currentLang === 'ar';

    if (ratingType === 'love') {
      const tracker = doctorClickTracker[key] || { count: 0, lastTime: 0 };
      const timeDiff = now - tracker.lastTime;

      // Track clicks within 800ms
      if (timeDiff < 800) {
        tracker.count += 1;
      } else {
        tracker.count = 1;
      }
      tracker.lastTime = now;
      doctorClickTracker[key] = tracker;

      const currentRating = getRatingForPerson(courseCode, doctorName);

      // If already mandated, clicking it again toggles back to regular favorite
      if (currentRating === 'mandate') {
        tracker.count = 0;
        setDoctorPreference(courseCode, doctorName, 'love');
        showToast(
          isAr
            ? `تم إلغاء التثبيت الإجباري لـ ${doctorName} (أصبح مفضل فقط) ⭐`
            : `Doctor ${doctorName} mandate removed (now regular favorite) ⭐`,
          'info'
        );
        return;
      }

      // Check for triple-click: either 3 rapid clicks or event.detail >= 3
      if (tracker.count >= 3 || (event && event.detail >= 3)) {
        tracker.count = 0;
        setDoctorPreference(courseCode, doctorName, 'mandate');
        showToast(
          isAr
            ? `تم تثبيت ${doctorName} كإجباري ومفروض في كافة الجداول! 🌟🔒`
            : `Doctor ${doctorName} is now MANDATED in all schedules! 🌟🔒`,
          'success'
        );
        return;
      }

      if (tracker.count === 2) {
        // Double clicked: inform user 1 more click to mandate
        setDoctorPreference(courseCode, doctorName, 'love');
        showToast(
          isAr
            ? `انقر نقرة ثالثة لتثبيت ${doctorName} كإجباري 🌟🔒`
            : `Click one more time to MANDATE ${doctorName} 🌟🔒`,
          'info'
        );
        return;
      }

      // Normal single click on Favorite
      setDoctorPreference(courseCode, doctorName, 'love');
      showToast(
        isAr
          ? `تم تحديد ${doctorName} كمفضل ⭐ (انقر 3 مرات للتثبيت الإجباري 🌟🔒)`
          : `Marked ${doctorName} as Favorite ⭐ (Triple-click to mandate 🌟🔒)`,
        'info'
      );
    } else if (ratingType === 'avoid') {
      delete doctorClickTracker[key];
      setDoctorPreference(courseCode, doctorName, 'avoid');
      showToast(
        isAr
          ? `تم حظر واستبعاد ${doctorName} نهائياً من كافة الجداول 🚫`
          : `Doctor ${doctorName} strictly excluded from all schedules 🚫`,
        'warning'
      );
    } else {
      // neutral
      delete doctorClickTracker[key];
      setDoctorPreference(courseCode, doctorName, 'neutral');
    }
  }

  /**
   * Sanitizes doctor preferences object to ensure 1 canonical entry per instructor
   * and at most 1 mandated doctor per course.
   */
  function sanitizeDoctorPreferencesObj(raw) {
    if (!raw || typeof raw !== 'object') return {};
    const clean = {};
    Object.keys(raw).forEach(code => {
      clean[code] = {};
      const coursePrefs = raw[code] || {};
      let mandateCount = 0;

      // Deduplicate: merge titles and strip duplicate clean-name aliases
      Object.keys(coursePrefs).forEach(name => {
        const rating = coursePrefs[name];
        if (!rating || rating === 'neutral') return;

        const existingKey = Object.keys(clean[code]).find(k => getCleanSortName(k) === getCleanSortName(name));
        if (existingKey) {
          if (name.startsWith('د.') && !existingKey.startsWith('د.')) {
            clean[code][name] = rating;
            delete clean[code][existingKey];
          }
        } else {
          clean[code][name] = rating;
        }
      });

      // At most 1 mandated doctor per course
      Object.keys(clean[code]).forEach(name => {
        if (clean[code][name] === 'mandate') {
          if (mandateCount > 0) {
            clean[code][name] = 'love';
          } else {
            mandateCount++;
          }
        }
      });
    });
    return clean;
  }

  function setDoctorPreference(courseCode, doctorName, rating) {
    if (!state.doctorPreferences[courseCode]) {
      state.doctorPreferences[courseCode] = {};
    }

    // Clean up any old duplicate cleaned-name alias
    const cleanName = getCleanSortName(doctorName);
    if (cleanName && cleanName !== doctorName) {
      delete state.doctorPreferences[courseCode][cleanName];
    }

    // If setting to mandate, demote any previous mandated doctor in this course to avoid impossible conflicts
    if (rating === 'mandate') {
      Object.keys(state.doctorPreferences[courseCode]).forEach(doc => {
        if (state.doctorPreferences[courseCode][doc] === 'mandate') {
          state.doctorPreferences[courseCode][doc] = 'love';
        }
      });
    }

    if (rating === 'neutral') {
      delete state.doctorPreferences[courseCode][doctorName];
    } else {
      state.doctorPreferences[courseCode][doctorName] = rating;
    }

    // Persist to localStorage immediately
    localStorage.setItem('sched_doc_prefs', JSON.stringify(state.doctorPreferences));

    // Invalidate stale solutions since constraints changed
    state.solutions = [];

    // Privately track avoid, love (prefer), and mandate actions for the developer (debounced to avoid duplicate triple-clicks)
    queueDoctorTelemetryAction(courseCode, doctorName, rating);

    saveStateToStorage();
    renderDoctorPreferences();
  }

  const telemetryDebounceTimers = {};

  /**
   * Dispatches doctor preference telemetry with debouncing.
   * Prevents rapid triple-clicks (to mandate) from firing 3 separate events.
   * If a user triple-clicks to mandate, only 1 'mandate' event is dispatched.
   */
  function queueDoctorTelemetryAction(courseCode, doctorName, rating) {
    const key = `${courseCode}:::${doctorName}`;

    if (telemetryDebounceTimers[key]) {
      clearTimeout(telemetryDebounceTimers[key]);
      delete telemetryDebounceTimers[key];
    }

    if (!rating || rating === 'neutral') return;

    const course = state.courses.find(c => c.code === courseCode || c.id === courseCode);
    const courseName = course ? course.name : courseCode;

    const dispatch = (action) => {
      if (window.SiteTelemetry && typeof window.SiteTelemetry.trackDoctorAction === 'function') {
        window.SiteTelemetry.trackDoctorAction({
          doctorName,
          courseCode,
          courseName,
          action
        });
      }
    };

    // If mandate or avoid, dispatch immediately!
    if (rating === 'mandate' || rating === 'avoid') {
      dispatch(rating);
      return;
    }

    // If love (prefer), debounce by 850ms to verify user is not doing a triple-click
    telemetryDebounceTimers[key] = setTimeout(() => {
      delete telemetryDebounceTimers[key];
      const currentRating = getRatingForPerson(courseCode, doctorName);
      if (currentRating === 'love') {
        dispatch('love');
      }
    }, 850);
  }

  function escapeQuotes(str) {
    return (str || '').replace(/'/g, "\\'");
  }

  /**
   * Run Optimizer Engine with Animated Loading Modal & Progress Bar
   */
  function runOptimizer() {
    if (state.courses.length === 0) {
      showToast('Please add at least one course first.', 'error');
      return;
    }

    const modal = document.getElementById('optimizer-loading-modal');
    const stepEl = document.getElementById('optimizer-loading-step');
    const progressBar = document.getElementById('optimizer-progress-bar');
    const isAr = state.currentLang === 'ar';

    if (modal) {
      modal.style.setProperty('display', 'flex', 'important');
    }
    if (progressBar) progressBar.style.width = '15%';
    if (stepEl) {
      stepEl.textContent = isAr
        ? 'فحص وتجميع مجموعات المواد والمحاضرات...'
        : 'Analyzing course combinations and lecture groups...';
    }

    // Step 2: 120ms
    setTimeout(() => {
      if (progressBar) progressBar.style.width = '45%';
      if (stepEl) {
        stepEl.textContent = isAr
          ? 'استبعاد أوقات التدريب المحظورة وأيام الفراغ...'
          : 'Filtering blocked times and free days...';
      }

      // Step 3: 240ms
      setTimeout(() => {
        if (progressBar) progressBar.style.width = '80%';
        if (stepEl) {
          stepEl.textContent = isAr
            ? 'تطبيق تفضيلات الدكاترة وحساب فترات الفراغ...'
            : 'Applying doctor preferences and calculating gaps...';
        }

        // Run Optimizer solver asynchronously
        setTimeout(() => {
          let result;
          try {
            result = ScheduleOptimizer.findOptimalSchedules(state.courses, {
              doctorPreferences: state.doctorPreferences,
              gapWeight: state.preferences.gapWeight,
              daysWeight: state.preferences.daysWeight,
              doctorWeight: state.preferences.doctorWeight,
              earlyWeight: state.preferences.earlyWeight,
              freeDays: state.preferences.freeDays,
              blockedTimes: state.blockedTimes,
              strictDoctorMode: state.preferences.strictDoctorCombinations !== false
            });
          } catch (err) {
            console.error('Optimizer error:', err);
            result = { success: false, message: 'An unexpected error occurred during optimization.' };
          }

          if (progressBar) progressBar.style.width = '100%';
          if (stepEl) {
            stepEl.textContent = isAr
              ? 'ترتيب أفضل الجداول الخالية من التعارض...'
              : 'Ranking clash-free schedules...';
          }

          setTimeout(() => {
            if (modal) modal.style.setProperty('display', 'none', 'important');

            if (!result.success || !result.solutions || result.solutions.length === 0) {
              const errMsg = isAr ? (result.messageAr || result.message) : (result.message || 'No clash-free schedules found. Try relaxing free days or unblocking some times.');
              showToast(errMsg, 'error');
              return;
            }

            state.solutions = result.solutions;
            state.activeSolutionIndex = 0;

            // Switch to Timetable tab
            switchTab('timetable');
            renderSolutionsSelector();
            renderCurrentSolution();

            if (result.fallbackNotice) {
              showToast(
                isAr
                  ? (result.fallbackNoticeAr || `⚠️ تم توليد الجداول! بعض الدكاترة أوقاتهم متعارضة، تم إدراج أفضل التوفيقات المتاحة.`)
                  : result.fallbackNotice,
                'warning'
              );
            } else {
              const combosChecked = result.totalCombinationsPossible ? ` (${result.totalCombinationsPossible.toLocaleString()} combinations checked)` : '';
              const combosCheckedAr = result.totalCombinationsPossible ? ` (تم فحص ${result.totalCombinationsPossible.toLocaleString()} احتمال)` : '';
              showToast(
                isAr
                  ? `تم بنجاح! تم العثور على ${result.validCount} جدول بدون أي تعارض${combosCheckedAr}.`
                  : `Success! Found ${result.validCount} clash-free schedules${combosChecked}. Top options ranked below.`,
                'success'
              );
            }
          }, 220);
        }, 80);
      }, 120);
    }, 120);
  }

  /* ==========================================================================
     Tab 4: Manual Mode (Build Your Own Schedule)
     ========================================================================== */

  /**
   * Main render method for Tab 4
   */
  function renderManualMode() {
    if (!state.courses || state.courses.length === 0) {
      const banner = document.getElementById('manual-status-banner');
      const isAr = state.currentLang === 'ar';
      if (banner) {
        banner.className = 'manual-status-banner';
        banner.innerHTML = `
          <div class="manual-status-main">
            <span>ℹ️</span>
            <span>${isAr ? 'لم يتم إضافة مقررات بعد. برجاء إضافة مواد في التبويب الأول أو الضغط على "تحميل المقررات التجريبية".' : 'No courses added yet. Please add courses in Tab 1 or click "Load Example Courses".'}</span>
          </div>
        `;
      }
      const docContainer = document.getElementById('manual-doctor-groups-container');
      if (docContainer) docContainer.innerHTML = '';
      const coursesContainer = document.getElementById('manual-courses-picker-container');
      if (coursesContainer) coursesContainer.innerHTML = '';
      const ttContainer = document.getElementById('manual-timetable-render-container');
      if (ttContainer) ttContainer.innerHTML = '';
      return;
    }

    populateManualDoctorDropdown();
    renderManualDoctorGroups();
    renderManualCoursesPicker();
    renderManualStatusBanner();
    renderManualTimetable();
  }

  /**
   * Populates the Doctor selection dropdown in Tab 4
   */
  function populateManualDoctorDropdown() {
    const select = document.getElementById('manual-doctor-select');
    if (!select) return;

    const isAr = state.currentLang === 'ar';
    const doctorMap = new Map();

    state.courses.forEach(course => {
      (course.groups || []).forEach(grp => {
        (grp.instructors || []).forEach(rawInst => {
          const inst = (rawInst || '').trim();
          if (!inst || inst === 'Not Specified' || inst === 'غير محدد') return;
          if (!doctorMap.has(inst)) doctorMap.set(inst, new Set());
          doctorMap.get(inst).add(course.name || course.code);
        });
        (grp.sessions || []).forEach(sess => {
          const inst = (sess.instructor || '').trim();
          if (!inst || inst === 'Not Specified' || inst === 'غير محدد') return;
          if (!doctorMap.has(inst)) doctorMap.set(inst, new Set());
          doctorMap.get(inst).add(course.name || course.code);
        });
      });
    });

    const doctorsList = Array.from(doctorMap.keys());
    doctorsList.sort((a, b) => {
      const aIsDoc = a.includes('د.') || a.toLowerCase().includes('dr.');
      const bIsDoc = b.includes('د.') || b.toLowerCase().includes('dr.');
      if (aIsDoc && !bIsDoc) return -1;
      if (!aIsDoc && bIsDoc) return 1;
      return a.localeCompare(b, 'ar');
    });

    const currentVal = state.manualSelectedDoctor || '';
    let html = `<option value="">${isAr ? '-- اختر دكتوراً لعرض كافة مجموعاته --' : '-- Choose a doctor to view their groups --'}</option>`;

    doctorsList.forEach(doc => {
      const coursesTaught = Array.from(doctorMap.get(doc)).join(', ');
      const isSelected = doc === currentVal ? 'selected' : '';
      const isDoc = doc.includes('د.') || doc.toLowerCase().includes('dr.');
      const icon = isDoc ? '🎓' : '🔬';

      let prefTag = '';
      for (const course of state.courses) {
        const r = getDoctorPrefForCourse(course, doc);
        if (r === 'mandate') { prefTag = isAr ? ' 🌟🔒 [إجباري]' : ' 🌟🔒 [Mandated]'; break; }
        if (r === 'avoid') { prefTag = isAr ? ' 🚫 [مستبعد]' : ' 🚫 [Avoided]'; }
        else if (r === 'love' && !prefTag) { prefTag = isAr ? ' ⭐ [مفضل]' : ' ⭐ [Preferred]'; }
      }

      html += `<option value="${doc}" ${isSelected}>${icon} ${doc}${prefTag} (${coursesTaught})</option>`;
    });

    select.innerHTML = html;
  }

  /**
   * Renders the groups taught by the selected/searched doctor
   */
  function renderManualDoctorGroups() {
    const container = document.getElementById('manual-doctor-groups-container');
    if (!container) return;

    const isAr = state.currentLang === 'ar';
    const targetDoctor = (state.manualSelectedDoctor || '').trim();
    const query = (state.manualSearchQuery || '').trim().toLowerCase();

    if (!targetDoctor && !query) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.9rem; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <span>👆</span> <span>${isAr ? 'اختر دكتوراً من القائمة أعلاه أو اكتب اسمه في خانة البحث لعرض كافة مواعيد مجموعاته هنا.' : 'Choose a doctor above or type their name to reveal all their lecture groups and timings here.'}</span>
        </div>
      `;
      return;
    }

    const matchingGroups = [];

    state.courses.forEach(course => {
      (course.groups || []).forEach(grp => {
        let matches = false;

        if (targetDoctor) {
          const inGrp = (grp.instructors || []).some(i => i.trim() === targetDoctor);
          const inSess = (grp.sessions || []).some(s => (s.instructor || '').trim() === targetDoctor);
          if (inGrp || inSess) matches = true;
        }

        if (query) {
          const docMatches = (grp.instructors || []).some(i => i.toLowerCase().includes(query)) ||
            (grp.sessions || []).some(s => (s.instructor || '').toLowerCase().includes(query));
          const courseMatches = (course.name || '').toLowerCase().includes(query) || (course.code || '').toLowerCase().includes(query);
          if (docMatches || courseMatches) matches = true;
        }

        if (matches) {
          matchingGroups.push({
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            color: course.color,
            groupData: grp
          });
        }
      });
    });

    if (matchingGroups.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.88rem;">
          <span>🔍</span> <span>${isAr ? 'لم يتم العثور على مجموعات تطابق هذا الاختيار.' : 'No matching groups found for this selection.'}</span>
        </div>
      `;
      return;
    }

    let html = `<div class="doctor-groups-grid">`;

    matchingGroups.forEach(item => {
      const { courseId, courseName, courseCode, color, groupData } = item;
      const key = `${courseId}:::${groupData.group}`;
      const isSelected = !!state.manualSchedule[key];
      const selectedForCourse = getSelectedGroupsForCourse(courseId);
      const isMultiCourse = selectedForCourse.length > 1;

      const courseObj = state.courses.find(c => c.id === courseId) || { id: courseId, name: courseName, code: courseCode };
      const prefSummary = getGroupDoctorPrefSummary(courseObj, groupData);
      const prefBadgesHtml = getGroupDoctorPrefBadgesHtml(prefSummary, isAr);

      const conflict = checkGroupConflictWithManualSchedule(courseId, groupData);
      const isClashing = !isSelected && conflict.clashing;
      const isSoftClash = isClashing && conflict.severity === 'warning';

      let cardClass = 'manual-group-card';
      if (isSelected) cardClass += ' is-selected';
      else if (isSoftClash) cardClass += ' is-clashing-warning';
      else if (isClashing) cardClass += ' is-clashing';
      else cardClass += ' is-doc-match';

      if (prefSummary.hasAvoid) cardClass += ' has-avoided-doctor';
      if (prefSummary.hasMandate) cardClass += ' has-mandated-doctor';
      if (prefSummary.hasLove) cardClass += ' has-preferred-doctor';

      html += `
        <div class="${cardClass}" style="border-inline-start: 5px solid ${color || '#3B82F6'};">
          <div class="manual-group-header">
            <div class="manual-group-title">
              <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                <span style="color: ${color || 'var(--text-primary)'}; font-weight: 800;">${courseCode || courseName}</span>
                ${isSelected && isMultiCourse ? getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لهذه المادة' : 'Multiple groups selected for this subject') : ''}
              </div>
              <span class="mini-group-tag" style="background: var(--bg-primary); border: 1px solid var(--border-color); font-weight: 800;">Group ${groupData.group}</span>
              ${prefBadgesHtml}
            </div>
            <div>
              ${isSelected ? `<span class="selected-badge-pill">✓ ${isAr ? 'تم اختياره' : 'Selected'}</span>` : ''}
              ${isClashing ? (
                isSoftClash
                  ? `<span class="clash-warning-text is-warning" style="padding: 2px 6px; font-size: 0.72rem;">⚠️ ${isAr ? 'محاضرة مشتركة' : 'Combined'}</span>`
                  : `<span class="clash-warning-text" style="padding: 2px 6px; font-size: 0.72rem;">⚠️ ${isAr ? 'تعارض' : 'Clash'}</span>`
              ) : ''}
            </div>
          </div>

          <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
            <strong>${courseName}</strong>
          </div>

          <div class="manual-sessions-list">
            ${(groupData.sessions || []).map(s => {
              const timeStr = ScheduleRenderer.formatSlotTimeRange(s.startSlot, s.endSlot);
              const typeClass = s.type === 'Lab.' ? 'lab-item' : (s.type === 'Sec.' ? 'sec-item' : 'lect-item');
              const typeName = isAr ? (s.type === 'Lab.' ? 'معمل' : (s.type === 'Sec.' ? 'سكشن' : 'محاضرة')) : s.type;
              const docBadge = s.instructor ? getSessionDoctorPrefBadgeHtml(courseObj, s.instructor, isAr) : '';
              return `
                <div class="manual-session-item ${typeClass}">
                  <span><strong>${typeName}</strong>: ${s.day} (${timeStr})</span>
                  <span>${s.instructor ? `👨‍🏫 ${s.instructor}` : ''} ${docBadge}</span>
                </div>
              `;
            }).join('')}
          </div>

          ${isClashing ? `
            <div class="clash-warning-text ${isSoftClash ? 'is-warning' : ''}">
              <span>⚠️ ${conflict.detail}</span>
            </div>
          ` : ''}

          <div style="margin-top: 4px; display: flex; justify-content: flex-end;">
            <button class="btn ${isSelected ? 'btn-outline' : (isClashing ? 'btn-secondary' : 'btn-primary')} btn-sm"
                    style="${isSelected ? 'color: var(--danger); border-color: var(--danger);' : ''}"
                    onclick="App.selectManualGroup('${courseId}', '${groupData.group}')">
              <span>${isSelected ? (isAr ? '❌ إلغاء الاختيار' : '❌ Deselect Group') : (isAr ? '➕ اختيار المجموعة' : '➕ Select Group')}</span>
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  /**
   * Helper: returns all selected groups for a course
   */
  function getSelectedGroupsForCourse(courseId) {
    return Object.values(state.manualSchedule).filter(g => g.courseId === courseId || g.courseCode === courseId);
  }

  /**
   * Helper: returns course IDs that have >1 group selected
   */
  function getMultiGroupCourses() {
    const map = {};
    Object.values(state.manualSchedule).forEach(g => {
      map[g.courseId] = (map[g.courseId] || 0) + 1;
    });
    return Object.keys(map).filter(cid => map[cid] > 1);
  }

  /**
   * Helper: red error triangle SVG with tooltip
   */
  function getRedErrorTriangleSvg(customTitle) {
    const isAr = state.currentLang === 'ar';
    const title = customTitle || (isAr ? 'تم اختيار أكثر من مجموعة لنفس المقرر' : 'Multiple groups selected for this subject');
    return `<span class="red-error-triangle-icon" title="${title}">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: -2px; margin-inline: 2px;">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#EF4444"></path>
        <line x1="12" y1="9" x2="12" y2="13" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"></line>
        <circle cx="12" cy="17" r="1.2" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.5"></circle>
      </svg>
    </span>`;
  }

  /**
   * Renders the complete course-by-course group selection list
   */
  function renderManualCoursesPicker() {
    const container = document.getElementById('manual-courses-picker-container');
    if (!container) return;

    const isAr = state.currentLang === 'ar';
    const targetDoctor = (state.manualSelectedDoctor || '').trim();
    const query = (state.manualSearchQuery || '').trim().toLowerCase();

    let html = '';

    state.courses.forEach(course => {
      const selectedGroupsForCourse = getSelectedGroupsForCourse(course.id);
      const isMultiCourse = selectedGroupsForCourse.length > 1;

      html += `
        <div class="manual-course-row">
          <div class="manual-course-row-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="course-color-swatch" style="background: ${course.color || '#3B82F6'}; width: 14px; height: 14px; border-radius: 50%;"></span>
              <div>
                <span style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">${course.name}</span>
                ${course.code && course.code !== course.name ? `<span style="font-size: 0.85rem; color: var(--text-muted); margin-inline-start: 6px;">(${course.code})</span>` : ''}
              </div>
            </div>
            <div>
              ${selectedGroupsForCourse.length === 0
                ? `<span style="font-size: 0.8rem; color: var(--text-muted);">${isAr ? 'لم يتم اختيار مجموعة بعد' : 'No group selected'}</span>`
                : (isMultiCourse
                    ? `<span class="multi-groups-badge" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #EF4444; font-weight: 700; font-size: 0.82rem; padding: 4px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;">
                        ${getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لنفس المقرر' : 'Multiple groups selected for this subject')}
                        <span>${isAr ? `تم اختيار ${selectedGroupsForCourse.length} مجموعات: (${selectedGroupsForCourse.map(g => 'مجموعة ' + g.group).join('، ')})` : `${selectedGroupsForCourse.length} Groups Selected: (${selectedGroupsForCourse.map(g => 'Group ' + g.group).join(', ')})`}</span>
                       </span>`
                    : `<span class="selected-badge-pill" style="font-size: 0.82rem; padding: 4px 10px;">✓ ${isAr ? `المجموعة المختارة: ${selectedGroupsForCourse[0].group}` : `Selected: Group ${selectedGroupsForCourse[0].group}`}</span>`
                  )
              }
            </div>
          </div>

          <div class="manual-course-groups-row">
            ${(course.groups || []).map(grp => {
              const key = `${course.id}:::${grp.group}`;
              const isSelected = !!state.manualSchedule[key];

              let isDocMatch = false;
              if (targetDoctor) {
                const inGrp = (grp.instructors || []).some(i => i.trim() === targetDoctor);
                const inSess = (grp.sessions || []).some(s => (s.instructor || '').trim() === targetDoctor);
                if (inGrp || inSess) isDocMatch = true;
              } else if (query) {
                const inGrp = (grp.instructors || []).some(i => i.toLowerCase().includes(query));
                const inSess = (grp.sessions || []).some(s => (s.instructor || '').toLowerCase().includes(query));
                if (inGrp || inSess) isDocMatch = true;
              }

              const prefSummary = getGroupDoctorPrefSummary(course, grp);
              const prefBadgesHtml = getGroupDoctorPrefBadgesHtml(prefSummary, isAr);

              const conflict = checkGroupConflictWithManualSchedule(course.id, grp);
              const isClashing = !isSelected && conflict.clashing;
              const isSoftClash = isClashing && conflict.severity === 'warning';

              let cardClass = 'manual-group-card';
              if (isSelected) cardClass += ' is-selected';
              else if (isSoftClash) cardClass += ' is-clashing-warning';
              else if (isClashing) cardClass += ' is-clashing';
              else if (isDocMatch) cardClass += ' is-doc-match';

              if (prefSummary.hasAvoid) cardClass += ' has-avoided-doctor';
              if (prefSummary.hasMandate) cardClass += ' has-mandated-doctor';
              if (prefSummary.hasLove) cardClass += ' has-preferred-doctor';

              return `
                <div class="${cardClass}">
                  <div class="manual-group-header">
                    <div class="manual-group-title">
                      <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                        <span>Group ${grp.group}</span>
                        ${isSelected && isMultiCourse ? getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لهذه المادة' : 'Multiple groups selected for this subject') : ''}
                      </div>
                      ${isDocMatch ? `<span class="doc-highlight-pill">⭐ ${isAr ? 'مجموعة الدكتور' : "Doctor's Group"}</span>` : ''}
                      ${prefBadgesHtml}
                    </div>
                    <div>
                      ${isSelected ? `<span class="selected-badge-pill">✓</span>` : ''}
                      ${isClashing ? (
                        isSoftClash
                          ? `<span class="clash-warning-text is-warning" style="padding: 2px 6px; font-size: 0.72rem;">⚠️ ${isAr ? 'محاضرة مشتركة' : 'Combined'}</span>`
                          : `<span class="clash-warning-text" style="padding: 2px 6px; font-size: 0.72rem;">⚠️ ${isAr ? 'تعارض' : 'Clash'}</span>`
                      ) : ''}
                    </div>
                  </div>

                  <div class="manual-sessions-list">
                    ${(grp.sessions || []).map(s => {
                      const timeStr = ScheduleRenderer.formatSlotTimeRange(s.startSlot, s.endSlot);
                      const typeClass = s.type === 'Lab.' ? 'lab-item' : (s.type === 'Sec.' ? 'sec-item' : 'lect-item');
                      const typeName = isAr ? (s.type === 'Lab.' ? 'معمل' : (s.type === 'Sec.' ? 'سكشن' : 'محاضرة')) : s.type;
                      const docBadge = s.instructor ? getSessionDoctorPrefBadgeHtml(course, s.instructor, isAr) : '';
                      return `
                        <div class="manual-session-item ${typeClass}">
                          <span><strong>${typeName}</strong>: ${s.day} (${timeStr})</span>
                          <span>${s.instructor ? `👨‍🏫 ${s.instructor}` : ''} ${docBadge}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>

                  ${isClashing ? `
                    <div class="clash-warning-text ${isSoftClash ? 'is-warning' : ''}">
                      <span>⚠️ ${conflict.detail}</span>
                    </div>
                  ` : ''}

                  <div style="margin-top: 4px; display: flex; justify-content: flex-end;">
                    <button class="btn ${isSelected ? 'btn-outline' : (isClashing ? 'btn-secondary' : 'btn-primary')} btn-sm"
                            style="${isSelected ? 'color: var(--danger); border-color: var(--danger);' : ''}"
                            onclick="App.selectManualGroup('${course.id}', '${grp.group}')">
                      <span>${isSelected ? (isAr ? '❌ إلغاء الاختيار' : '❌ Deselect') : (isAr ? 'اختيار هذه المجموعة' : 'Select Group')}</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Checks if a candidate group has any time conflicts with currently selected manual schedule groups
   */
  function checkGroupConflictWithManualSchedule(courseId, candidateGroup) {
    const isAr = state.currentLang === 'ar';
    const candidateSessions = candidateGroup.sessions || [];
    let foundHardClash = null;
    let foundSoftClash = null;

    for (const [key, pickedGroup] of Object.entries(state.manualSchedule)) {
      if (pickedGroup.courseId === courseId && pickedGroup.group === candidateGroup.group) continue;

      const pickedSessions = pickedGroup.sessions || [];
      for (const s1 of candidateSessions) {
        for (const s2 of pickedSessions) {
          if (s1.day === s2.day && s1.startSlot <= s2.endSlot && s1.endSlot >= s2.startSlot) {
            const timeRange = ScheduleRenderer.formatSlotTimeRange(
              Math.max(s1.startSlot, s2.startSlot),
              Math.min(s1.endSlot, s2.endSlot)
            );
            const sameCourse = pickedGroup.courseId === courseId;
            const isLect1 = ScheduleRenderer.isLectureSession(s1);
            const isLect2 = ScheduleRenderer.isLectureSession(s2);
            const sameDoc = ScheduleRenderer.isSameDoctor(s1.instructor, s2.instructor);
            const isSoft = sameCourse && isLect1 && isLect2 && sameDoc;

            if (isSoft) {
              if (!foundSoftClash) {
                foundSoftClash = {
                  clashing: true,
                  severity: 'warning',
                  detail: isAr
                    ? `محاضرة مشتركة لنفس الدكتور (${s1.instructor}) مع مجموعة ${pickedGroup.group} يوم ${s1.day} (${timeRange})`
                    : `Combined lecture with same doctor (${s1.instructor}) with Group ${pickedGroup.group} on ${s1.day} (${timeRange})`
                };
              }
            } else {
              foundHardClash = {
                clashing: true,
                severity: 'danger',
                detail: isAr
                  ? `تعارض مع ${pickedGroup.courseName || pickedGroup.courseCode} (مجموعة ${pickedGroup.group}) يوم ${s1.day} (${timeRange})`
                  : `Clashes with ${pickedGroup.courseCode || pickedGroup.courseName} (Group ${pickedGroup.group}) on ${s1.day} (${timeRange})`
              };
              return foundHardClash;
            }
          }
        }
      }
    }

    if (foundHardClash) return foundHardClash;
    if (foundSoftClash) return foundSoftClash;
    return { clashing: false };
  }

  /**
   * Checks all conflicts within the entire current manual schedule
   */
  function checkManualConflicts() {
    const isAr = state.currentLang === 'ar';
    const conflicts = [];
    const entries = Object.entries(state.manualSchedule);

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const [k1, grp1] = entries[i];
        const [k2, grp2] = entries[j];

        for (const s1 of (grp1.sessions || [])) {
          for (const s2 of (grp2.sessions || [])) {
            if (s1.day === s2.day && s1.startSlot <= s2.endSlot && s1.endSlot >= s2.startSlot) {
              const timeRange = ScheduleRenderer.formatSlotTimeRange(
                Math.max(s1.startSlot, s2.startSlot),
                Math.min(s1.endSlot, s2.endSlot)
              );
              const sameCourse = grp1.courseId === grp2.courseId;
              const isLect1 = ScheduleRenderer.isLectureSession(s1);
              const isLect2 = ScheduleRenderer.isLectureSession(s2);
              const sameDoc = ScheduleRenderer.isSameDoctor(s1.instructor, s2.instructor);
              const isSoftLectureClash = sameCourse && isLect1 && isLect2 && sameDoc;

              conflicts.push({
                course1: grp1.courseCode || grp1.courseName,
                group1: grp1.group,
                course2: grp2.courseCode || grp2.courseName,
                group2: grp2.group,
                sameCourse,
                isSoftLectureClash,
                severity: isSoftLectureClash ? 'warning' : 'danger',
                day: s1.day,
                timeRange,
                detail: isSoftLectureClash
                  ? (isAr
                      ? `محاضرة مشتركة لنفس الدكتور (${s1.instructor}) لنفس المقرر (${grp1.courseName}): مجموعة ${grp1.group} ومجموعة ${grp2.group} يوم ${s1.day} (${timeRange})`
                      : `Combined lecture with same doctor (${s1.instructor}) for ${grp1.courseCode || grp1.courseName}: Group ${grp1.group} & Group ${grp2.group} on ${s1.day} (${timeRange})`)
                  : (sameCourse
                      ? (isAr
                          ? `تعارض بين مجموعتين مختارتين لنفس المقرر (${grp1.courseName}): مجموعة ${grp1.group} ومجموعة ${grp2.group} يوم ${s1.day} (${timeRange})`
                          : `Clash between two groups of ${grp1.courseCode || grp1.courseName}: Group ${grp1.group} and Group ${grp2.group} on ${s1.day} (${timeRange})`)
                      : (isAr
                          ? `تعارض بين ${grp1.courseCode || grp1.courseName} (مجموعة ${grp1.group}) و ${grp2.courseCode || grp2.courseName} (مجموعة ${grp2.group}) يوم ${s1.day} (${timeRange})`
                          : `Clash between ${grp1.courseCode || grp1.courseName} (Group ${grp1.group}) and ${grp2.courseCode || grp2.courseName} (Group ${grp2.group}) on ${s1.day} (${timeRange})`))
              });
            }
          }
        }
      }
    }

    const hasHardConflict = conflicts.some(c => c.severity === 'danger');
    const hasSoftConflict = conflicts.some(c => c.severity === 'warning');

    return {
      hasConflict: conflicts.length > 0,
      hasHardConflict,
      hasSoftConflict,
      conflicts
    };
  }

  /**
   * Selects or deselects a group for a course in Manual Mode
   */
  function selectManualGroup(courseId, groupName) {
    const isAr = state.currentLang === 'ar';
    const course = state.courses.find(c => c.id === courseId || c.code === courseId);
    if (!course) return;

    const groupData = (course.groups || []).find(g => g.group === groupName);
    if (!groupData) return;

    const key = `${course.id}:::${groupName}`;

    if (state.manualSchedule[key]) {
      delete state.manualSchedule[key];
      showToast(isAr ? `تم إلغاء اختيار مجموعة ${groupName} لمقرر ${course.name}` : `Deselected Group ${groupName} for ${course.name}`, 'info');
    } else {
      state.manualSchedule[key] = {
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
        group: groupName,
        color: course.color,
        instructors: groupData.instructors || [],
        sessions: (groupData.sessions || []).map(s => ({
          ...s,
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          group: groupName,
          color: course.color
        }))
      };

      const conflict = checkGroupConflictWithManualSchedule(course.id, groupData);
      const selectedForCourse = getSelectedGroupsForCourse(course.id);
      if (conflict.clashing) {
        showToast(`⚠️ ${conflict.detail}`, 'warning');
      } else if (selectedForCourse.length > 1) {
        showToast(isAr ? `⚠️ تم اختيار مجموعة ${groupName} (تم اختيار ${selectedForCourse.length} مجموعات لمقرر ${course.name})` : `⚠️ Selected Group ${groupName} (${selectedForCourse.length} groups selected for ${course.name})`, 'warning');
      } else {
        showToast(isAr ? `تم اختيار مجموعة ${groupName} لمقرر ${course.name}` : `Selected Group ${groupName} for ${course.name}`, 'success');
      }
    }

    saveStateToStorage();
    renderManualStatusBanner();
    renderManualDoctorGroups();
    renderManualCoursesPicker();
    renderManualTimetable();
  }

  /**
   * Deselects a group directly from a timetable card click or button
   */
  function deselectManualGroupFromTimetable(courseId, groupName, event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const isAr = state.currentLang === 'ar';
    const course = state.courses.find(c => c.id === courseId || c.code === courseId);
    const courseTitle = course ? course.name : courseId;
    const cid = course ? course.id : courseId;
    const key = `${cid}:::${groupName}`;

    if (state.manualSchedule[key]) {
      delete state.manualSchedule[key];
    } else {
      delete state.manualSchedule[courseId];
      delete state.manualSchedule[`${courseId}:::${groupName}`];
    }

    saveStateToStorage();
    renderManualStatusBanner();
    renderManualDoctorGroups();
    renderManualCoursesPicker();
    renderManualTimetable();

    // If currently viewing timetable in Tab 3, re-sync Tab 3
    if (state.currentTab === 'timetable' && state.solutions[state.activeSolutionIndex]?.id === 'sol_manual_custom') {
      const sol = getManualSolution();
      state.solutions[state.activeSolutionIndex] = sol;
      renderCurrentSolution();
    }

    showToast(isAr ? `تم إلغاء اختيار مجموعة ${groupName} لمقرر ${courseTitle}` : `Deselected Group ${groupName} for ${courseTitle}`, 'info');
  }

  /**
   * Clears the manual schedule
   */
  function clearManualSchedule() {
    const isAr = state.currentLang === 'ar';
    if (Object.keys(state.manualSchedule).length === 0) return;

    if (confirm(isAr ? 'هل أنت متأكد من رغبتك في إعادة ضبط واختيار جدول يدوي جديد؟' : 'Are you sure you want to reset your custom schedule selections?')) {
      state.manualSchedule = {};
      saveStateToStorage();
      renderManualStatusBanner();
      renderManualDoctorGroups();
      renderManualCoursesPicker();
      renderManualTimetable();
      showToast(isAr ? 'تم إعادة ضبط الجدول اليدوي' : 'Custom schedule reset.', 'info');
    }
  }

  /**
   * Renders the top status banner in Tab 4
   */
  function renderManualStatusBanner() {
    const banner = document.getElementById('manual-status-banner');
    if (!banner) return;

    const isAr = state.currentLang === 'ar';
    const totalCourses = state.courses.length;
    const selectedEntries = Object.values(state.manualSchedule);
    const selectedCount = selectedEntries.length;

    // Group by courseId to detect multiple groups selected for same subject
    const courseGroupsMap = {};
    selectedEntries.forEach(g => {
      courseGroupsMap[g.courseId] = (courseGroupsMap[g.courseId] || []);
      courseGroupsMap[g.courseId].push(g);
    });

    const uniqueCoursesCount = Object.keys(courseGroupsMap).length;
    const multiGroupCourses = Object.entries(courseGroupsMap).filter(([cid, grps]) => grps.length > 1);
    const hasMultiGroup = multiGroupCourses.length > 0;
    const conflictResult = checkManualConflicts();
    const hasConflict = conflictResult.hasConflict;

    const allSessions = [];
    selectedEntries.forEach(grp => {
      (grp.sessions || []).forEach(s => allSessions.push(s));
    });
    const daysSet = new Set(allSessions.map(s => s.day));

    const multiWarnText = hasMultiGroup
      ? `${getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لنفس المقرر' : 'Multiple groups selected for this subject')} <span>${isAr ? `تنبيه: تم اختيار أكثر من مجموعة لنفس المقرر (${multiGroupCourses.map(([cid, grps]) => `${grps[0].courseName || cid} [${grps.map(g => g.group).join(', ')}]`).join('، ')})` : `Notice: More than one group selected for (${multiGroupCourses.map(([cid, grps]) => `${grps[0].courseCode || cid} [${grps.map(g => g.group).join(', ')}]`).join(', ')})`}</span>`
      : '';

    // Check if any selected group has an avoided doctor
    const avoidedDocsInSchedule = [];
    selectedEntries.forEach(grp => {
      const courseObj = state.courses.find(c => c.id === grp.courseId) || { id: grp.courseId, code: grp.courseCode, name: grp.courseName };
      const summary = getGroupDoctorPrefSummary(courseObj, grp);
      if (summary.hasAvoid) {
        summary.ratedDocs.filter(d => d.rating === 'avoid').forEach(d => {
          if (!avoidedDocsInSchedule.includes(d.doctor)) avoidedDocsInSchedule.push(d.doctor);
        });
      }
    });

    const avoidedNotice = avoidedDocsInSchedule.length > 0
      ? `<div style="font-size: 0.76rem; color: #EF4444; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
           <span>🚫</span>
           <span>${isAr ? `تنبيه: يتضمن جدولك دكتوراً قمت باستبعاده (${avoidedDocsInSchedule.join('، ')}) - مسموح به في الوضع اليدوي.` : `Notice: Your custom schedule includes an avoided doctor (${avoidedDocsInSchedule.join(', ')}) - allowed in manual mode.`}</span>
         </div>`
      : '';

    if (hasConflict) {
      if (conflictResult.hasHardConflict) {
        banner.className = 'manual-status-banner is-conflict';
        banner.innerHTML = `
          <div class="manual-status-main">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span>⚠️</span>
              <span style="font-weight: 800;">${isAr ? `يوجد تعارض في الجدول (${conflictResult.conflicts.filter(c => c.severity === 'danger').length} تعارض)` : `Time Conflict Detected (${conflictResult.conflicts.filter(c => c.severity === 'danger').length} Clash)`}</span>
            </div>
            <div style="font-size: 0.8rem; font-weight: 500; opacity: 0.95; margin-top: 2px;">
              ${(conflictResult.conflicts.find(c => c.severity === 'danger') || conflictResult.conflicts[0]).detail}
            </div>
            ${hasMultiGroup ? `<div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; margin-top: 4px;">${multiWarnText}</div>` : ''}
            ${avoidedNotice}
          </div>
          <div class="manual-status-stats">
            <span>📚 ${uniqueCoursesCount} / ${totalCourses} ${isAr ? 'مقررات' : 'Courses'} (${selectedCount} ${isAr ? 'مجموعات' : 'Groups'})</span>
            <span>📅 ${daysSet.size} ${isAr ? 'أيام نزول' : 'Days'}</span>
          </div>
        `;
      } else {
        // Soft conflict: Same doctor & subject lecture clash (YELLOW NOT RED)
        banner.className = 'manual-status-banner is-warning';
        banner.innerHTML = `
          <div class="manual-status-main">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span>⚠️</span>
              <span style="font-weight: 800;">${isAr ? `تنبيه: محاضرة مشتركة لنفس الدكتور (${conflictResult.conflicts.length})` : `Notice: Combined Lecture with Same Doctor (${conflictResult.conflicts.length})`}</span>
            </div>
            <div style="font-size: 0.8rem; font-weight: 500; opacity: 0.95; margin-top: 2px;">
              ${conflictResult.conflicts[0].detail}
            </div>
            ${hasMultiGroup ? `<div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; margin-top: 4px;">${multiWarnText}</div>` : ''}
            ${avoidedNotice}
          </div>
          <div class="manual-status-stats">
            <span>📚 ${uniqueCoursesCount} / ${totalCourses} ${isAr ? 'مقررات' : 'Courses'} (${selectedCount} ${isAr ? 'مجموعات' : 'Groups'})</span>
            <span>📅 ${daysSet.size} ${isAr ? 'أيام نزول' : 'Days'}</span>
          </div>
        `;
      }
    } else if (selectedCount === 0) {
      banner.className = 'manual-status-banner';
      banner.innerHTML = `
        <div class="manual-status-main">
          <span>✍️</span>
          <span>${isAr ? 'ابدأ باختيار دكتورك المفضل أو حدد المجموعات لكل مقرر من القوائم أدناه.' : 'Start by selecting your favorite doctor or picking groups for each course below.'}</span>
        </div>
        <div class="manual-status-stats">
          <span>📚 0 / ${totalCourses} ${isAr ? 'مقررات' : 'Courses'}</span>
        </div>
      `;
    } else if (hasMultiGroup) {
      banner.className = 'manual-status-banner is-warning';
      banner.innerHTML = `
        <div class="manual-status-main">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            ${multiWarnText}
          </div>
          <div style="font-size: 0.78rem; opacity: 0.9; margin-top: 2px;">
            ${isAr ? 'الجدول خالٍ من التعارض الزمني لكن تم اختيار أكثر من مجموعة لمادة واحدة.' : 'No time clashes, but multiple groups are selected for the same course.'}
          </div>
          ${avoidedNotice}
        </div>
        <div class="manual-status-stats">
          <span>📚 ${uniqueCoursesCount} / ${totalCourses} ${isAr ? 'مقررات' : 'Courses'} (${selectedCount} ${isAr ? 'مجموعات' : 'Groups'})</span>
          <span>📅 ${daysSet.size} ${isAr ? 'أيام' : 'Days'}</span>
        </div>
      `;
    } else if (uniqueCoursesCount < totalCourses) {
      banner.className = 'manual-status-banner is-clean';
      banner.innerHTML = `
        <div class="manual-status-main">
          <span>✅</span>
          <span>${isAr ? `الجدول خالٍ من التعارض حتى الآن (${uniqueCoursesCount} من ${totalCourses} مواد)` : `Conflict-Free so far (${uniqueCoursesCount} of ${totalCourses} courses)`}</span>
          ${avoidedNotice}
        </div>
        <div class="manual-status-stats">
          <span>📚 ${uniqueCoursesCount} / ${totalCourses} ${isAr ? 'مقررات' : 'Courses'}</span>
          <span>📅 ${daysSet.size} ${isAr ? 'أيام' : 'Days'}</span>
        </div>
      `;
    } else {
      banner.className = 'manual-status-banner is-clean';
      banner.innerHTML = `
        <div class="manual-status-main">
          <span>🎉</span>
          <span>${isAr ? 'اكتمل جدولك بالكامل وهو خالٍ من أي تعارض بنسبة 100%!' : 'Your schedule is 100% complete and completely conflict-free!'}</span>
          ${avoidedNotice}
        </div>
        <div class="manual-status-stats">
          <span>📚 ${uniqueCoursesCount} / ${totalCourses} ${isAr ? 'مقررات' : 'Courses'}</span>
          <span>📅 ${daysSet.size} ${isAr ? 'أيام' : 'Days'}</span>
        </div>
      `;
    }
  }

  /**
   * Builds a synthetic solution object representing the current manual schedule
   */
  function getManualSolution() {
    const isAr = state.currentLang === 'ar';
    const allSessions = [];
    const selectedGroups = [];
    const courseGroupsMap = {};

    Object.entries(state.manualSchedule).forEach(([key, grp]) => {
      courseGroupsMap[grp.courseId] = (courseGroupsMap[grp.courseId] || []);
      courseGroupsMap[grp.courseId].push(grp.group);

      selectedGroups.push({
        courseId: grp.courseId,
        courseName: grp.courseName,
        courseCode: grp.courseCode,
        group: grp.group,
        color: grp.color,
        instructors: grp.instructors
      });

      const courseObj = state.courses.find(c => c.id === grp.courseId) || { id: grp.courseId, code: grp.courseCode, name: grp.courseName };

      (grp.sessions || []).forEach(s => {
        const docPref = s.instructor ? getDoctorPrefForCourse(courseObj, s.instructor) : 'neutral';
        allSessions.push({
          ...s,
          courseId: grp.courseId,
          courseName: grp.courseName,
          courseCode: grp.courseCode,
          group: grp.group,
          color: grp.color,
          doctorPref: docPref
        });
      });
    });

    const conflictResult = checkManualConflicts();
    const daysSet = new Set(allSessions.map(s => s.day));
    const multiGroupCourses = Object.entries(courseGroupsMap).filter(([cid, grps]) => grps.length > 1);

    const badges = [
      { text: isAr ? '✍️ جدول يدوي' : '✍️ Custom Schedule', type: 'manual' }
    ];

    if (conflictResult.hasHardConflict) {
      badges.push({ text: isAr ? `⚠️ ${conflictResult.conflicts.filter(c => c.severity === 'danger').length} تعارض` : `⚠️ ${conflictResult.conflicts.filter(c => c.severity === 'danger').length} Clashes`, type: 'avoid' });
    } else if (conflictResult.hasSoftConflict) {
      badges.push({ text: isAr ? `⚠️ ${conflictResult.conflicts.length} محاضرة مشتركة` : `⚠️ ${conflictResult.conflicts.length} Combined Lecture(s)`, type: 'mandate' });
    } else {
      badges.push({ text: isAr ? '✅ بدون تعارض' : '✅ Conflict-Free', type: 'best' });
    }

    if (multiGroupCourses.length > 0) {
      badges.push({
        text: isAr ? `⚠️ ${multiGroupCourses.length} مواد بأكثر من مجموعة` : `⚠️ ${multiGroupCourses.length} Multi-Group Courses`,
        type: conflictResult.hasHardConflict ? 'avoid' : 'mandate'
      });
    }

    const mergedAllSessions = ScheduleRenderer.mergeSameDoctorLectures ? ScheduleRenderer.mergeSameDoctorLectures(allSessions) : allSessions;

    return {
      id: 'sol_manual_custom',
      isManual: true,
      rank: isAr ? 'يدوي' : 'Custom',
      badges,
      compositeScore: conflictResult.hasHardConflict ? -1000 : (conflictResult.hasSoftConflict ? 800 : 1000),
      totalGapSlots: 0,
      activeDaysCount: daysSet.size,
      activeDays: Array.from(daysSet),
      sessions: mergedAllSessions,
      selectedGroups,
      blockedTimes: state.blockedTimes
    };
  }

  /**
   * Renders the weekly timetable preview for the manual schedule in Tab 4
   */
  function renderManualTimetable() {
    const container = document.getElementById('manual-timetable-render-container');
    if (!container) return;

    const sol = getManualSolution();
    const isAr = state.currentLang === 'ar';

    if (!sol.sessions || sol.sessions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>${isAr ? 'لم يتم اختيار أي مجموعة بعد' : 'No Groups Selected Yet'}</h3>
          <p>${isAr ? 'اختر دكتوراً أو حدد مجموعات للمقررات من الأعلى لمعاينة جدولك الأسبوعي هنا.' : 'Select groups above to see your weekly timetable update here in real-time.'}</p>
        </div>
      `;
      return;
    }

    const conflictResult = checkManualConflicts();
    let prefixHtml = '';
    if (conflictResult.hasConflict) {
      if (conflictResult.hasHardConflict) {
        prefixHtml = `
          <div class="session-conflict-alert">
            <span>⚠️</span>
            <span><strong>${isAr ? 'تنبيه تعارض في الجدول:' : 'Schedule Conflict Alert:'}</strong> ${conflictResult.conflicts.filter(c => c.severity === 'danger').map(c => c.detail).join(' • ')}</span>
          </div>
        `;
      } else {
        prefixHtml = `
          <div class="session-conflict-alert is-warning">
            <span>⚠️</span>
            <span><strong>${isAr ? 'تنبيه محاضرة مشتركة لنفس الدكتور:' : 'Combined Lecture Notice:'}</strong> ${conflictResult.conflicts.map(c => c.detail).join(' • ')}</span>
          </div>
        `;
      }
    }

    ScheduleRenderer.renderTimetable(sol, container, state.currentLang, state.blockedTimes);
    if (prefixHtml) {
      container.insertAdjacentHTML('afterbegin', prefixHtml);
    }
  }

  /**
   * Copies the manual schedule into Tab 3 solutions and switches to Tab 3
   */
  function applyManualToTimetableTab() {
    const isAr = state.currentLang === 'ar';
    const sol = getManualSolution();

    if (!sol.sessions || sol.sessions.length === 0) {
      showToast(isAr ? 'برجاء اختيار مجموعة واحدة على الأقل أولاً.' : 'Please select at least one course group first.', 'error');
      return;
    }

    state.solutions = [sol, ...state.solutions.filter(s => s.id !== 'sol_manual_custom')];
    state.activeSolutionIndex = 0;

    switchTab('timetable');
    renderSolutionsSelector();
    renderCurrentSolution();

    showToast(isAr ? 'تم تحميل جدولك اليدوي في شاشة الجداول النهائية!' : 'Loaded your custom schedule into Timetable Results!', 'success');
  }

  /**
   * Exports the manual timetable to PNG, ICS, or Print
   */
  function exportManualTimetable(type) {
    const isAr = state.currentLang === 'ar';
    const sol = getManualSolution();

    if (!sol.sessions || sol.sessions.length === 0) {
      showToast(isAr ? 'لا يوجد جدول مخصص لتصديره.' : 'No custom schedule to export.', 'error');
      return;
    }

    if (type === 'png') {
      ScheduleExporter.exportToPng(sol);
    } else if (type === 'ics') {
      ScheduleExporter.downloadIcsFile(sol, 'custom_college_timetable.ics');
    } else if (type === 'print') {
      ScheduleExporter.printTimetable();
    }
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
      const titleText = isAr ? `الخيار #${sol.rank}` : `Option #${sol.rank}`;
      const gapText = sol.totalGapSlots === 0
        ? (isAr ? '⚡ 0 فترات فراغ' : '⚡ 0 Gaps')
        : (isAr ? `☕ ${sol.totalGapSlots} فراغ` : `☕ ${sol.totalGapSlots} Gaps`);
      const daysText = isAr ? `${sol.activeDaysCount} أيام` : `${sol.activeDaysCount} Days`;

      html += `
        <button class="sol-chip ${isActive ? 'active' : ''}" onclick="App.selectSolution(${idx})" title="${titleText}: ${gapText}, ${daysText}">
          <span class="sol-chip-title">${titleText}</span>
          <span class="sol-chip-meta">${gapText} • ${daysText}</span>
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
    modal.style.setProperty('display', 'flex', 'important');
  }

  function closeGuideModal() {
    const modal = document.getElementById('guide-modal');
    if (modal) {
      modal.style.setProperty('display', 'none', 'important');
    }
    try { localStorage.setItem('sched_guide_dismissed', 'true'); } catch(e) {}
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

  window.App = {
    init,
    removeCourse,
    updateCourseColor,
    setDoctorPreference,
    handleDoctorPrefClick,
    selectSolution,
    updateDraftBlock,
    deleteDraftBlock,
    saveImageDraftCourse,
    toggleBlockedSlot,
    applyBlockedPreset,
    removeBlockedTime,
    openGuideModal,
    closeGuideModal,
    loadSampleCourses,
    findSchedules: runOptimizer,
    selectManualGroup,
    deselectManualGroupFromTimetable,
    clearManualSchedule,
    applyManualToTimetableTab,
    exportManualTimetable,
    renderManualMode
  };

  return window.App;
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
