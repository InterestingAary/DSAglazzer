// LeetCode content script - Detects solved problems
// Runs on problem pages after submission

import { PLATFORMS, MESSAGE_TYPES } from '../utils/constants.js';

let lastUrl = location.href;
let observer = null;

function init() {
  // Wait for page to fully load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDetection);
  } else {
    startDetection();
  }
  
  // Watch for URL changes (SPA navigation)
  watchUrlChanges();
}

function startDetection() {
  // Check if we're on a problem page
  if (!isProblemPage()) return;
  
  // Check for submission success
  checkSubmissionStatus();
  
  // Set up observer for dynamic content
  observeSubmissionResult();
}

function isProblemPage() {
  return location.pathname.includes('/problems/') && !location.pathname.includes('/solution');
}

function checkSubmissionStatus() {
  // Look for success indicators
  const successSelectors = [
    '[data-e2e-locator="submission-result"]',
    '.submission-result',
    '.status-success',
    '[class*="success"]',
    '.css-1oxj98f' // LeetCode new UI success badge
  ];
  
  for (const selector of successSelectors) {
    const element = document.querySelector(selector);
    if (element && isSuccessElement(element)) {
      extractAndSendProblemData();
      return;
    }
  }
  
  // Check for "Accepted" text in page
  const pageText = document.body.innerText;
  if (pageText.includes('Accepted') || pageText.includes('accepted')) {
    // Additional check: make sure it's not just the word in problem description
    const acceptedElements = document.querySelectorAll('*');
    for (const el of acceptedElements) {
      if (el.innerText.trim() === 'Accepted' || el.innerText.trim() === 'AC') {
        extractAndSendProblemData();
        return;
      }
    }
  }
}

function isSuccessElement(element) {
  const text = element.innerText.toLowerCase();
  return text.includes('accepted') || 
         text.includes('ac ') || 
         text.includes('success') ||
         element.classList.contains('status-success') ||
         element.getAttribute('data-status') === 'accepted';
}

function observeSubmissionResult() {
  if (observer) observer.disconnect();
  
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (isSuccessElement(node) || node.querySelector?.('[class*="success"], [class*="accepted"]')) {
              // Debounce to avoid multiple detections
              setTimeout(() => extractAndSendProblemData(), 1000);
              return;
            }
          }
        }
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function extractAndSendProblemData() {
  if (window.__dsaTrackerSent) return; // Prevent duplicate
  window.__dsaTrackerSent = true;
  
  const data = {
    title: extractTitle(),
    difficulty: extractDifficulty(),
    topic: extractTopic(),
    tags: extractTags(),
    url: location.href,
    timestamp: Date.now()
  };
  
  // Send to background
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.PROBLEM_DETECTED,
    data
  });
  
  // Reset flag after 5 seconds
  setTimeout(() => { window.__dsaTrackerSent = false; }, 5000);
}

function extractTitle() {
  const selectors = [
    '[data-cy="question-title"]',
    '.question-title',
    'h1[class*="title"]',
    '.css-v3d350',
    'h1'
  ];
  
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim()) {
      return el.innerText.trim().replace(/^\d+\.\s*/, '');
    }
  }
  
  // Fallback: parse from URL
  const match = location.pathname.match(/\/problems\/([^/]+)/);
  if (match) {
    return match[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  
  return 'Unknown Problem';
}

function extractDifficulty() {
  const selectors = [
    '[data-cy="question-difficulty"]',
    '.difficulty',
    '[class*="difficulty"]',
    '.css-10o4wqw'
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
  
  // Check for difficulty badge colors
  const badges = document.querySelectorAll('[class*="badge"], [class*="label"], [class*="tag"]');
  for (const badge of badges) {
    const text = badge.innerText.toLowerCase();
    if (text.includes('easy')) return 'Easy';
    if (text.includes('medium')) return 'Medium';
    if (text.includes('hard')) return 'Hard';
    if (badge.style.color === 'rgb(0, 168, 107)' || badge.style.color.includes('10b981')) return 'Easy';
    if (badge.style.color === 'rgb(255, 165, 0)' || badge.style.color.includes('f59e0b')) return 'Medium';
    if (badge.style.color === 'rgb(255, 68, 68)' || badge.style.color.includes('ef4444')) return 'Hard';
  }
  
  return 'Medium';
}

function extractTopic() {
  // Try to get topic from tags
  const tagSelectors = [
    '[data-cy="topic-tag"]',
    '.topic-tag',
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
  
  // Common LeetCode topics
  const knownTopics = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Math',
    'Sorting', 'Greedy', 'Depth-First Search', 'Binary Search',
    'Tree', 'Binary Tree', 'Graph', 'Two Pointers', 'Sliding Window',
    'Stack', 'Heap', 'Design', 'Bit Manipulation', 'Recursion',
    'Backtracking', 'Linked List', 'Queue', 'Union Find', 'Trie',
    'Segment Tree', 'Binary Indexed Tree', 'Divide and Conquer',
    'Monotonic Stack', 'Monotonic Queue', 'Suffix Array', 'Geometry'
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
    '[data-cy="topic-tag"]',
    '.topic-tag',
    '[class*="topic-tag"]',
    '[class*="tag-"]'
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
        if (isProblemPage()) {
          startDetection();
        }
      }, 500);
    }
  }).observe(document, { subtree: true, childList: true });
  
  // Also listen for popstate
  window.addEventListener('popstate', () => {
    window.__dsaTrackerSent = false;
    setTimeout(() => {
      if (isProblemPage()) startDetection();
    }, 500);
  });
}

// Initialize
init();

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (observer) observer.disconnect();
});