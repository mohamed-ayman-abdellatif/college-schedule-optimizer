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

  let clickCounter = 0;
  let clickTimer = null;

  /**
   * Track a doctor preference action
   * @param {Object} data { doctorName, courseCode, courseName, action }
   */
  function trackDoctorAction(data) {
    if (!data || !data.doctorName) return;

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

    // Secondary: Custom Webhook URL (e.g. Google Sheets Web App or Discord)
    const customWebhook = localStorage.getItem(WEBHOOK_STORAGE_KEY);
    if (customWebhook && customWebhook.startsWith('http')) {
      try {
        fetch(customWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
   * Compute aggregated summary per doctor & subject
   */
  function getDoctorSummary() {
    const events = getStoredEvents();
    const map = {};

    events.forEach(evt => {
      const key = `${evt.courseCode}:::${evt.doctorName}`;
      if (!map[key]) {
        map[key] = {
          doctorName: evt.doctorName,
          courseCode: evt.courseCode,
          courseName: evt.courseName,
          avoid: 0,
          prefer: 0,
          mandate: 0,
          total: 0,
          lastTime: evt.cairoTime
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
    const events = getStoredEvents();
    if (events.length === 0) {
      alert('No doctor preference events recorded yet.');
      return;
    }

    const headers = ['Timestamp (Cairo)', 'Doctor Name', 'Course Code', 'Course Name', 'Action'];
    const rows = events.map(e => [
      `"${e.cairoTime || e.timestamp}"`,
      `"${(e.doctorName || '').replace(/"/g, '""')}"`,
      `"${e.courseCode || ''}"`,
      `"${(e.courseName || '').replace(/"/g, '""')}"`,
      `"${e.action}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `doctor_preferences_report_${new Date().toISOString().slice(0, 10)}.csv`);
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
   * Open the secret Developer Admin Portal
   */
  function openAdminModal() {
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

    renderAdminModalContent();
    modal.style.setProperty('display', 'flex', 'important');
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
      <div class="modal-dialog" style="max-width: 820px; width: 94%; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95)); border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.4rem;">🔐</span>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #F59E0B;">
                Private Doctor Telemetry & Preferences Portal
              </h3>
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                Confidential to Mohamed Ayman (&lt;${DEVELOPER_EMAIL}&gt;) • Zero public display
              </div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="SiteTelemetry.closeAdminModal()">✕</button>
        </div>

        <div class="modal-body" id="telemetry-admin-body" style="overflow-y: auto; padding: 20px;">
          <!-- Content rendered dynamically -->
        </div>

        <div class="modal-footer" style="justify-content: space-between; flex-wrap: wrap; gap: 8px; border-top: 1px solid var(--border-color);">
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="SiteTelemetry.exportEventsToCSV()">
              📥 Export CSV / Excel
            </button>
            <button class="btn btn-secondary btn-sm" onclick="SiteTelemetry.promptCustomWebhook()">
              ⚙️ Webhook / Sheet URL
            </button>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" style="color: var(--danger);" onclick="SiteTelemetry.clearLocalEvents()">
              🗑️ Clear Buffer
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
   * Render content inside admin modal
   */
  function renderAdminModalContent() {
    const body = document.getElementById('telemetry-admin-body');
    if (!body) return;

    const events = getStoredEvents();
    const summary = getDoctorSummary();
    const customWebhook = localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';

    let totalAvoid = 0;
    let totalPrefer = 0;
    let totalMandate = 0;
    events.forEach(e => {
      if (e.action === 'avoid') totalAvoid++;
      else if (e.action === 'mandate') totalMandate++;
      else totalPrefer++;
    });

    let html = `
      <!-- Stats Overview Banner -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px;">
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Total Actions</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #3B82F6;">${events.length}</div>
        </div>
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Total Avoided 🚫</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #EF4444;">${totalAvoid}</div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Total Preferred ⭐</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #10B981;">${totalPrefer}</div>
        </div>
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Total Mandated 🌟🔒</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #F59E0B;">${totalMandate}</div>
        </div>
      </div>

      <!-- Live Webhook Notification Status -->
      <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px; margin-bottom: 20px; font-size: 0.82rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <span style="font-weight: 700; color: var(--text-primary);">📧 Direct Email Collector:</span>
          <span style="color: #10B981; font-weight: 600;">${DEVELOPER_EMAIL}</span> (Active via FormSubmit)
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
            ${customWebhook ? `🔗 Custom Webhook: <code style="word-break: break-all;">${customWebhook.slice(0, 50)}...</code>` : 'No custom Google Sheets webhook connected yet.'}
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="SiteTelemetry.promptCustomWebhook()">
          ${customWebhook ? 'Edit Webhook' : '+ Connect Google Sheet'}
        </button>
      </div>

      <!-- Aggregated Doctor Breakdown Table -->
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--text-primary); display: flex; justify-content: space-between; align-items: center;">
        <span>📊 Doctor Feedback Leaderboard</span>
        <span style="font-size: 0.78rem; font-weight: 500; color: var(--text-muted);">${summary.length} unique professors/instructors</span>
      </div>
    `;

    if (summary.length === 0) {
      html += `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); background: var(--bg-secondary); border-radius: 8px; margin-bottom: 20px;">
          No doctor preferences recorded on this client session yet. When anyone marks Avoid 🚫, Prefer ⭐, or Mandate 🌟🔒, they will appear here and be transmitted to you!
        </div>
      `;
    } else {
      html += `
        <div style="overflow-x: auto; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); background: var(--bg-secondary); color: var(--text-secondary);">
                <th style="padding: 8px 10px;">Doctor / Instructor</th>
                <th style="padding: 8px 10px;">Subject (Code)</th>
                <th style="padding: 8px 10px; text-align: center; color: #EF4444;">Avoid 🚫</th>
                <th style="padding: 8px 10px; text-align: center; color: #10B981;">Prefer ⭐</th>
                <th style="padding: 8px 10px; text-align: center; color: #F59E0B;">Mandate 🌟🔒</th>
                <th style="padding: 8px 10px; text-align: center;">Total</th>
              </tr>
            </thead>
            <tbody>
      `;

      summary.forEach(s => {
        html += `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 8px 10px; font-weight: 700; color: var(--text-primary);">${s.doctorName}</td>
            <td style="padding: 8px 10px; color: var(--text-secondary);">${s.courseName} <span style="font-size: 0.75rem; color: var(--text-muted);">(${s.courseCode})</span></td>
            <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #EF4444;">${s.avoid}</td>
            <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #10B981;">${s.prefer}</td>
            <td style="padding: 8px 10px; text-align: center; font-weight: 700; color: #F59E0B;">${s.mandate}</td>
            <td style="padding: 8px 10px; text-align: center; font-weight: 800;">${s.total}</td>
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
        🕒 Recent Activity Stream (Latest 30 Events)
      </div>
      <div style="overflow-x: auto; max-height: 240px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
          <thead>
            <tr style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color);">
              <th style="padding: 6px 10px;">Time (Cairo)</th>
              <th style="padding: 6px 10px;">Doctor</th>
              <th style="padding: 6px 10px;">Subject</th>
              <th style="padding: 6px 10px;">Action</th>
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
            <td style="padding: 6px 10px; color: var(--text-muted); font-size: 0.75rem;">${e.cairoTime || e.timestamp}</td>
            <td style="padding: 6px 10px; font-weight: 600;">${e.doctorName}</td>
            <td style="padding: 6px 10px; color: var(--text-secondary);">${e.courseCode}</td>
            <td style="padding: 6px 10px;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; background: ${badgeColor}20; color: ${badgeColor}; border: 1px solid ${badgeColor}40;">
                ${e.actionLabel}
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
   * Prompt to set custom webhook URL (e.g. Google Apps Script)
   */
  function promptCustomWebhook() {
    const current = localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
    const newUrl = prompt('Enter your Google Apps Script Web App URL or Discord Webhook URL:\n(Leave empty to remove)', current);
    if (newUrl !== null) {
      if (newUrl.trim()) {
        localStorage.setItem(WEBHOOK_STORAGE_KEY, newUrl.trim());
        alert('Custom webhook saved successfully! All future events will also stream to this endpoint.');
      } else {
        localStorage.removeItem(WEBHOOK_STORAGE_KEY);
        alert('Custom webhook removed.');
      }
      renderAdminModalContent();
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
    getDoctorSummary,
    exportEventsToCSV,
    clearLocalEvents,
    openAdminModal,
    closeAdminModal,
    promptCustomWebhook
  };
})();

if (typeof window !== 'undefined') {
  window.SiteTelemetry = SiteTelemetry;
}
