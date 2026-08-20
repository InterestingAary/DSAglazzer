import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatabaseProvider, useDatabase } from './DatabaseContext';
import type { Question } from '../types';
import React from 'react';

const LOCAL_STORAGE_KEY = 'dsa_tracker_questions_v2';

const TestComponent = () => {
  const { questions, stats, addQuestion, completeRevision, skipRevision, deleteQuestion, resetDatabase, exportDatabase, importDatabase } = useDatabase();
  
  return (
    <div>
      <div data-testid="solved-count">{stats.solvedCount}</div>
      <div data-testid="due-today">{stats.dueTodayCount}</div>
      <div data-testid="overdue">{stats.overdueCount}</div>
      <div data-testid="completed-revisions">{stats.totalRevisionsCompleted}</div>
      <div data-testid="current-streak">{stats.currentStreak}</div>
      <div data-testid="longest-streak">{stats.longestStreak}</div>
      
      <button 
        data-testid="add-question"
        onClick={() => addQuestion({
          name: 'Two Sum',
          platform: 'LeetCode',
          topic: 'Arrays',
          difficulty: 'Easy',
          link: 'https://leetcode.com/two-sum',
          solvedDate: '2025-01-15',
          notes: 'Test notes',
          isFavourite: false,
          needsPractice: false,
          algorithmTags: [],
        })}
      >
        Add Question
      </button>
      
      <button 
        data-testid="complete-revision"
        onClick={() => {
          const q = questions[0];
          if (q) {
            const rev = q.revisions.find(r => r.status === 'pending' || r.status === 'overdue');
            if (rev) completeRevision(q.id, rev.intervalDays);
          }
        }}
      >
        Complete Revision
      </button>
      
      <button 
        data-testid="skip-revision"
        onClick={() => {
          const q = questions[0];
          if (q) {
            const rev = q.revisions.find(r => r.status === 'pending' || r.status === 'overdue');
            if (rev) skipRevision(q.id, rev.intervalDays);
          }
        }}
      >
        Skip Revision
      </button>
      
      <button 
        data-testid="delete-question"
        onClick={() => {
          if (questions[0]) deleteQuestion(questions[0].id);
        }}
      >
        Delete Question
      </button>
      
      <button 
        data-testid="reset-database"
        onClick={resetDatabase}
      >
        Reset Database
      </button>
      
      <button 
        data-testid="export-database"
        onClick={() => {
          const data = exportDatabase();
          (window as any).__exportedData = data;
        }}
      >
        Export Database
      </button>
      
      <button 
        data-testid="import-database"
        onClick={() => {
          const success = importDatabase((window as any).__exportedData || '[]');
          (window as any).__importSuccess = success;
        }}
      >
        Import Database
      </button>
    </div>
  );
};

const renderWithProvider = (ui: React.ReactNode) => {
  return render(
    <DatabaseProvider>
      {ui}
    </DatabaseProvider>
  );
};

describe('DatabaseContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00'));
    localStorage.clear();
    (window as any).__exportedData = null;
    (window as any).__importSuccess = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with empty questions and stats', () => {
    renderWithProvider(<TestComponent />);
    
    expect(screen.getByTestId('solved-count').textContent).toBe('0');
    expect(screen.getByTestId('due-today').textContent).toBe('0');
    expect(screen.getByTestId('overdue').textContent).toBe('0');
    expect(screen.getByTestId('completed-revisions').textContent).toBe('0');
    expect(screen.getByTestId('current-streak').textContent).toBe('0');
    expect(screen.getByTestId('longest-streak').textContent).toBe('0');
  });

  it('adds a question and creates 3 revisions', () => {
    renderWithProvider(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('add-question'));
    
    expect(screen.getByTestId('solved-count').textContent).toBe('1');
  });

  it('persists questions to localStorage', () => {
    renderWithProvider(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('add-question'));
    
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('Two Sum');
    expect(parsed[0].revisions).toHaveLength(3);
  });

  it('loads questions from localStorage on init', () => {
    const existingQuestions: Question[] = [{
      id: 'existing-1',
      name: 'Existing Question',
      platform: 'LeetCode',
      topic: 'Arrays',
      difficulty: 'Medium',
      link: 'https://leetcode.com/existing',
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
    }];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingQuestions));
    
    renderWithProvider(<TestComponent />);
    
    expect(screen.getByTestId('solved-count').textContent).toBe('1');
    expect(screen.getByTestId('completed-revisions').textContent).toBe('1');
  });

  it('completes a revision and updates stats', () => {
    renderWithProvider(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('add-question'));
    fireEvent.click(screen.getByTestId('complete-revision'));
    
    expect(screen.getByTestId('completed-revisions').textContent).toBe('1');
  });

  it('skips a revision and postpones by 1 day', () => {
    renderWithProvider(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('add-question'));
    fireEvent.click(screen.getByTestId('skip-revision'));
    
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);
    const skippedRev = stored[0].revisions.find((r: any) => r.intervalDays === 3);
    expect(skippedRev.dueDate).toBe('2025-01-19');
    expect(skippedRev.status).toBe('pending');
  });

  it('deletes a question', () => {
    renderWithProvider(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('add-question'));
    fireEvent.click(screen.getByTestId('delete-question'));
    
    expect(screen.getByTestId('solved-count').textContent).toBe('0');
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('[]');
  });

  it('resets database', () => {
    renderWithProvider(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('add-question'));
    fireEvent.click(screen.getByTestId('reset-database'));
    
    expect(screen.getByTestId('solved-count').textContent).toBe('0');
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
  });

  it('exports and imports database', () => {
    renderWithProvider(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('add-question'));
    fireEvent.click(screen.getByTestId('export-database'));
    
    const exported = (window as any).__exportedData;
    expect(exported).not.toBeNull();
    
    fireEvent.click(screen.getByTestId('reset-database'));
    expect(screen.getByTestId('solved-count').textContent).toBe('0');
    
    fireEvent.click(screen.getByTestId('import-database'));
    
    expect((window as any).__importSuccess).toBe(true);
    expect(screen.getByTestId('solved-count').textContent).toBe('1');
  });

  it('rejects invalid import data', () => {
    renderWithProvider(<TestComponent />);
    
    (window as any).__exportedData = 'invalid json';
    fireEvent.click(screen.getByTestId('import-database'));
    
    expect((window as any).__importSuccess).toBe(false);
  });

  it('rejects import with invalid structure', () => {
    renderWithProvider(<TestComponent />);
    
    (window as any).__exportedData = JSON.stringify([{ id: '1', name: 'Test' }]);
    fireEvent.click(screen.getByTestId('import-database'));
    
    expect((window as any).__importSuccess).toBe(false);
  });
});