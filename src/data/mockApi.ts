import employeesData from "./employees.json";
import announcementsData from "./announcements.json";
import type { Employee, Announcement, LeaveRequest } from "../types";
import {
  generateAttendance,
  computeAttendanceSummary,
  generateLeaveBalances,
  generateLeaveRequests,
  generateCalendarEvents,
} from "./mockGenerators";

// Simulate network latency so loading states are meaningful.
function delay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

const CURRENT_USER_ID = "emp-001";

// In-memory store to make writes (leave requests) feel persistent for the session.
let leaveRequestsStore: LeaveRequest[] = generateLeaveRequests();

export const mockApi = {
  getCurrentUser: async (): Promise<Employee> => {
    const user = (employeesData as Employee[]).find((e) => e.id === CURRENT_USER_ID)!;
    return delay(user, 400);
  },

  getTeamDirectory: async (): Promise<Employee[]> => {
    return delay(employeesData as Employee[], 700);
  },

  getAttendance: async () => {
    const records = generateAttendance(42);
    const summary = computeAttendanceSummary(records);
    return delay({ records, summary }, 650);
  },

  getLeaveBalances: async () => {
    return delay(generateLeaveBalances(), 500);
  },

  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    return delay(
      [...leaveRequestsStore].sort(
        (a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()
      ),
      550
    );
  },

  submitLeaveRequest: async (
    payload: Omit<LeaveRequest, "id" | "employeeId" | "status" | "appliedOn" | "days">
  ): Promise<LeaveRequest> => {
    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);

    const newRequest: LeaveRequest = {
      id: `lv-${Date.now()}`,
      employeeId: CURRENT_USER_ID,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
      days,
      ...payload,
    };
    leaveRequestsStore = [newRequest, ...leaveRequestsStore];
    return delay(newRequest, 900);
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
    return delay(announcementsData as Announcement[], 600);
  },

  getCalendarEvents: async () => {
    return delay(generateCalendarEvents(), 500);
  },
};
