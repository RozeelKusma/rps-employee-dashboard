import {
  CheckCircle2,
  Clock,
  CalendarX,
  Percent,
  CalendarDays,
} from "lucide-react";

import { useAsync } from "~/hooks/useAsync";
import { mockApi } from "~/data/mockApi";
import { Skeleton } from "~/components/ui/Skeleton";
import { StatCard } from "~/components/dashboard/StatCard";
import { AttendanceChart } from "~/components/dashboard/AttendanceChart";
import { AnnouncementsFeed } from "~/components/announcements/AnnouncementsFeed";
import { LeaveBalanceChart } from "~/components/dashboard/LeaveBalanceChart";
import { Card, CardHeader } from "~/components/ui/Card";
import { MonthCalendar } from "~/components/calendar/MonthCalendar";
import { useAnnouncementStore } from "~/store/announcementStore";
import { useEffect } from "react";

const DashboardPage = () => {
  const { data: attendance, loading: attendanceLoading } = useAsync(
    () => mockApi.getAttendance(),
    [],
  );
  const { data: leaveBalances, loading: leaveLoading } = useAsync(
    () => mockApi.getLeaveBalances(),
    [],
  );

  const { data: events, loading: eventsLoading } = useAsync(
    () => mockApi.getCalendarEvents(),
    [],
  );
  const { data: user } = useAsync(() => mockApi.getCurrentUser(), []);
  const {
    announcements,
    fetchAnnouncements,
    loading: announcementsLoading,
  } = useAnnouncementStore();
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);
  const summary = attendance?.summary;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {user ? (
            `Welcome back, ${user.name.split(" ")[0]}`
          ) : (
            <Skeleton className="h-7 w-56" />
          )}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your work today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {attendanceLoading || !summary ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-19 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Attendance Rate"
              value={`${summary.attendanceRate}%`}
              icon={<Percent className="w-5 h-5" />}
              tone="indigo"
              trend="+2.3%"
            />
            <StatCard
              label="Days Present"
              value={summary.present}
              icon={<CheckCircle2 className="w-5 h-5" />}
              tone="emerald"
            />
            <StatCard
              label="Avg. Check-in"
              value={summary.averageCheckIn}
              icon={<Clock className="w-5 h-5" />}
              tone="sky"
            />
            <StatCard
              label="Days on Leave"
              value={summary.onLeave}
              icon={<CalendarX className="w-5 h-5" />}
              tone="amber"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <AttendanceChart
            records={attendance?.records ?? null}
            loading={attendanceLoading}
          />
          <AnnouncementsFeed
            announcements={announcements}
            loading={announcementsLoading}
            limit={3}
          />
        </div>
        <div className="space-y-5">
          <LeaveBalanceChart balances={leaveBalances} loading={leaveLoading} />
          <Card>
            <CardHeader
              title="Upcoming"
              subtitle="Company calendar"
              icon={<CalendarDays className="w-4.5 h-4.5" />}
            />
            {eventsLoading || !events ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <MonthCalendar events={events} compact />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
