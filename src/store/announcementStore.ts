import { create } from "zustand";
import type { Announcement } from "../types";
import { mockApi } from "../data/mockApi";
import { summarizeAnnouncement, summarizeDigest } from "../lib/summarizer";

interface DigestBullet {
  title: string;
  bullet: string;
}

interface AnnouncementState {
  announcements: Announcement[] | null;
  loading: boolean;
  error: string | null;

  // Per-announcement AI summary cache, keyed by announcement id.
  summaries: Record<string, string>;
  summarizingIds: Record<string, boolean>;

  // "Daily digest" — one AI-generated bullet per announcement.
  digest: DigestBullet[] | null;
  digestLoading: boolean;

  fetchAnnouncements: () => Promise<void>;
  summarize: (id: string) => Promise<void>;
  generateDigest: () => Promise<void>;
  clearDigest: () => void;
}

export const useAnnouncementStore = create<AnnouncementState>()((set, get) => ({
  announcements: null,
  loading: false,
  error: null,
  summaries: {},
  summarizingIds: {},
  digest: null,
  digestLoading: false,

  fetchAnnouncements: async () => {
    // Guard against duplicate concurrent/repeat fetches — multiple
    // read from this store instead of each firing their own mock API call.
    if (get().loading || get().announcements) return;
    set({ loading: true, error: null });
    try {
      const announcements = await mockApi.getAnnouncements();
      set({ announcements, loading: false });
    } catch (err) {
      set({
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to load announcements",
      });
    }
  },

  summarize: async (id: string) => {
    const { announcements, summarizingIds } = get();
    const announcement = announcements?.find((a) => a.id === id);
    if (!announcement || summarizingIds[id]) return;

    set({ summarizingIds: { ...get().summarizingIds, [id]: true } });
    try {
      const summary = await summarizeAnnouncement(announcement.body);
      set({
        summaries: { ...get().summaries, [id]: summary },
        summarizingIds: { ...get().summarizingIds, [id]: false },
      });
    } catch {
      set({ summarizingIds: { ...get().summarizingIds, [id]: false } });
    }
  },

  generateDigest: async () => {
    const { announcements } = get();
    if (!announcements || announcements.length === 0) return;
    set({ digestLoading: true });
    try {
      const bullets = await summarizeDigest(announcements.slice(0, 6));
      set({ digest: bullets, digestLoading: false });
    } catch {
      set({ digestLoading: false });
    }
  },

  clearDigest: () => set({ digest: null }),
}));
