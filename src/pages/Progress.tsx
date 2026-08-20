import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  PieChart as PieIcon, 
  FolderCheck,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Card } from '../components/ui/Card';

export const Progress: React.FC = () => {
  const { questions } = useDatabase();

  // 1. Difficulty split calculations
  const difficultyData = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;

    questions.forEach(q => {
      if (q.difficulty === 'Easy') easy++;
      else if (q.difficulty === 'Medium') medium++;
      else if (q.difficulty === 'Hard') hard++;
    });

    return [
      { name: 'Easy', value: easy, color: '#10b981' },
      { name: 'Medium', value: medium, color: '#f59e0b' },
      { name: 'Hard', value: hard, color: '#ef4444' }
    ].filter(item => item.value > 0); // Only show segments with data
  }, [questions]);

  // 2. Topic split calculations
  const topicData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    questions.forEach(q => {
      counts[q.topic] = (counts[q.topic] || 0) + 1;
    });

    return Object.keys(counts)
      .map(topic => ({
        name: topic,
        count: counts[topic]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7); // Display top 7 topics
  }, [questions]);

  // 3. Revision statistics
  const revisionStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    let skipped = 0;
    let pending = 0;

    questions.forEach(q => {
      q.revisions.forEach(r => {
        total++;
        if (r.status === 'completed') completed++;
        else if (r.status === 'skipped') skipped++;
        else pending++;
      });
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, skipped, pending, completionRate };
  }, [questions]);

  const hasData = questions.length > 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div>
        <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1 block">Analytics</span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Analytics & Progress</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Visualize your DSA journey, topic coverage, and revision performance.
        </p>
      </div>

      {hasData ? (
        <div className="space-y-6">
          {/* Top Quick Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="flex items-center gap-4">
              <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-500/20 shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Questions</span>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{questions.length}</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Completed Revisions</span>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{revisionStats.completed}</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-500/20 shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Revision Success Rate</span>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{revisionStats.completionRate}%</p>
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty Donut Chart */}
            <Card className="flex flex-col h-[350px]">
              <div className="flex items-center gap-2 mb-4">
                <PieIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Difficulty Split</h3>
              </div>
              {difficultyData.length > 0 ? (
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(9, 9, 11, 0.9)', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs font-semibold">
                  No data available
                </div>
              )}
            </Card>

            {/* Topic Frequency Bar Chart */}
            <Card className="flex flex-col h-[350px]">
              <div className="flex items-center gap-2 mb-4">
                <FolderCheck size={16} className="text-zinc-400 dark:text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Top Solved Topics</h3>
              </div>
              {topicData.length > 0 ? (
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topicData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <XAxis type="number" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#888888" fontSize={10} width={100} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                        contentStyle={{ 
                          backgroundColor: 'rgba(9, 9, 11, 0.9)', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs font-semibold">
                  No data available
                </div>
              )}
            </Card>
          </div>

          {/* Bottom Card details on Revisions */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={16} className="text-zinc-400 dark:text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Spaced Repetition Stats</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Scheduled Revisions</span>
                <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{revisionStats.total}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Completed</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{revisionStats.completed}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Pending/Upcoming</span>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{revisionStats.pending}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Skipped/Postponed</span>
                <p className="text-2xl font-bold text-zinc-500 dark:text-zinc-400">{revisionStats.skipped}</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Empty states */
        <Card className="flex flex-col items-center justify-center text-center py-20 max-w-md mx-auto mt-10 space-y-4">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800/80 rounded-full text-zinc-400">
            <PieIcon size={32} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-200">No Analytics Yet</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Add solved questions and complete revision intervals to view your growth metrics.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
export default Progress;
