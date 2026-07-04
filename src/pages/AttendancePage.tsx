import { CheckCircle2, XCircle, Clock3, CalendarClock } from "lucide-react";
import { AttendanceHeatmap } from "~/components/attendance/AttendanceHeatmap";
import { AttendanceChart } from "~/components/dashboard/AttendanceChart";
import { StatCard } from "~/components/dashboard/StatCard";
import { Skeleton } from "~/components/ui/Skeleton";
import { mockApi } from "~/data/mockApi";
import { useAsync } from "~/hooks/useAsync";

const AttendancePage = () => {
  const { data, loading } = useAsync(() => mockApi.getAttendance(), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Attendance
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your check-in history and attendance patterns over the last 6 weeks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading || !data ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-19 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Present Days"
              value={data.summary.present}
              icon={<CheckCircle2 className="w-5 h-5" />}
              tone="emerald"
            />
            <StatCard
              label="Late Arrivals"
              value={data.summary.late}
              icon={<Clock3 className="w-5 h-5" />}
              tone="amber"
            />
            <StatCard
              label="Absences"
              value={data.summary.absent}
              icon={<XCircle className="w-5 h-5" />}
              tone="red"
            />
            <StatCard
              label="Working Days"
              value={data.summary.totalWorkingDays}
              icon={<CalendarClock className="w-5 h-5" />}
              tone="indigo"
            />
          </>
        )}
      </div>

      <AttendanceChart records={data?.records ?? null} loading={loading} />

      {loading || !data ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <AttendanceHeatmap records={data.records} />
      )}
    </div>
  );
};

export default AttendancePage;
