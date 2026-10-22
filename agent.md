# Agent Handoff & Architecture Guide (`agent.md`)

Welcome! This document provides a complete technical overview of the **AASTMT Schedule Optimizer (`quick-volta`)** so any coding agent can immediately understand the project structure, design philosophy, data models, DOM contracts, and verification workflow without guesswork.

---

## 1. Project Overview & Philosophy

- **Purpose**: A client-side web application for AASTMT (Arab Academy for Science, Technology & Maritime Transport) students to load their faculty/department schedules (via pre-bundled JSON catalogs, raw portal HTML, PDF files, or timetable screenshots), configure constraints (blocked times, doctor/TA preferences, max campus days, gap tolerance), and generate ranked clash-free weekly timetables.
- **Tech Stack**: 100% vanilla HTML5, CSS3, and ES6+ JavaScript (IIFE module pattern). Zero build step, zero bundler, zero UI framework. External libraries (`pdf.js`, `tesseract.js`, `xlsx`) are loaded via CDN in `index.html` and degrade gracefully when offline.
- **Design System**:
  - **Clean, intentional UI**: Crisp `1px` borders, subtle surface hierarchy, clear typography (`Inter`, `Plus Jakarta Sans`, `JetBrains Mono`), and minimal inline SVG icons.
  - **No "vibecoded" clutter**: Avoid neon box-shadows, multi-stop rainbow gradients, emoji spam in labels/buttons, or inline style hacks with undefined CSS variables.
  - **Theme & RTL Ready**: First-class Dark (`:root`) and Light (`[data-theme="light"]`) themes, plus full English (`ltr`) and Arabic (`rtl`) localization.

---

## 2. Directory & Module Map

```text
quick-volta/
├── index.html              # Main application shell (4 tabs + modals)
├── test_suite.html         # Automated browser/VM test suite (50 suites, 318 assertions)
├── agent.md                # This handoff guide
├── README.md               # User-facing project documentation
├── css/
│   ├── style.css           # Design tokens, layout, forms, cards, modals, responsive rules
│   └── timetable.css       # Timetable matrix grid, session cards, agenda view, print styles
├── data/
│   ├── index.json          # Faculty catalog manifest (id, titleAr, titleEn, file)
│   └── *.json              # Pre-parsed faculty schedule datasets (e.g., Engineering.json)
└── js/
    ├── parser.js           # ScheduleParser: HTML table parser + Major JSON catalog extractor
    ├── pdfParser.js        # PdfScheduleParser: PDF text & spatial coordinate grid parser
    ├── sampleData.js       # SampleScheduleData: Built-in sample courses, HTML, and fallback JSON
    ├── optimizer.js        # ScheduleOptimizer: Backtracking solver, 3-tier fallback, scoring
    ├── imageExtractor.js   # ImageScheduleExtractor: OCR (Tesseract) + canvas color-grid parser
    ├── renderer.js         # ScheduleRenderer: 16-slot matrix grid, mobile agenda, summary bar
    ├── exporter.js         # ScheduleExporter: PNG, PDF, Excel (.xlsx), ICS, JSON, Print
    ├── analytics.js        # LiveAnalytics: Lightweight Firebase Realtime DB presence/views counter
    ├── telemetry.js        # AdminTelemetry: Local-first event tracking + hidden Ctrl+Shift+A dashboard
    └── app.js              # App: State management, i18n dictionary, event bindings, UI rendering
```

### Script Loading Order (`index.html`)
Because the project uses global IIFE namespaces rather than ES modules (so it works directly over `file://` as well as static hosting), scripts **must** load in this order:
1. `js/parser.js` (`ScheduleParser`)
2. `js/pdfParser.js` (`PdfScheduleParser`)
3. `js/sampleData.js` (`SampleScheduleData`)
4. `js/optimizer.js` (`ScheduleOptimizer`)
5. `js/imageExtractor.js` (`ImageScheduleExtractor`)
6. `js/renderer.js` (`ScheduleRenderer`)
7. `js/exporter.js` (`ScheduleExporter`)
8. `js/analytics.js` (`LiveAnalytics`)
9. `js/telemetry.js` (`AdminTelemetry`)
10. `js/app.js` (`App`)

---

## 3. Core Data Schemas

### Course Object
```js
{
  id: "ECE2102",
  code: "ECE2102",
  name: "Applied Programming",
  color: "#3B82F6",
  scheduleType: "course", // "course" | "group"
  instructors: ["د. هشام صلاح الدين محمد رشاد", "مجد نبيل نصرى نعمه"],
  groups: [
    {
      group: "B",
      hasLecture: true,
      hasLab: true,
      instructors: ["د. هشام صلاح الدين محمد رشاد", "مجد نبيل نصرى نعمه"],
      sessions: [ /* Array of Session objects */ ]
    }
  ],
  slots: [ /* Flattened array of all Session objects across groups */ ]
}
```

