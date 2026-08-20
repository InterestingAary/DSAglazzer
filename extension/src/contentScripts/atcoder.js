// AtCoder content script - Detects solved problems

import { PLATFORMS, MESSAGE_TYPES } from '../utils/constants.js';

let lastUrl = location.href;
let observer = null;

function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDetection);
  } else {
    startDetection();
  }
  watchUrlChanges();
}

function startDetection() {
  if (!isProblemPage()) return;
  checkSubmissionStatus();
  observeSubmissionResult();
}

function isProblemPage() {
  return location.pathname.includes('/tasks/');
}

function checkSubmissionStatus() {
  // AtCoder success indicators
  const successSelectors = [
    '.ac',
    '.accepted',
    '.result-ac',
    '[class*="ac"]',
    '.success'
  ];
  
  for (const selector of successSelectors) {
    const element = document.querySelector(selector);
    if (element && isSuccessElement(element)) {
      extractAndSendProblemData();
      return;
    }
  }
  
  // Check for "AC" or "Accepted" in page
  const pageText = document.body.innerText;
  if (pageText.includes('AC') || pageText.includes('Accepted')) {
    // More specific check - look for verdict
    const verdictElements = document.querySelectorAll('td, .verdict, .result');
    for (const el of verdictElements) {
      if (el.innerText.trim() === 'AC' || el.innerText.toLowerCase().includes('accepted')) {
        extractAndSendProblemData();
        return;
      }
    }
  }
}

function isSuccessElement(element) {
  const text = element.innerText.trim().toLowerCase();
  return text === 'ac' || 
         text === 'accepted' ||
         element.classList.contains('ac') ||
         element.classList.contains('accepted');
}

function observeSubmissionResult() {
  if (observer) observer.disconnect();
  
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (isSuccessElement(node) || node.querySelector?.('[class*="ac"], [class*="accepted"]')) {
              setTimeout(() => extractAndSendProblemData(), 1000);
              return;
            }
          }
        }
      }
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

function extractAndSendProblemData() {
  if (window.__dsaTrackerSent) return;
  window.__dsaTrackerSent = true;
  
  const data = {
    title: extractTitle(),
    difficulty: extractDifficulty(),
    topic: extractTopic(),
    tags: extractTags(),
    url: location.href,
    timestamp: Date.now()
  };
  
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.PROBLEM_DETECTED,
    data
  });
  
  setTimeout(() => { window.__dsaTrackerSent = false; }, 5000);
}

function extractTitle() {
  const selectors = [
    '.problem-title',
    '.title',
    'h1',
    '#task-statement h2',
    '.task-name'
  ];
  
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim()) {
      return el.innerText.trim().replace(/^[A-Z]\s*/, '');
    }
  }
  
  const match = location.pathname.match(/\/tasks\/([^/]+)/);
  if (match) {
    return match[1].toUpperCase();
  }
  
  return 'Unknown Problem';
}

function extractDifficulty() {
  // AtCoder uses ABC/ARC/AGC contest types and problem letters for difficulty
  const selectors = [
    '.difficulty',
    '[class*="difficulty"]',
    '.problem-difficulty'
  ];
  
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.innerText.toLowerCase();
      if (text.includes('easy')) return 'Easy';
      if (text.includes('medium')) return 'Medium';
      if (text.includes('hard')) return 'Hard';
    }
  }
  
  // Infer from problem letter (A/B/C = Easy, D/E = Medium, F+ = Hard)
  const problemLetter = extractProblemLetter();
  if (problemLetter) {
    const letter = problemLetter.toUpperCase();
    if (['A', 'B', 'C'].includes(letter)) return 'Easy';
    if (['D', 'E'].includes(letter)) return 'Medium';
    return 'Hard';
  }
  
  // Check contest type
  const contestType = extractContestType();
  if (contestType) {
    if (contestType.includes('ABC')) {
      if (problemLetter && ['A', 'B', 'C'].includes(problemLetter.toUpperCase())) return 'Easy';
      if (problemLetter && ['D', 'E'].includes(problemLetter.toUpperCase())) return 'Medium';
      return 'Hard';
    }
    if (contestType.includes('ARC') || contestType.includes('AGC')) return 'Hard';
  }
  
  return 'Medium';
}

function extractProblemLetter() {
  // From URL: /tasks/abc123_a
  const match = location.pathname.match(/\/tasks\/[a-z]+\d+_([a-z])/i);
  if (match) return match[1];
  
  // From page
  const letterEl = document.querySelector('.problem-letter, [class*="letter"], .task-label');
  if (letterEl) return letterEl.innerText.trim();
  
  return null;
}

function extractContestType() {
  // From URL: /tasks/abc123_a
  const match = location.pathname.match(/\/tasks\/([a-z]+)\d+/i);
  if (match) return match[1].toUpperCase();
  
  // From page
  const contestEl = document.querySelector('.contest-title, .contest-name, [class*="contest"]');
  if (contestEl) {
    const text = contestEl.innerText;
    const typeMatch = text.match(/(ABC|ARC|AGC|AHC)\d+/i);
    if (typeMatch) return typeMatch[1];
  }
  
  return null;
}

function extractTopic() {
  const tagSelectors = [
    '.topic-tag',
    '.tag',
    '[class*="topic"]',
    '[class*="tag"]'
  ];
  
  const topics = [];
  for (const selector of tagSelectors) {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.innerText.trim();
      if (text && text.length > 1 && text.length < 30) {
        topics.push(text);
      }
    });
  }
  
  // AtCoder specific topics
  const knownTopics = [
    'implementation', 'greedy', 'dp', 'dynamic programming', 'brute force',
    'data structures', 'trees', 'graphs', 'math', 'number theory',
    'binary search', 'two pointers', 'sliding window', 'dfs', 'bfs',
    'segment tree', 'fenwick tree', 'bitmasks', 'constructive algorithms',
    'sorting', 'strings', 'hashing', 'probability', 'geometry',
    'combinatorics', 'shortest paths', 'flows', 'dsu', 'treap',
    'prefix sum', 'sweep line', 'divide and conquer', 'meet in the middle'
  ];
  
  for (const topic of topics) {
    if (knownTopics.some(kt => kt.toLowerCase() === topic.toLowerCase())) {
      return topic.charAt(0).toUpperCase() + topic.slice(1);
    }
  }
  
  return topics[0] || 'General';
}

function extractTags() {
  const tagSelectors = [
    '.topic-tag',
    '.tag',
    '[class*="tag"]',
    '.problem-tags a'
  ];
  
  const tags = new Set();
  for (const selector of tagSelectors) {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.innerText.trim().toLowerCase();
      if (text && text.length > 1 && text.length < 30) {
        tags.add(text);
      }
    });
  }
  
  return Array.from(tags).slice(0, 5);
}

function watchUrlChanges() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      window.__dsaTrackerSent = false;
      setTimeout(() => {
        if (isProblemPage()) startDetection();
      }, 500);
    }
  }).observe(document, { subtree: true, childList: true });
  
  window.addEventListener('popstate', () => {
    window.__dsaTrackerSent = false;
    setTimeout(() => { if (isProblemPage()) startDetection(); }, 500);
  });
}

init();

window.addEventListener('beforeunload', () => {
  if (observer) observer.disconnect();
});