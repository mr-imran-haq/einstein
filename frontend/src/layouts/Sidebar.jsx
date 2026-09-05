import {
  LayoutDashboard, CalendarCheck, BookOpen, Target, CheckSquare,
  Clock, Calendar, Newspaper, StickyNote, Timer, Flame,
  TrendingUp, Sparkles, FolderOpen, Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Today's Plan", icon: CalendarCheck, path: "/today" },
  { label: "Study Hub", icon: BookOpen, path: "/study" },
  { label: "Targets", icon: Target, path: "/targets" },
  { label: "To-Do List", icon: CheckSquare, path: "/todo" },
  { label: "Routine", icon: Clock, path: "/routine" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "News Feed", icon: Newspaper, path: "/news" },
  { label: "Notes", icon: StickyNote, path: "/notes" },
  { label: "Focus Timer", icon: Timer, path: "/focus" },
  { label: "Habits", icon: Flame, path: "/habits" },
  { label: "Progress", icon: TrendingUp, path: "/progress" },
  { label: "AI Assistant", icon: Sparkles, path: "/assistant" },
  { label: "My Creations", icon: FolderOpen, path: "/creations" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-paper border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="px-6 py-6">
        <h1 className="font-display text-xl text-ink">Einstein</h1>
        <p className="text-sm text-muted mt-0.5">Personal assistant</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-ink/80 hover:bg-black/5"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
            <div className="px-3 py-4 border-t border-border">
              <div className="px-3 mb-2">
                <p className="text-sm text-ink font-medium">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-ink/70 hover:bg-black/5">
                <LogOut size={18} />
                Log out
              </button>
            </div>
    </aside>
  );
}