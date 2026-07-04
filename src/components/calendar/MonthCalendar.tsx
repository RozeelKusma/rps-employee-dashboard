import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "../../types";

const EVENT_COLOR: Record<CalendarEvent["type"], string> = {
  holiday: "bg-emerald-500",
  leave: "bg-amber-500",
  event: "bg-indigo-500",
  birthday: "bg-pink-500",
};

function toKey(d: Date) {
  return d.toISOString().split("T")[0];
}

export function MonthCalendar({
  events,
  compact = false,
}: {
  events: CalendarEvent[];
  compact?: boolean;
}) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    return map;
  }, [events]);

  const { weeks, monthLabel } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    const weekChunks: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weekChunks.push(cells.slice(i, i + 7));

    return {
      weeks: weekChunks,
      monthLabel: firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  }, [cursor]);

  const todayKey = toKey(new Date());
  const selectedEvents = selected ? eventsByDate.get(selected) ?? [] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-slate-400 dark:text-slate-500 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (!day) return <div key={di} className={compact ? "h-8" : "h-12"} />;
              const key = toKey(day);
              const dayEvents = eventsByDate.get(key) ?? [];
              const isToday = key === todayKey;
              const isSelected = key === selected;

              return (
                <button
                  key={di}
                  onClick={() => setSelected(key === selected ? null : key)}
                  className={`relative rounded-lg flex flex-col items-center justify-center text-xs transition-colors ${
                    compact ? "h-8" : "h-12"
                  } ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : isToday
                      ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {day.getDate()}
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 absolute bottom-1">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : EVENT_COLOR[ev.type]}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4 space-y-2">
          {selectedEvents.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">No events on this day.</p>
          ) : (
            selectedEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${EVENT_COLOR[ev.type]}`} />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{ev.title}</span>
                <span className="text-slate-400 dark:text-slate-500 ml-auto capitalize">{ev.type}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
