import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, Flame, Menu, X, Zap } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useDatabase } from "../context/DatabaseContext";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/questions", label: "Practice" },
  { to: "/calendar", label: "Calendar" },
  { to: "/progress", label: "Progress" },
  { to: "/today", label: "Revision" },
];

interface AppNavbarProps {
  onToggleDrawer: () => void;
  drawerOpen: boolean;
}

export default function AppNavbar({ onToggleDrawer, drawerOpen }: AppNavbarProps) {
  const { stats, notificationPermission, requestNotificationPermission } = useDatabase();
  const navigate = useNavigate();
  const [bellState, setBellState] = useState<"idle" | "on" | "denied">("idle");

  useEffect(() => {
    setBellState(notificationPermission === "granted" ? "on" : notificationPermission === "denied" ? "denied" : "idle");
  }, [notificationPermission]);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[var(--bg-app)]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <BrandLogo size={32} />
          <div className="hidden md:flex items-center gap-5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-semibold border-b-2 pb-1 transition-colors ${
                    isActive
                      ? "text-[var(--accent)] border-[var(--accent)]"
                      : "text-[var(--text-secondary)] border-transparent hover:text-[var(--accent)]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-sm text-[var(--tertiary)] dark:text-[#ffb869]"
            title={`${stats.currentStreak} day streak`}
          >
            <Flame size={15} fill="currentColor" /> {stats.currentStreak}
          </span>
          <button
            type="button"
            onClick={() => navigate("/today")}
            title="Quick revise"
            aria-label="Go to today's revisions"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-brand-300 hover:bg-brand-500/10 transition-colors cursor-pointer"
          >
            <Zap size={18} />
          </button>
          <button
            type="button"
            onClick={handleBell}
            title={
              bellState === "on" ? "Notifications enabled" : bellState === "denied" ? "Notifications blocked" : "Enable revision notifications"
            }
            aria-label="Toggle notifications"
            aria-pressed={bellState === "on"}
            className={`h-9 w-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              bellState === "on" ? "text-brand-300 bg-brand-500/10" : "text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-brand-500/10"
            }`}
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            onClick={onToggleDrawer}
            aria-expanded={drawerOpen}
            aria-controls="app-drawer"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200 hover:border-brand-500/40 hover:text-brand-500 dark:hover:text-brand-300 transition-colors cursor-pointer"
          >
            {drawerOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );

  function handleBell() {
    if (notificationPermission === "granted") return;
    requestNotificationPermission().catch(() => setBellState("denied"));
  }
}