import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { LeaveBalance } from "../../types";
import { Card, CardHeader } from "../ui/Card";
import { SkeletonCard } from "../ui/Skeleton";
import { PieChart as PieIcon } from "lucide-react";

export function LeaveBalanceChart({ balances, loading }: { balances: LeaveBalance[] | null; loading: boolean }) {
  if (loading || !balances) return <SkeletonCard />;

  const totalRemaining = balances.reduce((sum, b) => sum + b.remaining, 0);

  return (
    <Card>
      <CardHeader title="Leave Balance" subtitle={`${totalRemaining} days remaining total`} icon={<PieIcon className="w-4.5 h-4.5" />} />
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={balances}
                dataKey="remaining"
                nameKey="type"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={3}
                strokeWidth={0}
              >
                {balances.map((b) => (
                  <Cell key={b.type} fill={b.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(value, _name, props) => [`${value} days left`, props.payload.type]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {balances.map((b) => (
            <div key={b.type} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
              <span className="text-slate-600 dark:text-slate-400 truncate flex-1">{b.type}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                {b.remaining}/{b.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
