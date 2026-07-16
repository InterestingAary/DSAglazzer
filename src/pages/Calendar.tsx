import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  CalendarDays,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getTodayDateString } from '../utils/dateUtils';
import type { Question } from '../types';

export const Calendar: React.FC = () => {
  const { questions } = useDatabase();
  const todayStr = getTodayDateString();

  // Selected date state (defaults to today)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Month navigation state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    // Days in current month
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    // First day of week (0 = Sunday, 6 = Saturday)
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const days: { dateStr: string | null; dayNum: number | null }[] = [];

    // Prefix empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dateStr: null, dayNum: null });
    }

    // Actual month dates
    for (let day = 1; day <= totalDays; day++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      days.push({ dateStr, dayNum: day });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Map of date string to lists of revisions scheduled on that date
  const dayScheduleMap = useMemo(() => {
    const map = new Map<string, { question: Question; status: 'completed' | 'pending' | 'overdue' | 'upcoming'; interval: number }[]>();

    questions.forEach(q => {
      q.revisions.forEach(rev => {
        // If completed, map it to the actual revision date
        if (rev.status === 'completed' && rev.revisedAt) {
          const dateStr = rev.revisedAt;
          const currentList = map.get(dateStr) || [];
          currentList.push({ question: q, status: 'completed', interval: rev.intervalDays });
          map.set(dateStr, currentList);
        } else {
          // Map to due date for pending / overdue / upcoming
          const dateStr = rev.dueDate;
          let status: 'pending' | 'overdue' | 'upcoming' = 'upcoming';
          if (dateStr === todayStr) {
            status = 'pending';
          } else if (dateStr < todayStr) {
            status = 'overdue';
          }
          
          const currentList = map.get(dateStr) || [];
          currentList.push({ question: q, status, interval: rev.intervalDays });
          map.set(dateStr, currentList);
        }
      });
    });

    return map;
  }, [questions, todayStr]);

  // Selected date agenda
  const agendaList = useMemo(() => {
    return dayScheduleMap.get(selectedDateStr) || [];
  }, [selectedDateStr, dayScheduleMap]);

  // Format header month label
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get indicator dot configuration for a calendar cell
  const getCellIndicators = (dateStr: string) => {
    const list = dayScheduleMap.get(dateStr);
    if (!list || list.length === 0) return null;

    let hasOverdue = false;
    let hasDue = false;
    let hasUpcoming = false;
    let hasCompleted = false;

    list.forEach(item => {
      if (item.status === 'overdue') hasOverdue = true;
      else if (item.status === 'pending') hasDue = true;
      else if (item.status === 'upcoming') hasUpcoming = true;
      else if (item.status === 'completed') hasCompleted = true;
    });

    return { hasOverdue, hasDue, hasUpcoming, hasCompleted };
  };

  // Helper styling for difficulty badge
  const getDifficultyVariant = (diff: string) => {
    if (diff === 'Easy') return 'easy';
    if (diff === 'Medium') return 'medium';
    return 'hard';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Revision Calendar</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track your history and upcoming revision timelines day by day.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={handleGoToday}>
            Today
          </Button>
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900/60 overflow-hidden">
            <button 
              onClick={handlePrevMonth}
              className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-l border-zinc-200 dark:border-zinc-800 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Calendar Grid Box */}
        <Card className="lg:col-span-2 p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-6 px-1">
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{monthName}</span>
            <div className="flex gap-4 text-[10px] text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Overdue</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Due Today</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Upcoming</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Completed</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Days Header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <span key={i} className="text-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider py-1.5 select-none">
                {d}
              </span>
            ))}

            {/* Days Cells */}
            {calendarDays.map((cell, idx) => {
              if (cell.dayNum === null || cell.dateStr === null) {
                return <div key={idx} className="aspect-square bg-zinc-50/20 dark:bg-zinc-950/10 rounded-lg border border-transparent" />;
              }

              const isSelected = cell.dateStr === selectedDateStr;
              const isToday = cell.dateStr === todayStr;
              const indicators = getCellIndicators(cell.dateStr);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateStr(cell.dateStr!)}
                  className={`aspect-square p-1 rounded-lg border flex flex-col items-center justify-between relative transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20 hover:bg-blue-500'
                      : isToday
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-150 dark:hover:bg-zinc-750'
                        : 'bg-white dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/80 text-zinc-850 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  {/* Day Date number */}
                  <span className={`text-xs font-semibold select-none ${isSelected ? 'text-white' : 'text-zinc-750 dark:text-zinc-200'}`}>
                    {cell.dayNum}
                  </span>

                  {/* Indicators dot row */}
                  {indicators && (
                    <div className="flex gap-0.5 justify-center mt-auto pb-1 shrink-0">
                      {indicators.hasOverdue && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500'}`} />
                      )}
                      {indicators.hasDue && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`} />
                      )}
                      {indicators.hasUpcoming && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                      )}
                      {indicators.hasCompleted && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Selected Day Agenda Drawer */}
        <Card className="p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-xs flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-4 select-none">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Day's Agenda</h3>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">
                  {new Date(selectedDateStr).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
              <CalendarDays size={18} className="text-zinc-400 dark:text-zinc-500" />
            </div>

            <div className="space-y-3.5 overflow-y-auto max-h-[350px]">
              {agendaList.length > 0 ? (
                agendaList.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-zinc-50 dark:bg-zinc-950/45 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                        {item.question.name}
                      </span>
                      <Badge variant={getDifficultyVariant(item.question.difficulty)} className="shrink-0">
                        {item.question.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
                      <span>Day {item.interval} Revision</span>
                      <span className={`font-semibold flex items-center gap-1 ${
                        item.status === 'completed' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : item.status === 'overdue' 
                            ? 'text-rose-600 dark:text-rose-400' 
                            : item.status === 'pending' 
                              ? 'text-amber-600 dark:text-amber-400' 
                              : 'text-blue-600 dark:text-blue-450'
                      }`}>
                        {item.status === 'completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {item.status === 'completed' 
                          ? 'Completed' 
                          : item.status === 'overdue' 
                            ? 'Overdue' 
                            : item.status === 'pending' 
                              ? 'Due Today' 
                              : 'Upcoming'
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <a 
                        href={item.question.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="secondary" size="sm" className="w-full !h-7 !text-[11px]">
                          <ExternalLink size={10} />
                          Open Problem
                        </Button>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-2 text-zinc-400">
                  <BookOpen size={20} className="text-zinc-350 dark:text-zinc-700" />
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-300">Agenda Clear</p>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500 max-w-[180px]">No revision schedules or completions on this date.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 select-none">
            <span>Revisions scheduled:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-200">{agendaList.length}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Calendar;
