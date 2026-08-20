// Background service worker for DSA Revision Tracker Chrome Extension
// Handles storage sync, cross-tab communication, and platform detection

import { STORAGE_KEYS, PLATFORMS, detectPlatform, generateQuestionId } from './utils/constants.js';

let pendingDetection = null;

// Initialize storage with defaults
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.SYNC_ENABLED,
    STORAGE_KEYS.WEB_APP_URL,
    STORAGE_KEYS.AUTO_DETECT
  ]);
  
  if (result[STORAGE_KEYS.SYNC_ENABLED] === undefined) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.SYNC_ENABLED]: true,
      [STORAGE_KEYS.WEB_APP_URL]: 'http://localhost:5173',
      [STORAGE_KEYS.AUTO_DETECT]: true
    });
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'PROBLEM_DETECTED':
      handleProblemDetected(message.data, sender.tab);
      break;
    case 'GET_SETTINGS':
      getSettings().then(sendResponse);
      return true; // async response
    case 'UPDATE_SETTINGS':
      updateSettings(message.settings).then(() => sendResponse({ success: true }));
      return true;
    case 'SYNC_TO_WEB_APP':
      syncToWebApp(message.data).then(sendResponse);
      return true;
    case 'CHECK_SYNC_STATUS':
      checkSyncStatus().then(sendResponse);
      return true;
  }
});

// Handle problem detection from content scripts
async function handleProblemDetected(data, tab) {
  const settings = await getSettings();
  
  if (!settings.autoDetect) return;
  
  const platform = detectPlatform(tab.url);
  if (!platform) return;
  
  const question = {
    id: generateQuestionId(),
    name: data.title,
    platform: platform.name,
    topic: data.topic || 'General',
    difficulty: data.difficulty || 'Medium',
    link: tab.url,
    solvedDate: new Date().toISOString().split('T')[0],
    notes: `Auto-detected from ${platform.displayName}`,
    isFavourite: false,
    needsPractice: false,
    algorithmTags: data.tags || [],
    revisions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Store in extension storage
  await saveQuestion(question);
  
  // Notify popup if open
  chrome.runtime.sendMessage({
    type: 'QUESTION_ADDED',
    data: question
  });
  
  // Try to sync to web app
  if (settings.syncEnabled) {
    await syncToWebApp(question);
  }
  
  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'Problem Added to Tracker',
    message: `${data.title} (${platform.displayName})`
  });
}

// Save question to extension storage
async function saveQuestion(question) {
  const result = await chrome.storage.local.get(STORAGE_KEYS.QUESTIONS);
  const questions = result[STORAGE_KEYS.QUESTIONS] || [];
  questions.unshift(question);
  // Keep only last 1000 questions
  if (questions.length > 1000) questions.length = 1000;
  await chrome.storage.local.set({ [STORAGE_KEYS.QUESTIONS]: questions });
}

// Sync to web app via localStorage (same origin) or postMessage
async function syncToWebApp(question) {
  const settings = await getSettings();
  const webAppUrl = settings.webAppUrl || 'http://localhost:5173';
  
  try {
    // Try to find open web app tab
    const tabs = await chrome.tabs.query({ url: `${webAppUrl}/*` });
    
    if (tabs.length > 0) {
      // Send message to content script injected in web app
      await chrome.tabs.sendMessage(tabs[0].id, {
        type: 'IMPORT_QUESTION',
        data: question
      });
      return { success: true, method: 'postMessage' };
    }
    
    // Fallback: store in chrome.storage for web app to pick up
    const result = await chrome.storage.local.get(STORAGE_KEYS.PENDING_SYNC);
    const pending = result[STORAGE_KEYS.PENDING_SYNC] || [];
    pending.push({ question, timestamp: Date.now() });
    await chrome.storage.local.set({ [STORAGE_KEYS.PENDING_SYNC]: pending });
    
    return { success: true, method: 'storage' };
  } catch (error) {
    console.error('Sync failed:', error);
    return { success: false, error: error.message };
  }
}

// Get extension settings
async function getSettings() {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.SYNC_ENABLED,
    STORAGE_KEYS.WEB_APP_URL,
    STORAGE_KEYS.AUTO_DETECT
  ]);
  
  return {
    syncEnabled: result[STORAGE_KEYS.SYNC_ENABLED] ?? true,
    webAppUrl: result[STORAGE_KEYS.WEB_APP_URL] ?? 'http://localhost:5173',
    autoDetect: result[STORAGE_KEYS.AUTO_DETECT] ?? true
  };
}

// Update settings
async function updateSettings(settings) {
  const updates = {};
  if (settings.syncEnabled !== undefined) updates[STORAGE_KEYS.SYNC_ENABLED] = settings.syncEnabled;
  if (settings.webAppUrl !== undefined) updates[STORAGE_KEYS.WEB_APP_URL] = settings.webAppUrl;
  if (settings.autoDetect !== undefined) updates[STORAGE_KEYS.AUTO_DETECT] = settings.autoDetect;
  
  await chrome.storage.local.set(updates);
  
  // Notify all tabs
  chrome.runtime.sendMessage({ type: 'SETTINGS_UPDATED', data: await getSettings() });
}

// Check if web app is available for sync
async function checkSyncStatus() {
  const settings = await getSettings();
  const tabs = await chrome.tabs.query({ url: `${settings.webAppUrl}/*` });
  
  return {
    webAppConnected: tabs.length > 0,
    webAppUrl: settings.webAppUrl,
    syncEnabled: settings.syncEnabled
  };
}

// Listen for tab updates to detect problem pages
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const platform = detectPlatform(tab.url);
    if (platform) {
      // Inject content script if not already injected
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: [`contentScripts/${platform.key}.js`]
        });
      } catch (e) {
        // Script already injected or error
      }
    }
  }
});

// Periodic sync check
setInterval(async () => {
  const settings = await getSettings();
  if (!settings.syncEnabled) return;
  
  const status = await checkSyncStatus();
  if (status.webAppConnected) {
    // Process pending sync queue
    const result = await chrome.storage.local.get(STORAGE_KEYS.PENDING_SYNC);
    const pending = result[STORAGE_KEYS.PENDING_SYNC] || [];
    
    if (pending.length > 0) {
      for (const item of pending) {
        await syncToWebApp(item.question);
      }
      await chrome.storage.local.set({ [STORAGE_KEYS.PENDING_SYNC]: [] });
    }
  }
}, 30000); // Every 30 seconds