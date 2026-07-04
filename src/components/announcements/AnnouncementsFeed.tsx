import type { Announcement } from "../../types";
import { Card, CardHeader } from "../ui/Card";
import { Badge, announcementTone } from "../ui/Badge";
import { SkeletonCard } from "../ui/Skeleton";
import { Loader2, Megaphone, Pin, Sparkles } from "lucide-react";
import { useAnnouncementStore } from "~/store/announcementStore";

export function AnnouncementsFeed({
  announcements,
  loading,
  limit,
}: {
  announcements: Announcement[] | null;
  loading: boolean;
  limit?: number;
}) {
  const summaries = useAnnouncementStore((s) => s.summaries);
  const summarizingIds = useAnnouncementStore((s) => s.summarizingIds);
  const summarize = useAnnouncementStore((s) => s.summarize);

  if (loading || !announcements) return <SkeletonCard />;

  const list = limit ? announcements.slice(0, limit) : announcements;

  return (
    <Card>
      <CardHeader
        title="Company Announcements"
        subtitle={`${announcements.length} updates`}
        icon={<Megaphone className="w-4.5 h-4.5" />}
      />
      <div className="space-y-3">
        {list.map((a) => {
          const summary = summaries[a.id];
          const isSummarizing = !!summarizingIds[a.id];

          return (
            <div
              key={a.id}
              className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {a.pinned && (
                    <Pin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  )}
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {a.title}
                  </h4>
                </div>
                <Badge tone={announcementTone(a.category)}>{a.category}</Badge>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                {a.body}
              </p>

              {summary && (
                <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-snug">
                    <span className="font-semibold">AI summary:</span> {summary}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                  <span>{a.author}</span>
                  <span>·</span>
                  <span>
                    {new Date(a.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {!summary && (
                  <button
                    onClick={() => {
                      summarize(a.id);
                    }}
                    disabled={isSummarizing}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 disabled:opacity-60 transition-colors"
                  >
                    {isSummarizing ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />{" "}
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" /> AI Summarize
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
