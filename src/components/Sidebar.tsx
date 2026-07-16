import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Flame, 
  Sun, 
  Moon, 
  Clock, 
  ListChecks, 
  ClipboardList
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useTheme } from '../context/ThemeContext';

export const Sidebar: React.FC = () => {
  const { stats } = useDatabase();
  const { theme, toggleTheme } = useTheme();

  // Due revisions count
  const pendingCount = stats.dueTodayCount + stats.overdueCount;

  const navItems = [
    { to: '/', name: 'Dashboard', icon: LayoutDashboard },
    { 
      to: '/today', 
      name: 'Today\'s Revision', 
      icon: ListChecks, 
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: stats.overdueCount > 0 ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
    },
    { to: '/questions', name: 'All Questions', icon: ClipboardList },
    { to: '/calendar', name: 'Calendar', icon: Calendar },
    { to: '/progress', name: 'Progress', icon: Clock },
    { to: '/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-500/20">
            D
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-none">DSA Revise</h1>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Spaced Repetition</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer group ${
                  isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Streak Widget & Footer theme switch */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-4">
        {/* Active Streak Display */}
        {stats.currentStreak > 0 && (
          <div className="p-3 bg-orange-500/5 border border-orange-500/10 dark:border-orange-500/5 rounded-xl flex items-center gap-3 animate-pulse-subtle">
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Flame size={18} fill="currentColor" />
            </div>
            <div>
              <div className="text-xs text-zinc-400">Current Streak</div>
              <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 leading-tight">
                {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Theme</span>
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
