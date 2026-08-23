import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, ClipboardList, Calendar, Clock, Settings, Flame } from "lucide-react";
import { useDatabase } from "../context/DatabaseContext";

const items = [
  { to: "/", label: "Dashboard", sub: "Overview & streak", icon: LayoutDashboard, accent: "brand" },
  { to: "/today", label: "Today", sub: "Due revisions", icon: ListChecks, accent: "amber" },
  { to: "/questions", label: "Questions", sub: "Library", icon: ClipboardList, accent: "brand" },
  { to: "/calendar", label: "Calendar", sub: "Timeline", icon: Calendar, accent: "brand" },
  { to: "/progress", label: "Progress", sub: "Analytics", icon: Clock, accent: "emerald" },
  { to: "/settings", label: "Settings", sub: "Sync & prefs", icon: Settings, accent: "zinc" },
] as const;

export default function TopGrid() {
  const { stats } = useDatabase();
  const pending = stats.dueTodayCount + stats.overdueCount;
  return (
    <div className="relative">
      {/* grid-bg band */}
      <div className="absolute inset-0 grid-bg opacity-[0.35] pointer-events-none" aria-hidden="true" />
      <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((it) => {
          const Icon = it.icon;
          const isToday = it.to === "/today";
          const badge = isToday && pending > 0 ? pending : undefined;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `group relative rounded-xl border bg-white/80 dark:bg-zinc-900/60 backdrop-blur p-3.5 card-lift overflow-hidden ${
                  isActive ? "border-brand-500/40 shadow-brand-600/10" : "border-zinc-200/80 dark:border-zinc-800/70"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />}
                  <div className="flex items-start justify-between gap-2">
                    <span className={`h-7 w-7 rounded-lg flex items-center justify-center border text-xs ${isActive ? "bg-brand-500 text-white border-brand-600" : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500"}`}>
                      <Icon size={14} />
                    </span>
                    {badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${stats.overdueCount > 0 ? "bg-rose-500 text-white" : "bg-brand-500 text-white"}`}>{badge}</span>
                    )}
                    {it.label === "Dashboard" && stats.currentStreak > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400"><Flame size={10} fill="currentColor" />{stats.currentStreak}</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className={`text-xs font-semibold tracking-tight ${isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-200"} font-display`}>{it.label}</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{it.sub}</div>
                  </div>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-500 transition-all ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-40"}`} />
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}