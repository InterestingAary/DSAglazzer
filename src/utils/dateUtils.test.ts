import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getTodayDateString,
  addDays,
  parseLocalDate,
  formatLocalDate,
  getLastNDays,
  getActivityMap,
  calculateStreak,
} from './dateUtils';
import type { Question } from '../types';

describe('dateUtils', () => {
  const fixedDate = new Date('2025-01-15T12:00:00');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getTodayDateString', () => {
    it('returns today in YYYY-MM-DD format', () => {
      expect(getTodayDateString()).toBe('2025-01-15');
    });
  });

  describe('addDays', () => {
    it('adds positive days correctly', () => {
      expect(addDays('2025-01-15', 3)).toBe('2025-01-18');
      expect(addDays('2025-01-15', 7)).toBe('2025-01-22');
      expect(addDays('2025-01-15', 30)).toBe('2025-02-14');
    });

    it('subtracts days correctly with negative values', () => {
      expect(addDays('2025-01-15', -1)).toBe('2025-01-14');
      expect(addDays('2025-01-15', -3)).toBe('2025-01-12');
    });

    it('handles month boundaries', () => {
      expect(addDays('2025-01-31', 1)).toBe('2025-02-01');
      expect(addDays('2025-01-01', -1)).toBe('2024-12-31');
    });

    it('handles leap year', () => {
      expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
      expect(addDays('2024-02-29', 1)).toBe('2024-03-01');
    });
  });

  describe('parseLocalDate', () => {
    it('parses YYYY-MM-DD to Date object in local time', () => {
      const date = parseLocalDate('2025-01-15');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });
  });

  describe('formatLocalDate', () => {
    it('formats Date object to YYYY-MM-DD', () => {
      const date = new Date(2025, 0, 15);
      expect(formatLocalDate(date)).toBe('2025-01-15');
    });
  });

  describe('getLastNDays', () => {
    it('returns array of last N days including today', () => {
      const days = getLastNDays(5);
      expect(days).toHaveLength(5);
      expect(days[0]).toBe('2025-01-11');
      expect(days[4]).toBe('2025-01-15');
    });

    it('returns empty array for 0', () => {
      expect(getLastNDays(0)).toEqual([]);
    });
  });

  describe('getActivityMap', () => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        name: 'Two Sum',
        platform: 'LeetCode',
        topic: 'Arrays',
        difficulty: 'Easy',
        link: 'https://leetcode.com/two-sum',
        solvedDate: '2025-01-10',
        notes: '',
        isFavourite: false,
        needsPractice: false,
        algorithmTags: [],
        revisions: [
          { dueDate: '2025-01-13', intervalDays: 3, status: 'completed', revisedAt: '2025-01-13' },
          { dueDate: '2025-01-17', intervalDays: 7, status: 'pending' },
          { dueDate: '2025-02-09', intervalDays: 30, status: 'pending' },
        ],
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      },
      {
        id: '2',
        name: 'Valid Parentheses',
        platform: 'LeetCode',
        topic: 'Stack',
        difficulty: 'Easy',
        link: 'https://leetcode.com/valid-parentheses',
        solvedDate: '2025-01-12',
        notes: '',
        isFavourite: false,
        needsPractice: false,
        algorithmTags: [],
        revisions: [
          { dueDate: '2025-01-15', intervalDays: 3, status: 'pending' },
          { dueDate: '2025-01-19', intervalDays: 7, status: 'pending' },
          { dueDate: '2025-02-11', intervalDays: 30, status: 'pending' },
        ],
        createdAt: '2025-01-12T00:00:00Z',
        updatedAt: '2025-01-12T00:00:00Z',
      },
    ];

    it('counts solve dates and completed revision dates', () => {
      const map = getActivityMap(mockQuestions);
      expect(map.get('2025-01-10')).toBe(1);
      expect(map.get('2025-01-12')).toBe(1);
      expect(map.get('2025-01-13')).toBe(1);
    });

    it('does not count pending revisions', () => {
      const map = getActivityMap(mockQuestions);
      expect(map.get('2025-01-15')).toBeUndefined();
      expect(map.get('2025-01-17')).toBeUndefined();
    });

    it('returns empty map for empty questions', () => {
      expect(getActivityMap([]).size).toBe(0);
    });
  });

  describe('calculateStreak', () => {
    it('returns 0 for empty questions', () => {
      expect(calculateStreak([])).toEqual({ currentStreak: 0, longestStreak: 0 });
    });

    it('calculates current streak from today', () => {
      const questions: Question[] = [
        makeQuestion('1', '2025-01-15'),
        makeQuestion('2', '2025-01-14'),
        makeQuestion('3', '2025-01-13'),
      ];
      expect(calculateStreak(questions).currentStreak).toBe(3);
    });

    it('calculates current streak from yesterday if no activity today', () => {
      const questions: Question[] = [
        makeQuestion('1', '2025-01-14'),
        makeQuestion('2', '2025-01-13'),
      ];
      expect(calculateStreak(questions).currentStreak).toBe(2);
    });

    it('resets streak when gap exists', () => {
      const questions: Question[] = [
        makeQuestion('1', '2025-01-15'),
        makeQuestion('2', '2025-01-13'),
      ];
      expect(calculateStreak(questions).currentStreak).toBe(1);
    });

    it('calculates longest streak', () => {
      const questions: Question[] = [
        makeQuestion('1', '2025-01-10'),
        makeQuestion('2', '2025-01-11'),
        makeQuestion('3', '2025-01-12'),
        makeQuestion('4', '2025-01-14'),
      ];
      expect(calculateStreak(questions).longestStreak).toBe(3);
    });

    it('handles same-day multiple activities', () => {
      const questions: Question[] = [
        makeQuestion('1', '2025-01-15'),
        makeQuestion('2', '2025-01-15'),
        makeQuestion('3', '2025-01-14'),
      ];
      expect(calculateStreak(questions).currentStreak).toBe(2);
    });
  });
});

function makeQuestion(id: string, solvedDate: string): Question {
  return {
    id,
    name: `Question ${id}`,
    platform: 'LeetCode',
    topic: 'Arrays',
    difficulty: 'Easy',
    link: `https://leetcode.com/q${id}`,
    solvedDate,
    notes: '',
    isFavourite: false,
    needsPractice: false,
    algorithmTags: [],
    revisions: [
      { dueDate: addDays(solvedDate, 3), intervalDays: 3, status: 'pending' },
      { dueDate: addDays(solvedDate, 7), intervalDays: 7, status: 'pending' },
      { dueDate: addDays(solvedDate, 30), intervalDays: 30, status: 'pending' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}