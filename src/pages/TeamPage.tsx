import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { mockApi } from "~/data/mockApi";
import { useAsync } from "~/hooks/useAsync";
import { TeamSearchBar } from "~/components/team/TeamSearchBar";
import { SkeletonCard } from "~/components/ui/Skeleton";
import { TeamMemberCard } from "~/components/team/TeamMemberCard";

const TeamPage = () => {
  const { data: team, loading } = useAsync(
    () => mockApi.getTeamDirectory(),
    [],
  );
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");

  const departments = useMemo(() => {
    if (!team) return [];
    return Array.from(new Set(team.map((m) => m.department))).sort();
  }, [team]);

  const filtered = useMemo(() => {
    if (!team) return [];
    const q = query.trim().toLowerCase();
    return team.filter((m) => {
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q));
      const matchesDept = department === "all" || m.department === department;
      return matchesQuery && matchesDept;
    });
  }, [team, query, department]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Team Directory
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Find and connect with colleagues across the organization.
        </p>
      </div>

      <TeamSearchBar
        query={query}
        onQueryChange={setQuery}
        department={department}
        onDepartmentChange={setDepartment}
        departments={departments}
      />

      {loading || !team ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No teammates found
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try a different search term or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
