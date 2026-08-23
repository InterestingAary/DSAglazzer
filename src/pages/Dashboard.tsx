import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  CheckCircle2, 
  CalendarDays, 
  AlertCircle, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import Heatmap from '../components/Heatmap';
import Reveal from '../components/Reveal';
import { getTodayDateString } from '../utils/dateUtils';

export const Dashboard: React.FC = () => {
  const { questions, stats } = useDatabase();
  const navigate = useNavigate();
  const todayStr = getTodayDateString();

  // Find upcoming revisions (next 5 pending revisions in chronological order)
  const upcomingRevisions = useMemo(() => {
    const list: { question: typeof questions[0]; nextRev: typeof questions[0]['revisions'][0] }[] = [];
    
    questions.forEach(q => {
      const nextPending = q.revisions.find(r => r.status === 'pending' || r.status === 'overdue');
      if (nextPending) {
        list.push({ question: q, nextRev: nextPending });
      }
    });

    // Sort by due date ascending
    return list
      .sort((a, b) => a.nextRev.dueDate.localeCompare(b.nextRev.dueDate))
      .slice(0, 5);
  }, [questions]);

  // Total revision completion rate
  const completionRate = useMemo(() => {
    let total = 0;
    let completed = 0;
    questions.forEach(q => {
      q.revisions.forEach(r => {
        total++;
        if (r.status === 'completed') {
          completed++;
        }
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [questions]);

  const cardsData = [
    {
      title: 'Total Questions Solved',
      value: stats.solvedCount,
      description: 'Total questions added to tracker',
      icon: FileText,
      colorClass: 'text-brand-600 dark:text-brand-400 bg-brand-500/10 border-brand-500/20'
    },
    {
      title: 'Questions Due Today',
      value: stats.dueTodayCount,
      description: 'Revisions scheduled for today',
      icon: CalendarDays,
      colorClass: stats.dueTodayCount > 0 
        ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' 
        : 'text-zinc-500 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    },
    {
      title: 'Overdue Questions',
      value: stats.overdueCount,
      description: 'Missed revision timelines',
      icon: AlertCircle,
      colorClass: stats.overdueCount > 0 
        ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' 
        : 'text-zinc-500 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    },
    {
      title: 'Total Revisions Completed',
      value: stats.totalRevisionsCompleted,
      description: `${completionRate}% revision completion rate`,
      icon: CheckCircle2,
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header — portfolio-style display */}
      <Reveal>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">Overview <span className="h-px w-8 bg-gradient-to-r from-brand-500 to-iris-500 hidden sm:inline-block" aria-hidden="true" /></span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">Welcome back, <span className="brand-text-gradient">Developer</span></h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-xl">Your <strong className="text-zinc-700 dark:text-zinc-200">spaced repetition</strong> status for today — stay consistent, keep the streak alive.</p>
        </div>
        
        {/* Dynamic call to action button */}
        {(stats.dueTodayCount > 0 || stats.overdueCount > 0) ? (
          <Button 
            variant="primary" 
            onClick={() => navigate('/today')}
            className="shadow-brand-600/25 shadow-md group active:scale-[0.98]"
          >
            Start Today&apos;s Revision ({stats.dueTodayCount + stats.overdueCount} due)
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            onClick={() => navigate('/questions')}
            className="group active:scale-[0.98]"
          >
            Add New Question
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Button>
        )}
      </div>
      </Reveal>

      {/* KPI Cards Grid */}
      <Reveal delay={0.06}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((c, i) => {
          const Icon = c.icon;
          return (
            <Card key={i} hoverable className="flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{c.title}</span>
                <div className={`p-2 rounded-lg border flex items-center justify-center shrink-0 ${c.colorClass}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <span className="stat-number text-3xl font-bold text-zinc-900 dark:text-zinc-50">{c.value}</span>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">{c.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
      </Reveal>

      {/* Heatmap Row */}
      <Reveal delay={0.1}>
      <Heatmap questions={questions} />
      </Reveal>

      {/* Main Grid: Streak + Next up list */}
      <Reveal delay={0.14}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Streak details */}
        <Card className="lg:col-span-1 flex flex-col justify-between gap-5 h-full">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-brand-500" />
              Revision Streaks
            </h3>
            <div className="flex flex-col gap-6 items-center py-4">
              <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="w-24 h-24 rounded-full p-[3px] brand-gradient flex items-center justify-center shadow-lg shadow-brand-600/20">
                  <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                    <div className="text-center">
                      <span className="stat-number text-3xl font-extrabold text-brand-600 dark:text-brand-400 leading-none">
                        {stats.currentStreak}
                      </span>
                      <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase mt-0.5">
                        Days
                      </span>
                    </div>
                  </div>
                </div>
                {/* Fire Badge */}
                <div className="absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-orange-500 text-white shadow-md">
                  <Flame size={16} fill="currentColor" />
                </div>
              </div>

              <div className="w-full text-center space-y-1">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">
                  {stats.currentStreak > 0 
                    ? `You are on a ${stats.currentStreak}-day revision streak!`
                    : 'Solve or revise a question to start your streak today!'
                  }
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Consistency is key for long-term memory retention.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">Longest Streak Record:</span>
            <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <Flame size={14} fill="currentColor" />
              {stats.longestStreak} {stats.longestStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </Card>

        {/* Right Column: Upcoming Schedule List */}
        <Card className="lg:col-span-2 flex flex-col justify-between gap-5 h-full">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-brand-500" />
              Upcoming Revision Agenda
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {upcomingRevisions.length > 0 ? (
                upcomingRevisions.map(({ question, nextRev }, idx) => {
                  const isDue = nextRev.dueDate <= todayStr;
                  const isMissed = nextRev.dueDate < todayStr;
                  
                  return (
                    <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3 group">
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                          {question.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                          <span>{question.topic}</span>
                          <span>•</span>
                          <span className="capitalize">{question.platform}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          Day {nextRev.intervalDays}
                        </span>
                        <Badge 
                          variant={
                            isMissed 
                              ? 'hard' 
                              : isDue 
                                ? 'medium' 
                                : 'default'
                          }
                          className="font-medium"
                        >
                          {isMissed 
                            ? 'Overdue' 
                            : isDue 
                              ? 'Due Today' 
                              : new Date(nextRev.dueDate).toLocaleDateString(undefined, { dateStyle: 'short' })
                          }
                        </Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 space-y-2">
                  <Sparkles size={24} className="text-zinc-300 dark:text-zinc-700" />
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">All revision queues clear!</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">Solved questions will start scheduling revisions here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 text-right">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/calendar')}
              className="text-xs font-semibold hover:gap-2 transition-all cursor-pointer"
            >
              View Calendar Agenda
              <ArrowRight size={13} />
            </Button>
          </div>
        </Card>
      </div>
      </Reveal>
    </div>
  );
};
export default Dashboard;
