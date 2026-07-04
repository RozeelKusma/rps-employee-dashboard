import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  LeaveBalance,
  LeaveRequest,
  CalendarEvent,
} from "../types";

// Simple seeded pseudo-random generator so data is stable across renders/reloads
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const STATUS_POOL: AttendanceStatus[] = ["present", "present", "present", "present", "late", "half-day"];

export function generateAttendance(daysBack = 42): AttendanceRecord[] {
  const rand = seededRandom(42);
  const records: AttendanceRecord[] = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    const iso = date.toISOString().split("T")[0];

    let status: AttendanceStatus;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = "weekend";
    } else if (date > today) {
      continue;
    } else {
      const r = rand();
      if (r > 0.93) status = "absent";
      else if (r > 0.85) status = "leave";
      else status = STATUS_POOL[Math.floor(rand() * STATUS_POOL.length)];
    }

    const record: AttendanceRecord = { date: iso, status };

    if (status === "present" || status === "late" || status === "half-day") {
      const baseHour = status === "late" ? 10 : 9;
      const minuteVariance = Math.floor(rand() * 45);
      record.checkIn = `${String(baseHour).padStart(2, "0")}:${String(minuteVariance).padStart(2, "0")}`;
      const outHour = status === "half-day" ? 13 : 18;
      record.checkOut = `${String(outHour).padStart(2, "0")}:${String(Math.floor(rand() * 59)).padStart(2, "0")}`;
      record.hoursWorked = status === "half-day" ? 4 : Math.round((8 + rand() * 1.5) * 10) / 10;
    }

    records.push(record);
  }

  return records;
}

export function computeAttendanceSummary(records: AttendanceRecord[]): AttendanceSummary {
  const workingDays = records.filter((r) => r.status !== "weekend");
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const halfDay = records.filter((r) => r.status === "half-day").length;
  const onLeave = records.filter((r) => r.status === "leave").length;

  const checkIns = records.filter((r) => r.checkIn).map((r) => r.checkIn as string);
  const avgMinutes =
    checkIns.reduce((sum, t) => {
      const [h, m] = t.split(":").map(Number);
      return sum + h * 60 + m;
    }, 0) / (checkIns.length || 1);
  const avgH = Math.floor(avgMinutes / 60);
  const avgM = Math.round(avgMinutes % 60);

  const attendanceRate = workingDays.length
    ? Math.round(((present + late + halfDay) / workingDays.length) * 100)
    : 0;

  return {
    present,
    absent,
    late,
    halfDay,
    onLeave,
    totalWorkingDays: workingDays.length,
    averageCheckIn: `${String(avgH).padStart(2, "0")}:${String(avgM).padStart(2, "0")}`,
    attendanceRate,
  };
}

export function generateLeaveBalances(): LeaveBalance[] {
  return [
    { type: "Annual Leave", total: 18, used: 7, remaining: 11, color: "#6366f1" },
    { type: "Sick Leave", total: 12, used: 3, remaining: 9, color: "#f97316" },
    { type: "Casual Leave", total: 10, used: 4, remaining: 6, color: "#10b981" },
    { type: "Unpaid Leave", total: 30, used: 0, remaining: 30, color: "#64748b" },
    { type: "Maternity/Paternity", total: 90, used: 0, remaining: 90, color: "#ec4899" },
  ];
}

export function generateLeaveRequests(): LeaveRequest[] {
  return [
    {
      id: "lv-1001",
      employeeId: "emp-001",
      startDate: "2026-06-10",
      endDate: "2026-06-11",
      type: "Sick Leave",
      reason: "Flu recovery",
      status: "Approved",
      appliedOn: "2026-06-08",
      days: 2,
    },
    {
      id: "lv-1002",
      employeeId: "emp-001",
      startDate: "2026-05-02",
      endDate: "2026-05-06",
      type: "Annual Leave",
      reason: "Family trip to Pokhara",
      status: "Approved",
      appliedOn: "2026-04-20",
      days: 5,
    },
    {
      id: "lv-1003",
      employeeId: "emp-001",
      startDate: "2026-07-15",
      endDate: "2026-07-15",
      type: "Casual Leave",
      reason: "Personal errand",
      status: "Pending",
      appliedOn: "2026-06-29",
      days: 1,
    },
    {
      id: "lv-1004",
      employeeId: "emp-001",
      startDate: "2026-03-11",
      endDate: "2026-03-12",
      type: "Casual Leave",
      reason: "Moving apartments",
      status: "Rejected",
      appliedOn: "2026-03-05",
      days: 2,
    },
  ];
}

export function generateCalendarEvents(): CalendarEvent[] {
  const year = new Date().getFullYear();
  return [
    { id: "ev-1", date: `${year}-07-04`, title: "Team Sync", type: "event" },
    { id: "ev-2", date: `${year}-07-10`, title: "Sara Kim's Birthday", type: "birthday" },
    { id: "ev-3", date: `${year}-07-15`, title: "Rojil - Casual Leave", type: "leave" },
    { id: "ev-4", date: `${year}-07-22`, title: "Design Review", type: "event" },
    { id: "ev-5", date: `${year}-08-01`, title: "Company Foundation Day", type: "holiday" },
    { id: "ev-6", date: `${year}-06-10`, title: "Rojil - Sick Leave", type: "leave" },
    { id: "ev-7", date: `${year}-06-19`, title: "Marcus's Birthday", type: "birthday" },
  ];
}
