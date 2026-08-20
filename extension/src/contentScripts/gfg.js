// GeeksforGeeks content script - Detects solved problems

import { MESSAGE_TYPES } from '../utils/constants.js';

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
  return location.pathname.includes('/problems/') || location.pathname.includes('/practice/');
}

function checkSubmissionStatus() {
  // GFG success indicators
  const successSelectors = [
    '.success-message',
    '.status-accepted',
    '[class*="success"]',
    '.green-text',
    '.accepted'
  ];
  
  for (const selector of successSelectors) {
    const element = document.querySelector(selector);
    if (element && isSuccessElement(element)) {
      extractAndSendProblemData();
      return;
    }
  }
  
  // Check for "Accepted" or "Solved" in page
  const pageText = document.body.innerText;
  if (pageText.includes('Accepted') || pageText.includes('Solved') || pageText.includes('Congratulations')) {
    extractAndSendProblemData();
  }
}

function isSuccessElement(element) {
  const text = element.innerText.toLowerCase();
  return text.includes('accepted') || 
         text.includes('solved') || 
         text.includes('congratulations') ||
         text.includes('correct answer') ||
         element.classList.contains('success') ||
         element.classList.contains('accepted');
}

function observeSubmissionResult() {
  if (observer) observer.disconnect();
  
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (isSuccessElement(node) || node.querySelector?.('[class*="success"], [class*="accepted"]')) {
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
    '.problem-name',
    'h1[class*="title"]',
    '.problem-header h1',
    'h1'
  ];
  
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim()) {
      return el.innerText.trim().replace(/^\d+\.\s*/, '');
    }
  }
  
  const match = location.pathname.match(/\/problems\/([^/]+)/);
  if (match) {
    return match[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  
  return 'Unknown Problem';
}

function extractDifficulty() {
  const selectors = [
    '.difficulty',
    '[class*="difficulty"]',
    '.problem-difficulty',
    '[class*="level"]'
  ];
  
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.innerText.toLowerCase();
      if (text.includes('easy') || text.includes('basic')) return 'Easy';
      if (text.includes('medium') || text.includes('intermediate')) return 'Medium';
      if (text.includes('hard') || text.includes('advanced')) return 'Hard';
    }
  }
  
  // Check for colored badges
  const badges = document.querySelectorAll('.badge, .tag, .label, [class*="badge"], [class*="tag"]');
  for (const badge of badges) {
    const text = badge.innerText.toLowerCase();
    const color = window.getComputedStyle(badge).color;
    if (text.includes('easy') || text.includes('basic')) return 'Easy';
    if (text.includes('medium') || text.includes('intermediate')) return 'Medium';
    if (text.includes('hard') || text.includes('advanced')) return 'Hard';
    if (color === 'rgb(0, 128, 0)' || color === 'rgb(0, 168, 107)') return 'Easy';
    if (color === 'rgb(255, 165, 0)' || color === 'rgb(255, 159, 10)') return 'Medium';
    if (color === 'rgb(255, 0, 0)' || color === 'rgb(239, 68, 68)') return 'Hard';
  }
  
  return 'Medium';
}

function extractTopic() {
  const tagSelectors = [
    '.topic-tag',
    '.tag',
    '[class*="topic"]',
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
  
  const knownTopics = [
    'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph',
    'Dynamic Programming', 'Greedy', 'Backtracking', 'Divide and Conquer',
    'Binary Search', 'Sorting', 'Hashing', 'Heap', 'Trie', 'Segment Tree',
    'Bit Manipulation', 'Mathematics', 'Geometry', 'Number Theory',
    'Recursion', 'Two Pointers', 'Sliding Window', 'Prefix Sum'
  ];
  
  for (const topic of topics) {
    if (knownTopics.some(kt => kt.toLowerCase() === topic.toLowerCase())) {
      return topic;
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
      const text = el.innerText.trim();
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