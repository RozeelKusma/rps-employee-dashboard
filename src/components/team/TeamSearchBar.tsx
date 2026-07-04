import { Search, Mic, X } from "lucide-react";
import { useVoiceSearch } from "../../hooks/useVoiceSearch";
import { useNotificationStore } from "~/store/notification.store";

export function TeamSearchBar({
  query,
  onQueryChange,
  department,
  onDepartmentChange,
  departments,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  department: string;
  onDepartmentChange: (v: string) => void;
  departments: string[];
}) {
  const notify = useNotificationStore((state) => state.notify);
  const { isListening, isSupported, start, stop } = useVoiceSearch(
    (transcript) => {
      onQueryChange(transcript);
      notify("info", "Voice search", `Searching for "${transcript}"`);
    },
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, role, or skill..."
          className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {query ? (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          isSupported && (
            <button
              onClick={() => (isListening ? stop() : start())}
              aria-label="Voice search"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isListening
                  ? "bg-red-500 text-white animate-pulse-ring"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      <select
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 sm:w-56"
      >
        <option value="all">All Departments</option>
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}
