import { useNavigate } from "react-router";
import { Menu, Sun, Moon, Bell } from "lucide-react";
import type { Employee } from "~/types";
import { useThemeStore } from "~/store/theme.store";

export function Topbar({
  onMenuClick,
  currentUser,
  pageTitle,
}: {
  onMenuClick: () => void;
  currentUser: Employee | null;
  pageTitle: string;
}) {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-4 px-4 lg:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg -ml-2"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {theme === "dark" ? (
          <Sun className="w-4.5 h-4.5" />
        ) : (
          <Moon className="w-4.5 h-4.5" />
        )}
      </button>

      <button
        aria-label="Notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="w-4.5 h-4.5" />
        <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
      </button>

      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2.5 pl-1 pr-1 lg:pr-3 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {currentUser ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full bg-slate-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        )}
        <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-200">
          {currentUser?.name.split(" ")[0] ?? ""}
        </span>
      </button>
    </header>
  );
}
