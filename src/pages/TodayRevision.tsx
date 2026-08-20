import React, { useMemo, useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  CornerDownRight, 
  AlertCircle, 
  Edit3, 
  Calendar, 
  Save, 
  MessageSquareCode 
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getTodayDateString } from '../utils/dateUtils';

export const TodayRevision: React.FC = () => {
  const { questions, completeRevision, skipRevision, updateQuestion } = useDatabase();
  const todayStr = getTodayDateString();

  // Active editing notes state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');

  // Filter questions that have a revision due today or overdue
  const dueQuestions = useMemo(() => {
    return questions.filter(q => {
      const activePending = q.revisions.find(
        r => (r.status === 'pending' || r.status === 'overdue') && r.dueDate <= todayStr
      );
      return !!activePending;
    });
  }, [questions, todayStr]);

  const handleStartEditing = (qId: string, currentNotes: string) => {
    setEditingNotesId(qId);
    setNoteContent(currentNotes);
  };

  const handleSaveNotes = (qId: string) => {
    updateQuestion(qId, { notes: noteContent });
    setEditingNotesId(null);
  };

  // Helper to format difficulty variant
  const getDifficultyVariant = (diff: string) => {
    if (diff === 'Easy') return 'easy';
    if (diff === 'Medium') return 'medium';
    return 'hard';
  };

  // Helper to format platform variant
  const getPlatformVariant = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === 'leetcode') return 'leetcode';
    if (p === 'striver') return 'striver';
    if (p === 'gfg') return 'gfg';
    if (p === 'codestudio') return 'codestudio';
    return 'other';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1 block">Daily Queue</span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Today's Revisions</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Solve due questions to strengthen your memory and maintain your streak.
        </p>
      </div>

      {dueQuestions.length > 0 ? (
        <div className="space-y-4">
          {/* Header Status Card */}
          <div className="p-4 bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-brand-600 dark:text-brand-400 shrink-0" />
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              You have <span className="font-bold text-brand-700 dark:text-brand-400">{dueQuestions.length}</span> question{dueQuestions.length > 1 ? 's' : ''} due for revision today.
            </p>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dueQuestions.map(q => {
              // Find the active revision
              const activeRev = q.revisions.find(
                r => (r.status === 'pending' || r.status === 'overdue') && r.dueDate <= todayStr
              )!;
              
              const isOverdue = activeRev.dueDate < todayStr;

              return (
                <Card 
                  key={q.id} 
                  className={`flex flex-col justify-between gap-5 border ${
                    isOverdue 
                      ? 'border-rose-200 dark:border-rose-900/40 bg-rose-500/5' 
                      : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Tags & Due Label */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Badge variant={getPlatformVariant(q.platform)}>{q.platform}</Badge>
                        <Badge variant={getDifficultyVariant(q.difficulty)}>{q.difficulty}</Badge>
                      </div>
                      
                      <Badge 
                        variant={isOverdue ? 'hard' : 'medium'}
                        className="font-medium shrink-0"
                      >
                        {isOverdue 
                          ? 'Overdue' 
                          : 'Due Today'
                        }
                      </Badge>
                    </div>

                    {/* Problem Info */}
                    <div>
                      <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 leading-tight">
                        {q.name}
                      </h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">
                        {q.topic}
                      </p>
                    </div>

                    {/* Notes Area (Editable) */}
                    <div className="space-y-1.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-100 dark:border-zinc-800/50">
                      <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                        <span className="font-semibold flex items-center gap-1">
                          <MessageSquareCode size={13} />
                          Personal Notes
                        </span>
                        {editingNotesId !== q.id ? (
                          <button
                            onClick={() => handleStartEditing(q.id, q.notes)}
                            className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                          >
                            <Edit3 size={11} />
                            Edit
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSaveNotes(q.id)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
                          >
                            <Save size={11} />
                            Save
                          </button>
                        )}
                      </div>

                      {editingNotesId === q.id ? (
                        <textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          className="w-full text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-2 focus:outline-none focus:ring-1 focus:ring-brand-500 text-zinc-850 dark:text-zinc-250 font-mono mt-1"
                          rows={3}
                          placeholder="Add revision hints or solutions..."
                        />
                      ) : (
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono break-words leading-normal whitespace-pre-wrap">
                          {q.notes || 'No notes added yet.'}
                        </p>
                      )}
                    </div>

                    {/* Timeline metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                      <Calendar size={12} />
                      <span>Originally solved: {new Date(q.solvedDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      <span>•</span>
                      <span>Timeline: Day {activeRev.intervalDays}</span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    <a
                      href={q.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="secondary" size="sm" className="w-full text-xs font-semibold py-2">
                        <ExternalLink size={13} />
                        Open Link
                      </Button>
                    </a>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => skipRevision(q.id, activeRev.intervalDays)}
                      className="w-full text-xs hover:bg-zinc-150 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-2 border border-zinc-200/50 dark:border-zinc-800/50"
                      title="Postpone this revision by 1 day"
                    >
                      <CornerDownRight size={13} />
                      Skip
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => completeRevision(q.id, activeRev.intervalDays)}
                      className="w-full text-xs font-semibold py-2"
                    >
                      <CheckCircle2 size={13} />
                      Complete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty caught-up state */
        <Card className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4 max-w-md mx-auto mt-10">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">All Caught Up!</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Your memory is fully refreshed. No revisions are due for today.
            </p>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            New questions you add will schedule future repetitions. Check back tomorrow!
          </p>
        </Card>
      )}
    </div>
  );
};
export default TodayRevision;
