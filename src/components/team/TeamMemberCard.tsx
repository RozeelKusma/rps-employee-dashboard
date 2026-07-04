import { Mail, Phone, MapPin } from "lucide-react";
import type { TeamMember } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

const STATUS_DOT: Record<string, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-slate-400",
};

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full bg-slate-100" />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${STATUS_DOT[member.status]}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{member.name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.role}</p>
          <Badge tone="neutral">{member.department}</Badge>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{member.phone}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{member.location}</span>
        </div>
      </div>

      {member.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
