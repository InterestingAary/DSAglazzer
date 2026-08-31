// Import/Export utilities for DSA GLAZZER

import { Problem, ProblemStatus, RevisionItem, ActivityItem, UserStats, Language, Difficulty, Topic } from '../types';
import { problems } from '../data/problems';

export interface ExportData {
  version: string;
  exportedAt: string;
  userStats: UserStats;
  problemStatuses: Record<string, ProblemStatus>;
  revisions: RevisionItem[];
  activities: ActivityItem[];
  solutions: Array<{
    problemId: string;
    language: Language;
    sourceCode: string;
    submissionResult: unknown;
    testResults: unknown;
    executionTimeMs: number | null;
    attemptNumber: number;
    createdAt: string;
  }>;
}

export function exportAllData(state: {
  stats: UserStats;
  problemStatuses: Record<string, ProblemStatus>;
  revisions: RevisionItem[];
  activities: ActivityItem[];
}): ExportData {
  const solutions = [] as ExportData['solutions'];
  // Solutions would be fetched from storage/backend

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    userStats: state.stats,
    problemStatuses: state.problemStatuses,
    revisions: state.revisions,
    activities: state.activities,
    solutions,
  };
}

export function downloadJSON(data: ExportData, filename = 'dsa-glazzer-export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface CSVProblemRow {
  problemId: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: string;
  status: 'solved' | 'attempted' | 'unattempted';
  platform: string;
  solvedAt?: string;
  lastAttemptedAt?: string;
  attempts: number;
  language: string;
}

export function exportToCSV(rows: CSVProblemRow[], filename = 'dsa-glazzer-problems.csv') {
  const headers = [
    'Problem ID',
    'Title',
    'Slug',
    'Difficulty',
    'Topic',
    'Status',
    'Platform',
    'Solved At',
    'Last Attempted At',
    'Attempts',
    'Language',
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => [
      row.problemId,
      `"${row.title.replace(/"/g, '""')}"`,
      row.slug,
      row.difficulty,
      row.topic,
      row.status,
      row.platform,
      row.solvedAt || '',
      row.lastAttemptedAt || '',
      row.attempts.toString(),
      row.language,
    ].join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importFromCSV(file: File): Promise<{ success: number; errors: string[] }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
          resolve({ success: 0, errors: ['CSV file is empty or invalid'] });
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const requiredHeaders = ['Problem ID', 'Title', 'Difficulty', 'Topic', 'Status'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          resolve({ success: 0, errors: [`Missing required columns: ${missingHeaders.join(', ')}`] });
          return;
        }

        let success = 0;
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length < headers.length) {
            errors.push(`Line ${i + 1}: Invalid number of columns`);
            continue;
          }

          const row: Record<string, string> = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '';
          });

          // Validate required fields
          if (!row['Problem ID'] || !row['Title'] || !row['Difficulty'] || !row['Topic'] || !row['Status']) {
            errors.push(`Line ${i + 1}: Missing required fields`);
            continue;
          }

          // Validate difficulty
          const difficulty = row['Difficulty'] as Difficulty;
          if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            errors.push(`Line ${i + 1}: Invalid difficulty "${difficulty}"`);
            continue;
          }

          // Validate status
          const status = row['Status'] as 'solved' | 'attempted' | 'unattempted';
          if (!['solved', 'attempted', 'unattempted'].includes(status)) {
            errors.push(`Line ${i + 1}: Invalid status "${status}"`);
            continue;
          }

          // This would be integrated with the actual import logic
          success++;
        }

        resolve({ success, errors });
      } catch (error) {
        resolve({ success: 0, errors: [`Import failed: ${(error as Error).message}`] });
      }
    };
    reader.readAsText(file);
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

export async function importFromJSON(file: File): Promise<{ success: boolean; data?: ExportData; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as ExportData;

        // Validate structure
        if (!data.version || !data.userStats || !data.problemStatuses) {
          resolve({ success: false, error: 'Invalid export file format' });
          return;
        }

        resolve({ success: true, data });
      } catch (error) {
        resolve({ success: false, error: `Invalid JSON: ${(error as Error).message}` });
      }
    };
    reader.readAsText(file);
  });
}

export function generateProblemRowsForExport(
  userProblems: Array<{ problemId: string; status: ProblemStatus; problem: { title: string; slug: string; difficulty: Difficulty; topic: Topic } }>
): Array<{ problemId: string; title: string; slug: string; difficulty: Difficulty; topic: string; status: 'solved' | 'attempted' | 'unattempted'; platform: string; solvedAt?: string; lastAttemptedAt?: string; attempts: number; language: string }> {
  return userProblems.map(({ problemId, status, problem }) => ({
    problemId,
    title: problem.title,
    slug: problem.slug,
    difficulty: status.status === 'solved' ? 'Easy' : 'Easy', // TODO: get actual difficulty
    topic: problem.topic,
    status: status.status,
    platform: 'local',
    solvedAt: status.status === 'solved' ? new Date().toISOString() : undefined,
    lastAttemptedAt: status.lastAttempted ? new Date(status.lastAttempted).toISOString() : undefined,
    attempts: status.attempts,
    language: status.solvedLanguages[0] || 'javascript',
  }));
}