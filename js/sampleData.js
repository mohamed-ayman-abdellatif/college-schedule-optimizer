/**
 * sampleData.js
 * Stub module kept for backwards compatibility; all subjects and faculty schedules
 * are retrieved dynamically from the `schedules-data` branch of this repository.
 */

const SampleScheduleData = (() => {
  return {
    DEFAULT_COURSE_SET: [],
    DEFAULT_MAJOR_CATALOG: null,
    DEFAULT_MAJOR_SCHEDULE_JSON: null,
    COMPUTING_MAJOR_SCHEDULE_JSON: null,
    BUNDLED_MAJOR_SCHEDULES: {}
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SampleScheduleData;
}
