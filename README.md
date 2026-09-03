# 🗓️ College Schedule Converter & Best Timetable Optimizer
### محول ومحسن الجداول الجامعية الذكي

An interactive, responsive, client-side web application designed for university students (specifically tuned for the **Arab Academy for Science, Technology & Maritime Transport (AASTMT)** and universities with period-based schedules). It converts college schedule HTML and photos into structured data, eliminates time clashes, allows prioritizing preferred doctors/instructors, and finds the best schedules that minimize gaps between lectures.

---

## ✨ Features

### 1. 📥 HTML Schedule Parser
- **2D Dynamic Grid Matrix**: Accurately parses ASP.NET table grids, resolving complex nested `rowspan` and `colspan` across rows.
- **Data Extracted**:
  - Course Title & Course Code (e.g., `Applied Programming - ECE2102`)
  - Days: `Saturday`, `Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday` (Arabic & English support)
  - Time Slots: **1 to 16** (mapped to academic periods 1 to 8, with configurable clock hours e.g. `08:30 - 10:20`)
  - Group Letters: `Group A`, `Group B`, `Group C` ... `Group L`, etc.
  - Session Types: `Lect.` (محاضرة), `Lab.` (معمل), `Sec.` (تمارين / سكشن)
  - Instructors: Arabic/English professor and TA names (e.g. `د. هشام صلاح الدين`, `د. دينا محمد علي`, `م. مجد نبيل`, etc.)
  - Color styling: Captures university portal group color codes.
- Supports pasting raw HTML text or uploading `.html` files directly.

### 2. 📷 Photo / Screenshot Extractor
- Drag and drop or upload screenshots/photos of university timetables (like the Arab Academy schedule portal).
- Automatic Canvas color-segmentation: locates active session blocks on the 7-day $\times$ 16-slot grid.
- Interactive **Calibration & Verification Studio**: Review detected slots, adjust group letters, and edit doctor names with 100% confidence.

### 3. ⚡ Smart Schedule Optimizer
- High-speed **Constraint Satisfaction Problem (CSP)** backtracking solver.
- **Zero Clashes**: Mathematically guarantees no overlapping sessions across registered courses.
- **Minimizes Gaps**: Calculates exact idle slots between the day's first and last classes to eliminate waiting on campus.
- **Doctor / Instructor Matching**:
  - Rank professors: ⭐ **Favorite**, ⚪ **Neutral**, 🚫 **Avoid**.
  - Prioritizes schedules featuring your favorite doctors.
- **Campus Days Optimization**:
  - Option to pack classes into 3 or 4 days to maximize full days off!
  - Target Free Days selector (e.g. "I want Thursday or Sunday completely off").
- **Group Uniformity**: Option to prefer keeping the same group letter across multiple subjects.
- Generates a ranked list of top clash-free solutions with smart badges:
  - `⭐ Best Overall`
  - `⚡ Zero Gaps (No Waiting)`
  - `🏖️ Only 3 Days On Campus`
  - `👨‍🏫 Top Doctor Match`
  - `🎯 100% Same Group Letter`

### 4. 🗓️ Interactive Timetable & Export Tools
- Visual weekly calendar grid (Periods 1 to 16, Saturday through Friday).
- Clear session cards with course code, group badge, session badge, doctor name, and time range.
- Visual **Coffee-Break Gap Indicators** showing idle time between classes.
- **Export Options**:
  - 🖼️ **Export PNG**: High-resolution image snapshot generated directly via HTML5 Canvas.
  - 📲 **Google Calendar (.ics)**: Synchronize your classes with Google Calendar, Apple Calendar, or Outlook.
  - 🖨️ **Print View**: Clean, high-contrast print stylesheet ready for A4 printing.
  - 💾 **Save / Load JSON**: Backup your courses and schedules to share with friends.
- **Bilingual & Themes**: Instant toggle between English and Arabic (RTL / LTR) and Dark / Light modes.

---

## 🚀 Quick Start

1. Open `index.html` in any web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
   - No installation, server, or build step required!
2. Click **"Load Example Courses"** to instantly test with 5 pre-loaded engineering courses (including `Applied Programming - ECE2102`).
3. Click **"Find Best Schedules"** to run the optimizer.
4. Switch to **"Doctor & Goals"** to set your favorite professors or target free days.
5. Browse the ranked schedules in the **"Timetable Results"** tab!

---

## 🔒 Privacy & Offline Capability

- **100% Client-Side**: All parsing, optimization, and exports run entirely inside your browser.
- No university login credentials or schedule data ever leave your machine.
