# 🏛️ University Schedules Public Database

This repository maintains the master schedule catalog and JSON timetable files for university colleges, faculties, and departments.

The **[College Schedule Optimizer](https://github.com/mohamed-ayman-abdellatif/college-schedule-optimizer)** directly connects to this repository to automatically discover and extract schedules for students and faculty.

---

## 📁 Repository Structure

```
├── index.json                                  # Master catalog of all available majors & semesters
├── colleges/
│   ├── computing_heliopolis_2026_term1.json    # College timetable JSON (from scraper)
│   ├── engineering_heliopolis_2026_term1.json
│   └── ...
└── README.md
```

---

## 🚀 How to Add or Update a College Schedule

1. **Scrape the College Portal**:
   * Use the schedule scraper userscript (`college_schedule_scraper.user.js`) on your university portal.
   * Click **"Download Consolidated JSON"** to get the full timetable JSON.

2. **Place the JSON file in `colleges/`**:
   * Name it clearly, for example: `computing_heliopolis_2026_term1.json`.

3. **Register the Schedule in `index.json`**:
   * Add a new entry to the `"majors"` array in `index.json`:
   ```json
   {
     "id": "computing_heliopolis_2026_term1",
     "title": "كلية الحاسبات وتكنولوجيا المعلومات - مصر الجديدة",
     "titleEn": "Faculty of Computing & Information Technology - Heliopolis",
     "semester": "الأول 2027/2026",
     "semesterEn": "Term 1 (2026/2027)",
     "file": "colleges/computing_heliopolis_2026_term1.json",
     "totalDepartments": 7,
     "totalSchedules": 136,
     "departments": [
       "الأمن السيبرانى - ق.م",
       "علوم الحاسب ق.م",
       "الذكاء الإصطناعي - ق.م"
     ],
     "updatedAt": "2026-09-08T00:00:00.000Z"
   }
   ```

4. **Commit & Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Term 1 schedules for College of Computing"
   git push origin main
   ```
   * As soon as you push, the College Schedule Optimizer website will automatically detect the new schedules worldwide via the global CDN!

---

## 🌐 Public CDN Access

The optimizer website pulls files using the global jsDelivr CDN and raw GitHub endpoints:
* **Master Catalog**: `https://cdn.jsdelivr.net/gh/mohamed-ayman-abdellatif/college-schedules-data@main/index.json`
* **Raw Fallback**: `https://raw.githubusercontent.com/mohamed-ayman-abdellatif/college-schedules-data/main/index.json`
