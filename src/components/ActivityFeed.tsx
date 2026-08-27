import React from 'react';
import { motion } from 'framer-motion';
import { ActivityItem } from '../types';
import { CheckCircle2, AlertCircle, Award, RotateCcw, ArrowUpRight } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  onSelectProblemById: (problemId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({activities, onSelectProblemById}) => {
  return (
    <motion.section
      className="spatial-card p-5 sm:p-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between border-b border-glass-border pb-3">
        <h3 className="font-heading text-base font-black uppercase tracking-tight text-text-primary">
          RECENT TELEMETRY
        </h3>
        <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-widest animate-glow-pulse">
          LIVE
        </span>
      </div>

      <motion.div
        className="flex flex-col gap-1.5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activities.map((item) => {
          const isSolved = item.type === 'solved';
          const isFailed = item.type === 'failed';
          const isBadge = item.type === 'badge';

          return (
            <motion.div
              key={item.id}
              onClick={() => item.problemId && onSelectProblemById(item.problemId)}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                item.problemId ? 'hover:bg-glass-bg cursor-pointer group' : ''
              } ${isFailed ? 'opacity-85' : ''}`}
              variants={itemVariants}
            >
              <div className="mt-0.5 shrink-0">
                {isSolved && <CheckCircle2 className="w-4 h-4 text-accent" />}
                {isFailed && <AlertCircle className="w-4 h-4 text-accent-danger" />}
                {isBadge && <Award className="w-4 h-4 text-accent-amber" />}
                {item.type === 'revision' && <RotateCcw className="w-4 h-4 text-accent-emerald" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold uppercase tracking-tight text-text-primary truncate group-hover:text-accent transition-colors">
                    {item.title}
                  </p>
                  {item.problemId && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-text-secondary line-clamp-1 mt-0.5">
                  {item.detail}
                </p>
                <span className="font-mono text-[10px] uppercase text-text-muted block mt-1">
                  {item.timeAgo}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};
