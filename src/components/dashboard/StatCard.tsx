import type { ReactNode } from "react";
import { Card } from "../ui/Card";

export function StatCard({
  label,
  value,
  icon,
  tone = "indigo",
  trend,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: "indigo" | "emerald" | "amber" | "red" | "sky";
  trend?: string;
}) {
  const TONE_BG: Record<string, string> = {
    indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
    sky: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400",
  };

  return (
    <Card className="flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${TONE_BG[tone]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
          {trend && <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{trend}</span>}
        </div>
      </div>
    </Card>
  );
}
