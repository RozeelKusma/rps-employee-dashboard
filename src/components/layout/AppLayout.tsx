import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatAssistant } from "~/components/chat/ChatAssistant";
import { useAsync } from "~/hooks/useAsync";
import { mockApi } from "~/data/mockApi";
import { useThemeStore } from "~/store/theme.store";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/attendance": "Attendance",
  "/leave": "Leave Requests",
  "/team": "Team Directory",
  "/announcements": "Announcements",
  "/calendar": "Calendar",
  "/profile": "My Profile",
};

export function AppLayout() {
  const { theme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { data: currentUser } = useAsync(() => mockApi.getCurrentUser(), []);

  // Lightweight shared context feeds the chat assistant without prop drilling
  // through every page — each of these calls is cheap and cached per mount.
  const { data: attendance } = useAsync(() => mockApi.getAttendance(), []);
  const { data: leaveBalances } = useAsync(
    () => mockApi.getLeaveBalances(),
    [],
  );
  const { data: leaveRequests } = useAsync(
    () => mockApi.getLeaveRequests(),
    [],
  );
  const { data: announcements } = useAsync(
    () => mockApi.getAnnouncements(),
    [],
  );

  const pageTitle = TITLES[location.pathname] ?? "Dashboard";
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          currentUser={currentUser}
          pageTitle={pageTitle}
        />

        <main className="flex-1 p-4 lg:p-6 max-w-350 w-full mx-auto">
          <div key={location.pathname} className="animate-fade-slide-up">
            <Outlet />
          </div>
        </main>
      </div>

      <ChatAssistant
        userName={currentUser?.name ?? "there"}
        attendanceSummary={attendance?.summary ?? null}
        leaveBalances={leaveBalances ?? null}
        leaveRequests={leaveRequests ?? null}
        announcements={announcements ?? null}
      />
    </div>
  );
}
