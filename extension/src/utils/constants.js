// Shared constants for the extension

export const STORAGE_KEYS = {
  QUESTIONS: 'dsa_tracker_questions',
  PENDING_SYNC: 'dsa_tracker_pending_sync',
  SETTINGS: 'dsa_tracker_settings',
  SYNC_ENABLED: 'dsa_tracker_sync_enabled',
  WEB_APP_URL: 'dsa_tracker_web_app_url',
  AUTO_DETECT: 'dsa_tracker_auto_detect'
};

export const PLATFORMS = {
  LEETCODE: {
    key: 'leetcode',
    name: 'LeetCode',
    displayName: 'LeetCode',
    domains: ['leetcode.com', 'leetcode.cn'],
    problemPathPatterns: ['/problems/']
  },
  GFG: {
    key: 'gfg',
    name: 'GFG',
    displayName: 'GeeksforGeeks',
    domains: ['geeksforgeeks.org', 'practice.geeksforgeeks.org'],
    problemPathPatterns: ['/problems/']
  },
  CODEFORCES: {
    key: 'codeforces',
    name: 'Codeforces',
    displayName: 'Codeforces',
    domains: ['codeforces.com'],
    problemPathPatterns: ['/problemset/problem/', '/contest/', '/problem/']
  },
  CODECHEF: {
    key: 'codechef',
    name: 'CodeChef',
    displayName: 'CodeChef',
    domains: ['codechef.com'],
    problemPathPatterns: ['/problems/']
  },
  ATCODER: {
    key: 'atcoder',
    name: 'AtCoder',
    displayName: 'AtCoder',
    domains: ['atcoder.jp'],
    problemPathPatterns: ['/tasks/']
  }
};

export function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const pathname = urlObj.pathname;
    
    for (const platform of Object.values(PLATFORMS)) {
      if (platform.domains.some(d => hostname.includes(d))) {
        if (platform.problemPathPatterns.some(p => pathname.includes(p))) {
          return platform;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function generateQuestionId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const MESSAGE_TYPES = {
  PROBLEM_DETECTED: 'PROBLEM_DETECTED',
  QUESTION_ADDED: 'QUESTION_ADDED',
  GET_SETTINGS: 'GET_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  SYNC_TO_WEB_APP: 'SYNC_TO_WEB_APP',
  CHECK_SYNC_STATUS: 'CHECK_SYNC_STATUS',
  IMPORT_QUESTION: 'IMPORT_QUESTION'
};