import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  User,
  Percent,
  CheckCircle2,
  CalendarX,
} from "lucide-react";

import { StatCard } from "~/components/dashboard/StatCard";
import { Card, CardHeader } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/Skeleton";
import { mockApi } from "~/data/mockApi";
import { useAsync } from "~/hooks/useAsync";

const ProfilePage = () => {
  const { data: user, loading: userLoading } = useAsync(
    () => mockApi.getCurrentUser(),
    [],
  );
  const { data: attendance, loading: attendanceLoading } = useAsync(
    () => mockApi.getAttendance(),
    [],
  );
  const { data: leaveBalances, loading: leaveLoading } = useAsync(
    () => mockApi.getLeaveBalances(),
    [],
  );

  const totalRemaining =
    leaveBalances?.reduce((sum, b) => sum + b.remaining, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your personal and employment details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1 text-center">
          {userLoading || !user ? (
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ) : (
            <>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full mx-auto bg-slate-100"
              />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
                {user.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user.role}
              </p>
              <div className="flex justify-center mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-left">
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label={user.email}
                />
                <InfoRow
                  icon={<Phone className="w-4 h-4" />}
                  label={user.phone}
                />
                <InfoRow
                  icon={<MapPin className="w-4 h-4" />}
                  label={user.location}
                />
                <InfoRow
                  icon={<Briefcase className="w-4 h-4" />}
                  label={`${user.department} · Reports to ${user.manager}`}
                />
                <InfoRow
                  icon={<Calendar className="w-4 h-4" />}
                  label={`Joined ${new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
                />
              </div>
            </>
          )}
        </Card>

        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {attendanceLoading || !attendance || leaveLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-19 rounded-2xl" />
              ))
            ) : (
              <>
                <StatCard
                  label="Attendance Rate"
                  value={`${attendance.summary.attendanceRate}%`}
                  icon={<Percent className="w-5 h-5" />}
                  tone="indigo"
                />
                <StatCard
                  label="Days Present"
                  value={attendance.summary.present}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  tone="emerald"
                />
                <StatCard
                  label="Leave Remaining"
                  value={totalRemaining}
                  icon={<CalendarX className="w-5 h-5" />}
                  tone="amber"
                />
              </>
            )}
          </div>

          <Card>
            <CardHeader
              title="Skills & Expertise"
              icon={<User className="w-4.5 h-4.5" />}
            />
            {userLoading || !user ? (
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {user.skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Employment Details" />
            {userLoading || !user ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <dl className="grid grid-cols-2 gap-y-4 text-sm">
                <DetailItem label="Employee ID" value={user.id.toUpperCase()} />
                <DetailItem label="Department" value={user.department} />
                <DetailItem label="Manager" value={user.manager} />
                <DetailItem label="Location" value={user.location} />
              </dl>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
      <span className="text-slate-400 dark:text-slate-500 shrink-0">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400 dark:text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">
        {value}
      </dd>
    </div>
  );
}

export default ProfilePage;
