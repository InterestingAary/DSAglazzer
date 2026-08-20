import React, { useMemo } from 'react';
import type { Question } from '../types';
import { getActivityMap } from '../utils/dateUtils';

interface HeatmapProps {
  questions: Question[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ questions }) => {
  const activityMap = useMemo(() => getActivityMap(questions), [questions]);

  // Compute a grid of 53 weeks ending with today
  const { weeks, monthLabels } = useMemo(() => {
    // Reference activityMap to satisfy hooks linter and typescript compiler
    if (activityMap.size < 0) return { weeks: [], monthLabels: [] };
    const today = new Date();
    // Go back 364 days (52 weeks)
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    
    // Align start date to the nearest Sunday to keep columns uniform
    const startDayOfWeek = startDate.getDay();
    const alignedStartDate = new Date(startDate);
    alignedStartDate.setDate(startDate.getDate() - startDayOfWeek);

    const dates: Date[] = [];
    let current = new Date(alignedStartDate);
    
    // Generate dates up to today
    while (current <= today) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Group into weeks of 7 days
    const weekGrid: Date[][] = [];
    let tempWeek: Date[] = [];
    
    dates.forEach((date, i) => {
      tempWeek.push(date);
      if (tempWeek.length === 7 || i === dates.length - 1) {
        weekGrid.push(tempWeek);
        tempWeek = [];
      }
    });

    // Generate Month Labels
    const labels: { index: number; name: string }[] = [];
    let lastMonth = -1;

    weekGrid.forEach((week, index) => {
      const firstDayOfWeek = week[0];
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        labels.push({
          index,
          name: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' })
        });
        lastMonth = month;
      }
    });

    return { weeks: weekGrid, monthLabels: labels };
  }, [activityMap]);

  // Color selection based on density
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/80';
    if (count <= 1) return 'bg-brand-200 dark:bg-brand-950 border-brand-300 dark:border-brand-900/60 text-brand-800 dark:text-brand-400';
    if (count <= 2) return 'bg-brand-300 dark:bg-brand-800 border-brand-400 dark:border-brand-700/60 text-white';
    if (count <= 4) return 'bg-brand-500 dark:bg-brand-600 border-brand-600 dark:border-brand-500/60 text-white';
    return 'bg-brand-700 dark:bg-brand-400 border-brand-800 dark:border-brand-300 text-white';
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Activity Heatmap</h3>
        
        {/* Heatmap Grid Wrapper */}
        <div className="overflow-x-auto scrollbar-thin pb-2">
          <div className="min-w-[680px] flex flex-col select-none">
            {/* Month Header */}
            <div className="flex text-[10px] text-zinc-400 dark:text-zinc-500 h-5 relative pl-7">
              {monthLabels.map((lbl, i) => (
                <div 
                  key={i} 
                  className="absolute"
                  style={{ left: `${28 + lbl.index * 13}px` }}
                >
                  {lbl.name}
                </div>
              ))}
            </div>

            {/* Grid Days */}
            <div className="flex gap-[3px]">
              {/* Row Header for Days */}
              <div className="flex flex-col gap-[3px] text-[9px] text-zinc-400 dark:text-zinc-500 w-6 pr-2 pt-1 font-medium select-none">
                <span className="h-[10px]"></span>
                <span className="h-[10px]">Mon</span>
                <span className="h-[10px]"></span>
                <span className="h-[10px]">Wed</span>
                <span className="h-[10px]"></span>
                <span className="h-[10px]">Fri</span>
                <span className="h-[10px]"></span>
              </div>

              {/* Grid Columns (Weeks) */}
              <div className="flex gap-[3px] flex-1">
                {weeks.map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-[3px]">
                    {week.map((day, dIndex) => {
                      const dateStr = formatDate(day);
                      const count = activityMap.get(dateStr) || 0;
                      const title = `${count} activity item${count !== 1 ? 's' : ''} on ${day.toLocaleDateString()}`;
                      
                      return (
                        <div
                          key={dIndex}
                          className={`w-2.5 h-2.5 rounded-sm border cursor-pointer group relative ${getCellColor(count)}`}
                          title={title}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block z-10 bg-zinc-950 dark:bg-zinc-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                            {title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 mt-3.5 pr-2 select-none">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm border bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-sm border bg-brand-200 dark:bg-brand-950 border-brand-300 dark:border-brand-900" />
          <div className="w-2.5 h-2.5 rounded-sm border bg-brand-300 dark:bg-brand-800 border-brand-400 dark:border-brand-700" />
          <div className="w-2.5 h-2.5 rounded-sm border bg-brand-500 dark:bg-brand-600 border-brand-600 dark:border-brand-500" />
          <div className="w-2.5 h-2.5 rounded-sm border bg-brand-700 dark:bg-brand-400 border-brand-800 dark:border-brand-300" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
export default Heatmap;
