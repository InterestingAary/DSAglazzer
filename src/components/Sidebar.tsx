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
      badgeColor: stats.overdueCount > 0 ? 'bg-rose-500/90 text-white' : 'bg-brand-500 text-zinc-950'
    },
    { to: '/questions', name: 'All Questions', icon: ClipboardList },
    { to: '/calendar', name: 'Calendar', icon: Calendar },
    { to: '/progress', name: 'Progress', icon: Clock },
    { to: '/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-950 dark:bg-[#0a0a0d] border-r border-zinc-800/70 dark:border-zinc-800/50 flex flex-col h-screen sticky top-0 shrink-0 text-zinc-100">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-zinc-800/70 dark:border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg brand-gradient flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-900/40">
            D
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-none tracking-tight">DSA Revise</h1>
            <span className="text-[10px] text-zinc-500 font-medium">Spaced Repetition</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `group relative flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive 
                    ? 'bg-white/[0.07] text-white' 
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-brand-400 transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={`transition-colors ${isActive ? 'text-brand-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Streak Widget & Footer theme switch */}
      <div className="p-4 border-t border-zinc-800/70 dark:border-zinc-800/50 flex flex-col gap-4">
        {/* Active Streak Display */}
        {stats.currentStreak > 0 && (
          <div className="p-3 bg-brand-500/[0.08] border border-brand-500/15 rounded-xl flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400">
              <Flame size={18} fill="currentColor" />
            </div>
            <div>
              <div className="text-[11px] text-zinc-500 font-medium">Current Streak</div>
              <div className="text-sm font-bold text-white leading-tight">
                {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">Theme</span>
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200 transition-colors cursor-pointer"
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