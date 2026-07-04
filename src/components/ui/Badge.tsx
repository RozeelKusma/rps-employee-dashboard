import type { ReactNode } from "react";

type BadgeTone = "success" | "warning" | "error" | "info" | "neutral" | "purple";

const TONE_STYLES: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-600/20 dark:ring-emerald-400/20",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-amber-600/20 dark:ring-amber-400/20",
  error: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 ring-red-600/20 dark:ring-red-400/20",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 ring-blue-600/20 dark:ring-blue-400/20",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300 ring-slate-500/20",
  purple: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 ring-purple-600/20 dark:ring-purple-400/20",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${TONE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}

export function leaveStatusTone(status: string): BadgeTone {
  if (status === "Approved") return "success";
  if (status === "Pending") return "warning";
  if (status === "Rejected") return "error";
  return "neutral";
}

export function announcementTone(category: string): BadgeTone {
  switch (category) {
    case "Urgent":
      return "error";
    case "Policy":
      return "info";
    case "Event":
      return "purple";
    case "Holiday":
      return "success";
    default:
      return "neutral";
  }
}
