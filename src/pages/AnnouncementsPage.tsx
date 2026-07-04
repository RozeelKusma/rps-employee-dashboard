import { Loader2, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnnouncementsFeed } from "~/components/announcements/AnnouncementsFeed";
import Button from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { useAnnouncementStore } from "~/store/announcementStore";
import type { AnnouncementCategory } from "~/types";

const CATEGORIES: (AnnouncementCategory | "All")[] = [
  "All",
  "General",
  "Policy",
  "Event",
  "Holiday",
  "Urgent",
];

const AnnouncementsPage = () => {
  const {
    announcements,
    loading,
    fetchAnnouncements,
    digest,
    digestLoading,
    generateDigest,
    clearDigest,
  } = useAnnouncementStore();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const filtered = useMemo(() => {
    if (!announcements) return null;
    if (category === "All") return announcements;
    return announcements.filter((a) => a.category === category);
  }, [announcements, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Company Announcements
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay up to date with the latest company news.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          loading={digestLoading}
          onClick={() => generateDigest()}
          disabled={!announcements || announcements.length === 0}
        >
          Generate AI Digest
        </Button>
      </div>

      {(digest || digestLoading) && (
        <Card className="border-indigo-200 dark:border-indigo-800 bg-linear-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  AI Daily Digest
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  A quick summary of what's new
                </p>
              </div>
            </div>
            {digest && !digestLoading && (
              <button
                onClick={clearDigest}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {digestLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Reading through announcements...
            </div>
          ) : (
            <ul className="space-y-2">
              {digest?.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}:
                    </span>{" "}
                    {item.bullet}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === c
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <AnnouncementsFeed announcements={filtered} loading={loading} />
    </div>
  );
};

export default AnnouncementsPage;
