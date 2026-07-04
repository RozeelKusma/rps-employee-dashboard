import { CalendarDays } from "lucide-react";
import { MonthCalendar } from "~/components/calendar/MonthCalendar";
import { Card, CardHeader } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/Skeleton";
import { mockApi } from "~/data/mockApi";
import { useAsync } from "~/hooks/useAsync";

const CalendarPage = () => {
  const { data: events, loading } = useAsync(
    () => mockApi.getCalendarEvents(),
    [],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Calendar
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Team events, holidays, birthdays, and approved leave in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Team Calendar"
              icon={<CalendarDays className="w-4.5 h-4.5" />}
            />
            {loading || !events ? (
              <Skeleton className="h-105 w-full" />
            ) : (
              <MonthCalendar events={events} />
            )}
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader title="Legend" />
            <div className="space-y-3">
              {[
                {
                  label: "Holiday",
                  color: "bg-emerald-500",
                  desc: "Company-wide holiday",
                },
                {
                  label: "Leave",
                  color: "bg-amber-500",
                  desc: "Approved time off",
                },
                {
                  label: "Event",
                  color: "bg-indigo-500",
                  desc: "Meetings & team events",
                },
                {
                  label: "Birthday",
                  color: "bg-pink-500",
                  desc: "Teammate birthdays",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${item.color}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default CalendarPage;
