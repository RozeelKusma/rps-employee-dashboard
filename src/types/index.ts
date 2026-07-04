// ---------- Employee / Profile ----------
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  avatar: string;
  phone: string;
  joinDate: string; // ISO date
  manager: string;
  status: "online" | "away" | "offline";
  skills: string[];
}

// ---------- Attendance ----------
export type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "leave" | "weekend";

export interface AttendanceRecord {
  date: string; // ISO date
  status: AttendanceStatus;
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  hoursWorked?: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  onLeave: number;
  totalWorkingDays: number;
  averageCheckIn: string;
  attendanceRate: number; // percentage
}

// ---------- Leave ----------
export type LeaveType = "Sick Leave" | "Casual Leave" | "Annual Leave" | "Maternity/Paternity" | "Unpaid Leave";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  days: number;
}

// ---------- Team Directory ----------
export interface TeamMember extends Employee {
  bio?: string;
}

// ---------- Announcements ----------
export type AnnouncementCategory = "General" | "Policy" | "Event" | "Holiday" | "Urgent";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  author: string;
  date: string;
  pinned?: boolean;
}

// ---------- Notifications ----------
export type NotificationType = "success" | "error" | "info" | "warning";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
}

// ---------- Chat Assistant ----------
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// ---------- Calendar ----------
export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: "holiday" | "leave" | "event" | "birthday";
}