### Session Object
- **Days**: Normalized English day names (`Saturday`, `Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`).
- **Slots**: Integer `1` through `16` (each period is 2 slots; e.g., Period 1 = Slots 1–2 `08:30–10:20`, Period 2 = Slots 3–4 `10:30–12:20`, etc.).
- **Session Types**: `'Lect.'`, `'Lab.'`, or `'Sec.'`.
- **Instructor Prefixes**: Lecture instructors automatically receive `د. ` (Arabic) or `Dr. ` (English) prefixes unless unspecified (`Not Specified` / `غير محدد`). TAs (`Lab.` / `Sec.`) keep their raw names without doctor titles.

### Optimizer Solution Object
 returned in `result.solutions`:
```js
{
  rank: 1,
  groups: { ECE2102: "B", EEE2304: "A" },
  sessions: [ /* Merged & sorted sessions for the chosen groups */ ],
  metrics: {
    campusDays: 3,
    daysOff: 4,
    totalGaps: 2,
    dailyGaps: { Saturday: 0, Sunday: 2, ... },
    doctorScore: 200,
    matchedPreferredDoctors: ["د. دينا ..."],
    includedAvoidedDoctors: [],
    compositeScore: 1450
  },
  compositeScore: 1450, // Exposed at top-level AND inside metrics
  totalScore: 1450      // Alias kept in sync with compositeScore
}
```

---

## 4. Key Architectural Details & Recent Improvements

1. **Frontend Design Cleanup (`index.html`, `css/style.css`, `css/timetable.css`)**:
   - Defined all CSS custom properties in `:root` (dark default) and `[data-theme="light"]` (`--bg-main`, `--bg-card`, `--bg-surface`, `--bg-elevated`, `--bg-input`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border`, `--border-light`, `--primary`, `--accent`, etc.).
   - Removed decorative emoji clutter from HTML labels, tabs, buttons, and `TRANSLATIONS` in `js/app.js`, replacing them with clean text and minimal SVG icons.
   - Replaced inline neon/gradient style strings in `js/renderer.js` and `js/app.js` with structured semantic classes and CSS variables.
2. **Optimizer & Preset Sorting (`js/optimizer.js`, `js/app.js`)**:
   - `ScheduleOptimizer.optimize` populates `compositeScore` and `totalScore` at both the top level of each solution object and inside `solution.metrics`.
   - `applyTimetableFilters()` in `js/app.js` sorts the `'score'` preset using `(b.compositeScore ?? b.totalScore ?? 0) - (a.compositeScore ?? a.totalScore ?? 0)`.
   - Removed the artificial 540ms nested `setTimeout` chain in `runOptimizer()`, replacing it with a single 20ms UI yield before running the synchronous solver.
3. **Shared Helpers (`js/renderer.js`, `js/app.js`)**:
   - `ScheduleRenderer.isUnspecifiedDoctor(name)` is exported on `ScheduleRenderer` and reused by `js/app.js` to avoid duplicate regex logic.

---

## 5. Testing & Verification (`test_suite.html`)

The repository includes an extensive automated test suite in `test_suite.html` (50 suites, 318 assertions) covering:
- HTML Course & Group schedule parsing (`ScheduleParser`)
- Major JSON catalog loading, department matching, period discovery, and global course search
- PDF text and spatial grid coordinate extraction (`PdfScheduleParser`)
- Backtracking solver, 3-tier doctor preference fallback, strict mode, and lecture merging (`ScheduleOptimizer`)
- Grid/agenda rendering, clash overlays, and export modules (`ScheduleRenderer`, `ScheduleExporter`)
- Bilingual (`en`/`ar`) and theme (`dark`/`light`) state management (`App`)

### Crucial Contracts Protected by `test_suite.html`
When editing `js/app.js`, `js/renderer.js`, or `index.html`, preserve these contracts:
- **DOM IDs**: Keep all existing element IDs intact (e.g., `select-major-college`, `select-major-department`, `select-major-period`, `input-major-course-search`, `major-active-title`, `major-active-subtitle`, `btn-submit-major-subjects`, `courses-list-container`, `doctor-prefs-container`, `blocked-painter-grid`, `timetable-grid-wrapper`, `solution-summary-container`, `btn-view-agenda`, `btn-view-grid`).
- **Renderer Classes**: Keep `.session-name`, `.session-code`, `.clash-mini-name`, `.mobile-agenda-container`, `.agenda-day-card`, `.agenda-session-item` in `js/renderer.js`.
- **Translation Strings**: Several test assertions check specific substrings in `TRANSLATIONS` (e.g., `-- Choose Faculty --` / `اختر الكلية`, `No Faculty Selected` / `لم يتم اختيار كلية`, `Select a faculty first` / `اختر الكلية أولاً`, `Doctors` / `دكاترة`, `TAs` / `معيدين`, `subjects` / `مادة`). Do not alter those key phrases without checking `test_suite.html`.
- **Developer Prayer Note**: Preserve the footer message `متنساش تدعيلي دعوة حلوة` in `index.html`.

### How to Run the Tests
1. **In a Browser**: Open `test_suite.html` in any browser (or serve the folder with `npx serve .` / `python -m http.server`) and verify `Tests Passed: 318 / 318 (Failed: 0)`.
2. **Via Node VM**: You can execute `test_suite.html` headlessly in Node by loading the JS modules into a lightweight `vm` context (see the conversation scratch runner if available).
