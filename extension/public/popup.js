// Popup script for DSA Revision Tracker Extension

import { STORAGE_KEYS, MESSAGE_TYPES } from '../src/utils/constants.js';

// DOM Elements
const elements = {
  questionCount: document.getElementById('question-count'),
  syncDot: document.getElementById('sync-dot'),
  syncLabel: document.getElementById('sync-label'),
  syncBtn: document.getElementById('sync-btn'),
  statSolved: document.getElementById('stat-solved'),
  statDue: document.getElementById('stat-due'),
  statStreak: document.getElementById('stat-streak'),
  questionList: document.getElementById('question-list'),
  viewAllLink: document.getElementById('view-all'),
  openWebAppBtn: document.getElementById('open-webapp'),
  addManualBtn: document.getElementById('add-manual'),
  autoDetectToggle: document.getElementById('auto-detect'),
  syncEnabledToggle: document.getElementById('sync-enabled'),
  webAppUrlInput: document.getElementById('webapp-url'),
  helpLink: document.getElementById('help-link')
};

// State
let currentSettings = {
  syncEnabled: true,
  webAppUrl: 'http://localhost:5173',
  autoDetect: true
};

let questions = [];

// Initialize popup
async function init() {
  await loadSettings();
  await loadQuestions();
  await checkSyncStatus();
  setupEventListeners();
  renderAll();
}

async function loadSettings() {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.SYNC_ENABLED,
    STORAGE_KEYS.WEB_APP_URL,
    STORAGE_KEYS.AUTO_DETECT
  ]);
  
  currentSettings = {
    syncEnabled: result[STORAGE_KEYS.SYNC_ENABLED] ?? true,
    webAppUrl: result[STORAGE_KEYS.WEB_APP_URL] ?? 'http://localhost:5173',
    autoDetect: result[STORAGE_KEYS.AUTO_DETECT] ?? true
  };
  
  // Update UI
  elements.autoDetectToggle.checked = currentSettings.autoDetect;
  elements.syncEnabledToggle.checked = currentSettings.syncEnabled;
  elements.webAppUrlInput.value = currentSettings.webAppUrl;
}

async function loadQuestions() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.QUESTIONS);
  questions = result[STORAGE_KEYS.QUESTIONS] || [];
}

async function checkSyncStatus() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.CHECK_SYNC_STATUS
    });
    
    updateSyncUI(response);
  } catch {
    updateSyncUI({ webAppConnected: false });
  }
}

function updateSyncUI(status) {
  const dot = elements.syncDot;
  const label = elements.syncLabel;
  
  dot.classList.remove('connected', 'syncing', 'error');
  
  if (status.webAppConnected) {
    dot.classList.add('connected');
    label.textContent = 'Connected';
  } else if (currentSettings.syncEnabled) {
    dot.classList.add('syncing');
    label.textContent = 'Connecting...';
  } else {
    dot.classList.add('error');
    label.textContent = 'Sync disabled';
  }
}

async function renderAll() {
  renderStats();
  renderQuestionList();
}

function renderStats() {
  const solved = questions.length;
  const dueToday = 0; // Would need to calculate from revisions
  const streak = 0; // Would need to calculate
  
  elements.statSolved.textContent = solved;
  elements.statDue.textContent = dueToday;
  elements.statStreak.textContent = streak;
  elements.questionCount.textContent = solved;
}

function renderQuestionList() {
  const list = elements.questionList;
  
  if (questions.length === 0) {
    list.innerHTML = '<div class="empty-state">No questions yet. Solve a problem on LeetCode, GFG, or Codeforces to see it here!</div>';
    return;
  }
  
  // Show latest 5 questions
  const recent = questions.slice(0, 5);
  
  list.innerHTML = recent.map(q => `
    <div class="question-item">
      <div class="question-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="4"/>
          <path d="M9 9h6M9 12h6M9 15h4"/>
        </svg>
      </div>
      <div class="question-content">
        <div class="question-title">${escapeHtml(q.name)}</div>
        <div class="question-meta">
          <span class="question-platform">${escapeHtml(q.platform)}</span>
          <span class="question-difficulty ${q.difficulty.toLowerCase()}">${escapeHtml(q.difficulty)}</span>
          <span class="question-time">${formatRelativeTime(q.createdAt)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function setupEventListeners() {
  // Sync button
  elements.syncBtn.addEventListener('click', async () => {
    elements.syncBtn.disabled = true;
    elements.syncDot.classList.remove('connected', 'error');
    elements.syncDot.classList.add('syncing');
    elements.syncLabel.textContent = 'Syncing...';
    
    try {
      const status = await chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.CHECK_SYNC_STATUS
      });
      updateSyncUI(status);
    } catch {
      updateSyncUI({ webAppConnected: false });
    } finally {
      elements.syncBtn.disabled = false;
    }
  });
  
  // Open web app
  elements.openWebAppBtn.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({ url: `${currentSettings.webAppUrl}/*` });
    
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { active: true });
      await chrome.windows.update(tabs[0].windowId, { focused: true });
    } else {
      await chrome.tabs.create({ url: currentSettings.webAppUrl });
    }
    window.close();
  });
  
  // Add manually
  elements.addManualBtn.addEventListener('click', async () => {
    await chrome.tabs.create({ url: `${currentSettings.webAppUrl}/questions` });
    window.close();
  });
  
  // View all
  elements.viewAllLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await chrome.tabs.create({ url: `${currentSettings.webAppUrl}/questions` });
    window.close();
  });
  
  // Help link
  elements.helpLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await chrome.tabs.create({ url: 'https://github.com/your-repo/dsa-revision-tracker' });
    window.close();
  });
  
  // Settings toggles
  elements.autoDetectToggle.addEventListener('change', async () => {
    await chrome.storage.local.set({
      [STORAGE_KEYS.AUTO_DETECT]: elements.autoDetectToggle.checked
    });
    currentSettings.autoDetect = elements.autoDetectToggle.checked;
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.UPDATE_SETTINGS,
      settings: { autoDetect: currentSettings.autoDetect }
    });
  });
  
  elements.syncEnabledToggle.addEventListener('change', async () => {
    await chrome.storage.local.set({
      [STORAGE_KEYS.SYNC_ENABLED]: elements.syncEnabledToggle.checked
    });
    currentSettings.syncEnabled = elements.syncEnabledToggle.checked;
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.UPDATE_SETTINGS,
      settings: { syncEnabled: currentSettings.syncEnabled }
    });
    checkSyncStatus();
  });
  
  // Web app URL
  elements.webAppUrlInput.addEventListener('change', async () => {
    const url = elements.webAppUrlInput.value.trim();
    if (url && isValidUrl(url)) {
      await chrome.storage.local.set({
        [STORAGE_KEYS.WEB_APP_URL]: url
      });
      currentSettings.webAppUrl = url;
      checkSyncStatus();
    } else {
      elements.webAppUrlInput.value = currentSettings.webAppUrl;
    }
  });
  
  // Listen for messages from background
  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case MESSAGE_TYPES.QUESTION_ADDED:
        loadQuestions().then(renderAll);
        break;
      case MESSAGE_TYPES.SETTINGS_UPDATED:
        currentSettings = { ...currentSettings, ...message.data };
        checkSyncStatus();
        break;
    }
  });
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', init);