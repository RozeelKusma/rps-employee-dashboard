import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { AttendanceRecord } from "../../types";
import { Card, CardHeader } from "../ui/Card";
import { SkeletonCard } from "../ui/Skeleton";
import { Activity } from "lucide-react";

const STATUS_TO_SCORE: Record<string, number> = {
  present: 100,
  late: 70,
  "half-day": 50,
  leave: 0,
  absent: 0,
  weekend: -1,
};

export function AttendanceChart({
  records,
  loading,
}: {
  records: AttendanceRecord[] | null;
  loading: boolean;
}) {
  if (loading || !records) return <SkeletonCard />;

  const last14 = records.filter((r) => r.status !== "weekend").slice(-14);
  const chartData = last14.map((r) => ({
    date: new Date(r.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: STATUS_TO_SCORE[r.status] ?? 0,
    status: r.status,
    hoursWorked: r.hoursWorked ?? 0,
  }));

  return (
    <Card>
      <CardHeader
        title="Attendance Trend"
        subtitle="Last 14 working days"
        icon={<Activity className="w-4.5 h-4.5" />}
      />
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="attendanceGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-800"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="fill-slate-500 dark:fill-slate-400"
              interval={1}
            />
            <YAxis hide domain={[0, 10]} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                textTransform: "capitalize",
              }}
              formatter={(_value, _name, props) => [
                props.payload.hoursWorked > 0
                  ? `Worked Hours: ${props.payload.hoursWorked}`
                  : "",
              ]}
            />
            <Area
              type="bump"
              dataKey="hoursWorked"
              stroke="#6366f9"
              strokeWidth={2}
              fill="url(#attendanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
