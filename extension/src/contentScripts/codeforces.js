// Codeforces content script - Detects solved problems

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
  return location.pathname.includes('/problem/') || 
         location.pathname.includes('/problemset/problem/') ||
         location.pathname.match(/\/contest\/\d+\/problem\/[A-Z]/);
}

function checkSubmissionStatus() {
  // Codeforces success indicators
  const successSelectors = [
    '.verdict-accepted',
    '.status-accepted',
    '[class*="accepted"]',
    '.verdict-ok',
    '.accepted-verdict'
  ];
  
  for (const selector of successSelectors) {
    const element = document.querySelector(selector);
    if (element && isSuccessElement(element)) {
      extractAndSendProblemData();
      return;
    }
  }
  
  // Check submission status on problem page
  const statusElements = document.querySelectorAll('.submission-verdict, .verdict, [class*="verdict"]');
  for (const el of statusElements) {
    if (el.innerText.toLowerCase().includes('accepted') || el.innerText.toLowerCase().includes('ok')) {
      extractAndSendProblemData();
      return;
    }
  }
  
  // Check for "Accepted" in page text
  const pageText = document.body.innerText;
  if (pageText.includes('Accepted') || pageText.includes('Verdict: OK')) {
    extractAndSendProblemData();
  }
}

function isSuccessElement(element) {
  const text = element.innerText.toLowerCase();
  return text.includes('accepted') || 
         text.includes('ok') || 
         text.includes('verdict: accepted') ||
         element.classList.contains('verdict-accepted') ||
         element.classList.contains('accepted');
}

function observeSubmissionResult() {
  if (observer) observer.disconnect();
  
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (isSuccessElement(node) || node.querySelector?.('[class*="accepted"], [class*="verdict"]')) {
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
    '.problem-statement .header',
    '.problem-name'
  ];
  
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim()) {
      return el.innerText.trim().replace(/^[A-Z]\.\s*/, '');
    }
  }
  
  const match = location.pathname.match(/\/problem\/([^/]+)/);
  if (match) {
    return match[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  
  return 'Unknown Problem';
}

function extractDifficulty() {
  // Codeforces uses rating-based difficulty
  const ratingSelectors = [
    '.problem-rating',
    '.rating',
    '[class*="rating"]',
    '.difficulty',
    '[title*="Difficulty"]'
  ];
  
  for (const selector of ratingSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.innerText;
      const ratingMatch = text.match(/(\d{3,4})/);
      if (ratingMatch) {
        const rating = parseInt(ratingMatch[1]);
        if (rating <= 1200) return 'Easy';
        if (rating <= 1900) return 'Medium';
        return 'Hard';
      }
    }
  }
  
  // Check tags for difficulty hints
  const tags = extractTags();
  for (const tag of tags) {
    const lower = tag.toLowerCase();
    if (lower.includes('easy') || lower.includes('beginner') || lower.includes('800') || lower.includes('900') || lower.includes('1000') || lower.includes('1100') || lower.includes('1200')) return 'Easy';
    if (lower.includes('medium') || lower.includes('intermediate') || lower.includes('1300') || lower.includes('1400') || lower.includes('1500') || lower.includes('1600') || lower.includes('1700') || lower.includes('1800') || lower.includes('1900')) return 'Medium';
    if (lower.includes('hard') || lower.includes('advanced') || lower.includes('2000') || lower.includes('2100') || lower.includes('2200') || lower.includes('2300') || lower.includes('2400') || lower.includes('2500') || lower.includes('2600') || lower.includes('2700') || lower.includes('2800') || lower.includes('2900') || lower.includes('3000') || lower.includes('3100') || lower.includes('3200') || lower.includes('3300') || lower.includes('3400') || lower.includes('3500')) return 'Hard';
  }
  
  return 'Medium';
}

function extractTopic() {
  const tagSelectors = [
    '.problem-tag',
    '.tag',
    '[class*="tag"]',
    '.problem-tags a'
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
  
  // Codeforces specific topics
  const knownTopics = [
    'implementation', 'greedy', 'dp', 'dynamic programming', 'brute force',
    'data structures', 'trees', 'graphs', 'math', 'number theory',
    'binary search', 'two pointers', 'sliding window', 'dfs', 'bfs',
    'segment tree', 'fenwick tree', 'bitmasks', 'constructive algorithms',
    'sorting', 'strings', 'hashing', 'probability', 'geometry',
    'combinatorics', 'shortest paths', 'flows', 'dsu', 'treap'
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
    '.problem-tag',
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