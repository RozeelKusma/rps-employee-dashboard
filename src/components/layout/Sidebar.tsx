import {
  LayoutDashboard,
  CalendarClock,
  FileText,
  Users,
  Megaphone,
  CalendarDays,
  UserCircle,
  X,
  LucideLayoutDashboard,
} from "lucide-react";
import { NavLink } from "react-router";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/attendance", label: "Attendance", icon: CalendarClock },
  { to: "/leave", label: "Leave Requests", icon: FileText },
  { to: "/team", label: "Team Directory", icon: Users },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/profile", label: "My Profile", icon: UserCircle },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <LucideLayoutDashboard
                className="w-4.5 h-4.5 text-white"
                strokeWidth={2.5}
              />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">
              RPS Employee
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="rounded-xl bg-linear-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/10 dark:to-violet-500/10 p-3.5">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Dashboard V1.0
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              All data is mocked
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
