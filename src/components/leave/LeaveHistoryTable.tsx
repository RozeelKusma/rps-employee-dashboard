import type { LeaveRequest } from "../../types";
import { Card, CardHeader } from "../ui/Card";
import { Badge, leaveStatusTone } from "../ui/Badge";
import { SkeletonRow } from "../ui/Skeleton";
import { History } from "lucide-react";

export function LeaveHistoryTable({ requests, loading }: { requests: LeaveRequest[] | null; loading: boolean }) {
  return (
    <Card>
      <CardHeader title="Leave History" subtitle={requests ? `${requests.length} requests` : undefined} icon={<History className="w-4.5 h-4.5" />} />

      {loading || !requests ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No leave requests yet.</p>
      ) : (
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-2 font-medium">Type</th>
                <th className="px-5 py-2 font-medium">Dates</th>
                <th className="px-5 py-2 font-medium">Days</th>
                <th className="px-5 py-2 font-medium">Reason</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{r.type}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {r.startDate === r.endDate ? r.startDate : `${r.startDate} → ${r.endDate}`}
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{r.days}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400 max-w-[220px] truncate">{r.reason}</td>
                  <td className="px-5 py-3">
                    <Badge tone={leaveStatusTone(r.status)}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
