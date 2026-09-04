/**
 * analytics.js
 * Real-time Active Users (Presence) and Total Visitors counter for College Schedule Optimizer.
 * Operates serverlessly with zero setup, privacy-preserving (no cookies/PII),
 * and provides live auto-refreshing UI badges plus developer analytics integration.
 */

const SiteAnalytics = (() => {
  const NAMESPACE = 'cso-mohamed-ayman';
  const TOTAL_KEY = 'unique_visitors';
  const HEARTBEAT_INTERVAL_MS = 45000; // Ping every 45 seconds

  let state = {
    activeUsers: 1,
    totalVisitors: null,
    sessionStart: Date.now(),
    heartbeatTimer: null,
    isTabVisible: true,
    currentLang: 'en'
  };

  /**
   * Helper to perform fetch with timeout to avoid hanging
   */
  async function fetchWithTimeout(url, timeoutMs = 4000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-cache' });
      clearTimeout(timer);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      clearTimeout(timer);
      return null;
    }
  }

  /**
   * Current UTC minute bucket for tracking active users
   */
  function getCurrentMinuteBucket() {
    return Math.floor(Date.now() / 60000);
  }

  /**
   * Format number with thousands separators (handles Arabic locale)
   */
  function formatNumber(num, lang = 'en') {
    if (num === null || num === undefined || isNaN(num)) return '--';
    const n = parseInt(num, 10);
    try {
      return n.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
    } catch (e) {
      return n.toString();
    }
  }

  /**
   * Record visit and get all-time unique visitor count.
   * Uses localStorage so that opening/closing/refreshing the page does NOT inflate the count.
   * Only genuine new unique devices/browsers will increment the counter.
   */
  async function syncTotalVisitors() {
    // Check cached total first for immediate zero-lag display
    const cached = localStorage.getItem('cso_cached_unique_total');
    if (cached) {
      state.totalVisitors = parseInt(cached, 10);
      updateUI();
    }

    // Check if this browser/device has already been counted
    const visitorRegistered = localStorage.getItem('cso_unique_visitor_registered');
    let endpoint = `https://abacus.jasoncameron.dev/get/${NAMESPACE}/${TOTAL_KEY}`;

    // Only increment total count ONCE per device/browser using localStorage
    if (!visitorRegistered) {
      endpoint = `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${TOTAL_KEY}`;
      localStorage.setItem('cso_unique_visitor_registered', 'true');
    }

    const data = await fetchWithTimeout(endpoint);
    if (data && typeof data.value === 'number') {
      state.totalVisitors = data.value;
      localStorage.setItem('cso_cached_unique_total', data.value.toString());
      updateUI();
    }
  }

  /**
   * Heartbeat to register this client in the current minute bucket and read active users.
   * Uses localStorage to track the last registered minute so opening/closing the page
   * or multiple heartbeats in the same minute will never double-increment the active count.
   */
  async function pingPresence() {
    if (document.visibilityState === 'hidden') return;

    const currentM = getCurrentMinuteBucket();
    const prevM = currentM - 1;

    // Check if this client already registered presence in this minute bucket
    const lastPingMinute = localStorage.getItem('cso_last_active_minute');
    let hitData = null;

    if (lastPingMinute !== currentM.toString()) {
      // First ping for this client in the current minute: register with atomic hit
      const hitUrl = `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/active_m_${currentM}`;
      hitData = await fetchWithTimeout(hitUrl);
      if (hitData && typeof hitData.value === 'number') {
        localStorage.setItem('cso_last_active_minute', currentM.toString());
      }
    } else {
      // Already registered in this minute bucket: read current total without incrementing
      const getUrl = `https://abacus.jasoncameron.dev/get/${NAMESPACE}/active_m_${currentM}`;
      hitData = await fetchWithTimeout(getUrl);
    }

    let currentMinuteCount = (hitData && typeof hitData.value === 'number') ? hitData.value : 1;

    // Check previous minute bucket for smoothing across minute transitions
    const getPrevUrl = `https://abacus.jasoncameron.dev/get/${NAMESPACE}/active_m_${prevM}`;
    const prevData = await fetchWithTimeout(getPrevUrl);
    let prevMinuteCount = (prevData && typeof prevData.value === 'number') ? prevData.value : 0;

    // Active users is the max of current ping and previous minute (at least 1 for the current user)
    state.activeUsers = Math.max(1, currentMinuteCount, prevMinuteCount);
    updateUI();
  }

  /**
   * Update all DOM elements showing stats
   */
  function updateUI() {
    const lang = (window.App && window.App.state && window.App.state.currentLang) ||
                 document.documentElement.getAttribute('lang') ||
                 state.currentLang ||
                 'en';

    const activeFormatted = formatNumber(state.activeUsers, lang);
    const totalFormatted = formatNumber(state.totalVisitors, lang);

    // Header counter elements
    const hActive = document.getElementById('header-active-count');
    const hTotal = document.getElementById('header-total-count');
    if (hActive) hActive.textContent = activeFormatted;
    if (hTotal) hTotal.textContent = totalFormatted;

    // Footer counter elements
    const fActive = document.getElementById('footer-active-count');
    const fTotal = document.getElementById('footer-total-count');
    if (fActive) fActive.textContent = activeFormatted;
    if (fTotal) fTotal.textContent = totalFormatted;

    // Modal elements if open
    const mActive = document.getElementById('modal-active-count');
    const mTotal = document.getElementById('modal-total-count');
    if (mActive) mActive.textContent = activeFormatted;
    if (mTotal) mTotal.textContent = totalFormatted;
  }

  /**
   * Open the detailed Analytics & Traffic Modal
   */
  function openStatsModal() {
    const modal = document.getElementById('analytics-modal');
    if (!modal) return;
    updateUI();
    modal.style.setProperty('display', 'flex', 'important');
  }

  /**
   * Close the Analytics & Traffic Modal
   */
  function closeStatsModal() {
    const modal = document.getElementById('analytics-modal');
    if (modal) {
      modal.style.setProperty('display', 'none', 'important');
    }
  }

  /**
   * Formats session elapsed time
   */
  function getSessionDurationText() {
    const seconds = Math.floor((Date.now() - state.sessionStart) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  /**
   * Initialize analytics system
   */
  function init() {
    // Initial sync
    syncTotalVisitors();
    pingPresence();

    // Regular heartbeat every 45s
    if (state.heartbeatTimer) clearInterval(state.heartbeatTimer);
    state.heartbeatTimer = setInterval(pingPresence, HEARTBEAT_INTERVAL_MS);

    // Refresh active state when user switches back to this tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        pingPresence();
        syncTotalVisitors();
      }
    });

    // Close analytics modal on backdrop click or Escape
    document.getElementById('analytics-modal')?.addEventListener('click', e => {
      if (e.target.id === 'analytics-modal') closeStatsModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeStatsModal();
    });

    // Update session timer in modal if open
    setInterval(() => {
      const el = document.getElementById('modal-session-time');
      if (el) el.textContent = getSessionDurationText();
    }, 1000);
  }

  window.SiteAnalytics = {
    init,
    updateUI,
    openStatsModal,
    closeStatsModal,
    getState: () => ({ ...state })
  };

  return window.SiteAnalytics;
})();

// Auto initialize on DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    SiteAnalytics.init();
  });
}