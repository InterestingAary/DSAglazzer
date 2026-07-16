import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Question, UserStats } from '../types';
import { getTodayDateString, calculateStreak, addDays } from '../utils/dateUtils';
import { createRevisionSchedules } from '../utils/spacedRepetition';

interface DatabaseContextType {
  questions: Question[];
  stats: UserStats;
  addQuestion: (q: Omit<Question, 'id' | 'revisions' | 'createdAt' | 'updatedAt'>) => void;
  updateQuestion: (id: string, q: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  completeRevision: (questionId: string, intervalDays: number) => void;
  skipRevision: (questionId: string, intervalDays: number) => void;
  resetDatabase: () => void;
  exportDatabase: () => string;
  importDatabase: (jsonData: string) => boolean;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => Promise<void>;
  triggerNotification: (title: string, body: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dsa_tracker_questions_v2';
const NOTIFICATION_ASKED_KEY = 'dsa_tracker_notification_asked';

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // 1. Initial Load (starts empty by default)
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Question[];
        setQuestions(parsed);
      } catch (e) {
        console.error('Failed to parse local storage questions', e);
        setQuestions([]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      }
    } else {
      setQuestions([]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    }

    // Check notification permission if supported
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // 2. Save helper
  const saveQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newQuestions));
  };

  // 3. Compute dynamic stats on questions list change
  const [stats, setStats] = useState<UserStats>({
    solvedCount: 0,
    dueTodayCount: 0,
    overdueCount: 0,
    totalRevisionsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    const todayStr = getTodayDateString();
    
    let dueToday = 0;
    let overdue = 0;
    let revisionsCompleted = 0;

    questions.forEach(q => {
      q.revisions.forEach(rev => {
        if (rev.status === 'completed') {
          revisionsCompleted++;
        } else if (rev.status === 'pending' || rev.status === 'overdue') {
          if (rev.dueDate === todayStr) {
            dueToday++;
          } else if (rev.dueDate < todayStr) {
            overdue++;
          }
        }
      });
    });

    const { currentStreak, longestStreak } = calculateStreak(questions);

    setStats({
      solvedCount: questions.length,
      dueTodayCount: dueToday,
      overdueCount: overdue,
      totalRevisionsCompleted: revisionsCompleted,
      currentStreak,
      longestStreak,
    });
  }, [questions]);

  // 4. CRUD operations
  const addQuestion = (q: Omit<Question, 'id' | 'revisions' | 'createdAt' | 'updatedAt'>) => {
    const id = crypto.randomUUID();
    const revisions = createRevisionSchedules(q.solvedDate);
    
    const newQuestion: Question = {
      ...q,
      id,
      revisions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveQuestions([newQuestion, ...questions]);
    triggerNotification('Question Added', `"${q.name}" has been added and scheduled for revision.`);
  };

  const updateQuestion = (id: string, updatedFields: Partial<Question>) => {
    const updated = questions.map(q => {
      if (q.id === id) {
        // If solved date changed, we recalculate pending revisions
        let revisions = q.revisions;
        if (updatedFields.solvedDate && updatedFields.solvedDate !== q.solvedDate) {
          const newSchedules = createRevisionSchedules(updatedFields.solvedDate);
          // Preserve completed/skipped status if matching intervals exist, else replace
          revisions = newSchedules.map(newRev => {
            const oldRev = q.revisions.find(r => r.intervalDays === newRev.intervalDays);
            if (oldRev && (oldRev.status === 'completed' || oldRev.status === 'skipped')) {
              return { ...oldRev, dueDate: addDays(updatedFields.solvedDate!, newRev.intervalDays) };
            }
            return newRev;
          });
        }

        return {
          ...q,
          ...updatedFields,
          revisions,
          updatedAt: new Date().toISOString(),
        };
      }
      return q;
    });
    saveQuestions(updated);
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    saveQuestions(updated);
  };

  const completeRevision = (questionId: string, intervalDays: number) => {
    const todayStr = getTodayDateString();
    const updated = questions.map(q => {
      if (q.id === questionId) {
        const revisions = q.revisions.map(rev => {
          if (rev.intervalDays === intervalDays) {
            return {
              ...rev,
              status: 'completed' as const,
              revisedAt: todayStr,
            };
          }
          return rev;
        });
        return {
          ...q,
          revisions,
          updatedAt: new Date().toISOString(),
        };
      }
      return q;
    });
    saveQuestions(updated);
    
    // Check if there are more due revisions for today to update notifications
    const targetQ = questions.find(q => q.id === questionId);
    if (targetQ) {
      triggerNotification('Revision Completed! 🎉', `Completed revision for "${targetQ.name}". Keep it up!`);
    }
  };

  const skipRevision = (questionId: string, intervalDays: number) => {
    const updated = questions.map(q => {
      if (q.id === questionId) {
        const revisions = q.revisions.map(rev => {
          if (rev.intervalDays === intervalDays) {
            // Postpone the revision by 1 day
            const newDueDate = addDays(rev.dueDate, 1);
            return {
              ...rev,
              dueDate: newDueDate,
              status: 'pending' as const, // stays pending but postponed
            };
          }
          return rev;
        });
        return {
          ...q,
          revisions,
          updatedAt: new Date().toISOString(),
        };
      }
      return q;
    });
    saveQuestions(updated);
  };

  const resetDatabase = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setQuestions([]);
  };

  const exportDatabase = (): string => {
    return JSON.stringify(questions, null, 2);
  };

  const importDatabase = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        // Basic validation of fields
        const isValid = parsed.every(item => 
          item.id && 
          item.name && 
          item.platform && 
          item.topic && 
          item.difficulty && 
          Array.isArray(item.revisions)
        );
        if (isValid) {
          saveQuestions(parsed);
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // 5. Notifications
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      localStorage.setItem(NOTIFICATION_ASKED_KEY, 'true');
    } catch (error) {
      console.error('Error requesting notification permission', error);
    }
  };

  const triggerNotification = (title: string, body: string) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch (error) {
      console.error('Failed to trigger notification', error);
    }
  };

  // Notify on due revisions at startup
  useEffect(() => {
    if (questions.length === 0) return;
    const todayStr = getTodayDateString();
    const dueCount = questions.reduce((acc, q) => {
      const hasDue = q.revisions.some(r => r.dueDate === todayStr && (r.status === 'pending' || r.status === 'overdue'));
      return hasDue ? acc + 1 : acc;
    }, 0);

    if (dueCount > 0 && Notification.permission === 'granted') {
      triggerNotification(
        'Revisions Due Today!',
        `You have ${dueCount} question${dueCount > 1 ? 's' : ''} waiting for revision today. Keep your streak active!`
      );
    }
  }, [questions]);

  return (
    <DatabaseContext.Provider value={{
      questions,
      stats,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      completeRevision,
      skipRevision,
      resetDatabase,
      exportDatabase,
      importDatabase,
      notificationPermission,
      requestNotificationPermission,
      triggerNotification
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
