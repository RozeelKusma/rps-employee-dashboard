import type { AttendanceRecord, AttendanceStatus } from "../../types";
import { Card, CardHeader } from "../ui/Card";
import { CalendarRange } from "lucide-react";

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  present: "bg-emerald-500",
  late: "bg-amber-400",
  "half-day": "bg-sky-400",
  leave: "bg-purple-400",
  absent: "bg-red-400",
  weekend: "bg-slate-100 dark:bg-slate-800",
};

const LABELS: { status: AttendanceStatus; label: string }[] = [
  { status: "present", label: "Present" },
  { status: "late", label: "Late" },
  { status: "half-day", label: "Half day" },
  { status: "leave", label: "On leave" },
  { status: "absent", label: "Absent" },
];

export function AttendanceHeatmap({ records }: { records: AttendanceRecord[] }) {
  return (
    <Card>
      <CardHeader title="Attendance Log" subtitle="Last 6 weeks" icon={<CalendarRange className="w-4.5 h-4.5" />} />
      <div className="flex flex-wrap gap-1.5">
        {records.map((r) => (
          <div key={r.date} className="group relative">
            <div className={`w-6 h-6 rounded-md ${STATUS_COLOR[r.status]}`} />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-lg bg-slate-900 text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {r.status}
              {r.checkIn ? ` · ${r.checkIn}` : ""}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {LABELS.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className={`w-2.5 h-2.5 rounded-sm ${STATUS_COLOR[status]}`} />
            {label}
          </div>
        ))}
      </div>
    </Card>
  );
}
