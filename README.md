# 🗓️ College Schedule Converter & Best Timetable Optimizer
### محول ومحسن الجداول الجامعية الذكي

[![Deploy to GitHub Pages](https://github.com/mohamed-ayman-abdellatif/college-schedule-optimizer/actions/workflows/deploy.yml/badge.svg)](https://github.com/mohamed-ayman-abdellatif/college-schedule-optimizer/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=flat&logo=github)](https://mohamed-ayman-abdellatif.github.io/college-schedule-optimizer/)
[![Schedules Data Branch](https://img.shields.io/badge/Schedules%20Data-schedules--data-blue?style=flat&logo=github)](https://github.com/mohamed-ayman-abdellatif/college-schedule-optimizer/tree/schedules-data)

🌐 **Live App**: [https://mohamed-ayman-abdellatif.github.io/college-schedule-optimizer/](https://mohamed-ayman-abdellatif.github.io/college-schedule-optimizer/)

An interactive, responsive, client-side web application designed for university students (specifically tuned for the **Arab Academy for Science, Technology & Maritime Transport (AASTMT)** and universities with period-based schedules). It retrieves live faculty and subject schedules directly from the repository's dedicated [`schedules-data`](https://github.com/mohamed-ayman-abdellatif/college-schedule-optimizer/tree/schedules-data) branch via an instant global subject searcher, converts portal HTML, PDFs, and timetable screenshots into structured data, eliminates time clashes, prioritizes preferred doctors/TAs, and finds the best schedules that minimize gaps between lectures.

---

## ✨ Features

### 1. 🔍 Live Global Subject Searcher & Cloud Catalog (`schedules-data`)
- **Instant Global Subject Search**: Search across **593+ unified subjects** immediately on startup by **course code** (e.g., `ECE2102`, `CCS1001`), **subject name**, **doctor / TA name** (Arabic or English), or **department**—without needing to download huge schedule bundles first.
- **Unified Subject Entries**: All groups (`Group A`, `Group B`, `Group 1`, etc.), sessions, doctors, and TAs of a course within a faculty are merged into a single subject entry (`subjects/<facultyId>/<code.json>`), so clicking **`+ Add Subject`** gives you every available group and instructor at once.
- **Faculty / Department / Period Browser**: Optionally filter by Faculty (e.g., *Faculty of Engineering & Technology - Heliopolis*, *Faculty of Computing & Information Technology - Heliopolis*), Department, and Term/Period to batch-submit all subjects for your cohort.
- **Dedicated Data Branch**: All schedules live on the orphan [`schedules-data`](https://github.com/mohamed-ayman-abdellatif/college-schedule-optimizer/tree/schedules-data) branch, keeping the `main` application branch clean and lightweight with zero bundled example/demo courses.

### 2. 📥 HTML, PDF & Photo Schedule Parsers
- **HTML Schedule Parser**:
  - Parses ASP.NET portal table grids (`rowspan` / `colspan`), extracting course codes, titles, days (`Saturday` – `Thursday`), 6 academic periods (Slots 1–12, `08:30 – 20:30`), group letters, session types (`Lect.`, `Lab.`, `Sec.`), and Arabic/English doctor & TA names.
- **PDF Timetable Parser**:
  - Extracts multi-page university PDF schedules using spatial coordinate grid mapping and text extraction (`pdf.js`).
- **Photo / Screenshot Extractor**:
  - Drag-and-drop timetable screenshots for automatic Canvas color-segmentation + OCR (`tesseract.js`), complete with an interactive **Calibration & Verification Studio**.

### 3. ⚡ Smart Schedule Optimizer & Manual Builder
- **Constraint Satisfaction Problem (CSP)** backtracking solver with 3-tier intelligent fallback.
- **Zero Clashes**: Mathematically guarantees no overlapping sessions across registered courses.
- **Minimizes Gaps**: Calculates exact idle slots between the day's first and last classes to eliminate waiting on campus.
- **Doctor / TA Preferences**:
  - Rank professors and TAs: ⭐ **Favorite**, ⚪ **Neutral**, 🚫 **Avoid** (plus **Strict Doctor Mode**).
- **Campus Days & Blocked Times**:
  - Pack classes into fewer campus days (e.g., 2, 3, or 4 days) and click slots on the interactive mini-grid to block personal busy times.
- **Interactive Manual Builder**:
  - Build or tweak your timetable slot-by-slot with live clash detection and instant swap suggestions.

### 4. 🗓️ Interactive Timetable & Export Tools
- Visual weekly calendar grid (6 periods / 12 slots, `08:30 AM – 08:30 PM`, Saturday through Thursday) plus a responsive mobile Agenda view.
- Visual **Coffee-Break Gap Indicators** showing idle time between classes.
- **Export Options**:
  - 🖼️ **Export PNG**: High-resolution image snapshot generated via HTML5 Canvas.
  - 📄 **Export PDF & Print View**: Clean, high-contrast A4 layout.
  - 📊 **Export Excel (`.xlsx`)**: Structured spreadsheet of your timetable.
  - 📲 **Google Calendar (`.ics`)**: Sync classes with Google Calendar, Apple Calendar, or Outlook.
  - 💾 **Save / Load JSON**: Backup and share your courses and schedules.
- **Bilingual & Themes**: Instant toggle between Arabic (`RTL`) and English (`LTR`), plus Dark and Light themes.

---

## 🗂️ Repository Branch Structure

| Branch | Purpose |
| :--- | :--- |
| **`main`** | Lightweight client-side web application (`index.html`, `css/`, `js/`, `test_suite.html`) with no bundled example or default courses. |
| **[`schedules-data`](https://github.com/mohamed-ayman-abdellatif/college-schedule-optimizer/tree/schedules-data)** | Dedicated data branch serving `index.json` (faculty manifest), `subjects_index.json` (global searcher index of 593 subjects), `subjects/<facultyId>/<code.json>` (per-subject unified group JSONs), and `colleges/<facultyId>.json` (full faculty schedules). |

---

## 🚀 Quick Start

1. Open the [Live App](https://mohamed-ayman-abdellatif.github.io/college-schedule-optimizer/) or open `index.html` directly in any modern browser (no build step or local server required).
2. **Add Your Subjects**:
   - **Quick Subject Search**: Type any course code (e.g., `ECE2102`, `CCS1001`), course name, or doctor/TA name into the search bar and click **`+ Add Subject`**, **or**
   - **Browse by Faculty**: Select your **Faculty → Department → Period / Term** and click **`Submit Subjects into Website`**, **or**
   - **Import Files**: Upload/paste portal HTML, PDF timetables, or schedule screenshots.
3. Switch to **"Doctor & Goals"** to set your favorite/avoided professors, blocked times, or target campus days.
4. Click **"Find Best Schedules"** and browse the ranked clash-free timetables in **"Timetable Results"**!

---

## 🔒 Privacy & Analytics

- **100% Client-Side Optimization**: All schedule parsing, optimization, and exports run entirely inside your browser. No university credentials ever leave your device.
- **Anonymous Live Pulse**: Lightweight serverless presence counter showing active students currently optimizing schedules.

---

### 🤲 كلمة من المطور
> **متنساش تدعيلي دعوة حلوة** بالتوفيق والبركة ❤️
