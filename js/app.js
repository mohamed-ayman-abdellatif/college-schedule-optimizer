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
    manualSearchQuery: '',
    manualHideAvoided: true,
    timetableFilters: {
      maxDays: 'any',
      maxGaps: 'any',
      maxClassesPerDay: 'any',
      maxOptions: 'all',
      preset: 'balanced'
    },
    filteredSolutions: [],
    filterMismatch: false,
    manualCustomizeDocTA: false,
    mixMatchSelections: {},
    mixMatchExpandedCourses: {}
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
      uploadPdfTab: '📄 Upload PDF Timetable',
      uploadPhotoTab: 'Upload Schedule Photo',
      importCardSubtitle: 'Paste HTML from your college portal, upload a PDF timetable, or upload a schedule photo',
      pdfDropzoneTitle: 'Drag & drop your PDF timetable here, or click to browse',
      pdfDropzoneSub: 'Supports aSc Timetables & AAST university schedule PDFs (all pages & groups)',
      pdfParsingPages: 'Extracting pages from PDF...',
      togglePdfText: 'Or paste copied text / OCR from PDF',
      pdfTextPlaceholder: 'Paste copied text or OCR output from the PDF timetable here...',
      parsePdfTextBtn: 'Parse PDF Text',
      pdfModalTitle: 'Select Courses to Import',
      pdfModalSubtitle: 'Choose which courses from your timetable PDF you want to add to your schedule:',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      importSelectedCourses: 'Import Selected Courses',
      cancelBtn: 'Cancel',
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
      freeDaysTitle: 'Target Free Days (Days Off)',
      freeDaysDesc: 'Select the days of the week you prefer to take completely off',
      freeDaysLabel: 'Target Free Days (Days Completely Off):',
      blockedTimesTitle: 'Prohibited / Blocked Times (Training & Busy Hours)',
      blockedTimesDesc: 'Prohibit specific times (e.g. Saturday 8 AM training). The optimizer will guarantee zero classes are scheduled during these times!',
      blockedPresetsLabel: 'Quick Presets:',
      presetSatTraining: '⚽ Block Saturday 08:30 - 10:20 (Training)',
      presetEvenings: '🌙 Block All Slots After 4 PM',
      presetClearBlocked: 'Clear All Blocked Slots',
      clearCacheBtn: 'Clear Cache & Reset',
      freshStartBtn: 'Fresh Start (Reset All)',
      resetAllPrefsBtn: 'Reset Preferences & Blocked Slots',
      exportTxt: 'Export TXT',
      copyTxt: 'Copy Codes',
      scheduleTxtModalTitle: 'Schedule Groups Text',
      scheduleTxtHelp: 'Format: Course Code: Group Number/Letter',
      txtCurrentSchedule: 'This Schedule',
      txtAllSchedules: 'All Schedules',
      copyTxtBtn: '📋 Copy to Clipboard',
      downloadTxtBtn: '💾 Download .txt File',
      txtCopiedToast: 'Schedule text copied to clipboard! 📋',
      txtDownloadedToast: 'Schedule exported to text file! 📄',
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
      arrowKeysHint: 'Use keyboard arrows',
      prevScheduleBtn: '◀ Previous',
      nextScheduleBtn: 'Next ▶',
      prevSchedule: 'Previous',
      nextSchedule: 'Next',
      schedulesFilterTitle: 'Schedules Filter & Optimization Priorities',
      schedulesFilterDesc: 'Strict non-negotiable filters for campus days, gaps, and daily workload, plus instant ranking goals.',
      filterMaxDays: 'Max Days / Week:',
      filterMaxGaps: 'Max Gap Slots:',
      filterMaxClasses: 'Max Classes / Day:',
      filterMaxOptions: 'Max Schedules to Show:',
      optAllSchedules: 'All Schedules',
      optTop5: 'Top 5 Schedules',
      optTop15: 'Top 15 Schedules',
      optTop25: 'Top 25 Schedules',
      optTop50: 'Top 50 Schedules',
      optTop100: 'Top 100 Schedules',
      optTop250: 'Top 250 Schedules',
      optAny: 'Any (No restriction)',
      rankingPresetLabel: 'Ranking Priority (Choose 1 of 4):',
      presetMinDays: 'Minimum Days',
      presetMinGaps: 'Minimal Gaps',
      presetEarly: 'Early Schedule',
      presetBalanced: 'Balanced',
      filterMismatchBannerTitle: 'Non-negotiable Filter Mismatch: Showing 1 Unfiltered Schedule for Inspection',
      filterConflictModalTitle: 'No Schedules Match Your Filters!',
      filterConflictModalDesc: 'None of the generated schedules satisfy your strict non-negotiable filters. We have provided 1 unfiltered schedule on the timetable so you can inspect where the restriction is exceeded.',
      resetFiltersBtn: '↺ Reset Filters',
      viewUnfilteredBtn: 'View Unfiltered Schedule',
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
      manualHideAvoidedLabel: 'Hide Avoided Doctors & Keep Only Mandated Doctors (When Set)',
      manualHideAvoidedDesc: 'Automatically hides groups taught by avoided professors (🚫) and, if a course has mandated professors (🌟🔒), only shows their groups.',
      clearManualSchedule: 'Reset Schedule',
      viewInTimetable: 'View in Timetable Results',
      manualDocSearchTitle: 'Explore by Doctor / Professor',
      manualDocSearchDesc: 'Choose any doctor to reveal all their lecture groups, days, times, and quickly add them to your schedule',
      selectDoctorLabel: 'Select Doctor / Professor:',
      searchDoctorLabel: 'Or Search Doctor / Course:',
      manualCourseGroupsTitle: 'Course Groups & Instant Conflict Checker',
      manualCourseGroupsDesc: 'Pick one group for each course. Groups with time clashes with your current picks will be highlighted in red.',
      manualCustomizeDocTALabel: 'Customize Doctor, Section & Lab Independently',
      manualCustomizeDocTADesc: 'Choose Doctor (Lectures), Section, and Lab separately for each group, or select entire groups together.',
      manualDoctorComponentTitle: 'Doctor (Lectures)',
      manualSectionComponentTitle: 'Section',
      manualLabComponentTitle: 'Lab',
      manualTaComponentTitle: 'TA (Sections & Labs)',
      manualAddDoctor: '➕ Add Doctor',
      manualAddSection: '➕ Add Section',
      manualAddLab: '➕ Add Lab',
      manualAddTA: '➕ Add TA',
      manualDoctorInSchedule: '✓ Doctor In Timetable',
      manualSectionInSchedule: '✓ Section In Timetable',
      manualLabInSchedule: '✓ Lab In Timetable',
      manualTaInSchedule: '✓ TA In Timetable',
      manualSelectEntireGroup: '➕ Select Entire Group',
      manualDeselectEntireGroup: '❌ Deselect Entire Group',
      manualTimetableTitle: 'Your Custom Timetable Preview',
      manualTimetableDesc: 'Interactive 16-period schedule showing your custom selections and any time overlaps',
      mixMatchTitle: 'Mix & Match: Custom Doctors & TAs',
      mixMatchDesc: 'Freely choose lecture professors from one group and TAs for sections/labs from another group with instant clash checking.',
      mixMatchResetBtn: '↺ Reset Selections',
      mixMatchApplyManualBtn: 'Apply to Manual Timetable',
      mixMatchSaveGroupBtn: '💾 Save as Course Custom Group',
      mixMatchTimetableTitle: 'Live Mixed Schedule Preview',
      mixMatchTimetableDesc: 'Live timetable showing your mixed lecture, section, and lab picks across all courses',
      mixMatchExpandAll: '📂 Expand All',
      mixMatchCollapseAll: '📁 Collapse All',
      mixMatchJumpToTimetable: '📅 Timetable Grid ⬇️',
      mixMatchJumpToCourses: '⬆️ Back to Course Pickers',
      mixMatchAllCourses: 'All Courses',
      mixMatchSelectedCount: 'Selected',
      mixMatchNoPicks: 'No picks yet',
      mixMatchReady: 'Complete ✓',
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
      uploadPdfTab: '📄 رفع جدول PDF',
      uploadPhotoTab: 'رفع صورة / سكرين شوت للجدول',
      importCardSubtitle: 'الصق كود HTML من موقع الكلية، أو ارفع ملف PDF للجدول، أو ارفع صورة الجدول',
      pdfDropzoneTitle: 'اسحب وأفلت ملف PDF الخاص بالجدول هنا، أو اضغط للاختيار',
      pdfDropzoneSub: 'يدعم جداول aSc Timetables وجداول الأكاديمية البحرية AAST (كل الصفحات والمجموعات)',
      pdfParsingPages: 'جاري استخراج الصفحات من ملف PDF...',
      togglePdfText: 'أو الصق النص المنسوخ / OCR من ملف PDF',
      pdfTextPlaceholder: 'الصق النص المنسوخ أو ناتج OCR من ملف PDF هنا...',
      parsePdfTextBtn: 'تحليل نص الـ PDF',
      pdfModalTitle: 'اختر المواد المراد إضافتها',
      pdfModalSubtitle: 'حدد المواد التي تريد تسجيلها من جدول الـ PDF:',
      selectAll: 'تحديد الكل',
      deselectAll: 'إلغاء تحديد الكل',
      importSelectedCourses: 'إضافة المواد المحددة',
      cancelBtn: 'إلغاء',
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
      freeDaysTitle: 'أيام الإجازة المطلوبة (أيام بدون نزول بالكامل)',
      freeDaysDesc: 'حدد أيام الأسبوع التي تفضل أن تكون إجازة تامة بدون أي حصص',
      freeDaysLabel: 'أيام إجازة مطلوبة بالكامل (بدون نزول):',
      blockedTimesTitle: 'الأوقات المحظورة (مواعيد التمرين والانشغالات)',
      blockedTimesDesc: 'احظر أوقات محددة (مثل تدريب السبت الساعة 8 صباحاً). يضمن المحسن عدم وضع أي حصة في هذه الفترات نهائياً!',
      blockedPresetsLabel: 'إعدادات سريعة جاهزة:',
      presetSatTraining: '⚽ حظر تدريب السبت 08:30 - 10:20',
      presetEvenings: '🌙 حظر الفترات المسائية بعد 4 عصراً',
      presetClearBlocked: 'مسح جميع الأوقات المحظورة',
      clearCacheBtn: 'تفريغ الذاكرة وإعادة الضبط',
      freshStartBtn: 'بداية جديدة (إعادة ضبط شاملة)',
      resetAllPrefsBtn: 'إعادة ضبط التفضيلات والأوقات المحظورة',
      exportTxt: 'تصدير ملف نصي (TXT)',
      copyTxt: 'نسخ الأكواد',
      scheduleTxtModalTitle: 'نص مجموعات المقررات',
      scheduleTxtHelp: 'التنسيق: كود المادة: رقم أو حرف المجموعة',
      txtCurrentSchedule: 'هذا الجدول',
      txtAllSchedules: 'جميع الجداول',
      copyTxtBtn: '📋 نسخ للحافظة',
      downloadTxtBtn: '💾 تحميل كملف نصي (.txt)',
      txtCopiedToast: 'تم نسخ نص الجدول للحافظة بنجاح! 📋',
      txtDownloadedToast: 'تم تصدير الجدول كملف نصي بنجاح! 📄',
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
      arrowKeysHint: 'استخدم أسهم الكيبورد',
      prevScheduleBtn: '◀ السابق',
      nextScheduleBtn: 'التالي ▶',
      prevSchedule: 'السابق',
      nextSchedule: 'التالي',
      schedulesFilterTitle: 'تصفية الجداول وأولويات الترتيب',
      schedulesFilterDesc: 'فلاتر إلزامية غير قابلة للتفاوض لعدد أيام النزول وفترات الفراغ والعبء اليومي مع ترتيب فوري.',
      filterMaxDays: 'أقصى عدد أيام نزول / أسبوع:',
      filterMaxGaps: 'أقصى فترات فراغ (Gaps):',
      filterMaxClasses: 'أقصى فترات/حصص باليوم:',
      filterMaxOptions: 'أقصى عدد جداول معروضة:',
      optAllSchedules: 'جميع الجداول (بدون تقييد)',
      optTop5: 'أفضل 5 جداول',
      optTop15: 'أفضل 15 جدول',
      optTop25: 'أفضل 25 جدول',
      optTop50: 'أفضل 50 جدول',
      optTop100: 'أفضل 100 جدول',
      optTop250: 'أفضل 250 جدول',
      optAny: 'أي عدد (بدون تقييد)',
      rankingPresetLabel: 'الأولوية في ترتيب الجداول (اختر ١ من ٤):',
      presetMinDays: 'أقل عدد أيام نزول',
      presetMinGaps: 'أقل فترات فراغ',
      presetEarly: 'انتهاء مبكر لليوم',
      presetBalanced: 'متوازن وشامل',
      filterMismatchBannerTitle: 'تعارض مع الفلاتر الإلزامية: يتم عرض جدول واحد بدون تصفية لمعرفة سبب الاستبعاد',
      filterConflictModalTitle: 'لا يوجد جدول يطابق الفلاتر المحددة!',
      filterConflictModalDesc: 'لا يوجد أي جدول يحقق فلاترك الإلزامية الصارمة. قمنا بعرض جدول واحد بدون تصفية في النتائج لتتمكن من معرفة الشرط المتجاوز وتعديل الفلتر.',
      resetFiltersBtn: '↺ إعادة ضبط الفلاتر',
      viewUnfilteredBtn: 'معاينة الجدول غير المصفى',
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
      manualHideAvoidedLabel: 'إخفاء الدكاترة المستبعدين وعرض الدكاترة الإجباريين فقط للمادة',
      manualHideAvoidedDesc: 'يقوم تلقائياً بإخفاء مجموعات الدكاترة المستبعدين (🚫)، وفي حال وجود دكتور إجباري (🌟🔒) يتم حصر العرض على مجموعاته فقط.',
      clearManualSchedule: 'إعادة ضبط الجدول',
      viewInTimetable: 'عرض في شاشة الجداول',
      manualDocSearchTitle: 'استكشاف المجموعات حسب الدكتور',
      manualDocSearchDesc: 'اختر أي دكتور لمعرفة كافة المجموعات التي يقوم بتدريسها ومواعيدها وإضافتها لجدولك بضغطة واحدة',
      selectDoctorLabel: 'اختر الدكتور / الأستاذ:',
      searchDoctorLabel: 'أو ابحث بالاسم / المادة:',
      manualCourseGroupsTitle: 'مجموعات المقررات والفحص الفوري للتعارض',
      manualCourseGroupsDesc: 'اختر مجموعة واحدة لكل مادة. المجموعات التي تتعارض مع اختياراتك الحالية ستظهر باللون الأحمر فوراً.',
      manualCustomizeDocTALabel: 'تخصيص الدكتور والسكشن والمعمل بشكل مستقل',
      manualCustomizeDocTADesc: 'اختر الدكتور (المحاضرات) والسكشن والمعمل بشكل منفصل لكل مجموعة، أو اختر المجموعة بالكامل.',
      manualDoctorComponentTitle: 'الدكتور (المحاضرات)',
      manualSectionComponentTitle: 'السكشن (التمارين)',
      manualLabComponentTitle: 'المعمل',
      manualTaComponentTitle: 'المعيد (السكاشن والمعامل)',
      manualAddDoctor: '➕ إضافة الدكتور',
      manualAddSection: '➕ إضافة السكشن',
      manualAddLab: '➕ إضافة المعمل',
      manualAddTA: '➕ إضافة المعيد',
      manualDoctorInSchedule: '✓ مضاف للجدول',
      manualSectionInSchedule: '✓ مضاف للجدول',
      manualLabInSchedule: '✓ مضاف للجدول',
      manualTaInSchedule: '✓ مضاف للجدول',
      manualSelectEntireGroup: '➕ اختيار المجموعة بالكامل',
      manualDeselectEntireGroup: '❌ إلغاء المجموعة بالكامل',
      manualTimetableTitle: 'معاينة جدولك اليدوي المخصص',
      manualTimetableDesc: 'جدول تفاعلي 16 فترة يعرض اختياراتك اليدوية وأي تعارضات بالألوان الفورية',
      mixMatchTitle: 'دمج المجموعات: اختيار دكتور ومعيد من مجموعات مختلفة',
      mixMatchDesc: 'حرية كاملة لاختيار دكتور المحاضرة من مجموعة، والمعيد للسكشن أو المعمل من مجموعة أخرى مع فحص فوري للتعارض.',
      mixMatchResetBtn: '↺ إعادة ضبط الاختيارات',
      mixMatchApplyManualBtn: 'تطبيق في الجدول اليدوي',
      mixMatchSaveGroupBtn: '💾 حفظ كمجموعة مخصصة للمقرر',
      mixMatchTimetableTitle: 'معاينة حية للجدول المدمج',
      mixMatchTimetableDesc: 'عرض مباشر يوضح اختياراتك المدمجة من محاضرات وسكاشن ومعامل لجميع المواد',
      mixMatchExpandAll: '📂 توسيع الكل',
      mixMatchCollapseAll: '📁 طي الكل',
      mixMatchJumpToTimetable: '📅 معاينة الجدول ⬇️',
      mixMatchJumpToCourses: '⬆️ العودة لاختيار المواد',
      mixMatchAllCourses: 'جميع المواد',
      mixMatchSelectedCount: 'محدد',
      mixMatchNoPicks: 'لم يتم الاختيار',
      mixMatchReady: 'مكتمل ✓',
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
      localStorage.setItem('sched_manual_hide_avoided', JSON.stringify(state.manualHideAvoided !== false));
      localStorage.setItem('sched_manual_customize_doc_ta', JSON.stringify(state.manualCustomizeDocTA === true));
      localStorage.setItem('sched_timetable_filters', JSON.stringify(state.timetableFilters || {}));
      localStorage.setItem('sched_mixmatch_selections', JSON.stringify(state.mixMatchSelections || {}));
      localStorage.setItem('sched_is_sample', JSON.stringify(state.isSampleData === true));
      localStorage.setItem('sched_theme', state.currentTheme);
      localStorage.setItem('sched_lang', state.currentLang);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  function loadStateFromStorage() {
    try {
      const storedIsSample = localStorage.getItem('sched_is_sample');
      if (storedIsSample !== null) {
        state.isSampleData = (storedIsSample === 'true');
      }
      const storedCourses = localStorage.getItem('sched_courses');
      if (storedCourses) {
        state.courses = JSON.parse(storedCourses);
        // Self-repair any sessions affected by old Period 8 bug (startSlot 15 -> startSlot 1)
        state.courses.forEach(c => {
          (c.groups || []).forEach(g => {
            (g.sessions || []).forEach(s => {
              if ((s.startSlot === 15 && s.endSlot === 16) && (s.periodNum === 8 || !s.periodNum)) {
                s.startSlot = 1;
                s.endSlot = 2;
                s.periodNum = 1;
              }
            });
          });
        });
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
              const suffix = v.componentType && v.componentType !== 'all' ? `:::${v.componentType}` : (k.includes(':::doctor') ? ':::doctor' : (k.includes(':::section') ? ':::section' : (k.includes(':::lab') ? ':::lab' : (k.includes(':::ta') ? ':::ta' : ''))));
              const properKey = `${v.courseId}:::${v.group}${suffix}`;
              migrated[properKey] = v;
            }
          }
          state.manualSchedule = migrated;
        } catch (e) {
          state.manualSchedule = {};
        }
      }

      const storedHideAvoided = localStorage.getItem('sched_manual_hide_avoided');
      if (storedHideAvoided !== null) {
        try {
          state.manualHideAvoided = JSON.parse(storedHideAvoided);
        } catch (e) {
          state.manualHideAvoided = true;
        }
      }

      const storedCustomizeDocTA = localStorage.getItem('sched_manual_customize_doc_ta');
      if (storedCustomizeDocTA !== null) {
        try {
          state.manualCustomizeDocTA = JSON.parse(storedCustomizeDocTA) === true;
        } catch (e) {
          state.manualCustomizeDocTA = false;
        }
      } else {
        state.manualCustomizeDocTA = false;
      }

      const storedFilters = localStorage.getItem('sched_timetable_filters');
      if (storedFilters) {
        try {
          state.timetableFilters = Object.assign(state.timetableFilters, JSON.parse(storedFilters));
        } catch (e) {}
      }

      const storedMixMatch = localStorage.getItem('sched_mixmatch_selections');
      if (storedMixMatch) {
        try {
          state.mixMatchSelections = JSON.parse(storedMixMatch);
        } catch (e) {}
      }

      const storedPrefs = localStorage.getItem('sched_prefs');
      if (storedPrefs) state.preferences = Object.assign(state.preferences, JSON.parse(storedPrefs));
      if (state.preferences && Array.isArray(state.preferences.freeDays)) {
        if (state.preferences.freeDays.length >= 5) {
          state.preferences.freeDays = [];
        }
      }

      const storedBlocked = localStorage.getItem('sched_blocked_times');
      if (storedBlocked) {
        try {
          const parsedBlocked = JSON.parse(storedBlocked);
          if (Array.isArray(parsedBlocked)) {
            state.blockedTimes = parsedBlocked.filter(b => b && b.day && (b.slot || (b.startSlot && b.endSlot)));
          } else {
            state.blockedTimes = [];
          }
        } catch (e) {
          state.blockedTimes = [];
        }
      }

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
      renderSolutionsSelector();
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

    // PDF Upload & Dropzone
    const pdfDropzone = document.getElementById('pdf-dropzone');
    const pdfInput = document.getElementById('input-schedule-pdf');

    pdfDropzone?.addEventListener('click', () => pdfInput?.click());
    pdfDropzone?.addEventListener('dragover', e => {
      e.preventDefault();
      pdfDropzone.classList.add('dragover');
    });
    pdfDropzone?.addEventListener('dragleave', () => pdfDropzone.classList.remove('dragover'));
    pdfDropzone?.addEventListener('drop', e => {
      e.preventDefault();
      pdfDropzone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
        handlePdfUpload(file);
      } else {
        showToast(state.currentLang === 'ar' ? 'يرجى اختيار ملف PDF صالح' : 'Please select a valid PDF file', 'error');
      }
    });

    pdfInput?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handlePdfUpload(file);
    });

    // Toggle PDF text paste box
    document.getElementById('btn-toggle-pdf-text')?.addEventListener('click', () => {
      const box = document.getElementById('pdf-text-container');
      if (box) {
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
      }
    });

    // Parse PDF text button
    document.getElementById('btn-parse-pdf-text')?.addEventListener('click', handlePdfTextParse);

    // PDF Course Selection Modal Events
    document.getElementById('btn-close-pdf-modal')?.addEventListener('click', closePdfCoursesModal);
    document.getElementById('btn-cancel-pdf-import')?.addEventListener('click', closePdfCoursesModal);
    document.getElementById('btn-pdf-select-all')?.addEventListener('click', () => setAllPdfCoursesChecked(true));
    document.getElementById('btn-pdf-deselect-all')?.addEventListener('click', () => setAllPdfCoursesChecked(false));
    document.getElementById('btn-confirm-pdf-import')?.addEventListener('click', confirmPdfImport);

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
    document.getElementById('btn-export-txt')?.addEventListener('click', () => {
      handleExportTxt('opt');
    });

    document.getElementById('btn-export-png')?.addEventListener('click', () => {
      const activeList = getActiveSolutions();
      const sol = activeList[state.activeSolutionIndex];
      if (sol) ScheduleExporter.exportToPng(sol);
      else showToast('No schedule selected to export', 'error');
    });

    document.getElementById('btn-print')?.addEventListener('click', () => {
      ScheduleExporter.printTimetable();
    });

    document.getElementById('btn-export-ics')?.addEventListener('click', () => {
      const activeList = getActiveSolutions();
      const sol = activeList[state.activeSolutionIndex];
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
        state.filteredSolutions = [];
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
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        handleTimetableArrowNavigation(e);
      }
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

    document.getElementById('btn-manual-export-txt')?.addEventListener('click', () => exportManualTimetable('txt'));
    document.getElementById('btn-manual-export-png')?.addEventListener('click', () => exportManualTimetable('png'));
    document.getElementById('btn-manual-export-ics')?.addEventListener('click', () => exportManualTimetable('ics'));
    document.getElementById('btn-manual-print')?.addEventListener('click', () => exportManualTimetable('print'));

    // Initialize Timetable Filter UI values
    const maxDaysEl = document.getElementById('filter-max-days');
    if (maxDaysEl) maxDaysEl.value = state.timetableFilters.maxDays || 'any';
    const maxGapsEl = document.getElementById('filter-max-gaps');
    if (maxGapsEl) maxGapsEl.value = state.timetableFilters.maxGaps || 'any';
    const maxClassesEl = document.getElementById('filter-max-classes-day');
    if (maxClassesEl) maxClassesEl.value = state.timetableFilters.maxClassesPerDay || 'any';
    const maxOptionsEl = document.getElementById('filter-max-options');
    if (maxOptionsEl) maxOptionsEl.value = state.timetableFilters.maxOptions || 'all';

    const curPreset = state.timetableFilters.preset || 'balanced';
    document.querySelectorAll('.preset-choice-card').forEach(card => card.classList.remove('is-active'));
    const activePresetCard = document.getElementById(`preset-card-${curPreset}`);
    if (activePresetCard) activePresetCard.classList.add('is-active');
    const curPresetRadio = document.querySelector(`input[name="ranking-preset"][value="${curPreset}"]`);
    if (curPresetRadio) curPresetRadio.checked = true;

    // Initialize Manual Mode Checkboxes
    const hideAvoidedCb = document.getElementById('check-manual-hide-avoided');
    if (hideAvoidedCb) {
      hideAvoidedCb.checked = state.manualHideAvoided !== false;
    }
    const customizeDocTaCb = document.getElementById('check-manual-customize-doc-ta');
    if (customizeDocTaCb) {
      customizeDocTaCb.checked = state.manualCustomizeDocTA === true;
    }
  }

  function switchTab(tabId) {
    state.currentTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(c => {
      c.style.display = c.id === `tab-${tabId}` ? 'block' : 'none';
    });

    // Auto-scroll active tab into view on mobile
    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeBtn && typeof activeBtn.scrollIntoView === 'function') {
      try {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch (e) {
        activeBtn.scrollIntoView(false);
      }
    }

    // When switching to Timetable Results tab, ensure content is rendered
    if (tabId === 'timetable') {
      if (state.solutions.length === 0 && state.courses.length > 0) {
        runOptimizer();
      } else {
        applyTimetableFilters();
      }
    } else if (tabId === 'manual') {
      renderManualMode();
    }
  }

  /**
   * Helper to check if current courses in state are strictly the preloaded demo/sample dataset.
   * Prevents false positives when real user-imported courses share course codes with sample data.
   */
  function isCurrentStateOnlySampleCourses() {
    if (state.isSampleData === false) return false;
    if (!state.courses || state.courses.length === 0) return false;

    // Any course explicitly marked as non-sample is real user data
    if (state.courses.some(c => c.isSample === false)) return false;

    // Any group that has a real group code (contains underscore or is longer than 4 chars like 03CE01_144) is real user data
    const hasUserGroup = state.courses.some(c =>
      (c.groups || []).some(g => g.group && (g.group.includes('_') || g.group.length > 4))
    );
    if (hasUserGroup) return false;

    if (state.isSampleData === true) return true;

    // Check if current state courses strictly match default sample set by both code and sample group structure
    if (typeof SampleScheduleData !== 'undefined' && SampleScheduleData.DEFAULT_COURSE_SET) {
      return state.courses.every(c =>
        c.isSample === true ||
        SampleScheduleData.DEFAULT_COURSE_SET.some(sc =>
          sc.code === c.code &&
          sc.groups && c.groups &&
          sc.groups.length === c.groups.length &&
          sc.groups[0]?.group === c.groups[0]?.group
        )
      );
    }

    return false;
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

    // If the current courses in state are strictly the default sample courses,
    // clear them so imported schedules don't get mixed with demo data.
    if (isCurrentStateOnlySampleCourses()) {
      state.courses = [];
      state.doctorPreferences = {};
    }
    state.isSampleData = false;
    try { localStorage.setItem('sched_is_sample', 'false'); } catch (e) {}

    // Add or merge courses into state, accumulating groups when importing multiple group schedules
    let addedCount = 0;
    let mergedCount = 0;

    result.courses.forEach(newCourse => {
      newCourse.isSample = false;
      const existingCourse = state.courses.find(c => c.code === newCourse.code || c.id === newCourse.id);
      if (existingCourse) {
        existingCourse.isSample = false;
        if (!existingCourse.groups) existingCourse.groups = [];

        (newCourse.groups || []).forEach(newG => {
          const exGIdx = existingCourse.groups.findIndex(g => g.group === newG.group);
          if (exGIdx > -1) {
            existingCourse.groups[exGIdx] = newG;
          } else {
            existingCourse.groups.push(newG);
          }
        });

        // Re-aggregate all slots from all groups
        const allSlots = [];
        existingCourse.groups.forEach(g => {
          if (Array.isArray(g.sessions)) {
            allSlots.push(...g.sessions);
          }
        });
        existingCourse.slots = allSlots;

        // Merge instructors
        const instSet = new Set(existingCourse.instructors || []);
        (newCourse.instructors || []).forEach(inst => {
          if (inst && inst !== 'Not Specified') instSet.add(inst);
        });
        existingCourse.instructors = Array.from(instSet);

        // Update name if newCourse has a better title
        if (newCourse.name && (!existingCourse.name || existingCourse.name === existingCourse.code)) {
          existingCourse.name = newCourse.name;
        }

        mergedCount++;
      } else {
        state.courses.push(newCourse);
        addedCount++;
      }
    });

    // Reset solutions so optimizer re-calculates combinations with new groups/courses
    state.solutions = [];
    state.filteredSolutions = [];
    state.activeSolutionIndex = 0;

    saveStateToStorage();
    renderCoursesList();
    renderDoctorPreferences();

    const isAr = state.currentLang === 'ar';
    let feedbackMsg = result.message;
    if (result.scheduleType === 'group' && result.groupCode) {
      if (mergedCount > 0 && addedCount === 0) {
        feedbackMsg = isAr
          ? `تم دمج المجموعة (${result.groupCode}) في ${mergedCount} مواد بنجاح.`
          : `Merged group (${result.groupCode}) into ${mergedCount} existing course(s).`;
      } else if (mergedCount > 0 && addedCount > 0) {
        feedbackMsg = isAr
          ? `تم إضافة ${addedCount} مواد جديدة ودمج المجموعة (${result.groupCode}) في ${mergedCount} مواد.`
          : `Added ${addedCount} new course(s) and merged group (${result.groupCode}) into ${mergedCount} course(s).`;
      }
    }

    showToast(feedbackMsg, 'success');

    // Clear textarea
    document.getElementById('html-input-text').value = '';
  }

  /**
   * PDF File Upload & Extraction
   */
  async function handlePdfUpload(file) {
    const isAr = state.currentLang === 'ar';
    const progressContainer = document.getElementById('pdf-progress-container');
    const progressBar = document.getElementById('pdf-progress-bar');
    const progressText = document.getElementById('pdf-progress-text');
    const progressPct = document.getElementById('pdf-progress-pct');

    try {
      if (progressContainer) progressContainer.style.display = 'block';
      if (progressBar) progressBar.style.width = '5%';
      if (progressPct) progressPct.textContent = '5%';
      if (progressText) progressText.textContent = isAr ? 'جاري قراءة ملف PDF...' : 'Reading PDF file...';

      const result = await PdfScheduleParser.parsePdfFile(file, (curr, total) => {
        const pct = Math.round((curr / total) * 100);
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (progressPct) progressPct.textContent = `${pct}%`;
        if (progressText) {
          progressText.textContent = isAr
            ? `جاري استخراج صفحة ${curr} من ${total}...`
            : `Extracting page ${curr} of ${total}...`;
        }
      });

      if (!result.success || result.courses.length === 0) {
        throw new Error(result.message || 'No courses found in PDF');
      }

      if (progressContainer) progressContainer.style.display = 'none';
      openPdfCoursesModal(result);
    } catch (err) {
      console.error('PDF parsing error:', err);
      if (progressContainer) progressContainer.style.display = 'none';
      showToast(isAr ? `خطأ أثناء قراءة ملف الـ PDF: ${err.message}` : `PDF error: ${err.message}`, 'error');
    }
  }

  /**
   * PDF Copied Text / OCR Parsing
   */
  function handlePdfTextParse() {
    const isAr = state.currentLang === 'ar';
    const text = document.getElementById('pdf-input-text')?.value || '';
    if (!text.trim()) {
      showToast(isAr ? 'يرجى لصق نص الجدول أولاً' : 'Please paste timetable text first', 'error');
      return;
    }

    try {
      const result = PdfScheduleParser.parsePdfText(text);
      if (!result.success || result.courses.length === 0) {
        throw new Error(result.message || 'No courses found in text');
      }

      openPdfCoursesModal(result);
    } catch (err) {
      console.error('PDF text parse error:', err);
      showToast(isAr ? `خطأ في تحليل النص: ${err.message}` : `Text parse error: ${err.message}`, 'error');
    }
  }

  /**
   * Open Course Selection Modal
   */
  function openPdfCoursesModal(result) {
    const isAr = state.currentLang === 'ar';
    state.pendingPdfCourses = result.courses;

    const modal = document.getElementById('pdf-courses-modal');
    const badge = document.getElementById('pdf-detected-groups-badge');
    const listContainer = document.getElementById('pdf-courses-selection-list');

    if (badge) {
      badge.textContent = isAr
        ? `تم العثور على ${result.detectedGroups.length} مجموعات (${result.detectedGroups.join(', ')})`
        : `Found ${result.detectedGroups.length} Groups (${result.detectedGroups.join(', ')})`;
    }

    if (listContainer) {
      listContainer.innerHTML = '';
      result.courses.forEach((course, idx) => {
        const card = document.createElement('div');
        card.className = 'pdf-course-card is-selected';
        card.dataset.courseIndex = idx;

        const totalSessions = course.groups.reduce((acc, g) => acc + g.sessions.length, 0);
        const uniqueDoctors = course.instructors.filter(i => i !== 'Not Specified');

        card.innerHTML = `
          <div class="pdf-course-card-left">
            <input type="checkbox" class="pdf-course-checkbox" id="chk-pdf-course-${idx}" checked />
            <div class="pdf-course-color-bar" style="background: ${course.color};"></div>
            <div>
              <div class="pdf-course-title">${course.name}</div>
              <div class="pdf-course-meta">
                <span class="pdf-group-pill">${course.groups.length} ${isAr ? 'مجموعات' : 'groups'}</span>
                <span class="pdf-group-pill">${totalSessions} ${isAr ? 'حصص/فترات' : 'sessions'}</span>
                ${uniqueDoctors.length > 0 ? `<span class="pdf-group-pill">👨‍🏫 ${uniqueDoctors.slice(0, 2).join(', ')}${uniqueDoctors.length > 2 ? '...' : ''}</span>` : ''}
              </div>
            </div>
          </div>
        `;

        card.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') {
            const chk = card.querySelector('.pdf-course-checkbox');
            chk.checked = !chk.checked;
          }
          card.classList.toggle('is-selected', card.querySelector('.pdf-course-checkbox').checked);
          updatePdfSelectedCount();
        });

        const chk = card.querySelector('.pdf-course-checkbox');
        chk.addEventListener('change', () => {
          card.classList.toggle('is-selected', chk.checked);
          updatePdfSelectedCount();
        });

        listContainer.appendChild(card);
      });
    }

    updatePdfSelectedCount();
    if (modal) modal.style.display = 'flex';
  }

  function updatePdfSelectedCount() {
    const isAr = state.currentLang === 'ar';
    const checked = document.querySelectorAll('.pdf-course-checkbox:checked').length;
    const label = document.getElementById('pdf-selected-count-label');
    if (label) {
      label.textContent = isAr
        ? `المحدد: ${checked} مواد`
        : `Selected: ${checked} courses`;
    }
  }

  function setAllPdfCoursesChecked(val) {
    document.querySelectorAll('.pdf-course-checkbox').forEach(chk => {
      chk.checked = val;
      const card = chk.closest('.pdf-course-card');
      if (card) card.classList.toggle('is-selected', val);
    });
    updatePdfSelectedCount();
  }

  function closePdfCoursesModal() {
    const modal = document.getElementById('pdf-courses-modal');
    if (modal) modal.style.display = 'none';
    state.pendingPdfCourses = null;
  }

  function confirmPdfImport() {
    const isAr = state.currentLang === 'ar';
    if (!state.pendingPdfCourses || state.pendingPdfCourses.length === 0) return;

    const selectedIndices = [];
    document.querySelectorAll('.pdf-course-checkbox').forEach((chk, idx) => {
      if (chk.checked) selectedIndices.push(idx);
    });

    if (selectedIndices.length === 0) {
      showToast(isAr ? 'يرجى اختيار مادة واحدة على الأقل' : 'Please select at least one course', 'error');
      return;
    }

    // If the current courses in state are strictly the default sample courses,
    // replace them with the user's imported timetable courses so they don't get mixed together.
    if (isCurrentStateOnlySampleCourses()) {
      state.courses = [];
      state.doctorPreferences = {};
    }
    state.isSampleData = false;
    try { localStorage.setItem('sched_is_sample', 'false'); } catch (e) {}

    let addedCount = 0;
    let mergedCount = 0;
    selectedIndices.forEach(idx => {
      const course = state.pendingPdfCourses[idx];
      course.isSample = false;
      const existingCourse = state.courses.find(c => c.code === course.code || c.id === course.id);
      if (existingCourse) {
        existingCourse.isSample = false;
        if (!existingCourse.groups) existingCourse.groups = [];
        (course.groups || []).forEach(newG => {
          const exGIdx = existingCourse.groups.findIndex(g => g.group === newG.group);
          if (exGIdx > -1) {
            existingCourse.groups[exGIdx] = newG;
          } else {
            existingCourse.groups.push(newG);
          }
        });
        const allSlots = [];
        existingCourse.groups.forEach(g => {
          if (Array.isArray(g.sessions)) allSlots.push(...g.sessions);
        });
        existingCourse.slots = allSlots;
        const instSet = new Set(existingCourse.instructors || []);
        (course.instructors || []).forEach(inst => {
          if (inst && inst !== 'Not Specified') instSet.add(inst);
        });
        existingCourse.instructors = Array.from(instSet);
        if (course.name && (!existingCourse.name || existingCourse.name === existingCourse.code)) {
          existingCourse.name = course.name;
        }
        mergedCount++;
      } else {
        state.courses.push(course);
        addedCount++;
      }
    });

    state.solutions = [];
    state.activeSolutionIndex = 0;
    saveStateToStorage();
    renderCoursesList();
    renderDoctorPreferences();
    closePdfCoursesModal();

    showToast(
      isAr
        ? `تم استيراد ${addedCount} مواد بنجاح من الجدول! 🎉`
        : `Successfully imported ${addedCount} courses from PDF! 🎉`,
      'success'
    );
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
    state.courses.forEach(c => { c.isSample = true; });
    state.isSampleData = true;
    try { localStorage.setItem('sched_is_sample', 'true'); } catch (e) {}
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
   * Helper to check if a doctor name refers to an unspecified / unassigned doctor
   */
  function isUnspecifiedDoctor(name) {
    if (!name) return true;
    const s = String(name).trim().toLowerCase();
    return s === '' || s === 'not specified' || s === 'غير محدد' || s === 'unspecified' || s === 'دكتور غير محدد' || s === 'not specified (doctor)';
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
   * True if has doctor prefix, is unspecified doctor, or teaches any lecture session.
   */
  function isPersonDoctor(personName, course) {
    if (isUnspecifiedDoctor(personName)) return true;
    if (!personName) return false;

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
    if (!name || isUnspecifiedDoctor(name)) return name;
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
              if (inst && !isUnspecifiedDoctor(inst)) {
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
              if (!isUnspecifiedDoctor(name) && (doctorsSet.has(name) || isPersonDoctor(name, course))) {
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
          if (inst && !isUnspecifiedDoctor(inst)) {
            if (slot.type === 'Lect.' || /Lect|محاضرة/i.test(slot.type || '')) {
              slot.instructor = formatDoctorName(inst, true);
            }
          }
        });
      }

      if (course.instructors && Array.isArray(course.instructors)) {
        course.instructors = course.instructors.map(name => {
          if (!isUnspecifiedDoctor(name) && isPersonDoctor(name, course)) {
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
    if (isUnspecifiedDoctor(formatted) || isUnspecifiedDoctor(original)) {
      for (const [key, val] of Object.entries(prefs)) {
        if (isUnspecifiedDoctor(key)) return val;
      }
      return 'neutral';
    }
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
    const doc = String(doctorName || '').trim();
    const courseObj = (typeof course === 'object' && course !== null) ? course : {};
    const courseKeys = [courseObj.code, courseObj.id, courseObj.name, course].filter(k => typeof k === 'string' && k.trim());

    if (isUnspecifiedDoctor(doc)) {
      for (const key of courseKeys) {
        const rating = getRatingForPerson(key, 'Not Specified', 'غير محدد');
        if (rating && rating !== 'neutral') return rating;
      }
      for (const [cKey, prefs] of Object.entries(state.doctorPreferences || {})) {
        if (courseKeys.includes(cKey)) {
          for (const [pDoc, pRating] of Object.entries(prefs)) {
            if (isUnspecifiedDoctor(pDoc)) return pRating;
          }
        }
      }
      return 'neutral';
    }

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
      if (s && !isUnspecifiedDoctor(s)) courseDocs.add(s);
    });
    (grp.sessions || []).forEach(sess => {
      const s = (sess.instructor || '').trim();
      if (s && !isUnspecifiedDoctor(s)) courseDocs.add(s);
    });

    const hasUnspecifiedLect = (grp.sessions || []).some(s => {
      const isLect = s.type === 'Lect.' || /Lect|محاضرة/i.test(s.type || '');
      return isLect && (!s.instructor || isUnspecifiedDoctor(s.instructor));
    });
    if (hasUnspecifiedLect) {
      courseDocs.add('Not Specified');
    }

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
    const isUnspec = !instructor || isUnspecifiedDoctor(instructor);
    const targetDoc = isUnspec ? 'Not Specified' : instructor;
    const rating = getDoctorPrefForCourse(course, targetDoc);
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
      let hasUnspecifiedLect = false;
      if (course.groups) {
        course.groups.forEach(g => {
          (g.instructors || []).forEach(inst => {
            if (inst && !isUnspecifiedDoctor(inst)) rawInstructors.add(inst);
          });
          (g.sessions || []).forEach(s => {
            if (s.instructor && !isUnspecifiedDoctor(s.instructor)) rawInstructors.add(s.instructor);
            const isLect = s.type === 'Lect.' || /Lect|محاضرة/i.test(s.type || '');
            if (isLect && (!s.instructor || isUnspecifiedDoctor(s.instructor))) {
              hasUnspecifiedLect = true;
            }
          });
        });
      }
      if (course.slots) {
        course.slots.forEach(s => {
          if (s.instructor && !isUnspecifiedDoctor(s.instructor)) rawInstructors.add(s.instructor);
          const isLect = s.type === 'Lect.' || /Lect|محاضرة/i.test(s.type || '');
          if (isLect && (!s.instructor || isUnspecifiedDoctor(s.instructor))) {
            hasUnspecifiedLect = true;
          }
        });
      }

      if (rawInstructors.size === 0 && !hasUnspecifiedLect) return;

      const courseCode = course.code || course.id;
      if (!state.doctorPreferences[courseCode]) {
        state.doctorPreferences[courseCode] = {};
      }

      // Partition into Doctors and Instructors
      const doctors = [];
      const instructors = [];

      rawInstructors.forEach(person => {
        if (!person || isUnspecifiedDoctor(person)) return;
        const isDoc = isPersonDoctor(person, course);
        const formatted = formatDoctorName(person, isDoc);
        if (isDoc) {
          doctors.push({ original: person, formatted, isDoctor: true });
        } else {
          instructors.push({ original: person, formatted, isDoctor: false });
        }
      });

      if (hasUnspecifiedLect) {
        const unspecFormatted = state.currentLang === 'ar' ? 'غير محدد' : 'Not Specified';
        doctors.push({
          original: 'Not Specified',
          formatted: unspecFormatted,
          isDoctor: true,
          isUnspecified: true
        });
      }

      // Deduplicate by formatted name
      const uniqueDocs = Array.from(new Map(doctors.map(d => [d.formatted, d])).values());
      const uniqueInsts = Array.from(new Map(instructors.map(i => [i.formatted, i])).values());

      // 1. Sort Doctors: Named doctors in alphabetical order, followed by Unspecified doctor at the end
      const namedDocs = uniqueDocs.filter(d => !d.isUnspecified);
      const unspecDocs = uniqueDocs.filter(d => d.isUnspecified);
      namedDocs.sort((a, b) => {
        const nameA = getCleanSortName(a.formatted);
        const nameB = getCleanSortName(b.formatted);
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      });
      const sortedDocs = [...namedDocs, ...unspecDocs];

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
              ${sortedDocs.length} ${state.currentLang === 'ar' ? 'دكاترة' : 'Doctors'} • ${uniqueInsts.length} ${state.currentLang === 'ar' ? 'معيدين' : 'TAs'}
            </span>
          </div>
          <div>
      `;

      // Render Doctors first (alphabetical order & highlighted)
      if (sortedDocs.length > 0) {
        html += `<div class="pref-subgroup-header">${t.doctorsSubheading}</div>`;
        sortedDocs.forEach(item => {
          const currentPref = getRatingForPerson(courseCode, item.formatted, item.original);
          const isMandated = currentPref === 'mandate';
          const isAvoided = currentPref === 'avoid';
          const isLove = currentPref === 'love';

          html += `
            <div class="doctor-pref-item is-doctor ${isMandated ? 'is-mandated' : ''} ${isAvoided ? 'is-avoided' : ''}">
              <div class="doctor-name-col">
                <span style="font-size: 16px;">${isMandated ? '🌟' : (item.isUnspecified ? '❓' : '🎓')}</span>
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

        if (isUnspecifiedDoctor(name)) {
          clean[code]['Not Specified'] = rating;
          return;
        }

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

    const isUnspec = isUnspecifiedDoctor(doctorName);
    const canonicalName = isUnspec ? 'Not Specified' : doctorName;

    // Clean up any old duplicate cleaned-name alias
    const cleanName = getCleanSortName(doctorName);
    if (cleanName && cleanName !== doctorName) {
      delete state.doctorPreferences[courseCode][cleanName];
    }
    if (isUnspec) {
      delete state.doctorPreferences[courseCode]['غير محدد'];
      delete state.doctorPreferences[courseCode]['Not Specified'];
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
      delete state.doctorPreferences[courseCode][canonicalName];
    } else {
      state.doctorPreferences[courseCode][canonicalName] = rating;
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
              const baseMsg = isAr ? (result.messageAr || result.message) : (result.message || 'No clash-free schedules found.');
              const tip = isAr
                ? ' 💡 يمكنك الضغط على زر "تفريغ الذاكرة 🧹" بأعلى الصفحة للبدء بحالة نظيفة تماماً مثل التصفح المتخفي.'
                : ' 💡 You can click "Clear Cache 🧹" at the top to reset everything to fresh defaults (like incognito mode).';
              showToast(baseMsg + tip, 'error');
              return;
            }

            state.solutions = result.solutions;
            state.activeSolutionIndex = 0;

            // Switch to Timetable tab and apply strict filters & ranking presets
            switchTab('timetable');
            applyTimetableFilters();

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
      let hasUnspec = false;
      (course.groups || []).forEach(grp => {
        (grp.instructors || []).forEach(rawInst => {
          const inst = (rawInst || '').trim();
          if (!inst || isUnspecifiedDoctor(inst)) return;
          if (!doctorMap.has(inst)) doctorMap.set(inst, new Set());
          doctorMap.get(inst).add(course.name || course.code);
        });
        (grp.sessions || []).forEach(sess => {
          const inst = (sess.instructor || '').trim();
          const isLect = sess.type === 'Lect.' || /Lect|محاضرة/i.test(sess.type || '');
          if (isLect && (!inst || isUnspecifiedDoctor(inst))) {
            hasUnspec = true;
          }
          if (!inst || isUnspecifiedDoctor(inst)) return;
          if (!doctorMap.has(inst)) doctorMap.set(inst, new Set());
          doctorMap.get(inst).add(course.name || course.code);
        });
      });
      if (hasUnspec) {
        const unspecKey = isAr ? 'غير محدد' : 'Not Specified';
        if (!doctorMap.has(unspecKey)) doctorMap.set(unspecKey, new Set());
        doctorMap.get(unspecKey).add(course.name || course.code);
      }
    });

    const doctorsList = Array.from(doctorMap.keys());
    doctorsList.sort((a, b) => {
      if (isUnspecifiedDoctor(a)) return 1;
      if (isUnspecifiedDoctor(b)) return -1;
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
      const isUnspec = isUnspecifiedDoctor(doc);
      const icon = isUnspec ? '❓' : (isDoc ? '🎓' : '🔬');

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
   * Helper session type predicates
   */
  function isLectureSession(s) {
    if (!s) return false;
    if (ScheduleRenderer && typeof ScheduleRenderer.isLectureSession === 'function') {
      return ScheduleRenderer.isLectureSession(s);
    }
    const t = (s.type || '').toLowerCase();
    return t.includes('lect') || t.includes('محاضرة');
  }

  function isLabSession(s) {
    if (!s) return false;
    if (ScheduleRenderer && typeof ScheduleRenderer.isLabSession === 'function') {
      return ScheduleRenderer.isLabSession(s);
    }
    const t = (s.type || '').toLowerCase();
    return t.includes('lab') || t.includes('معمل');
  }

  function isSectionSession(s) {
    if (!s) return false;
    if (ScheduleRenderer && typeof ScheduleRenderer.isSectionSession === 'function') {
      return ScheduleRenderer.isSectionSession(s);
    }
    const t = (s.type || '').toLowerCase();
    return t.includes('sec') || t.includes('سكشن') || t.includes('تمارين') || (!isLectureSession(s) && !isLabSession(s));
  }

  function getGroupSessionsForRole(groupData, role) {
    const sessions = (groupData && groupData.sessions) || [];
    if (role === 'doctor') {
      return sessions.filter(isLectureSession);
    } else if (role === 'lab') {
      return sessions.filter(isLabSession);
    } else if (role === 'section') {
      return sessions.filter(isSectionSession);
    } else if (role === 'ta') {
      return sessions.filter(s => !isLectureSession(s));
    }
    return [];
  }

  function getAvailableRolesForGroup(groupData) {
    const roles = [];
    const sessions = (groupData && groupData.sessions) || [];
    if (sessions.some(isLectureSession)) roles.push('doctor');
    if (sessions.some(isSectionSession)) roles.push('section');
    if (sessions.some(isLabSession)) roles.push('lab');
    return roles;
  }

  /**
   * Helper: returns all selected groups / components for a course
   */
  function getSelectedGroupsForCourse(courseId) {
    return Object.values(state.manualSchedule).filter(g => g.courseId === courseId || g.courseCode === courseId);
  }

  /**
   * Helper: returns detailed status of course's manual selection,
   * accurately distinguishing single/mixed combinations from duplicate conflicts.
   */
  function getCourseGroupStatus(courseId) {
    const items = getSelectedGroupsForCourse(courseId);
    if (items.length === 0) {
      return { hasSelection: false, isConflict: false, label: '', items: [] };
    }

    const docItems = items.filter(i => i.componentType === 'doctor');
    const secItems = items.filter(i => i.componentType === 'section');
    const labItems = items.filter(i => i.componentType === 'lab');
    const taItems = items.filter(i => i.componentType === 'ta');
    const fullItems = items.filter(i => !i.componentType || i.componentType === 'all');

    // Conflict exists if user picked >1 full group, >1 doctor, >1 section, >1 lab, >1 TA, or a full group combined with a partial
    const isConflict = items.length > 1 && (
      fullItems.length > 1 ||
      docItems.length > 1 ||
      secItems.length > 1 ||
      labItems.length > 1 ||
      taItems.length > 1 ||
      (fullItems.length > 0 && (docItems.length > 0 || secItems.length > 0 || labItems.length > 0 || taItems.length > 0))
    );

    const isAr = state.currentLang === 'ar';
    let label = '';
    if (isConflict) {
      label = isAr
        ? `تم اختيار ${items.length} مجموعات: (${items.map(g => 'مجموعة ' + g.group).join('، ')})`
        : `${items.length} Groups Selected: (${items.map(g => 'Group ' + g.group).join(', ')})`;
    } else if (fullItems.length === 1) {
      label = isAr
        ? `المجموعة المختارة: ${fullItems[0].group}`
        : `Selected: Group ${fullItems[0].group}`;
    } else {
      const parts = [];
      if (docItems.length === 1) {
        parts.push(isAr ? `دكتور: مجموعة ${docItems[0].group}` : `Dr: Group ${docItems[0].group}`);
      }
      if (secItems.length === 1) {
        parts.push(isAr ? `سكشن: مجموعة ${secItems[0].group}` : `Sec: Group ${secItems[0].group}`);
      }
      if (labItems.length === 1) {
        parts.push(isAr ? `معمل: مجموعة ${labItems[0].group}` : `Lab: Group ${labItems[0].group}`);
      }
      if (taItems.length === 1) {
        parts.push(isAr ? `معيد: مجموعة ${taItems[0].group}` : `TA: Group ${taItems[0].group}`);
      }

      if (parts.length > 1) {
        label = `✓ ${parts.join(' | ')}`;
      } else if (docItems.length === 1) {
        label = isAr ? `✓ دكتور: مجموعة ${docItems[0].group} (المحاضرات فقط)` : `✓ Doctor: Group ${docItems[0].group} (Lectures only)`;
      } else if (secItems.length === 1) {
        label = isAr ? `✓ سكشن: مجموعة ${secItems[0].group} (السكشن فقط)` : `✓ Section: Group ${secItems[0].group} (Section only)`;
      } else if (labItems.length === 1) {
        label = isAr ? `✓ معمل: مجموعة ${labItems[0].group} (المعمل فقط)` : `✓ Lab: Group ${labItems[0].group} (Lab only)`;
      } else if (taItems.length === 1) {
        label = isAr ? `✓ معيد: مجموعة ${taItems[0].group} (السكاشن والمعامل)` : `✓ TA: Group ${taItems[0].group} (Sections/Labs)`;
      } else if (items.length > 0) {
        label = isAr ? `المجموعة المختارة: ${items[0].group}` : `Selected: Group ${items[0].group}`;
      }
    }

    return {
      hasSelection: true,
      isConflict,
      label,
      items,
      docGroup: docItems[0]?.group || (fullItems.length > 0 ? fullItems[0]?.group : null),
      secGroup: secItems[0]?.group || (fullItems.length > 0 ? fullItems[0]?.group : null),
      labGroup: labItems[0]?.group || (fullItems.length > 0 ? fullItems[0]?.group : null),
      taGroup: taItems[0]?.group || secItems[0]?.group || labItems[0]?.group || (fullItems.length > 0 ? fullItems[0]?.group : null)
    };
  }

  /**
   * Helper: returns course IDs that have genuine multi-group conflicts
   */
  function getMultiGroupCourses() {
    const conflictCourseIds = [];
    state.courses.forEach(course => {
      const status = getCourseGroupStatus(course.id);
      if (status.isConflict) {
        conflictCourseIds.push(course.id);
      }
    });
    return conflictCourseIds;
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
   * Toggle Manual Hide Avoided Doctors
   */
  function toggleManualHideAvoided(checked) {
    state.manualHideAvoided = Boolean(checked);
    saveStateToStorage();
    renderManualCoursesPicker();
    renderManualDoctorGroups();
  }

  /**
   * Toggle Manual Customize Doctor, Section & Lab Independently
   */
  function toggleManualCustomizeDocTA(checked) {
    state.manualCustomizeDocTA = Boolean(checked);
    saveStateToStorage();
    const isAr = state.currentLang === 'ar';
    showToast(
      state.manualCustomizeDocTA
        ? (isAr
            ? '🔀 تم تفعيل تخصيص الدكتور والسكشن والمعمل: انقر على أي دكتور أو سكشن أو معمل لإضافته للجدول!'
            : '🔀 Doctor, Section & Lab customization active: click any Doctor, Section, or Lab to add them to your timetable!')
        : (isAr
            ? 'تم الرجوع لوضع اختيار المجموعات بالكامل.'
            : 'Group selection mode active.'),
      'info'
    );
    renderManualCoursesPicker();
    renderManualDoctorGroups();
  }

  /**
   * Selects or deselects a specific component (doctor/lectures, section, or lab) for a course group in Manual Mode
   */
  function selectManualComponent(courseId, groupName, role = 'doctor', event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const isAr = state.currentLang === 'ar';
    const course = state.courses.find(c => c.id === courseId || c.code === courseId);
    if (!course) return;

    const groupData = (course.groups || []).find(g => g.group === groupName);
    if (!groupData) return;

    let roleName = '';
    if (role === 'doctor') {
      roleName = isAr ? 'الدكتور (المحاضرات)' : 'Doctor (Lectures)';
    } else if (role === 'section') {
      roleName = isAr ? 'السكشن (التمارين)' : 'Section';
    } else if (role === 'lab') {
      roleName = isAr ? 'المعمل' : 'Lab';
    } else {
      roleName = isAr ? 'المعيد' : 'TA';
    }

    const componentSessions = getGroupSessionsForRole(groupData, role);
    if (componentSessions.length === 0) {
      showToast(isAr ? `لا توجد جلسات ${roleName} لهذه المجموعة` : `No ${roleName} sessions found for this group`, 'info');
      return;
    }

    const compKey = `${course.id}:::${groupName}:::${role}`;
    const fullGroupKey = `${course.id}:::${groupName}`;

    const isDirectlySelected = !!state.manualSchedule[compKey];
    const isFullSelected = !!state.manualSchedule[fullGroupKey] &&
      (!state.manualSchedule[fullGroupKey].componentType || state.manualSchedule[fullGroupKey].componentType === 'all');

    if (isDirectlySelected) {
      // Toggle OFF: remove this component
      delete state.manualSchedule[compKey];
      showToast(isAr ? `تم إلغاء اختيار ${roleName} لمجموعة ${groupName} (${course.name})` : `Deselected ${roleName} for Group ${groupName} (${course.name})`, 'info');
    } else if (isFullSelected) {
      // Toggle this role OFF from full group -> other available roles remain active!
      delete state.manualSchedule[fullGroupKey];
      const availableRoles = getAvailableRolesForGroup(groupData);
      const otherRoles = availableRoles.filter(r => r !== role);
      otherRoles.forEach(otherRole => {
        const otherSessions = getGroupSessionsForRole(groupData, otherRole);
        if (otherSessions.length > 0) {
          state.manualSchedule[`${course.id}:::${groupName}:::${otherRole}`] = {
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            group: groupName,
            color: course.color,
            componentType: otherRole,
            instructors: Array.from(new Set(otherSessions.map(s => s.instructor).filter(Boolean))),
            sessions: otherSessions.map(s => ({
              ...s,
              courseId: course.id,
              courseName: course.name,
              courseCode: course.code,
              group: groupName,
              color: course.color,
              componentRole: otherRole
            }))
          };
        }
      });
      showToast(isAr ? `تم إلغاء اختيار ${roleName} لمجموعة ${groupName}` : `Deselected ${roleName} for Group ${groupName}`, 'info');
    } else {
      // User is selecting this component!
      // 1. If another group was selected for the SAME role in this course, replace it
      Object.keys(state.manualSchedule).forEach(k => {
        const entry = state.manualSchedule[k];
        if (!entry || (entry.courseId !== course.id && entry.courseCode !== course.code)) return;

        if (entry.componentType === role) {
          delete state.manualSchedule[k];
        } else if (!entry.componentType || entry.componentType === 'all') {
          // Downgrade existing full group to only the OTHER available roles
          const existingGrp = (course.groups || []).find(g => g.group === entry.group);
          delete state.manualSchedule[k];
          if (existingGrp) {
            const retainedRoles = getAvailableRolesForGroup(existingGrp).filter(r => r !== role);
            retainedRoles.forEach(otherRole => {
              const otherSessions = getGroupSessionsForRole(existingGrp, otherRole);
              if (otherSessions.length > 0) {
                state.manualSchedule[`${course.id}:::${existingGrp.group}:::${otherRole}`] = {
                  courseId: course.id,
                  courseName: course.name,
                  courseCode: course.code,
                  group: existingGrp.group,
                  color: course.color,
                  componentType: otherRole,
                  instructors: Array.from(new Set(otherSessions.map(s => s.instructor).filter(Boolean))),
                  sessions: otherSessions.map(s => ({
                    ...s,
                    courseId: course.id,
                    courseName: course.name,
                    courseCode: course.code,
                    group: existingGrp.group,
                    color: course.color,
                    componentRole: otherRole
                  }))
                };
              }
            });
          }
        }
      });

      // 2. Check if all OTHER available roles of this same group are ALREADY active
      const availableRoles = getAvailableRolesForGroup(groupData);
      const otherRoles = availableRoles.filter(r => r !== role);
      const allOthersActive = otherRoles.length > 0 && otherRoles.every(r => !!state.manualSchedule[`${course.id}:::${groupName}:::${r}`]);

      if (allOthersActive) {
        // All components of this group are now chosen -> merge into full group!
        otherRoles.forEach(r => {
          delete state.manualSchedule[`${course.id}:::${groupName}:::${r}`];
        });
        state.manualSchedule[fullGroupKey] = {
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          group: groupName,
          color: course.color,
          componentType: 'all',
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
        showToast(isAr ? `تم اختيار مجموعة ${groupName} بالكامل لمقرر ${course.name}` : `Selected Entire Group ${groupName} for ${course.name}`, 'success');
      } else {
        // Add single role component
        state.manualSchedule[compKey] = {
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          group: groupName,
          color: course.color,
          componentType: role,
          instructors: Array.from(new Set(componentSessions.map(s => s.instructor).filter(Boolean))),
          sessions: componentSessions.map(s => ({
            ...s,
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            group: groupName,
            color: course.color,
            componentRole: role
          }))
        };

        const conflict = checkGroupConflictWithManualSchedule(course.id, {
          ...groupData,
          sessions: componentSessions
        });
        const instructorNames = Array.from(new Set(componentSessions.map(s => s.instructor).filter(Boolean))).join(', ');
        if (conflict.clashing) {
          showToast(`⚠️ ${conflict.detail}`, 'warning');
        } else {
          showToast(isAr
            ? `تم نقل ${roleName} (${instructorNames || 'مجموعة ' + groupName}) لمقرر ${course.name} إلى الجدول`
            : `Transferred ${roleName} (${instructorNames || 'Group ' + groupName}) for ${course.name} to Timetable`, 'success');
        }
      }
    }

    saveStateToStorage();
    renderManualStatusBanner();
    renderManualDoctorGroups();
    renderManualCoursesPicker();
    renderManualTimetable();
  }

  /**
   * Helper to render an interactive group card used in both Doctor Explorer and Course Groups list
   */
  function renderManualGroupCardHtml(course, grp, options = {}) {
    const isAr = state.currentLang === 'ar';
    const courseId = course.id;
    const courseName = course.name;
    const courseCode = course.code;
    const color = course.color;
    const isDocExplorer = Boolean(options.isDocExplorer);
    const isDocMatch = Boolean(options.isDocMatch);

    const fullKey = `${courseId}:::${grp.group}`;
    const docKey = `${courseId}:::${grp.group}:::doctor`;
    const secKey = `${courseId}:::${grp.group}:::section`;
    const labKey = `${courseId}:::${grp.group}:::lab`;
    const taKey = `${courseId}:::${grp.group}:::ta`;

    const isFullSelected = !!state.manualSchedule[fullKey] &&
      (!state.manualSchedule[fullKey].componentType || state.manualSchedule[fullKey].componentType === 'all');

    const isDocSelected = isFullSelected || !!state.manualSchedule[docKey];
    const isSecSelected = isFullSelected || !!state.manualSchedule[secKey] || !!state.manualSchedule[taKey];
    const isLabSelected = isFullSelected || !!state.manualSchedule[labKey] || !!state.manualSchedule[taKey];
    const isAnySelected = isFullSelected || isDocSelected || isSecSelected || isLabSelected;

    const courseStatus = getCourseGroupStatus(courseId);
    const isCourseConflict = courseStatus.isConflict;

    const conflict = checkGroupConflictWithManualSchedule(courseId, grp);
    const isClashing = !isAnySelected && conflict.clashing;
    const isSoftClash = isClashing && conflict.severity === 'warning';

    const prefSummary = getGroupDoctorPrefSummary(course, grp);
    const prefBadgesHtml = getGroupDoctorPrefBadgesHtml(prefSummary, isAr);

    let cardClass = 'manual-group-card';
    if (isFullSelected) cardClass += ' is-selected';
    else if (isDocSelected || isSecSelected || isLabSelected) cardClass += ' is-selected';
    else if (isSoftClash) cardClass += ' is-clashing-warning';
    else if (isClashing) cardClass += ' is-clashing';
    else if (isDocMatch) cardClass += ' is-doc-match';

    if (prefSummary.hasAvoid) cardClass += ' has-avoided-doctor';
    if (prefSummary.hasMandate) cardClass += ' has-mandated-doctor';
    if (prefSummary.hasLove) cardClass += ' has-preferred-doctor';

    let statusBadgeHtml = '';
    if (isFullSelected) {
      statusBadgeHtml = `<span class="selected-badge-pill">✓ ${isAr ? 'المجموعة كاملة' : 'Entire Group'}</span>`;
    } else if (isDocSelected && !isSecSelected && !isLabSelected) {
      statusBadgeHtml = `<span class="selected-badge-pill" style="background: rgba(59, 130, 246, 0.18); border-color: var(--accent-primary); color: var(--accent-primary);">✓ ${isAr ? 'دكتور فقط' : 'Doctor Only'}</span>`;
    } else if (isSecSelected && !isDocSelected && !isLabSelected) {
      statusBadgeHtml = `<span class="selected-badge-pill" style="background: rgba(16, 185, 129, 0.18); border-color: #10B981; color: #10B981;">✓ ${isAr ? 'سكشن فقط' : 'Section Only'}</span>`;
    } else if (isLabSelected && !isDocSelected && !isSecSelected) {
      statusBadgeHtml = `<span class="selected-badge-pill" style="background: rgba(139, 92, 246, 0.18); border-color: #8B5CF6; color: #8B5CF6;">✓ ${isAr ? 'معمل فقط' : 'Lab Only'}</span>`;
    } else if (isDocSelected && isSecSelected && !isLabSelected) {
      statusBadgeHtml = `<span class="selected-badge-pill">✓ ${isAr ? 'دكتور + سكشن' : 'Doctor + Section'}</span>`;
    } else if (isDocSelected && isLabSelected && !isSecSelected) {
      statusBadgeHtml = `<span class="selected-badge-pill">✓ ${isAr ? 'دكتور + معمل' : 'Doctor + Lab'}</span>`;
    } else if (isSecSelected && isLabSelected && !isDocSelected) {
      statusBadgeHtml = `<span class="selected-badge-pill">✓ ${isAr ? 'سكشن + معمل' : 'Section + Lab'}</span>`;
    } else if (isAnySelected) {
      statusBadgeHtml = `<span class="selected-badge-pill">✓ ${isAr ? 'تم اختياره' : 'Selected'}</span>`;
    }

    const lectSessions = (grp.sessions || []).filter(isLectureSession);
    const secSessions = (grp.sessions || []).filter(isSectionSession);
    const labSessions = (grp.sessions || []).filter(isLabSession);

    const docNames = Array.from(new Set(
      lectSessions.map(s => (s.instructor || '').trim()).filter(Boolean)
    ));
    if (docNames.length === 0 && (grp.instructors || []).length > 0) {
      docNames.push(...grp.instructors);
    }
    const docDisplay = docNames.length > 0 ? docNames.join(', ') : (isAr ? 'غير محدد' : 'Not Specified');

    const secNames = Array.from(new Set(
      secSessions.map(s => (s.instructor || '').trim()).filter(Boolean)
    ));
    const secDisplay = secNames.length > 0 ? secNames.join(', ') : (isAr ? 'غير محدد' : 'Not Specified');

    const labNames = Array.from(new Set(
      labSessions.map(s => (s.instructor || '').trim()).filter(Boolean)
    ));
    const labDisplay = labNames.length > 0 ? labNames.join(', ') : (isAr ? 'غير محدد' : 'Not Specified');

    let customizeControlsHtml = '';
    if (state.manualCustomizeDocTA) {
      customizeControlsHtml = `
        <div class="manual-customize-controls">
          ${lectSessions.length > 0 ? `
          <button type="button" class="manual-component-btn is-doctor ${isDocSelected ? 'is-selected' : ''}"
                  onclick="App.selectManualComponent('${courseId}', '${grp.group}', 'doctor', event)"
                  title="${isAr ? 'انقر لإضافة / إزالة دكتور هذه المجموعة (المحاضرات) من الجدول' : 'Click to add/remove this Doctor (Lectures) to/from timetable'}">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.15rem;">👨‍🏫</span>
              <div>
                <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent-primary); letter-spacing: 0.5px;">
                  ${isAr ? 'الدكتور (المحاضرات)' : 'Doctor (Lectures)'}
                </div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">
                  ${docDisplay}
                </div>
              </div>
            </div>
            <span class="manual-component-action-chip ${isDocSelected ? 'is-active' : 'is-inactive'}">
              ${isDocSelected ? (isAr ? '✓ مضاف للجدول' : '✓ In Timetable') : (isAr ? '➕ إضافة الدكتور' : '➕ Add Doctor')}
            </span>
          </button>
          ` : ''}

          ${secSessions.length > 0 ? `
          <button type="button" class="manual-component-btn is-section ${isSecSelected ? 'is-selected' : ''}"
                  onclick="App.selectManualComponent('${courseId}', '${grp.group}', 'section', event)"
                  title="${isAr ? 'انقر لإضافة / إزالة سكشن هذه المجموعة من الجدول' : 'Click to add/remove this Section to/from timetable'}">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.15rem;">📝</span>
              <div>
                <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #10B981; letter-spacing: 0.5px;">
                  ${isAr ? 'السكشن (التمارين)' : 'Section'}
                </div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">
                  ${secDisplay}
                </div>
              </div>
            </div>
            <span class="manual-component-action-chip ${isSecSelected ? 'is-active' : 'is-inactive'}">
              ${isSecSelected ? (isAr ? '✓ مضاف للجدول' : '✓ In Timetable') : (isAr ? '➕ إضافة السكشن' : '➕ Add Section')}
            </span>
          </button>
          ` : ''}

          ${labSessions.length > 0 ? `
          <button type="button" class="manual-component-btn is-lab ${isLabSelected ? 'is-selected' : ''}"
                  onclick="App.selectManualComponent('${courseId}', '${grp.group}', 'lab', event)"
                  title="${isAr ? 'انقر لإضافة / إزالة معمل هذه المجموعة من الجدول' : 'Click to add/remove this Lab to/from timetable'}">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.15rem;">🔬</span>
              <div>
                <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #8B5CF6; letter-spacing: 0.5px;">
                  ${isAr ? 'المعمل' : 'Lab'}
                </div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">
                  ${labDisplay}
                </div>
              </div>
            </div>
            <span class="manual-component-action-chip ${isLabSelected ? 'is-active' : 'is-inactive'}">
              ${isLabSelected ? (isAr ? '✓ مضاف للجدول' : '✓ In Timetable') : (isAr ? '➕ إضافة المعمل' : '➕ Add Lab')}
            </span>
          </button>
          ` : ''}
        </div>
      `;
    }

    const sessionsHtml = (grp.sessions || []).map(s => {
      const isLect = isLectureSession(s);
      const isLab = isLabSession(s);
      const isSec = isSectionSession(s);

      const timeStr = ScheduleRenderer.formatSlotTimeRange(s.startSlot, s.endSlot);
      const typeClass = isLab ? 'lab-item' : (isSec ? 'sec-item' : 'lect-item');
      const typeName = isAr ? (isLab ? 'معمل' : (isSec ? 'سكشن' : 'محاضرة')) : s.type;
      const docBadge = s.instructor ? getSessionDoctorPrefBadgeHtml(course, s.instructor, isAr) : '';

      const clickRole = isLect ? 'doctor' : (isLab ? 'lab' : 'section');
      const roleLabel = isAr ? (isLect ? 'المحاضرة' : (isLab ? 'المعمل' : 'السكشن')) : (isLect ? 'Doctor' : (isLab ? 'Lab' : 'Section'));
      const clickAttr = state.manualCustomizeDocTA
        ? `onclick="App.selectManualComponent('${courseId}', '${grp.group}', '${clickRole}', event)" style="cursor: pointer;" title="${isAr ? `انقر لنقل ${roleLabel} إلى الجدول` : `Click to toggle ${roleLabel} in timetable`}"`
        : '';

      return `
        <div class="manual-session-item ${typeClass}" ${clickAttr}>
          <span><strong>${typeName}</strong>: ${s.day} (${timeStr})</span>
          <span>${s.instructor ? `👨‍🏫 ${s.instructor}` : ''} ${docBadge}</span>
        </div>
      `;
    }).join('');

    const btnLabel = state.manualCustomizeDocTA
      ? (isFullSelected
          ? (isAr ? '❌ إلغاء المجموعة بالكامل' : '❌ Deselect Entire Group')
          : (isAr ? '➕ اختيار المجموعة بالكامل' : '➕ Select Entire Group'))
      : (isAnySelected
          ? (isAr ? '❌ إلغاء الاختيار' : '❌ Deselect Group')
          : (isAr ? '➕ اختيار المجموعة' : '➕ Select Group'));

    const btnStyle = isFullSelected || (!state.manualCustomizeDocTA && isAnySelected)
      ? 'color: var(--danger); border-color: var(--danger);'
      : '';

    const btnClass = (isFullSelected || (!state.manualCustomizeDocTA && isAnySelected))
      ? 'btn-outline'
      : (isClashing ? 'btn-secondary' : 'btn-primary');

    return `
      <div class="${cardClass}" style="${isDocExplorer ? `border-inline-start: 5px solid ${color || '#3B82F6'};` : ''}">
        <div class="manual-group-header">
          <div class="manual-group-title">
            ${isDocExplorer ? `
              <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                <span style="color: ${color || 'var(--text-primary)'}; font-weight: 800;">${courseCode || courseName}</span>
                ${isAnySelected && isCourseConflict ? getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لهذه المادة' : 'Multiple groups selected for this subject') : ''}
              </div>
            ` : `
              <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                <span>Group ${grp.group}</span>
                ${isAnySelected && isCourseConflict ? getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لهذه المادة' : 'Multiple groups selected for this subject') : ''}
              </div>
            `}
            ${isDocExplorer ? `<span class="mini-group-tag" style="background: var(--bg-primary); border: 1px solid var(--border-color); font-weight: 800;">Group ${grp.group}</span>` : ''}
            ${!isDocExplorer && isDocMatch ? `<span class="doc-highlight-pill">⭐ ${isAr ? 'مجموعة الدكتور' : "Doctor's Group"}</span>` : ''}
            ${prefBadgesHtml}
          </div>
          <div>
            ${statusBadgeHtml}
            ${isClashing ? (
              isSoftClash
                ? `<span class="clash-warning-text is-warning" style="padding: 2px 6px; font-size: 0.72rem;">⚠️ ${isAr ? 'محاضرة مشتركة' : 'Combined'}</span>`
                : `<span class="clash-warning-text" style="padding: 2px 6px; font-size: 0.72rem;">⚠️ ${isAr ? 'تعارض' : 'Clash'}</span>`
            ) : ''}
          </div>
        </div>

        ${isDocExplorer ? `
          <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
            <strong>${courseName}</strong>
          </div>
        ` : ''}

        ${customizeControlsHtml}

        <div class="manual-sessions-list">
          ${sessionsHtml}
        </div>

        ${isClashing ? `
          <div class="clash-warning-text ${isSoftClash ? 'is-warning' : ''}">
            <span>⚠️ ${conflict.detail}</span>
          </div>
        ` : ''}

        <div style="margin-top: 6px; display: flex; justify-content: flex-end;">
          <button class="btn ${btnClass} btn-sm"
                  style="${btnStyle}"
                  onclick="App.selectManualGroup('${courseId}', '${grp.group}')">
            <span>${btnLabel}</span>
          </button>
        </div>
      </div>
    `;
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
          const isUnspecTarget = isUnspecifiedDoctor(targetDoctor);
          const inGrp = (grp.instructors || []).some(i => {
            if (isUnspecTarget) return isUnspecifiedDoctor(i);
            return i.trim() === targetDoctor || (typeof ScheduleOptimizer !== 'undefined' && ScheduleOptimizer.matchesDoctor(i, targetDoctor));
          });
          const inSess = (grp.sessions || []).some(s => {
            const isLect = s.type === 'Lect.' || /Lect|محاضرة/i.test(s.type || '');
            if (isUnspecTarget) return isLect && (!s.instructor || isUnspecifiedDoctor(s.instructor));
            return (s.instructor || '').trim() === targetDoctor || (typeof ScheduleOptimizer !== 'undefined' && ScheduleOptimizer.matchesDoctor(s.instructor, targetDoctor));
          });
          if (inGrp || inSess) matches = true;
        }

        if (query) {
          const docMatches = (grp.instructors || []).some(i => i.toLowerCase().includes(query)) ||
            (grp.sessions || []).some(s => (s.instructor || '').toLowerCase().includes(query));
          const courseMatches = (course.name || '').toLowerCase().includes(query) || (course.code || '').toLowerCase().includes(query);
          if (docMatches || courseMatches) matches = true;
        }

        if (matches) {
          if (state.manualHideAvoided !== false) {
            const prefSummary = getGroupDoctorPrefSummary(course, grp);
            const isSelected = !!state.manualSchedule[`${course.id}:::${grp.group}`] ||
              !!state.manualSchedule[`${course.id}:::${grp.group}:::doctor`] ||
              !!state.manualSchedule[`${course.id}:::${grp.group}:::section`] ||
              !!state.manualSchedule[`${course.id}:::${grp.group}:::lab`] ||
              !!state.manualSchedule[`${course.id}:::${grp.group}:::ta`];
            if (!isSelected && prefSummary.hasAvoid) return;
          }
          matchingGroups.push({
            course,
            grp
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
      html += renderManualGroupCardHtml(item.course, item.grp, { isDocExplorer: true });
    });
    html += `</div>`;
    container.innerHTML = html;
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
      const status = getCourseGroupStatus(course.id);
      const isMultiCourse = status.isConflict;

      // Filter groups according to manualHideAvoided setting
      const hideAvoided = state.manualHideAvoided !== false;
      const courseHasMandate = (course.groups || []).some(g => getGroupDoctorPrefSummary(course, g).hasMandate);

      const visibleGroups = (course.groups || []).filter(grp => {
        if (!hideAvoided) return true;
        const prefSummary = getGroupDoctorPrefSummary(course, grp);
        const isSelected = !!state.manualSchedule[`${course.id}:::${grp.group}`] ||
          !!state.manualSchedule[`${course.id}:::${grp.group}:::doctor`] ||
          !!state.manualSchedule[`${course.id}:::${grp.group}:::section`] ||
          !!state.manualSchedule[`${course.id}:::${grp.group}:::lab`] ||
          !!state.manualSchedule[`${course.id}:::${grp.group}:::ta`];
        if (isSelected) return true; // keep user's active picks visible
        if (courseHasMandate && !prefSummary.hasMandate) return false;
        if (prefSummary.hasAvoid) return false;
        return true;
      });

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
              ${!status.hasSelection
                ? `<span style="font-size: 0.8rem; color: var(--text-muted);">${isAr ? 'لم يتم اختيار مجموعة بعد' : 'No group selected'}</span>`
                : (status.isConflict
                    ? `<span class="multi-groups-badge" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #EF4444; font-weight: 700; font-size: 0.82rem; padding: 4px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;">
                        ${getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لنفس المقرر' : 'Multiple groups selected for this subject')}
                        <span>${status.label}</span>
                       </span>`
                    : `<span class="selected-badge-pill" style="font-size: 0.82rem; padding: 4px 10px;">${status.label}</span>`
                  )
              }
            </div>
          </div>

          <div class="manual-course-groups-row">
            ${visibleGroups.length === 0 ? `
              <div style="font-size: 0.82rem; color: var(--text-muted); padding: 12px 16px; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px dashed var(--border-color); font-style: italic; width: 100%;">
                ${isAr
                  ? 'تم إخفاء مجموعات هذا المقرر نظراً لاستبعاد دكاترتها أو وجود دكتور إجباري. يمكنك إلغاء تفعيل خيار "إخفاء الدكاترة المستبعدين" بالأعلى لعرض كافة المجموعات.'
                  : 'All groups for this course are hidden by doctor preferences (avoided or mandated filter). Uncheck "Hide Avoided Doctors" above to display all groups.'}
              </div>
            ` : visibleGroups.map(grp => {
              let isDocMatch = false;
              if (targetDoctor) {
                const isUnspecTarget = isUnspecifiedDoctor(targetDoctor);
                const inGrp = (grp.instructors || []).some(i => {
                  if (isUnspecTarget) return isUnspecifiedDoctor(i);
                  return i.trim() === targetDoctor || (typeof ScheduleOptimizer !== 'undefined' && ScheduleOptimizer.matchesDoctor(i, targetDoctor));
                });
                const inSess = (grp.sessions || []).some(s => {
                  const isLect = s.type === 'Lect.' || /Lect|محاضرة/i.test(s.type || '');
                  if (isUnspecTarget) return isLect && (!s.instructor || isUnspecifiedDoctor(s.instructor));
                  return (s.instructor || '').trim() === targetDoctor || (typeof ScheduleOptimizer !== 'undefined' && ScheduleOptimizer.matchesDoctor(s.instructor, targetDoctor));
                });
                if (inGrp || inSess) isDocMatch = true;
              } else if (query) {
                const inGrp = (grp.instructors || []).some(i => i.toLowerCase().includes(query));
                const inSess = (grp.sessions || []).some(s => (s.instructor || '').toLowerCase().includes(query));
                if (inGrp || inSess) isDocMatch = true;
              }

              return renderManualGroupCardHtml(course, grp, { isDocExplorer: false, isDocMatch });
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
   * Selects or deselects an entire group for a course in Manual Mode (keeps both Doctor & TA)
   */
  function selectManualGroup(courseId, groupName) {
    const isAr = state.currentLang === 'ar';
    const course = state.courses.find(c => c.id === courseId || c.code === courseId);
    if (!course) return;

    const groupData = (course.groups || []).find(g => g.group === groupName);
    if (!groupData) return;

    const fullKey = `${course.id}:::${groupName}`;
    const docKey = `${course.id}:::${groupName}:::doctor`;
    const secKey = `${course.id}:::${groupName}:::section`;
    const labKey = `${course.id}:::${groupName}:::lab`;
    const taKey = `${course.id}:::${groupName}:::ta`;

    const isFullySelected = !!state.manualSchedule[fullKey] &&
      (!state.manualSchedule[fullKey].componentType || state.manualSchedule[fullKey].componentType === 'all');

    if (isFullySelected) {
      delete state.manualSchedule[fullKey];
      delete state.manualSchedule[docKey];
      delete state.manualSchedule[secKey];
      delete state.manualSchedule[labKey];
      delete state.manualSchedule[taKey];
      showToast(isAr ? `تم إلغاء اختيار مجموعة ${groupName} لمقرر ${course.name}` : `Deselected Group ${groupName} for ${course.name}`, 'info');
    } else {
      // Clear any other selections for this course (including individual doctor/sec/lab picks)
      Object.keys(state.manualSchedule).forEach(k => {
        const item = state.manualSchedule[k];
        if (item && (item.courseId === course.id || item.courseCode === course.code)) {
          delete state.manualSchedule[k];
        }
      });

      state.manualSchedule[fullKey] = {
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
        group: groupName,
        color: course.color,
        componentType: 'all',
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
      if (conflict.clashing) {
        showToast(`⚠️ ${conflict.detail}`, 'warning');
      } else {
        showToast(isAr ? `تم اختيار مجموعة ${groupName} بالكامل لمقرر ${course.name}` : `Selected Entire Group ${groupName} for ${course.name}`, 'success');
      }
    }

    saveStateToStorage();
    renderManualStatusBanner();
    renderManualDoctorGroups();
    renderManualCoursesPicker();
    renderManualTimetable();
  }

  /**
   * Deselects a group or custom component directly from a timetable card click or button
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

    delete state.manualSchedule[`${cid}:::${groupName}`];
    delete state.manualSchedule[`${cid}:::${groupName}:::doctor`];
    delete state.manualSchedule[`${cid}:::${groupName}:::section`];
    delete state.manualSchedule[`${cid}:::${groupName}:::lab`];
    delete state.manualSchedule[`${cid}:::${groupName}:::ta`];
    delete state.manualSchedule[`${courseId}:::${groupName}`];
    delete state.manualSchedule[`${courseId}:::${groupName}:::doctor`];
    delete state.manualSchedule[`${courseId}:::${groupName}:::section`];
    delete state.manualSchedule[`${courseId}:::${groupName}:::lab`];
    delete state.manualSchedule[`${courseId}:::${groupName}:::ta`];
    delete state.manualSchedule[courseId];
    delete state.manualSchedule[cid];

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
    const multiGroupCourseIds = getMultiGroupCourses();
    const hasMultiGroup = multiGroupCourseIds.length > 0;
    const conflictResult = checkManualConflicts();
    const hasConflict = conflictResult.hasConflict;

    const allSessions = [];
    selectedEntries.forEach(grp => {
      (grp.sessions || []).forEach(s => allSessions.push(s));
    });
    const daysSet = new Set(allSessions.map(s => s.day));

    const multiWarnText = hasMultiGroup
      ? `${getRedErrorTriangleSvg(isAr ? 'تم اختيار أكثر من مجموعة لنفس المقرر' : 'Multiple groups selected for this subject')} <span>${isAr ? `تنبيه: تم اختيار أكثر من مجموعة لنفس المقرر (${multiGroupCourseIds.map(cid => { const c = state.courses.find(x => x.id === cid); return c ? c.name : cid; }).join('، ')})` : `Notice: More than one group selected for (${multiGroupCourseIds.map(cid => { const c = state.courses.find(x => x.id === cid); return c ? (c.code || c.name) : cid; }).join(', ')})`}</span>`
      : '';

    // Check if any courses have customized doctor, section & lab active
    const customizedCourses = state.courses.filter(c => {
      const st = getCourseGroupStatus(c.id);
      return !st.isConflict && st.items.length > 1;
    });
    const customizedNotice = customizedCourses.length > 0
      ? `<div style="font-size: 0.78rem; color: var(--accent-primary); margin-top: 4px; display: flex; align-items: center; gap: 4px; font-weight: 600;">
           <span>🔀</span>
           <span>${isAr ? `تخصيص المواعيد مفعل: (${customizedCourses.map(c => `${c.name} [${getCourseGroupStatus(c.id).label}]`).join('، ')})` : `Custom components active: (${customizedCourses.map(c => `${c.code || c.name} [${getCourseGroupStatus(c.id).label}]`).join(', ')})`}</span>
         </div>`
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
            ${customizedNotice}
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
            ${customizedNotice}
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
          ${customizedNotice}
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
          ${customizedNotice}
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
          ${customizedNotice}
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
      let roleTag = '';
      if (grp.componentType === 'doctor') roleTag = 'Lect';
      else if (grp.componentType === 'section') roleTag = 'Sec';
      else if (grp.componentType === 'lab') roleTag = 'Lab';
      else if (grp.componentType === 'ta') roleTag = 'Sec/Lab';

      const grpLabel = roleTag ? `${roleTag} ${grp.group}` : grp.group;

      courseGroupsMap[grp.courseId] = (courseGroupsMap[grp.courseId] || []);
      courseGroupsMap[grp.courseId].push(grpLabel);

      selectedGroups.push({
        courseId: grp.courseId,
        courseName: grp.courseName,
        courseCode: grp.courseCode,
        group: grpLabel,
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
    const multiGroupCourseIds = getMultiGroupCourses();

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

    if (multiGroupCourseIds.length > 0) {
      badges.push({
        text: isAr ? `⚠️ ${multiGroupCourseIds.length} مواد بأكثر من مجموعة` : `⚠️ ${multiGroupCourseIds.length} Multi-Group Courses`,
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

    ScheduleRenderer.renderTimetable(sol, container, state.currentLang, state.blockedTimes, state.courses);
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

    if (type === 'txt') {
      handleExportTxt('manual');
    } else if (type === 'png') {
      ScheduleExporter.exportToPng(sol);
    } else if (type === 'ics') {
      ScheduleExporter.downloadIcsFile(sol, 'custom_college_timetable.ics');
    } else if (type === 'print') {
      ScheduleExporter.printTimetable();
    }
  }

  let currentTxtSolution = null;
  let currentTxtSource = 'opt'; // 'opt' | 'manual' | 'mixmatch'

  /**
   * Main text export handler for Tab 3 (Optimizer), Tab 4 (Manual), and Tab 5 (Mix & Match)
   */
  function handleExportTxt(source = 'opt') {
    const isAr = state.currentLang === 'ar';
    currentTxtSource = source;

    let sol = null;
    let fileName = null;

    if (source === 'opt') {
      const activeList = getActiveSolutions();
      sol = activeList[state.activeSolutionIndex];
      const rank = sol ? (sol.rank || state.activeSolutionIndex + 1) : 1;
      fileName = `Schedule_Option_${rank}_Groups.txt`;
    } else if (source === 'manual') {
      sol = getManualSolution();
      fileName = 'Manual_Schedule_Groups.txt';
    } else if (source === 'mixmatch') {
      sol = getMixMatchSolution();
      fileName = 'Mixed_Schedule_Groups.txt';
    }

    if (!sol || !sol.sessions || sol.sessions.length === 0) {
      showToast(isAr ? 'لا يوجد جدول محدد لتصديره كملف نصي.' : 'No schedule selected to export.', 'error');
      return;
    }

    currentTxtSolution = sol;

    // 1. Download formatted text file directly
    ScheduleExporter.downloadTxtFile(sol, fileName, state.courses);

    // 2. Copy formatted text to clipboard
    const textContent = ScheduleExporter.generateScheduleText(sol, state.courses);
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(textContent).catch(() => {});
    }

    // 3. Open modal showing the exact text with copy and download controls
    openScheduleTxtModal(source, sol);

    showToast(
      isAr
        ? 'تم تصدير الجدول كملف نصي ونسخه للحافظة بنجاح! 📄'
        : 'Schedule exported to text file & copied to clipboard! 📄',
      'success'
    );
  }

  function getMixMatchSolution() {
    const allSelected = getMixMatchAllSelectedSessions();
    return {
      id: 'sol_mixmatch_export',
      rank: 1,
      totalScore: 100,
      totalGapSlots: 0,
      activeDaysCount: new Set(allSelected.map(s => s.day)).size,
      sessions: allSelected
    };
  }

  function exportMixMatchTxt() {
    handleExportTxt('mixmatch');
  }

  function openScheduleTxtModal(source = 'opt', sol = null) {
    const modal = document.getElementById('modal-schedule-txt');
    if (!modal) return;

    currentTxtSource = source;
    currentTxtSolution = sol || (source === 'opt' ? getActiveSolutions()[state.activeSolutionIndex] : (source === 'manual' ? getManualSolution() : getMixMatchSolution()));

    const isAr = state.currentLang === 'ar';
    const titleEl = document.getElementById('schedule-txt-modal-title');
    const tabsEl = document.getElementById('schedule-txt-scope-tabs');

    if (source === 'opt') {
      if (tabsEl) tabsEl.style.display = 'inline-flex';
      const rank = currentTxtSolution ? (currentTxtSolution.rank || state.activeSolutionIndex + 1) : 1;
      if (titleEl) titleEl.textContent = isAr ? `نص مجموعات الجدول (خيار #${rank})` : `Schedule Groups Text (Option #${rank})`;
    } else {
      if (tabsEl) tabsEl.style.display = 'none';
      if (titleEl) titleEl.textContent = isAr ? 'نص مجموعات المقررات المحددة' : 'Selected Course Groups Text';
    }

    toggleScheduleTxtScope('current');
    modal.style.display = 'flex';
  }

  function closeScheduleTxtModal() {
    const modal = document.getElementById('modal-schedule-txt');
    if (modal) modal.style.display = 'none';
  }

  function toggleScheduleTxtScope(scope) {
    const textarea = document.getElementById('schedule-txt-content');
    const currentBtn = document.getElementById('btn-tab-txt-current');
    const allBtn = document.getElementById('btn-tab-txt-all');
    if (!textarea) return;

    if (currentBtn) currentBtn.classList.toggle('active', scope === 'current');
    if (allBtn) allBtn.classList.toggle('active', scope === 'all');

    if (scope === 'current') {
      const text = ScheduleExporter.generateScheduleText(currentTxtSolution, state.courses);
      textarea.value = text;
    } else {
      const activeList = getActiveSolutions();
      const blocks = activeList.map((sol, idx) => {
        const rank = sol.rank || (idx + 1);
        const text = ScheduleExporter.generateScheduleText(sol, state.courses);
        return `=== Schedule Option #${rank} ===\r\n${text}`;
      });
      textarea.value = blocks.join('\r\n\r\n');
    }
  }

  function copyScheduleTxtContent() {
    const textarea = document.getElementById('schedule-txt-content');
    const isAr = state.currentLang === 'ar';
    if (textarea && textarea.value) {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(textarea.value).then(() => {
          showToast(isAr ? 'تم نسخ النص إلى الحافظة بنجاح! 📋' : 'Schedule text copied to clipboard! 📋', 'success');
        }).catch(() => {
          textarea.select();
          document.execCommand('copy');
          showToast(isAr ? 'تم نسخ النص إلى الحافظة! 📋' : 'Schedule text copied! 📋', 'success');
        });
      } else {
        textarea.select();
        document.execCommand('copy');
        showToast(isAr ? 'تم نسخ النص إلى الحافظة! 📋' : 'Schedule text copied! 📋', 'success');
      }
    }
  }

  function downloadScheduleTxtFromModal() {
    const allBtn = document.getElementById('btn-tab-txt-all');
    const isAll = allBtn && allBtn.classList.contains('active');
    const isAr = state.currentLang === 'ar';

    if (isAll && currentTxtSource === 'opt') {
      const activeList = getActiveSolutions();
      ScheduleExporter.downloadAllSchedulesTxt(activeList, 'All_Schedules_Groups.txt', state.courses);
      showToast(isAr ? 'تم تحميل جميع الجداول كملف نصي! 📄' : 'Downloaded all schedules as text file! 📄', 'success');
    } else {
      let fileName = 'Schedule_Groups.txt';
      if (currentTxtSource === 'opt') {
        const rank = currentTxtSolution ? (currentTxtSolution.rank || state.activeSolutionIndex + 1) : 1;
        fileName = `Schedule_Option_${rank}_Groups.txt`;
      } else if (currentTxtSource === 'manual') {
        fileName = 'Manual_Schedule_Groups.txt';
      } else if (currentTxtSource === 'mixmatch') {
        fileName = 'Mixed_Schedule_Groups.txt';
      }
      ScheduleExporter.downloadTxtFile(currentTxtSolution, fileName, state.courses);
      showToast(isAr ? 'تم تحميل الجدول كملف نصي! 📄' : 'Downloaded schedule as text file! 📄', 'success');
    }
  }

  /**
   * Helper: returns the list of solutions currently active (filtered solutions or all solutions)
   */
  function getActiveSolutions() {
    if (state.filteredSolutions && state.filteredSolutions.length > 0) {
      return state.filteredSolutions;
    }
    return state.solutions || [];
  }

  /**
   * Helper: returns maximum number of solutions to display/navigate
   */
  function getMaxDisplayedLimit() {
    const raw = state.timetableFilters && state.timetableFilters.maxOptions;
    if (!raw || raw === 'all') return Infinity;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed <= 0 ? Infinity : parsed;
  }

  /**
   * Helper: returns the list of solutions to display/navigate based on user's maxOptions limit
   */
  function getDisplayedSolutions() {
    const activeList = getActiveSolutions();
    const limit = getMaxDisplayedLimit();
    if (limit === Infinity || activeList.length <= limit) {
      return activeList;
    }
    return activeList.slice(0, limit);
  }

  /**
   * Helper: calculates max classes / sessions in a single day for a solution
   */
  function getMaxClassesPerDay(solution) {
    if (!solution || !solution.sessions) return 0;
    const dayCounts = {};
    solution.sessions.forEach(s => {
      dayCounts[s.day] = (dayCounts[s.day] || 0) + 1;
    });
    const counts = Object.values(dayCounts);
    return counts.length > 0 ? Math.max(...counts) : 0;
  }

  /**
   * Helper: calculates early finish score (higher = finishes earlier in the day)
   */
  function getEarlyScore(solution) {
    if (!solution || !solution.sessions) return 0;
    let score = 0;
    solution.sessions.forEach(s => {
      score += (16 - (s.endSlot || 16));
    });
    return score;
  }

  /**
   * Helper: returns array of visible chip items to display in the selector.
   * Windowed pagination prevents flooding the DOM with hundreds of buttons:
   * Shows: First schedule (#1), Last schedule (#total), and a 5-schedule window
   * (2 behind, current, and 2 after the active schedule).
   */
  function getVisibleSolutionChips(total, current) {
    if (total <= 7) {
      const items = [];
      for (let i = 0; i < total; i++) {
        items.push({ type: 'solution', index: i });
      }
      return items;
    }

    let start = current - 2;
    let end = current + 2;

    // When near the start (e.g. default view at index 0), show 5 consecutive options (0, 1, 2, 3, 4)
    if (start < 0) {
      end += (0 - start);
      start = 0;
    }
    // When near the end, show 5 consecutive options up to the last
    if (end >= total) {
      start -= (end - (total - 1));
      end = total - 1;
    }
    start = Math.max(0, start);
    end = Math.min(total - 1, end);

    const set = {};
    set[0] = true;
    set[total - 1] = true;
    for (let i = start; i <= end; i++) {
      set[i] = true;
    }

    const sorted = Object.keys(set).map(Number).sort((a, b) => a - b);

    // If gap between consecutive indices is 2 (e.g. index 0 and 2), fill single missing item (1)
    const filled = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] === 2) {
        filled.push(sorted[i - 1] + 1);
      }
      filled.push(sorted[i]);
    }

    const items = [];
    for (let i = 0; i < filled.length; i++) {
      if (i > 0 && filled[i] - filled[i - 1] > 1) {
        items.push({
          type: 'ellipsis',
          from: filled[i - 1] + 1,
          to: filled[i] - 1
        });
      }
      items.push({ type: 'solution', index: filled[i] });
    }

    return items;
  }

  /**
   * Jump directly to a schedule number (1-based index)
   */
  function jumpToSchedule(value) {
    const displayedSolutions = getDisplayedSolutions();
    const total = displayedSolutions.length;
    if (total <= 0) return;

    let num = parseInt(value, 10);
    if (isNaN(num)) {
      const jumpInput = document.getElementById('schedule-jump-input');
      if (jumpInput) jumpInput.value = state.activeSolutionIndex + 1;
      return;
    }

    if (num < 1) num = 1;
    if (num > total) num = total;

    selectSolution(num - 1);
  }

  /**
   * Prompt user to jump to a schedule number when clicking ellipsis
   */
  function promptJumpToSchedule(from, to) {
    const isAr = state.currentLang === 'ar';
    const displayedSolutions = getDisplayedSolutions();
    const total = displayedSolutions.length;
    if (total <= 1) return;

    const jumpInput = document.getElementById('schedule-jump-input');
    if (jumpInput) {
      jumpInput.focus();
      jumpInput.select();
    }

    const defaultVal = from ? Math.round((from + to) / 2) : (state.activeSolutionIndex + 1);
    const promptMsg = isAr
      ? `أدخل رقم الجدول الذي تريد الانتقال إليه (1 إلى ${total}):`
      : `Enter schedule number to jump to (1 to ${total}):`;

    if (typeof window.prompt === 'function') {
      const userVal = window.prompt(promptMsg, String(defaultVal));
      if (userVal !== null && userVal.trim() !== '') {
        jumpToSchedule(userVal);
      }
    }
  }

  /**
   * Render solution chips / selector
   */
  function renderSolutionsSelector() {
    const container = document.getElementById('solutions-chips-container');
    if (!container) return;

    const isAr = state.currentLang === 'ar';
    const displayedSolutions = getDisplayedSolutions();
    const total = displayedSolutions.length;

    if (total === 0) {
      container.innerHTML = '';
      updateScheduleNavControls();
      return;
    }

    if (state.activeSolutionIndex >= total) {
      state.activeSolutionIndex = 0;
    }

    const visibleItems = getVisibleSolutionChips(total, state.activeSolutionIndex);

    let html = '';
    visibleItems.forEach(item => {
      if (item.type === 'ellipsis') {
        const jumpText = isAr
          ? `انتقال إلى جدول (${item.from + 1} - ${item.to + 1})`
          : `Jump to schedule (${item.from + 1} - ${item.to + 1})`;
        html += `
          <button type="button" class="sol-chip-ellipsis"
                  onclick="App.promptJumpToSchedule(${item.from + 1}, ${item.to + 1})"
                  title="${jumpText}" aria-label="${jumpText}">
            …
          </button>
        `;
      } else {
        const idx = item.index;
        const sol = displayedSolutions[idx];
        if (!sol) return;

        const isActive = idx === state.activeSolutionIndex;
        const titleText = state.filterMismatch
          ? (isAr ? `معاينة غير مصفاة #${sol.rank || 1}` : `Unfiltered Inspection #${sol.rank || 1}`)
          : (isAr ? `الخيار #${sol.rank || (idx + 1)}` : `Option #${sol.rank || (idx + 1)}`);
        const gapText = sol.totalGapSlots === 0
          ? (isAr ? '⚡ 0 فترات فراغ' : '⚡ 0 Gaps')
          : (isAr ? `☕ ${sol.totalGapSlots} فراغ` : `☕ ${sol.totalGapSlots} Gaps`);
        const daysText = isAr ? `${sol.activeDaysCount} أيام` : `${sol.activeDaysCount} Days`;

        html += `
          <button type="button" class="sol-chip ${isActive ? 'active' : ''} ${state.filterMismatch ? 'is-fallback-chip' : ''}"
                  data-index="${idx}"
                  onclick="App.selectSolution(${idx})"
                  title="${titleText}: ${gapText}, ${daysText}">
            <span class="sol-chip-title">${titleText}</span>
            <span class="sol-chip-meta">${gapText} • ${daysText}</span>
          </button>
        `;
      }
    });

    container.innerHTML = html;
    updateScheduleNavControls();
  }

  function updateScheduleNavControls() {
    const displayedSolutions = getDisplayedSolutions();
    const total = displayedSolutions.length;
    const current = total > 0 ? (state.activeSolutionIndex + 1) : 0;
    const isAr = state.currentLang === 'ar';

    const counterBadge = document.getElementById('schedule-counter-badge');
    if (counterBadge) {
      counterBadge.textContent = total > 0
        ? (isAr ? `${current} من ${total}` : `${current} / ${total}`)
        : (isAr ? '0 من 0' : '0 / 0');
    }

    const jumpInput = document.getElementById('schedule-jump-input');
    if (jumpInput) {
      jumpInput.value = current || '';
      jumpInput.min = '1';
      jumpInput.max = String(total || 1);
      jumpInput.disabled = total <= 1;
    }

    const prevBtn = document.getElementById('btn-prev-schedule');
    if (prevBtn) {
      prevBtn.disabled = total <= 1 || state.activeSolutionIndex <= 0;
    }

    const nextBtn = document.getElementById('btn-next-schedule');
    if (nextBtn) {
      nextBtn.disabled = total <= 1 || state.activeSolutionIndex >= total - 1;
    }

    const container = document.getElementById('solutions-chips-container');
    if (container) {
      const activeChip = container.querySelector('.sol-chip.active');
      if (activeChip) {
        // Horizontally scroll the chips container only, without scrolling the main window/page
        try {
          const chipLeft = activeChip.offsetLeft;
          const chipWidth = activeChip.offsetWidth;
          const containerWidth = container.clientWidth;
          const scrollTarget = chipLeft - (containerWidth / 2) + (chipWidth / 2);
          if (typeof container.scrollTo === 'function') {
            container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
          } else {
            container.scrollLeft = Math.max(0, scrollTarget);
          }
        } catch (e) {
          // Do not call activeChip.scrollIntoView as it forces the page/window to jump
        }
      }
    }
  }

  function nextSchedule() {
    const displayedSolutions = getDisplayedSolutions();
    const maxLen = displayedSolutions.length;
    if (maxLen <= 1) return;
    if (state.activeSolutionIndex < maxLen - 1) {
      selectSolution(state.activeSolutionIndex + 1);
    }
  }

  function prevSchedule() {
    const displayedSolutions = getDisplayedSolutions();
    const maxLen = displayedSolutions.length;
    if (maxLen <= 1) return;
    if (state.activeSolutionIndex > 0) {
      selectSolution(state.activeSolutionIndex - 1);
    }
  }

  function handleTimetableArrowNavigation(e) {
    if (state.currentTab !== 'timetable') return;

    const timetableSection = document.getElementById('tab-timetable');
    if (!timetableSection || timetableSection.style.display === 'none') return;

    const activeEl = document.activeElement;
    const tagName = activeEl?.tagName?.toUpperCase();
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || activeEl?.isContentEditable) {
      return;
    }

    const openModal = document.querySelector('.modal.active, .modal[style*="display: block"], .modal[style*="display: flex"]');
    if (openModal) return;

    const displayedSolutions = getDisplayedSolutions();
    const maxLen = displayedSolutions.length;
    if (maxLen <= 1) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSchedule();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSchedule();
    }
  }

  function selectSolution(index) {
    const displayedSolutions = getDisplayedSolutions();
    const maxLen = displayedSolutions.length;
    if (index >= 0 && index < maxLen) {
      // Capture current vertical and horizontal scroll positions
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const currentScrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;

      state.activeSolutionIndex = index;
      renderSolutionsSelector();
      renderCurrentSolution();

      // Maintain exact page scroll position so user doesn't jump to the top
      if (typeof window.scrollTo === 'function') {
        window.scrollTo(currentScrollX, currentScrollY);
      }
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
          window.scrollTo(currentScrollX, currentScrollY);
        });
      }
    }
  }

  function renderCurrentSolution() {
    const activeList = getActiveSolutions();
    const solution = activeList[state.activeSolutionIndex];
    const summaryContainer = document.getElementById('solution-summary-container');
    const timetableContainer = document.getElementById('timetable-render-container');

    if (solution) {
      ScheduleRenderer.renderSolutionSummary(solution, summaryContainer, state.currentLang);
      ScheduleRenderer.renderTimetable(solution, timetableContainer, state.currentLang, state.blockedTimes, state.courses);
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

  /* ==========================================================================
     Timetable Non-Negotiable Filters & 4 Presets Logic
     ========================================================================== */

  function handleTimetableFilterChange() {
    const maxDaysEl = document.getElementById('filter-max-days');
    const maxGapsEl = document.getElementById('filter-max-gaps');
    const maxClassesEl = document.getElementById('filter-max-classes-day');
    const maxOptionsEl = document.getElementById('filter-max-options');

    if (maxDaysEl) state.timetableFilters.maxDays = maxDaysEl.value;
    if (maxGapsEl) state.timetableFilters.maxGaps = maxGapsEl.value;
    if (maxClassesEl) state.timetableFilters.maxClassesPerDay = maxClassesEl.value;
    if (maxOptionsEl) state.timetableFilters.maxOptions = maxOptionsEl.value;

    saveStateToStorage();
    applyTimetableFilters();
  }

  function handlePresetChange(presetName) {
    state.timetableFilters.preset = presetName;

    document.querySelectorAll('.preset-choice-card').forEach(card => card.classList.remove('is-active'));
    const activeCard = document.getElementById(`preset-card-${presetName}`);
    if (activeCard) activeCard.classList.add('is-active');

    const radio = document.querySelector(`input[name="ranking-preset"][value="${presetName}"]`);
    if (radio) radio.checked = true;

    saveStateToStorage();
    applyTimetableFilters();
  }

  function resetTimetableFilters() {
    state.timetableFilters = {
      maxDays: 'any',
      maxGaps: 'any',
      maxClassesPerDay: 'any',
      maxOptions: 'all',
      preset: 'balanced'
    };

    const maxDaysEl = document.getElementById('filter-max-days');
    const maxGapsEl = document.getElementById('filter-max-gaps');
    const maxClassesEl = document.getElementById('filter-max-classes-day');
    const maxOptionsEl = document.getElementById('filter-max-options');
    if (maxDaysEl) maxDaysEl.value = 'any';
    if (maxGapsEl) maxGapsEl.value = 'any';
    if (maxClassesEl) maxClassesEl.value = 'any';
    if (maxOptionsEl) maxOptionsEl.value = 'all';

    document.querySelectorAll('.preset-choice-card').forEach(card => card.classList.remove('is-active'));
    const balCard = document.getElementById('preset-card-balanced');
    if (balCard) balCard.classList.add('is-active');
    const balRadio = document.querySelector('input[name="ranking-preset"][value="balanced"]');
    if (balRadio) balRadio.checked = true;

    closeFilterConflictModal();
    const banner = document.getElementById('filter-mismatch-banner');
    if (banner) banner.style.display = 'none';

    saveStateToStorage();
    applyTimetableFilters();
    showToast(state.currentLang === 'ar' ? 'تمت إعادة ضبط فلاتر الجداول' : 'Timetable filters reset.', 'info');
  }

  function closeFilterConflictModal() {
    const modal = document.getElementById('modal-filter-conflict');
    if (modal) modal.style.display = 'none';
  }

  function applyTimetableFilters() {
    if (!state.solutions || state.solutions.length === 0) {
      state.filteredSolutions = [];
      state.activeSolutionIndex = 0;
      state.filterMismatch = false;
      renderSolutionsSelector();
      renderCurrentSolution();
      return;
    }

    const { maxDays, maxGaps, maxClassesPerDay, preset } = state.timetableFilters;
    const isAr = state.currentLang === 'ar';

    const maxDaysNum = maxDays === 'any' ? Infinity : parseInt(maxDays, 10);
    const maxGapsNum = maxGaps === 'any' ? Infinity : parseInt(maxGaps, 10);
    const maxClassesNum = maxClassesPerDay === 'any' ? Infinity : parseInt(maxClassesPerDay, 10);

    const matched = state.solutions.filter(s => {
      const days = s.activeDaysCount;
      const gaps = s.totalGapSlots;
      const classes = getMaxClassesPerDay(s);
      return days <= maxDaysNum && gaps <= maxGapsNum && classes <= maxClassesNum;
    });

    const banner = document.getElementById('filter-mismatch-banner');
    const diagContainer = document.getElementById('filter-mismatch-diagnostics');
    const modal = document.getElementById('modal-filter-conflict');
    const modalDetails = document.getElementById('modal-filter-conflict-details');

    if (matched.length > 0) {
      // Sort matched solutions according to user's selected preset
      if (preset === 'minimum_days') {
        matched.sort((a, b) => (a.activeDaysCount - b.activeDaysCount) || (a.totalGapSlots - b.totalGapSlots) || (b.totalScore - a.totalScore));
      } else if (preset === 'minimal_gaps') {
        matched.sort((a, b) => (a.totalGapSlots - b.totalGapSlots) || (a.activeDaysCount - b.activeDaysCount) || (b.totalScore - a.totalScore));
      } else if (preset === 'early_schedule') {
        matched.sort((a, b) => (getEarlyScore(b) - getEarlyScore(a)) || (b.totalScore - a.totalScore));
      } else {
        // balanced
        matched.sort((a, b) => b.totalScore - a.totalScore);
      }

      state.filteredSolutions = matched;
      state.filterMismatch = false;
      if (state.activeSolutionIndex >= matched.length) {
        state.activeSolutionIndex = 0;
      }

      if (banner) banner.style.display = 'none';
      if (modal) modal.style.display = 'none';
    } else {
      // 0 MATCHES: STRICT NON-NEGOTIABLE FILTER CONFLICT
      // Provide 1 unfiltered schedule for inspection and trigger error modal & banner
      state.filterMismatch = true;
      const fallbackSol = state.solutions[0];
      state.filteredSolutions = [fallbackSol];
      state.activeSolutionIndex = 0;

      const minAvailDays = Math.min(...state.solutions.map(s => s.activeDaysCount));
      const minAvailGaps = Math.min(...state.solutions.map(s => s.totalGapSlots));
      const minAvailClasses = Math.min(...state.solutions.map(s => getMaxClassesPerDay(s)));

      const violations = [];
      if (maxDays !== 'any' && fallbackSol.activeDaysCount > maxDaysNum) {
        violations.push({
          type: 'days',
          label: isAr
            ? `❌ أيام النزول: ${fallbackSol.activeDaysCount} أيام (الفلتر المطلوب: أقصى حد ${maxDays} • أقل متاح: ${minAvailDays} أيام)`
            : `❌ Campus Days: ${fallbackSol.activeDaysCount} days (Your filter: Max ${maxDays} • Best available: ${minAvailDays} days)`
        });
      }
      if (maxGaps !== 'any' && fallbackSol.totalGapSlots > maxGapsNum) {
        violations.push({
          type: 'gaps',
          label: isAr
            ? `❌ فترات الفراغ: ${fallbackSol.totalGapSlots} فترات (الفلتر المطلوب: أقصى حد ${maxGaps} • أقل متاح: ${minAvailGaps} فترات)`
            : `❌ Gap Slots: ${fallbackSol.totalGapSlots} slots (Your filter: Max ${maxGaps} • Best available: ${minAvailGaps} slots)`
        });
      }
      const fallbackClasses = getMaxClassesPerDay(fallbackSol);
      if (maxClassesPerDay !== 'any' && fallbackClasses > maxClassesNum) {
        violations.push({
          type: 'classes',
          label: isAr
            ? `❌ أقصى حصص باليوم: ${fallbackClasses} حصص (الفلتر المطلوب: أقصى حد ${maxClassesPerDay} • أقل متاح: ${minAvailClasses} حصص)`
            : `❌ Max Classes / Day: ${fallbackClasses} classes (Your filter: Max ${maxClassesPerDay} • Best available: ${minAvailClasses} classes)`
        });
      }

      if (diagContainer) {
        diagContainer.innerHTML = violations.map(v => `<span class="violation-pill">${v.label}</span>`).join('');
      }
      if (banner) banner.style.display = 'block';

      if (modalDetails) {
        modalDetails.innerHTML = `
          <div style="margin-bottom: 8px; font-weight: 700; color: #EF4444;">
            ${isAr ? '⚠️ أسباب عدم وجود جداول تطابق اختياراتك:' : '⚠️ Why no schedules matched your filters:'}
          </div>
          <ul style="margin: 0; padding-inline-start: 20px;">
            ${violations.map(v => `<li style="margin-bottom: 6px;">${v.label}</li>`).join('')}
          </ul>
          <div style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted);">
            ${isAr
              ? 'تم إدراج جدول واحد بدون فلاتر في شاشة النتائج لتتمكن من معاينته ومعرفة الحصص التي تجاوزت الشروط.'
              : 'One unfiltered schedule has been loaded into the timetable results below so you can inspect where the limits are exceeded.'}
          </div>
        `;
      }
      if (modal) modal.style.display = 'flex';
    }

    renderSolutionsSelector();
    renderCurrentSolution();
  }

  /* ==========================================================================
     Tab 5: Mix & Match (Decoupled Doctors & TAs)
     ========================================================================== */

  function initMixMatchSelections() {
    if (!state.mixMatchSelections) state.mixMatchSelections = {};
    state.courses.forEach(course => {
      if (!state.mixMatchSelections[course.id]) {
        state.mixMatchSelections[course.id] = {
          lectGroup: null,
          secGroup: null,
          labGroup: null
        };
      }
    });
  }

  function getMixMatchAllSelectedSessions() {
    initMixMatchSelections();
    const allSessions = [];
    state.courses.forEach(course => {
      const sel = state.mixMatchSelections[course.id] || {};
      (course.groups || []).forEach(grp => {
        (grp.sessions || []).forEach(s => {
          const isLect = isLectureSession(s);
          const isSec = isSectionSession(s);
          const isLab = isLabSession(s);

          if ((isLect && sel.lectGroup === grp.group) ||
              (isSec && sel.secGroup === grp.group) ||
              (isLab && sel.labGroup === grp.group)) {
            allSessions.push({
              ...s,
              courseId: course.id,
              courseName: course.name,
              courseCode: course.code,
              color: course.color,
              group: grp.group
            });
          }
        });
      });
    });
    return allSessions;
  }

  function findMixMatchCollisions(allSessions) {
    const collisions = [];
    for (let i = 0; i < allSessions.length; i++) {
      for (let j = i + 1; j < allSessions.length; j++) {
        const s1 = allSessions[i];
        const s2 = allSessions[j];
        if (s1.day === s2.day) {
          if (Math.max(s1.startSlot, s2.startSlot) <= Math.min(s1.endSlot, s2.endSlot)) {
            const isSame = s1.id && s2.id && s1.id === s2.id;
            if (!isSame) {
              collisions.push({ s1, s2 });
            }
          }
        }
      }
    }
    return collisions;
  }

  function checkMixMatchOptionConflict(courseId, type, candidateGrp) {
    const isAr = state.currentLang === 'ar';
    const candSessions = (candidateGrp.sessions || []).filter(s => {
      if (type === 'lect') return isLectureSession(s);
      if (type === 'sec') return isSectionSession(s);
      if (type === 'lab') return isLabSession(s);
      return true;
    });

    const otherSelectedSessions = [];
    state.courses.forEach(course => {
      const sel = state.mixMatchSelections[course.id] || {};
      (course.groups || []).forEach(grp => {
        (grp.sessions || []).forEach(s => {
          const isLect = isLectureSession(s);
          const isSec = isSectionSession(s);
          const isLab = isLabSession(s);

          if (course.id === courseId) {
            if (type === 'lect' && isLect) return;
            if (type === 'sec' && isSec) return;
            if (type === 'lab' && isLab) return;
          }

          if ((isLect && sel.lectGroup === grp.group) ||
              (isSec && sel.secGroup === grp.group) ||
              (isLab && sel.labGroup === grp.group)) {
            otherSelectedSessions.push({ ...s, courseCode: course.code, courseName: course.name });
          }
        });
      });
    });

    for (const cSess of candSessions) {
      for (const oSess of otherSelectedSessions) {
        if (cSess.day === oSess.day) {
          if (Math.max(cSess.startSlot, oSess.startSlot) <= Math.min(cSess.endSlot, oSess.endSlot)) {
            const isSame = cSess.id && oSess.id && cSess.id === oSess.id;
            if (!isSame) {
              const name = oSess.courseCode || oSess.courseName;
              return {
                clashing: true,
                detail: isAr
                  ? `يتعارض مع ${name} (${oSess.type}) في ${cSess.day}`
                  : `Clashes with ${name} (${oSess.type}) on ${cSess.day}`
              };
            }
          }
        }
      }
    }
    return { clashing: false };
  }

  function selectMixMatchOption(courseId, sessionType, groupName) {
    initMixMatchSelections();
    if (!state.mixMatchSelections[courseId]) state.mixMatchSelections[courseId] = {};
    const current = state.mixMatchSelections[courseId][sessionType];
    state.mixMatchSelections[courseId][sessionType] = (current === groupName ? null : groupName);
    saveStateToStorage();
    renderMixMatchTab();
  }

  function resetMixMatchSelections() {
    state.mixMatchSelections = {};
    state.courses.forEach(c => {
      state.mixMatchSelections[c.id] = {
        lectGroup: null,
        secGroup: null,
        labGroup: null
      };
    });
    saveStateToStorage();
    renderMixMatchTab();
    showToast(state.currentLang === 'ar' ? 'تم إلغاء كافة الاختيارات بنجاح' : 'All selections cleared.', 'info');
  }

  function applyMixMatchToManual() {
    const isAr = state.currentLang === 'ar';
    const allMixed = getMixMatchAllSelectedSessions();
    if (allMixed.length === 0) {
      showToast(isAr ? 'برجاء اختيار حصة واحدة على الأقل أولاً.' : 'Please select at least one session in Mix & Match.', 'error');
      return;
    }

    state.manualSchedule = {};
    state.courses.forEach(course => {
      const courseSessions = allMixed.filter(s => s.courseId === course.id);
      if (courseSessions.length > 0) {
        const docs = courseSessions.map(s => s.instructor).filter(Boolean);
        state.manualSchedule[`${course.id}:::Mix`] = {
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          color: course.color,
          group: 'Mix',
          sessions: courseSessions,
          instructors: Array.from(new Set(docs))
        };
      }
    });

    saveStateToStorage();
    switchTab('manual');
    showToast(isAr ? 'تم تطبيق جدول الـ Mix & Match في الوضع اليدوي بنجاح! 🎯' : 'Mixed schedule applied to Manual Mode! 🎯', 'success');
  }

  function saveMixMatchAsCourseGroups() {
    const isAr = state.currentLang === 'ar';
    const allMixed = getMixMatchAllSelectedSessions();
    if (allMixed.length === 0) {
      showToast(isAr ? 'برجاء اختيار حصة واحدة على الأقل أولاً.' : 'Please select at least one session in Mix & Match.', 'error');
      return;
    }

    let updatedCount = 0;
    state.courses.forEach(course => {
      const courseSessions = allMixed.filter(s => s.courseId === course.id);
      if (courseSessions.length > 0) {
        if (!course.groups) course.groups = [];
        const mixGrpIdx = course.groups.findIndex(g => g.group === 'Mix');
        const docs = courseSessions.map(s => s.instructor).filter(Boolean);
        const newGrp = {
          group: 'Mix',
          sessions: courseSessions,
          hasLecture: courseSessions.some(isLectureSession),
          hasSection: courseSessions.some(isSectionSession),
          hasLab: courseSessions.some(isLabSession),
          instructors: Array.from(new Set(docs))
        };
        if (mixGrpIdx > -1) {
          course.groups[mixGrpIdx] = newGrp;
        } else {
          course.groups.push(newGrp);
        }
        updatedCount++;
      }
    });

    saveStateToStorage();
    showToast(
      isAr
        ? `تم حفظ التوفيقات كمجموعة "Mix" مخصصة في ${updatedCount} مادة! 💾 يمكنك استخدامها في الوضع اليدوي والمحسن.`
        : `Saved mixed selections as custom group "Mix" in ${updatedCount} courses! 💾`,
      'success'
    );
  }

  function toggleMixMatchCourseCollapse(courseId) {
    if (!state.mixMatchExpandedCourses) state.mixMatchExpandedCourses = {};
    state.mixMatchExpandedCourses[courseId] = !state.mixMatchExpandedCourses[courseId];
    renderMixMatchTab();
  }

  function expandAllMixMatchCourses() {
    if (!state.mixMatchExpandedCourses) state.mixMatchExpandedCourses = {};
    (state.courses || []).forEach(c => {
      state.mixMatchExpandedCourses[c.id] = true;
    });
    renderMixMatchTab();
  }

  function collapseAllMixMatchCourses() {
    if (!state.mixMatchExpandedCourses) state.mixMatchExpandedCourses = {};
    (state.courses || []).forEach(c => {
      state.mixMatchExpandedCourses[c.id] = false;
    });
    renderMixMatchTab();
  }

  function jumpToMixMatchCourse(courseId) {
    if (!state.mixMatchExpandedCourses) state.mixMatchExpandedCourses = {};
    state.mixMatchExpandedCourses[courseId] = true;
    renderMixMatchTab();
    setTimeout(() => {
      const el = document.getElementById(`mixmatch-card-${courseId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  }

  function jumpToMixMatchTimetable() {
    const el = document.getElementById('mixmatch-timetable-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function jumpToMixMatchPicker() {
    const el = document.getElementById('tab-mixmatch');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderMixMatchTab() {
    const container = document.getElementById('mixmatch-courses-container');
    const ttContainer = document.getElementById('mixmatch-timetable-render-container');
    const banner = document.getElementById('mixmatch-collision-banner');
    const toolbarContainer = document.getElementById('mixmatch-toolbar-container');
    if (!container) return;

    const isAr = state.currentLang === 'ar';

    if (!state.courses || state.courses.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 40px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-size: 48px; margin-bottom: 12px;">🔀</div>
          <h3>${isAr ? 'لم يتم إضافة مقررات بعد' : 'No Courses Added Yet'}</h3>
          <p style="color: var(--text-secondary);">${isAr ? 'يرجى إضافة مواد في التبويب الأول أو تحميل المقررات التجريبية.' : 'Please add courses in Tab 1 or click "Load Example Courses" first.'}</p>
        </div>
      `;
      if (toolbarContainer) toolbarContainer.innerHTML = '';
      if (ttContainer) ttContainer.innerHTML = '';
      if (banner) banner.style.display = 'none';
      return;
    }

    initMixMatchSelections();

    // Default expand state: first course open, remaining collapsed
    if (!state.mixMatchExpandedCourses) state.mixMatchExpandedCourses = {};
    if (Object.keys(state.mixMatchExpandedCourses).length === 0) {
      state.courses.forEach((c, idx) => {
        state.mixMatchExpandedCourses[c.id] = (idx === 0);
      });
    }

    const allSelected = getMixMatchAllSelectedSessions();
    const collisions = findMixMatchCollisions(allSelected);

    // Collision Warning Banner
    if (banner) {
      if (collisions.length > 0) {
        banner.style.display = 'block';
        const clashDetails = collisions.map(c => {
          const c1Name = c.s1.courseCode || c.s1.courseName;
          const c2Name = c.s2.courseCode || c.s2.courseName;
          const day = c.s1.day;
          const time = ScheduleRenderer.formatSlotTimeRange(Math.max(c.s1.startSlot, c.s2.startSlot), Math.min(c.s1.endSlot, c.s2.endSlot));
          return `<strong>${c1Name}</strong> (${c.s1.type} Grp ${c.s1.group}) ⚡ <strong>${c2Name}</strong> (${c.s2.type} Grp ${c.s2.group}) [${day} ${time}]`;
        }).join(' • ');
        banner.innerHTML = `
          <span>⚠️ <strong>${isAr ? 'تنبيه تعارض في التوفيقات المختارة:' : 'Mix Conflict Warning:'}</strong> ${clashDetails}</span>
        `;
      } else {
        banner.style.display = 'none';
      }
    }

    // Mix & Match Top Toolbar: Course Pills + View Actions
    if (toolbarContainer) {
      const pillsHtml = state.courses.map(course => {
        const sel = state.mixMatchSelections[course.id] || {};
        const groups = course.groups || [];
        const hasLect = groups.some(g => (g.sessions || []).some(isLectureSession));
        const hasSec = groups.some(g => (g.sessions || []).some(isSectionSession));
        const hasLab = groups.some(g => (g.sessions || []).some(isLabSession));
        const totalReq = (hasLect ? 1 : 0) + (hasSec ? 1 : 0) + (hasLab ? 1 : 0);

        let pickedCount = 0;
        if (hasLect && sel.lectGroup) pickedCount++;
        if (hasSec && sel.secGroup) pickedCount++;
        if (hasLab && sel.labGroup) pickedCount++;

        const isExpanded = !!state.mixMatchExpandedCourses[course.id];
        return `
          <button type="button" class="mixmatch-quick-pill ${isExpanded ? 'is-active' : ''}"
                  onclick="App.jumpToMixMatchCourse('${course.id}')"
                  title="${course.name}">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${course.color || '#3B82F6'}; display: inline-block; flex-shrink: 0;"></span>
            <span>${course.code || course.name}</span>
            <span class="mixmatch-pill-badge">${pickedCount}/${totalReq}</span>
          </button>
        `;
      }).join('');

      toolbarContainer.innerHTML = `
        <div class="mixmatch-toolbar">
          <div class="mixmatch-quick-pills">
            ${pillsHtml}
          </div>
          <div class="mixmatch-view-actions">
            <button type="button" class="btn btn-secondary btn-xs" onclick="App.expandAllMixMatchCourses()">
              ${isAr ? '📂 توسيع الكل' : '📂 Expand All'}
            </button>
            <button type="button" class="btn btn-secondary btn-xs" onclick="App.collapseAllMixMatchCourses()">
              ${isAr ? '📁 طي الكل' : '📁 Collapse All'}
            </button>
            <button type="button" class="btn btn-primary btn-xs" onclick="App.jumpToMixMatchTimetable()" style="font-weight: 700;">
              ${isAr ? '📅 معاينة الجدول ⬇️' : '📅 Preview Grid ⬇️'} (${allSelected.length})
            </button>
          </div>
        </div>
      `;
    }

    // Render Courses Accordion
    let coursesHtml = '';
    state.courses.forEach(course => {
      const sel = state.mixMatchSelections[course.id] || {};
      const groups = course.groups || [];

      const lectGroups = groups.filter(g => (g.sessions || []).some(isLectureSession));
      const secGroups = groups.filter(g => (g.sessions || []).some(isSectionSession));
      const labGroups = groups.filter(g => (g.sessions || []).some(isLabSession));

      const selectedLect = lectGroups.find(g => g.group === sel.lectGroup);
      const selectedSec = secGroups.find(g => g.group === sel.secGroup);
      const selectedLab = labGroups.find(g => g.group === sel.labGroup);

      const lectDocName = selectedLect ? ((selectedLect.sessions.find(isLectureSession) || {}).instructor || selectedLect.instructors?.[0] || '') : '';
      const secDocName = selectedSec ? ((selectedSec.sessions.find(isSectionSession) || {}).instructor || selectedSec.instructors?.[0] || '') : '';
      const labDocName = selectedLab ? ((selectedLab.sessions.find(isLabSession) || {}).instructor || selectedLab.instructors?.[0] || '') : '';

      const totalReq = (lectGroups.length > 0 ? 1 : 0) + (secGroups.length > 0 ? 1 : 0) + (labGroups.length > 0 ? 1 : 0);
      let pickedCount = 0;
      if (selectedLect) pickedCount++;
      if (selectedSec) pickedCount++;
      if (selectedLab) pickedCount++;

      let statusBadge = '';
      if (pickedCount === totalReq && totalReq > 0) {
        statusBadge = `<span class="mixmatch-status-badge complete">${isAr ? 'مكتمل ✓' : 'Complete ✓'}</span>`;
      } else if (pickedCount > 0) {
        statusBadge = `<span class="mixmatch-status-badge partial">${pickedCount}/${totalReq} ${isAr ? 'محدد' : 'Selected'}</span>`;
      } else {
        statusBadge = `<span class="mixmatch-status-badge empty">${isAr ? 'لم يتم الاختيار' : 'No picks yet'}</span>`;
      }

      const isExpanded = !!state.mixMatchExpandedCourses[course.id];

      coursesHtml += `
        <div id="mixmatch-card-${course.id}" class="mixmatch-course-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}" style="border-inline-start: 5px solid ${course.color || '#3B82F6'};">
          <div class="mixmatch-course-header" onclick="App.toggleMixMatchCourseCollapse('${course.id}')" title="${isExpanded ? (isAr ? 'اضغط للطي' : 'Click to collapse') : (isAr ? 'اضغط للتوسيع' : 'Click to expand')}">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="course-color-swatch" style="background: ${course.color || '#3B82F6'}; width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;"></span>
              <span style="font-weight: 800; font-size: 1.02rem; color: var(--text-primary);">${course.name}</span>
              ${course.code && course.code !== course.name ? `<span style="font-size: 0.82rem; color: var(--text-muted);">(${course.code})</span>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <div class="mixmatch-summary-pills">
                ${selectedLect ? `<span class="mixmatch-pick-pill lect-pill">🎓 Lect: Grp ${selectedLect.group} ${lectDocName ? `(${lectDocName})` : ''}</span>` : ''}
                ${selectedSec ? `<span class="mixmatch-pick-pill sec-pill">🔬 Sec: Grp ${selectedSec.group} ${secDocName ? `(${secDocName})` : ''}</span>` : ''}
                ${selectedLab ? `<span class="mixmatch-pick-pill lab-pill">⚗️ Lab: Grp ${selectedLab.group} ${labDocName ? `(${labDocName})` : ''}</span>` : ''}
                ${statusBadge}
              </div>
              <span class="mixmatch-chevron ${isExpanded ? 'open' : ''}">▼</span>
            </div>
          </div>

          ${isExpanded ? `
            <div class="mixmatch-course-body">
              <div class="mixmatch-columns">
                <!-- Lecture Column -->
                <div class="mixmatch-col">
                  <div class="mixmatch-col-title">
                    <span>🎓</span> <span>${isAr ? 'محاضرة (الدكتور)' : 'Lecture (Doctor)'}</span>
                  </div>
                  <div class="mixmatch-options-list">
                    ${lectGroups.length === 0 ? `<div class="mixmatch-empty-type">${isAr ? 'لا توجد محاضرات' : 'No Lectures'}</div>` : ''}
                    ${lectGroups.map(grp => {
                      const isSelected = sel.lectGroup === grp.group;
                      const lectSessions = (grp.sessions || []).filter(isLectureSession);
                      const instructor = lectSessions[0]?.instructor || grp.instructors?.[0] || '';
                      const prefSummary = getGroupDoctorPrefSummary(course, grp);
                      const prefBadge = getGroupDoctorPrefBadgesHtml(prefSummary, isAr);
                      const optClash = checkMixMatchOptionConflict(course.id, 'lect', grp);

                      return `
                        <div class="mixmatch-session-option ${isSelected ? 'is-selected' : ''} ${optClash.clashing ? 'is-clashing' : ''}"
                             onclick="event.stopPropagation(); App.selectMixMatchOption('${course.id}', 'lectGroup', '${grp.group}')">
                          <div class="mixmatch-option-head">
                            <div style="display: flex; align-items: center; gap: 6px;">
                              <span class="mixmatch-group-tag">Group ${grp.group}</span>
                              ${prefBadge}
                            </div>
                            ${isSelected ? `<span class="mixmatch-selected-tick">✓ ${isAr ? 'محدد' : 'Selected'}</span>` : ''}
                          </div>
                          <div class="mixmatch-inst-name" title="${instructor}">👨‍🏫 ${instructor || (isAr ? 'غير محدد' : 'Not Specified')}</div>
                          <div class="mixmatch-times-list">
                            ${lectSessions.map(s => {
                              const timeStr = ScheduleRenderer.formatSlotTimeRange(s.startSlot, s.endSlot);
                              return `<span class="mixmatch-time-chip">📅 ${s.day} (${timeStr})</span>`;
                            }).join('')}
                          </div>
                          ${optClash.clashing ? `<div class="mixmatch-clash-hint">⚠️ ${optClash.detail}</div>` : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Section Column (only if course has sections) -->
                ${secGroups.length > 0 ? `
                  <div class="mixmatch-col">
                    <div class="mixmatch-col-title">
                      <span>🔬</span> <span>${isAr ? 'سكشن (المعيد)' : 'Section (TA)'}</span>
                    </div>
                    <div class="mixmatch-options-list">
                      ${secGroups.map(grp => {
                        const isSelected = sel.secGroup === grp.group;
                        const secSessions = (grp.sessions || []).filter(isSectionSession);
                        const instructor = secSessions[0]?.instructor || grp.instructors?.[0] || '';
                        const prefSummary = getGroupDoctorPrefSummary(course, grp);
                        const prefBadge = getGroupDoctorPrefBadgesHtml(prefSummary, isAr);
                        const optClash = checkMixMatchOptionConflict(course.id, 'sec', grp);

                        return `
                          <div class="mixmatch-session-option ${isSelected ? 'is-selected' : ''} ${optClash.clashing ? 'is-clashing' : ''}"
                               onclick="event.stopPropagation(); App.selectMixMatchOption('${course.id}', 'secGroup', '${grp.group}')">
                            <div class="mixmatch-option-head">
                              <div style="display: flex; align-items: center; gap: 6px;">
                                <span class="mixmatch-group-tag">Group ${grp.group}</span>
                                ${prefBadge}
                              </div>
                              ${isSelected ? `<span class="mixmatch-selected-tick">✓ ${isAr ? 'محدد' : 'Selected'}</span>` : ''}
                            </div>
                            <div class="mixmatch-inst-name" title="${instructor}">🔬 ${instructor || (isAr ? 'معيد السكشن' : 'Section TA')}</div>
                            <div class="mixmatch-times-list">
                              ${secSessions.map(s => {
                                const timeStr = ScheduleRenderer.formatSlotTimeRange(s.startSlot, s.endSlot);
                                return `<span class="mixmatch-time-chip">📅 ${s.day} (${timeStr})</span>`;
                              }).join('')}
                            </div>
                            ${optClash.clashing ? `<div class="mixmatch-clash-hint">⚠️ ${optClash.detail}</div>` : ''}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                ` : ''}

                <!-- Lab Column (only if course has labs) -->
                ${labGroups.length > 0 ? `
                  <div class="mixmatch-col">
                    <div class="mixmatch-col-title">
                      <span>⚗️</span> <span>${isAr ? 'معمل (المعيد)' : 'Lab (TA)'}</span>
                    </div>
                    <div class="mixmatch-options-list">
                      ${labGroups.map(grp => {
                        const isSelected = sel.labGroup === grp.group;
                        const labSessions = (grp.sessions || []).filter(isLabSession);
                        const instructor = labSessions[0]?.instructor || grp.instructors?.[0] || '';
                        const prefSummary = getGroupDoctorPrefSummary(course, grp);
                        const prefBadge = getGroupDoctorPrefBadgesHtml(prefSummary, isAr);
                        const optClash = checkMixMatchOptionConflict(course.id, 'lab', grp);

                        return `
                          <div class="mixmatch-session-option ${isSelected ? 'is-selected' : ''} ${optClash.clashing ? 'is-clashing' : ''}"
                               onclick="event.stopPropagation(); App.selectMixMatchOption('${course.id}', 'labGroup', '${grp.group}')">
                            <div class="mixmatch-option-head">
                              <div style="display: flex; align-items: center; gap: 6px;">
                                <span class="mixmatch-group-tag">Group ${grp.group}</span>
                                ${prefBadge}
                              </div>
                              ${isSelected ? `<span class="mixmatch-selected-tick">✓ ${isAr ? 'محدد' : 'Selected'}</span>` : ''}
                            </div>
                            <div class="mixmatch-inst-name" title="${instructor}">⚗️ ${instructor || (isAr ? 'معيد المعمل' : 'Lab TA')}</div>
                            <div class="mixmatch-times-list">
                              ${labSessions.map(s => {
                                const timeStr = ScheduleRenderer.formatSlotTimeRange(s.startSlot, s.endSlot);
                                return `<span class="mixmatch-time-chip">📅 ${s.day} (${timeStr})</span>`;
                              }).join('')}
                            </div>
                            ${optClash.clashing ? `<div class="mixmatch-clash-hint">⚠️ ${optClash.detail}</div>` : ''}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = coursesHtml;

    if (ttContainer) {
      if (allSelected.length === 0) {
        ttContainer.innerHTML = `
          <div class="empty-state" style="text-align: center; padding: 30px;">
            <div style="font-size: 36px; margin-bottom: 8px;">📅</div>
            <h3>${isAr ? 'لم يتم اختيار حصص للمعاينة' : 'No Sessions Selected'}</h3>
            <p style="color: var(--text-muted);">${isAr ? 'اختر دكاترة ومعيدين من المجموعات أعلاه لمعاينة الجدول المدمج لحظياً.' : 'Pick doctors and TAs above to preview your mixed schedule in real-time.'}</p>
          </div>
        `;
      } else {
        const mockSolution = {
          id: 'sol_mixmatch_preview',
          rank: 1,
          totalScore: 100,
          totalGapSlots: 0,
          activeDaysCount: new Set(allSelected.map(s => s.day)).size,
          sessions: allSelected
        };
        ScheduleRenderer.renderTimetable(mockSolution, ttContainer, state.currentLang, state.blockedTimes, state.courses);
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

  /**
   * Reset doctor preferences, free days, and blocked times to default clean slate
   */
  function clearPreferencesAndBlocked() {
    const isAr = state.currentLang === 'ar';
    state.blockedTimes = [];
    state.doctorPreferences = {};
    state.preferences.freeDays = [];
    saveStateToStorage();

    // Reset UI chips
    document.querySelectorAll('.day-chip.active').forEach(el => el.classList.remove('active'));
    renderBlockedPainter();
    renderBlockedList();
    renderDoctorPreferences();
    showToast(
      isAr
        ? 'تمت إعادة ضبط تفضيلات الدكاترة وأيام الإجازة والأوقات المحظورة بنجاح!'
        : 'Reset all doctor preferences, free days, and blocked slots to defaults!',
      'success'
    );
  }

  /**
   * Complete Fresh Start / Clear Cache: Clears all localStorage and hard reloads page
   */
  function clearCacheAndReset() {
    const isAr = state.currentLang === 'ar';
    const confirmed = confirm(
      isAr
        ? 'هل ترغب في مسح الذاكرة المؤقتة وإعادة ضبط التطبيق بالكامل كأنك تفتح الموقع لأول مرة (مثل وضع التصفح المتخفي Incognito)؟'
        : 'Do you want to clear cache, reset all saved courses & preferences, and start fresh (exactly like incognito mode)?'
    );
    if (!confirmed) return;

    try {
      const keys = [
        'sched_courses',
        'sched_doc_prefs',
        'sched_prefs',
        'sched_blocked_times',
        'sched_manual_schedule',
        'sched_manual_hide_avoided',
        'sched_timetable_filters',
        'sched_mixmatch_selections'
      ];
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('LocalStorage clear failed:', e);
    }

    // Force hard reload bypassing HTTP cache
    window.location.reload(true);
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
    selectManualComponent,
    deselectManualGroupFromTimetable,
    clearManualSchedule,
    applyManualToTimetableTab,
    exportManualTimetable,
    renderManualMode,
    toggleManualHideAvoided,
    toggleManualCustomizeDocTA,
    getCourseGroupStatus,
    handleTimetableFilterChange,
    handlePresetChange,
    resetTimetableFilters,
    closeFilterConflictModal,
    applyTimetableFilters,
    renderMixMatchTab,
    selectMixMatchOption,
    resetMixMatchSelections,
    applyMixMatchToManual,
    saveMixMatchAsCourseGroups,
    toggleMixMatchCourseCollapse,
    expandAllMixMatchCourses,
    collapseAllMixMatchCourses,
    jumpToMixMatchCourse,
    jumpToMixMatchTimetable,
    jumpToMixMatchPicker,
    handleExportTxt,
    openScheduleTxtModal,
    closeScheduleTxtModal,
    toggleScheduleTxtScope,
    copyScheduleTxtContent,
    downloadScheduleTxtFromModal,
    exportMixMatchTxt,
    clearCacheAndReset,
    clearPreferencesAndBlocked,
    nextSchedule,
    prevSchedule,
    jumpToSchedule,
    promptJumpToSchedule,
    getVisibleSolutionChips,
    handleTimetableArrowNavigation,
    getDisplayedSolutions,
    getMaxDisplayedLimit,
    getCourses: () => state.courses
  };

  return window.App;
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
