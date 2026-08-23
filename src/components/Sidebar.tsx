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
import BrandLogo from './BrandLogo';

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
      badgeColor: stats.overdueCount > 0 ? 'bg-rose-500 text-white' : 'bg-brand-500 text-white'
    },
    { to: '/questions', name: 'All Questions', icon: ClipboardList },
    { to: '/calendar', name: 'Calendar', icon: Calendar },
    { to: '/progress', name: 'Progress', icon: Clock },
    { to: '/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 shrink-0 bg-gradient-to-b from-night-900 via-night-800 to-night-950 border-r border-white/10 flex flex-col text-zinc-100 shadow-2xl shadow-black/40">
      {/* Brand Header — custom gem logo */}
      <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
        <BrandLogo size={32} />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive 
                    ? 'brand-gradient text-white shadow-lg shadow-brand-600/25' 
                    : 'text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-zinc-500 group-hover:text-brand-300 transition-colors'} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
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
      <div className="p-4 border-t border-white/10 flex flex-col gap-3.5">
        {/* Active Streak Display */}
        {stats.currentStreak > 0 && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/15 to-amber-400/10 border border-orange-400/25 flex items-center gap-3 animate-pulse-subtle">
            <div className="h-9 w-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-300">
              <Flame size={18} fill="currentColor" />
            </div>
            <div>
              <div className="text-[11px] text-zinc-400 font-medium">Current Streak</div>
              <div className="text-sm font-bold text-orange-200 leading-tight">
                {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">Appearance</span>
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-300 hover:bg-brand-500/15 hover:text-brand-300 hover:border-brand-500/40 transition-colors cursor-pointer"
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