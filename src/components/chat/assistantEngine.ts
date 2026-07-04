import type {
  AttendanceSummary,
  LeaveBalance,
  LeaveRequest,
  Announcement,
} from "../../types";

interface AssistantContext {
  attendanceSummary: AttendanceSummary | null;
  leaveBalances: LeaveBalance[] | null;
  leaveRequests: LeaveRequest[] | null;
  announcements: Announcement[] | null;
  userName: string;
}

/**
 * A simple "AI" assistant. It pattern-matches on
 * keywords in the user's message and answers using the app's own mock data,
 * so responses stay consistent with what's shown on screen (no external LLM
 * call is made).
 */
export function generateAssistantReply(
  message: string,
  ctx: AssistantContext,
): string {
  const text = message.toLowerCase();

  if (/\b(hi|hello|hey)\b/.test(text)) {
    return `Hey ${ctx.userName.split(" ")[0]}! I can help with attendance, leave balances, leave requests, and company announcements. What would you like to know?`;
  }

  if (
    text.includes("leave balance") ||
    (text.includes("balance") && text.includes("leave"))
  ) {
    if (!ctx.leaveBalances)
      return "I'm still loading your leave balances — one moment.";
    const lines = ctx.leaveBalances.map(
      (b) => `• ${b.type}: ${b.remaining}/${b.total} days remaining`,
    );
    return `Here's your current leave balance:\n${lines.join("\n")}`;
  }

  if (text.includes("pending") && text.includes("leave")) {
    const pending =
      ctx.leaveRequests?.filter((r) => r.status === "Pending") ?? [];
    if (!ctx.leaveRequests)
      return "Let me check your leave requests — loading now.";
    if (pending.length === 0)
      return "You have no pending leave requests right now.";
    return `You have ${pending.length} pending request(s):\n${pending
      .map((r) => `• ${r.type} from ${r.startDate} to ${r.endDate}`)
      .join("\n")}`;
  }

  if (
    text.includes("leave") &&
    (text.includes("apply") || text.includes("request") || text.includes("how"))
  ) {
    return "You can apply for leave from the 'Leave Requests' page — click 'New Request', pick your dates and leave type, add a reason, and submit. I'll notify you once it's recorded.";
  }

  if (
    text.includes("attendance") ||
    text.includes("check-in") ||
    text.includes("check in")
  ) {
    if (!ctx.attendanceSummary)
      return "Pulling up your attendance data now — one second.";
    const s = ctx.attendanceSummary;
    return `Over the last ${s.totalWorkingDays} working days: ${s.present} present, ${s.late} late, ${s.absent} absent, ${s.onLeave} on leave. Your attendance rate is ${s.attendanceRate}% and your average check-in time is ${s.averageCheckIn}.`;
  }

  if (
    text.includes("announcement") ||
    text.includes("news") ||
    text.includes("update")
  ) {
    if (!ctx.announcements)
      return "Loading the latest announcements for you...";
    const recent = ctx.announcements.slice(0, 3);
    return `Here are the latest announcements:\n${recent.map((a) => `• ${a.title} (${a.category})`).join("\n")}`;
  }

  if (text.includes("holiday")) {
    const holiday = ctx.announcements?.find((a) => a.category === "Holiday");
    if (holiday) return `${holiday.title}: ${holiday.body}`;
    return "I don't see any upcoming holiday announcements right now.";
  }

  if (text.includes("thank")) {
    return "Happy to help! Let me know if there's anything else you need.";
  }

  return 'I can help with attendance summaries, leave balances, pending leave requests, and recent announcements. Try asking something like "What\'s my leave balance?" or "Show my attendance this month."';
}
