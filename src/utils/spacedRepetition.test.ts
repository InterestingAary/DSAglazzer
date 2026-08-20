import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRevisionSchedules, checkIsOverdue, getRevisionIntervals, setRevisionIntervals, DEFAULT_INTERVALS } from './spacedRepetition';

describe('spacedRepetition', () => {
  const fixedDate = new Date('2025-01-15T12:00:00');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('createRevisionSchedules', () => {
    it('creates 3 revisions for day 3, 7, 30', () => {
      const schedules = createRevisionSchedules('2025-01-15');
      expect(schedules).toHaveLength(3);
      expect(schedules[0]).toEqual({
        dueDate: '2025-01-18',
        intervalDays: 3,
        status: 'pending',
      });
      expect(schedules[1]).toEqual({
        dueDate: '2025-01-22',
        intervalDays: 7,
        status: 'pending',
      });
      expect(schedules[2]).toEqual({
        dueDate: '2025-02-14',
        intervalDays: 30,
        status: 'pending',
      });
    });

    it('handles month boundary', () => {
      const schedules = createRevisionSchedules('2025-01-31');
      expect(schedules[0].dueDate).toBe('2025-02-03');
      expect(schedules[1].dueDate).toBe('2025-02-07');
    });

    it('handles leap year', () => {
      const schedules = createRevisionSchedules('2024-02-28');
      expect(schedules[0].dueDate).toBe('2024-03-02');
    });

    it('all schedules have pending status initially', () => {
      const schedules = createRevisionSchedules('2025-01-15');
      schedules.forEach(s => {
        expect(s.status).toBe('pending');
        expect(s.revisedAt).toBeUndefined();
      });
    });
  });

  describe('createRevisionSchedules with custom intervals', () => {
    it('creates revisions for custom intervals', () => {
      const schedules = createRevisionSchedules('2025-01-15', [1, 3, 14]);
      expect(schedules).toHaveLength(3);
      expect(schedules[0]).toEqual({
        dueDate: '2025-01-16',
        intervalDays: 1,
        status: 'pending',
      });
      expect(schedules[1]).toEqual({
        dueDate: '2025-01-18',
        intervalDays: 3,
        status: 'pending',
      });
      expect(schedules[2]).toEqual({
        dueDate: '2025-01-29',
        intervalDays: 14,
        status: 'pending',
      });
    });

    it('handles single interval', () => {
      const schedules = createRevisionSchedules('2025-01-15', [7]);
      expect(schedules).toHaveLength(1);
      expect(schedules[0].intervalDays).toBe(7);
    });
  });

  describe('getRevisionIntervals', () => {
    it('returns default intervals when no settings stored', () => {
      localStorage.removeItem('dsa_tracker_settings');
      expect(getRevisionIntervals()).toEqual(DEFAULT_INTERVALS);
    });

    it('returns stored intervals', () => {
      localStorage.setItem('dsa_tracker_settings', JSON.stringify({ intervals: [1, 7, 14, 30] }));
      expect(getRevisionIntervals()).toEqual([1, 7, 14, 30]);
    });

    it('handles invalid stored data', () => {
      localStorage.setItem('dsa_tracker_settings', 'invalid json');
      expect(getRevisionIntervals()).toEqual(DEFAULT_INTERVALS);
    });

    it('handles empty intervals array', () => {
      localStorage.setItem('dsa_tracker_settings', JSON.stringify({ intervals: [] }));
      expect(getRevisionIntervals()).toEqual(DEFAULT_INTERVALS);
    });

    it('handles missing intervals key', () => {
      localStorage.setItem('dsa_tracker_settings', JSON.stringify({ otherKey: 'value' }));
      expect(getRevisionIntervals()).toEqual(DEFAULT_INTERVALS);
    });
  });

  describe('setRevisionIntervals', () => {
    it('stores intervals in localStorage', () => {
      setRevisionIntervals([2, 5, 10]);
      const stored = localStorage.getItem('dsa_tracker_settings');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual({ intervals: [2, 5, 10] });
    });

    it('preserves existing settings', () => {
      localStorage.setItem('dsa_tracker_settings', JSON.stringify({ intervals: [3, 7, 30], otherSetting: 'value' }));
      setRevisionIntervals([1, 2, 3]);
      const stored = localStorage.getItem('dsa_tracker_settings');
      expect(JSON.parse(stored!)).toEqual({ intervals: [1, 2, 3], otherSetting: 'value' });
    });
  });

  describe('checkIsOverdue', () => {
    const todayStr = '2025-01-15';

    it('returns false for completed revisions', () => {
      expect(checkIsOverdue('2025-01-10', todayStr, 'completed')).toBe(false);
    });

    it('returns false for skipped revisions', () => {
      expect(checkIsOverdue('2025-01-10', todayStr, 'skipped')).toBe(false);
    });

    it('returns true for pending revisions with past due date', () => {
      expect(checkIsOverdue('2025-01-10', todayStr, 'pending')).toBe(true);
      expect(checkIsOverdue('2025-01-14', todayStr, 'pending')).toBe(true);
    });

    it('returns true for overdue status with past due date', () => {
      expect(checkIsOverdue('2025-01-10', todayStr, 'overdue')).toBe(true);
    });

    it('returns false for pending revisions with today due date', () => {
      expect(checkIsOverdue(todayStr, todayStr, 'pending')).toBe(false);
    });

    it('returns false for pending revisions with future due date', () => {
      expect(checkIsOverdue('2025-01-20', todayStr, 'pending')).toBe(false);
    });

    it('returns false for overdue status with future due date', () => {
      expect(checkIsOverdue('2025-01-20', todayStr, 'overdue')).toBe(false);
    });
  });
});