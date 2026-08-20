import React from 'react';
import { 
  Star, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Tag,
  CheckSquare,
  Square
} from 'lucide-react';
import type { Question } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useDatabase } from '../context/DatabaseContext';
import { getTodayDateString } from '../utils/dateUtils';

interface QuestionCardProps {
  question: Question;
  onEdit: (q: Question) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  selectionMode?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onEdit, isSelected = false, onSelect, selectionMode = false }) => {
  const { deleteQuestion, completeRevision, updateQuestion } = useDatabase();
  const todayStr = getTodayDateString();

  // Find the next revision schedule (first pending/overdue schedule)
  const nextRevision = question.revisions.find(
    r => r.status === 'pending' || r.status === 'overdue'
  );

  // Determine if next revision is due today or overdue
  const isRevisionActive = nextRevision && nextRevision.dueDate <= todayStr;
  const isOverdue = nextRevision && nextRevision.dueDate < todayStr;

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuestion(question.id, { isFavourite: !question.isFavourite });
  };

  const handleMarkRevised = () => {
    if (nextRevision) {
      completeRevision(question.id, nextRevision.intervalDays);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${question.name}"?`)) {
      deleteQuestion(question.id);
    }
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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs hover:border-zinc-350 dark:hover:border-zinc-700/80 transition-all duration-200 group flex flex-col justify-between h-full gap-4">
      <div>
        {/* Card Header: Platform, Difficulty, Selection & Favorite Star */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {selectionMode && onSelect && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(question.id);
                }}
                className="p-1.5 rounded-lg border transition-colors cursor-pointer flex-shrink-0"
                aria-label={isSelected ? 'Deselect' : 'Select'}
              >
                {isSelected ? (
                  <CheckSquare size={16} className="text-blue-600 dark:text-blue-400" />
                ) : (
                  <Square size={16} className="text-zinc-400 dark:text-zinc-500" />
                )}
              </button>
            )}
            <Badge variant={getPlatformVariant(question.platform)}>
              {question.platform}
            </Badge>
            <Badge variant={getDifficultyVariant(question.difficulty)}>
              {question.difficulty}
            </Badge>
            {question.needsPractice && (
              <Badge variant="default" className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30">
                Practice Needed
              </Badge>
            )}
          </div>
          
          <button
            onClick={handleToggleFavourite}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              question.isFavourite 
                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 border-amber-200 dark:border-amber-900/30' 
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
            title={question.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Star size={15} fill={question.isFavourite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Problem Name & Topic */}
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {question.name}
          </h4>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            {question.topic}
          </p>
        </div>

        {/* Algorithm Tags */}
        {question.algorithmTags && question.algorithmTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {question.algorithmTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/10 text-[10px] px-2 py-0.5">
                <Tag size={10} className="mr-0.5" />
                {tag}
              </Badge>
            ))}
            {question.algorithmTags.length > 3 && (
              <Badge variant="default" className="bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20 dark:border-zinc-500/10 text-[10px] px-2 py-0.5">
                +{question.algorithmTags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Notes (truncate) */}
        {question.notes && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 line-clamp-2 bg-zinc-50 dark:bg-zinc-800/30 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
            {question.notes}
          </p>
        )}
      </div>

      {/* Revision Schedule & Solved Date */}
      <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex flex-col gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-400 dark:text-zinc-500">Solved:</span>
            <span>{new Date(question.solvedDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-400 dark:text-zinc-500">Next Revision:</span>
            {nextRevision ? (
              <span className={`inline-flex items-center gap-1 ${
                isOverdue 
                  ? 'text-red-600 dark:text-red-400 font-semibold' 
                  : isRevisionActive 
                    ? 'text-orange-600 dark:text-orange-400 font-medium' 
                    : 'text-zinc-700 dark:text-zinc-300'
              }`}>
                {isOverdue && <AlertCircle size={12} className="shrink-0" />}
                {new Date(nextRevision.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                  (Day {nextRevision.intervalDays})
                </span>
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 font-semibold">
                <CheckCircle size={12} />
                All Completed
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <a
            href={question.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="secondary" size="sm" className="w-full">
              <ExternalLink size={13} />
              Open Link
            </Button>
          </a>

          <Button
            variant={isRevisionActive ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleMarkRevised}
            disabled={!isRevisionActive}
            className="w-full"
            title={
              !nextRevision
                ? 'All revisions completed'
                : !isRevisionActive
                  ? `Next revision on ${new Date(nextRevision.dueDate).toLocaleDateString()}`
                  : 'Mark this revision as completed'
            }
          >
            <CheckCircle size={13} />
            {isRevisionActive ? 'Mark Revised' : 'No Rev. Due'}
          </Button>
        </div>

        {/* Edit / Delete Footer Controls */}
        <div className="flex items-center justify-end gap-1.5 pt-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(question)}
            className="!p-1.5 h-8 w-8 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
            title="Edit question"
          >
            <Edit3 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="!p-1.5 h-8 w-8 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
            title="Delete question"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default QuestionCard;
