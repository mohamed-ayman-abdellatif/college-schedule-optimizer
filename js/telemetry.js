/**
 * telemetry.js
 * Private Telemetry & Doctor Preference Tracking Module for College Schedule Optimizer.
 * Tracks all Avoid, Prefer, and Mandatory actions per doctor & subject,
 * and collects them privately for the developer (Mohamed Ayman <midogarcon@gmail.com>).
 * Strictly zero public exposure.
 */

const SiteTelemetry = (() => {
  const DEVELOPER_EMAIL = 'midogarcon@gmail.com';
  const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${DEVELOPER_EMAIL}`;
  const STORAGE_KEY = 'cso_telemetry_events';
  const WEBHOOK_STORAGE_KEY = 'cso_custom_webhook_url';
  const ADMIN_PIN = '2026';

  // Central default Google Apps Script Web App URL (syncs all devices globally)
  const DEFAULT_CLOUD_URL = 'https://script.google.com/macros/s/AKfycbzbz7yhI7eQjY2tPgd-107Q-bXLJjIXnSD5123Dax2XSrizi858F1-aybKRt8fo88NGYw/exec';

  let clickCounter = 0;
  let clickTimer = null;

  // Cloud sync state
  let cachedCloudEvents = null;
  let isFetchingCloud = false;
  let cloudFetchError = null;
  let activeDataSource = 'cloud'; // 'cloud' | 'local'

  /**
   * Returns effective cloud webhook URL
   */
  function getEffectiveWebhookUrl() {
    try {
      return (localStorage.getItem(WEBHOOK_STORAGE_KEY) || DEFAULT_CLOUD_URL || '').trim();
    } catch (e) {
      return DEFAULT_CLOUD_URL;
    }
  }

  /**
   * Check if current session or device has opened the secret developer portal
   */
  function isSuppressedAdminSession() {
    try {
      if (sessionStorage.getItem('cso_admin_session') === 'true' ||
          sessionStorage.getItem('cso_admin_authed') === 'true' ||
          localStorage.getItem('cso_admin_device') === 'true') {
        return true;
      }
    } catch (e) {}
    return false;
  }

  /**
   * Track a doctor preference action
   * @param {Object} data { doctorName, courseCode, courseName, action }
   */
  function trackDoctorAction(data) {
    if (!data || !data.doctorName) return;

    // Suppress telemetry tracking from admin session or developer device
    if (isSuppressedAdminSession()) {
      return;
    }

    const action = data.action || 'love';
    const actionLabel = action === 'avoid'
      ? 'Avoid (استبعاد 🚫)'
      : (action === 'mandate' ? 'Mandatory (إجباري 🌟🔒)' : 'Prefer (مفضل ⭐)');

    const eventObj = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      cairoTime: new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }),
      doctorName: data.doctorName.trim(),
      courseCode: (data.courseCode || '').trim(),
      courseName: (data.courseName || data.courseCode || '').trim(),
      action: action, // 'avoid', 'love', 'mandate'
      actionLabel: actionLabel
    };

    // 1. Store in local developer buffer
    saveEventToLocal(eventObj);

    // 2. Dispatch silently in background to developer's private collector
    sendToPrivateCollector(eventObj);
  }

  /**
   * Save event in local storage buffer (capped at 500 records)
   */
  function saveEventToLocal(eventObj) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const events = raw ? JSON.parse(raw) : [];
      events.unshift(eventObj);
      if (events.length > 500) events.pop();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('Local telemetry store error:', e);
    }
  }

  /**
   * Dispatches the event to developer endpoints in the background
   */
  async function sendToPrivateCollector(eventObj) {
    const payload = {
      _subject: `[Schedule Optimizer] ${eventObj.action.toUpperCase()}: ${eventObj.doctorName} - ${eventObj.courseCode}`,
      _captcha: 'false',
      doctor: eventObj.doctorName,
      subject: `${eventObj.courseName} (${eventObj.courseCode})`,
      action: eventObj.actionLabel,
      timeCairo: eventObj.cairoTime,
      timestamp: eventObj.timestamp
    };

    // Primary: FormSubmit.co direct to midogarcon@gmail.com
    try {
      fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (err) {}

    // Secondary: Cloud Webhook (e.g. Google Sheets Web App)
    // Uses text/plain and mode: no-cors to prevent CORS preflight blocking
    const cloudUrl = getEffectiveWebhookUrl();
    if (cloudUrl && cloudUrl.startsWith('http')) {
      try {
        fetch(cloudUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(eventObj)
        }).catch(() => {});
      } catch (err) {}
    }
  }

  /**
   * Retrieve all locally stored events
   */
  function getStoredEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Fetch all global events from central cloud (Google Sheets Web App)
   */
  async function fetchCloudEvents() {
    const cloudUrl = getEffectiveWebhookUrl();
    if (!cloudUrl || !cloudUrl.startsWith('http')) {
      cachedCloudEvents = null;
      activeDataSource = 'local';
      return null;
    }

    isFetchingCloud = true;
    cloudFetchError = null;

    try {
      const response = await fetch(cloudUrl, {
        method: 'GET',
        cache: 'no-cache'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data && Array.isArray(data.events)) {
        cachedCloudEvents = data.events;
        activeDataSource = 'cloud';
        return cachedCloudEvents;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.warn('Could not fetch cloud telemetry:', err);
      cloudFetchError = err.message || 'Network error';
      if (!cachedCloudEvents) {
        activeDataSource = 'local';
      }
      return null;
    } finally {
      isFetchingCloud = false;
    }
  }

  /**
   * Get active event list according to selected mode
   */
  function getActiveEvents() {
    if (activeDataSource === 'cloud' && cachedCloudEvents) {
      return cachedCloudEvents;
    }
    return getStoredEvents();
  }

  /**
   * Compute aggregated summary per doctor & subject
   */
  function getDoctorSummary(eventsList) {
    const events = eventsList || getActiveEvents();
    const map = {};

    events.forEach(evt => {
      const doctor = (evt.doctorName || '').trim();
      const code = (evt.courseCode || '').trim();
      if (!doctor) return;

      const key = `${code}:::${doctor}`;
      if (!map[key]) {
        map[key] = {
          doctorName: doctor,
          courseCode: code,
          courseName: evt.courseName || code,
          avoid: 0,
          prefer: 0,
          mandate: 0,
          total: 0,
          lastTime: evt.cairoTime || evt.timestamp
        };
      }
      map[key].total++;
      if (evt.action === 'avoid') map[key].avoid++;
      else if (evt.action === 'mandate') map[key].mandate++;
      else map[key].prefer++;
    });

    return Object.values(map).sort((a, b) => b.total - a.total);
  }

  /**
   * Export all events as CSV
   */
  function exportEventsToCSV() {
    const events = getActiveEvents();
    if (events.length === 0) {
      alert('No doctor preference events recorded yet.');
      return;
    }

    const headers = ['Timestamp (Cairo)', 'Doctor Name', 'Course Code', 'Course Name', 'Action', 'Action Label'];
    const rows = events.map(e => [
      `"${e.cairoTime || e.timestamp}"`,
      `"${(e.doctorName || '').replace(/"/g, '""')}"`,
      `"${e.courseCode || ''}"`,
      `"${(e.courseName || '').replace(/"/g, '""')}"`,
      `"${e.action || ''}"`,
      `"${(e.actionLabel || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const modeLabel = activeDataSource === 'cloud' ? 'all_students_cloud' : 'local_device';
    link.setAttribute('download', `doctor_preferences_${modeLabel}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Clear local telemetry buffer
   */
  function clearLocalEvents() {
    if (confirm('Are you sure you want to clear the local doctor preference logs on this device?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderAdminModalContent();
    }
  }

  /**
   * Set active data source view
   */
  function setDataSource(source) {
    activeDataSource = source;
    if (source === 'cloud' && !cachedCloudEvents && !isFetchingCloud) {
      fetchCloudEvents().then(() => renderAdminModalContent());
    } else {
      renderAdminModalContent();
    }
  }

  /**
   * Trigger refresh from cloud
   */
  async function refreshData() {
    const refreshBtn = document.getElementById('telemetry-refresh-btn');
    if (refreshBtn) refreshBtn.innerHTML = '🔄 Syncing...';
    await fetchCloudEvents();
    renderAdminModalContent();
  }

  /**
   * Open the secret Developer Admin Portal
   */
  async function openAdminModal() {
    let modal = document.getElementById('telemetry-admin-modal');
    if (!modal) {
      createAdminModalDOM();
      modal = document.getElementById('telemetry-admin-modal');
    }

    // Check PIN if not already authenticated in this session
    if (!sessionStorage.getItem('cso_admin_authed')) {
      const input = prompt('🔐 Enter Developer PIN to access Private Doctor Telemetry:');
      if (input !== ADMIN_PIN && input !== 'midogarcon') {
        if (input !== null) alert('Incorrect PIN.');
        return;
      }
      sessionStorage.setItem('cso_admin_authed', 'true');
    }

    // Flag this session and device so no telemetry is sent from developer browsing/testing
    try {
      sessionStorage.setItem('cso_admin_session', 'true');
      localStorage.setItem('cso_admin_device', 'true');
    } catch (e) {}

    modal.style.setProperty('display', 'flex', 'important');
    renderAdminModalContent();

    // If cloud URL configured, fetch latest global events
    const cloudUrl = getEffectiveWebhookUrl();
    if (cloudUrl && !isFetchingCloud) {
      await fetchCloudEvents();
      renderAdminModalContent();
    }
  }

  /**
   * Reset/clear telemetry in the connected Google Sheet and local caches
   */
  async function resetCloudSheet() {
    const cloudUrl = getEffectiveWebhookUrl();
    if (!cloudUrl || !cloudUrl.startsWith('http')) {
      alert('No Google Sheet Web App connected.');
      return;
    }

    if (!confirm('⚠️ Are you sure you want to RESET the Google Sheet?\n\nThis will send a wipe command to your Google Sheet, clear the local cache, and reset the dashboard to 0.')) {
      return;
    }

    try {
      // 1. Send GET with ?action=reset
      const resetUrl = cloudUrl.includes('?') ? `${cloudUrl}&action=reset` : `${cloudUrl}?action=reset`;
      await fetch(resetUrl, { method: 'GET', mode: 'no-cors', cache: 'no-cache' }).catch(() => {});

      // 2. Send POST with { action: 'reset' }
      await fetch(cloudUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'reset' })
      }).catch(() => {});

      // 3. Clear local buffer and cloud cache
      cachedCloudEvents = [];
      localStorage.removeItem(STORAGE_KEY);
      renderAdminModalContent();

      alert('✅ Reset command sent to Google Sheet!\n\nNote: If you have rows in your sheet, you can also open your Google Sheet tab, highlight rows 2 to the end, and press Delete to clear them instantly.');
    } catch (err) {
      alert('Error sending reset command: ' + err.message);
    }
  }

  /**
   * Close the secret Developer Admin Portal
   */
  function closeAdminModal() {
    const modal = document.getElementById('telemetry-admin-modal');
    if (modal) {
      modal.style.setProperty('display', 'none', 'important');
    }
  }

  /**
   * Dynamically build modal HTML if not already in DOM
   */
  function createAdminModalDOM() {
    const div = document.createElement('div');
    div.id = 'telemetry-admin-modal';
    div.className = 'modal-backdrop';
    div.style.cssText = 'display: none !important; z-index: 10000;';
    div.onclick = (e) => { if (e.target === div) closeAdminModal(); };

    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 860px; width: 95%; max-height: 92vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98)); border-bottom: 1px solid var(--border-color); padding: 14px 18px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.5rem;">🔐</span>
            <div>
              <h3 style="margin: 0; font-size: 1.18rem; font-weight: 800; color: #F59E0B; display: flex; align-items: center; gap: 8px;">
                Private Doctor Telemetry Dashboard
              </h3>
              <div style="font-size: 0.76rem; color: var(--text-muted);">
                Confidential to Mohamed Ayman (&lt;${DEVELOPER_EMAIL}&gt;) • Zero public display • 🛡️ Admin Session Active (Tracking Off)
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-outline btn-sm" id="telemetry-refresh-btn" onclick="SiteTelemetry.refreshData()" title="Refresh latest data">
              🔄 Refresh
            </button>
            <button class="btn btn-outline btn-sm" onclick="SiteTelemetry.closeAdminModal()">✕</button>
          </div>
        </div>

        <div class="modal-body" id="telemetry-admin-body" style="overflow-y: auto; padding: 18px;">
          <!-- Content rendered dynamically -->
        </div>

        <div class="modal-footer" style="justify-content: space-between; flex-wrap: wrap; gap: 8px; border-top: 1px solid var(--border-color); padding: 12px 18px;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="SiteTelemetry.exportEventsToCSV()">
              📥 Export CSV / Excel
            </button>
            <button class="btn btn-secondary btn-sm" onclick="SiteTelemetry.toggleGuide()">
              ⚙️ Google Sheet Setup (1 Min)
            </button>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.4);" onclick="SiteTelemetry.resetCloudSheet()">
              🗑️ Reset Google Sheet
            </button>
            <button class="btn btn-outline btn-sm" style="color: var(--text-muted);" onclick="SiteTelemetry.clearLocalEvents()">
              Clear Local Buffer
            </button>
            <button class="btn btn-secondary btn-sm" onclick="SiteTelemetry.closeAdminModal()">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
  }

  /**
   * Toggle the Google Sheets setup guide inside the modal
   */
  function toggleGuide() {
    const guideBox = document.getElementById('telemetry-sheet-guide-box');
    if (guideBox) {
      const isVisible = guideBox.style.display !== 'none';
      guideBox.style.display = isVisible ? 'none' : 'block';
    }
  }

  /**
   * Render content inside admin modal
   */
  function renderAdminModalContent() {
    const body = document.getElementById('telemetry-admin-body');
    if (!body) return;

    const cloudUrl = getEffectiveWebhookUrl();
    const hasCloudConfigured = Boolean(cloudUrl && cloudUrl.startsWith('http'));
    const isCloudMode = hasCloudConfigured && (activeDataSource === 'cloud');

    const events = isCloudMode && cachedCloudEvents ? cachedCloudEvents : getStoredEvents();
    const summary = getDoctorSummary(events);

    let totalAvoid = 0;
    let totalPrefer = 0;
    let totalMandate = 0;
    events.forEach(e => {
      if (e.action === 'avoid') totalAvoid++;
      else if (e.action === 'mandate') totalMandate++;
      else totalPrefer++;
    });

    let html = `
      <!-- Connection & Mode Status Bar -->
      <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px 16px; margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
              ${hasCloudConfigured
                ? `<span style="color: #10B981;">🟢 Live Cloud Connected</span>`
                : `<span style="color: #F59E0B;">🟡 Local Device Mode</span>`
              }
              <span style="font-size: 0.78rem; font-weight: 500; color: var(--text-muted);">
                (${events.length} records in this view)
              </span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 3px;">
              📧 FormSubmit Email: <strong style="color: #10B981;">${DEVELOPER_EMAIL}</strong> (Active)
              ${hasCloudConfigured ? ` • 🌐 Google Sheet: Connected` : ` • ⚠️ Clicks from other devices only reach your email until Google Sheet is connected`}
            </div>
          </div>

          <!-- View Toggle Switch -->
          <div style="display: flex; gap: 6px; background: var(--bg-secondary); padding: 4px; border-radius: 6px; border: 1px solid var(--border-color);">
            <button 
              class="btn btn-sm ${activeDataSource === 'cloud' ? 'btn-primary' : 'btn-outline'}" 
              style="font-size: 0.75rem; padding: 4px 10px; ${!hasCloudConfigured ? 'opacity: 0.5;' : ''}"
              onclick="SiteTelemetry.setDataSource('cloud')"
              ${!hasCloudConfigured ? 'title="Connect Google Sheet to view global data"' : ''}
            >
              🌐 All Students (${hasCloudConfigured && cachedCloudEvents ? cachedCloudEvents.length : (hasCloudConfigured ? 'Sync' : 'Not Connected')})
            </button>
            <button 
              class="btn btn-sm ${activeDataSource === 'local' ? 'btn-primary' : 'btn-outline'}" 
              style="font-size: 0.75rem; padding: 4px 10px;"
              onclick="SiteTelemetry.setDataSource('local')"
            >
              💻 This Browser (${getStoredEvents().length})
            </button>
          </div>
        </div>

        ${isFetchingCloud ? `
          <div style="margin-top: 8px; font-size: 0.78rem; color: #3B82F6; display: flex; align-items: center; gap: 6px;">
            <span>⏳ Fetching latest submissions from Google Sheets...</span>
          </div>
        ` : ''}

        ${cloudFetchError ? `
          <div style="margin-top: 8px; font-size: 0.78rem; color: #EF4444;">
            ⚠️ Could not reach Google Sheet endpoint: ${cloudFetchError}. Showing local cached records.
          </div>
        ` : ''}
      </div>

      <!-- Quick 1-Minute Google Sheets Setup Guide Box (Collapsible) -->
      <div id="telemetry-sheet-guide-box" style="display: ${hasCloudConfigured ? 'none' : 'block'}; background: rgba(59, 130, 246, 0.06); border: 1px dashed rgba(59, 130, 246, 0.4); border-radius: 10px; padding: 14px 16px; margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div style="font-weight: 700; color: var(--primary); font-size: 0.92rem;">
            ⚡ Why only your device's preferences appear here, and how to see ALL students:
          </div>
          <button class="btn btn-outline btn-sm" style="font-size: 0.7rem; padding: 2px 6px;" onclick="SiteTelemetry.toggleGuide()">✕</button>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin: 0 0 10px 0;">
          <strong>FormSubmit works 100%</strong> because every student's browser sends an email to <code>${DEVELOPER_EMAIL}</code> across the web.
          However, browser <code>localStorage</code> is isolated to each student's phone. To collect and display <strong>ALL students' data together</strong> in this dashboard, connect your free Google Sheet (takes 60 seconds):
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.79rem; color: var(--text-primary); margin-bottom: 12px;">
          <div>1️⃣ Open a new sheet at <a href="https://sheets.new" target="_blank" style="color: var(--primary); text-decoration: underline;">sheets.new</a>.</div>
          <div>2️⃣ Click <strong>Extensions (الإضافات)</strong> &gt; <strong>Apps Script</strong>, delete everything and paste the script below:</div>
          <div style="position: relative;">
            <textarea id="apps-script-code-box" readonly style="width: 100%; height: 120px; font-family: monospace; font-size: 0.72rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px;">function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : (e.parameter || {});
    if (data.action === "reset") {
      sheet.clearContents();
      sheet.appendRow(["Timestamp", "Cairo Time", "Doctor Name", "Course Code", "Course Name", "Action", "Action Label"]);
      return ContentService.createTextOutput(JSON.stringify({status:"success", message:"reset"})).setMimeType(ContentService.MimeType.JSON);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Cairo Time", "Doctor Name", "Course Code", "Course Name", "Action", "Action Label"]);
    }
    sheet.appendRow([new Date().toISOString(), data.cairoTime || "", data.doctorName || "", data.courseCode || "", data.courseName || "", data.action || "", data.actionLabel || ""]);
    return ContentService.createTextOutput(JSON.stringify({status:"success"})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error", error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var param = (e && e.parameter) || {};
    if (param.action === "reset") {
      sheet.clearContents();
      sheet.appendRow(["Timestamp", "Cairo Time", "Doctor Name", "Course Code", "Course Name", "Action", "Action Label"]);
      return ContentService.createTextOutput(JSON.stringify({status:"success", message:"reset"})).setMimeType(ContentService.MimeType.JSON);
    }
    var rows = sheet.getDataRange().getValues();
    var events = [];
    var start = (rows.length > 0 && rows[0][0] === "Timestamp") ? 1 : 0;
    for (var i = start; i < rows.length; i++) {
      if (!rows[i][2] && !rows[i][3]) continue;
      events.push({ id:"evt_"+i, timestamp:rows[i][0], cairoTime:rows[i][1], doctorName:String(rows[i][2]), courseCode:String(rows[i][3]), courseName:String(rows[i][4]), action:String(rows[i][5]), actionLabel:String(rows[i][6]) });
    }
    events.reverse();
    return ContentService.createTextOutput(JSON.stringify({status:"success", count:events.length, events:events})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error", error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}</textarea>
            <button class="btn btn-secondary btn-sm" style="position: absolute; top: 6px; right: 6px; font-size: 0.7rem; padding: 2px 8px;" onclick="SiteTelemetry.copyAppsScriptCode()">
              📋 Copy Code
            </button>
          </div>
          <div>3️⃣ Click <strong>Deploy (تطبيق)</strong> &gt; <strong>New deployment</strong> &gt; Select type: <strong>Web app</strong>. Set <em>Who has access</em> to <strong>Anyone (الجميع)</strong>.</div>
          <div>4️⃣ Copy the resulting Web App URL and paste it below:</div>
        </div>

        <div style="display: flex; gap: 8px;">
          <input 
            type="text" 
            id="telemetry-sheet-url-input" 
            placeholder="https://script.google.com/macros/s/.../exec" 
            value="${cloudUrl}"
            style="flex: 1; padding: 8px 12px; font-size: 0.8rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px;"
          />
          <button class="btn btn-primary btn-sm" onclick="SiteTelemetry.saveSheetUrlFromInput()">
            Save &amp; Sync Now
          </button>
        </div>
      </div>

      <!-- Stats Overview Banner -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(135px, 1fr)); gap: 12px; margin-bottom: 20px;">
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Total Actions</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #3B82F6;">${events.length}</div>
        </div>
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Total Avoided 🚫</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #EF4444;">${totalAvoid}</div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Total Preferred ⭐</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #10B981;">${totalPrefer}</div>
        </div>
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Total Mandated 🌟🔒</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #F59E0B;">${totalMandate}</div>
        </div>
      </div>

      <!-- Aggregated Doctor Breakdown Table -->
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--text-primary); display: flex; justify-content: space-between; align-items: center;">
        <span>📊 Doctor Feedback Leaderboard ${isCloudMode ? '(Global - All Students)' : '(Local Device)'}</span>
        <span style="font-size: 0.78rem; font-weight: 500; color: var(--text-muted);">${summary.length} unique instructors</span>
      </div>
    `;

    if (summary.length === 0) {
      html += `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); background: var(--bg-secondary); border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem;">
          No preferences found in this view. As students click Avoid 🚫, Prefer ⭐, or Mandate 🌟🔒, they will show here.
        </div>
      `;
    } else {
      html += `
        <div style="overflow-x: auto; margin-bottom: 24px; border: 1px solid var(--border-color); border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); background: var(--bg-secondary); color: var(--text-secondary);">
                <th style="padding: 9px 12px;">Doctor / Instructor</th>
                <th style="padding: 9px 12px;">Subject (Code)</th>
                <th style="padding: 9px 12px; text-align: center; color: #EF4444;">Avoid 🚫</th>
                <th style="padding: 9px 12px; text-align: center; color: #10B981;">Prefer ⭐</th>
                <th style="padding: 9px 12px; text-align: center; color: #F59E0B;">Mandate 🌟🔒</th>
                <th style="padding: 9px 12px; text-align: center;">Total</th>
              </tr>
            </thead>
            <tbody>
      `;

      summary.forEach(s => {
        html += `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 9px 12px; font-weight: 700; color: var(--text-primary);">${s.doctorName}</td>
            <td style="padding: 9px 12px; color: var(--text-secondary);">${s.courseName} <span style="font-size: 0.75rem; color: var(--text-muted);">(${s.courseCode})</span></td>
            <td style="padding: 9px 12px; text-align: center; font-weight: 700; color: #EF4444;">${s.avoid}</td>
            <td style="padding: 9px 12px; text-align: center; font-weight: 700; color: #10B981;">${s.prefer}</td>
            <td style="padding: 9px 12px; text-align: center; font-weight: 700; color: #F59E0B;">${s.mandate}</td>
            <td style="padding: 9px 12px; text-align: center; font-weight: 800;">${s.total}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    // Recent Raw Event Stream
    html += `
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--text-primary);">
        🕒 Recent Activity Feed (Latest ${Math.min(events.length, 30)} Submissions)
      </div>
      <div style="overflow-x: auto; max-height: 240px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
          <thead>
            <tr style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color);">
              <th style="padding: 7px 12px;">Time (Cairo)</th>
              <th style="padding: 7px 12px;">Doctor</th>
              <th style="padding: 7px 12px;">Subject</th>
              <th style="padding: 7px 12px;">Action</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (events.length === 0) {
      html += `<tr><td colspan="4" style="padding: 14px; text-align: center; color: var(--text-muted);">No activity recorded yet.</td></tr>`;
    } else {
      events.slice(0, 30).forEach(e => {
        let badgeColor = '#3B82F6';
        if (e.action === 'avoid') badgeColor = '#EF4444';
        if (e.action === 'mandate') badgeColor = '#F59E0B';
        if (e.action === 'love') badgeColor = '#10B981';

        html += `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 7px 12px; color: var(--text-muted); font-size: 0.75rem;">${e.cairoTime || e.timestamp}</td>
            <td style="padding: 7px 12px; font-weight: 600;">${e.doctorName}</td>
            <td style="padding: 7px 12px; color: var(--text-secondary);">${e.courseCode}</td>
            <td style="padding: 7px 12px;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; background: ${badgeColor}20; color: ${badgeColor}; border: 1px solid ${badgeColor}40;">
                ${e.actionLabel || e.action}
              </span>
            </td>
          </tr>
        `;
      });
    }

    html += `
          </tbody>
        </table>
      </div>
    `;

    body.innerHTML = html;
  }

  /**
   * Save Google Sheet URL from input field
   */
  async function saveSheetUrlFromInput() {
    const input = document.getElementById('telemetry-sheet-url-input');
    if (!input) return;
    const url = input.value.trim();
    if (url) {
      localStorage.setItem(WEBHOOK_STORAGE_KEY, url);
      alert('Google Sheet Web App connected! Syncing live data...');
      await fetchCloudEvents();
      renderAdminModalContent();
    } else {
      localStorage.removeItem(WEBHOOK_STORAGE_KEY);
      cachedCloudEvents = null;
      activeDataSource = 'local';
      alert('Webhook removed. Switched to local device mode.');
      renderAdminModalContent();
    }
  }

  /**
   * Copy Apps Script Code to clipboard
   */
  function copyAppsScriptCode() {
    const box = document.getElementById('apps-script-code-box');
    if (box) {
      box.select();
      navigator.clipboard.writeText(box.value).then(() => {
        alert('Apps Script code copied to clipboard! Paste it into your Google Sheet Apps Script editor.');
      }).catch(() => {
        alert('Copied! (Use Ctrl+C to copy manually if needed)');
      });
    }
  }

  /**
   * Prompt to set custom webhook URL (e.g. Google Apps Script)
   */
  function promptCustomWebhook() {
    const current = getEffectiveWebhookUrl();
    const newUrl = prompt('Enter your Google Apps Script Web App URL:\n(Leave empty to remove)', current);
    if (newUrl !== null) {
      if (newUrl.trim()) {
        localStorage.setItem(WEBHOOK_STORAGE_KEY, newUrl.trim());
        fetchCloudEvents().then(() => renderAdminModalContent());
      } else {
        localStorage.removeItem(WEBHOOK_STORAGE_KEY);
        cachedCloudEvents = null;
        activeDataSource = 'local';
        renderAdminModalContent();
      }
    }
  }

  /**
   * Register secret global triggers
   */
  function setupSecretTriggers() {
    // 1. Keyboard Shortcut: Ctrl + Shift + D (or Cmd + Shift + D)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        openAdminModal();
      }
    });

    // 2. Secret 5 clicks on developer prayer box/badge
    const bindPrayerClicks = () => {
      const elements = [
        document.querySelector('.dev-prayer-box'),
        document.querySelector('.dev-prayer-badge')
      ].filter(Boolean);

      elements.forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          clickCounter++;
          clearTimeout(clickTimer);
          clickTimer = setTimeout(() => { clickCounter = 0; }, 1800);

          if (clickCounter >= 5) {
            clickCounter = 0;
            openAdminModal();
          }
        });
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindPrayerClicks);
    } else {
      bindPrayerClicks();
    }

    // 3. URL trigger: #admin-telemetry or ?admin=dev
    if (window.location.hash === '#admin-telemetry' || window.location.search.includes('admin=dev')) {
      setTimeout(openAdminModal, 600);
    }
  }

  // Initialize triggers
  setupSecretTriggers();

  return {
    trackDoctorAction,
    getStoredEvents,
    getActiveEvents,
    getDoctorSummary,
    exportEventsToCSV,
    clearLocalEvents,
    openAdminModal,
    closeAdminModal,
    promptCustomWebhook,
    fetchCloudEvents,
    refreshData,
    setDataSource,
    toggleGuide,
    saveSheetUrlFromInput,
    copyAppsScriptCode,
    resetCloudSheet
  };
})();

if (typeof window !== 'undefined') {
  window.SiteTelemetry = SiteTelemetry;
}
