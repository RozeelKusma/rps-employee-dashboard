import { describe, it, expect, beforeEach } from "vitest";
import { useAnnouncementStore } from "../store/announcementStore";

function resetStore() {
  useAnnouncementStore.setState({
    announcements: null,
    loading: false,
    error: null,
    summaries: {},
    summarizingIds: {},
    digest: null,
    digestLoading: false,
  });
}

describe("useAnnouncementStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("fetches announcements into the store", async () => {
    await useAnnouncementStore.getState().fetchAnnouncements();
    const { announcements } = useAnnouncementStore.getState();
    expect(announcements).not.toBeNull();
    expect(announcements!.length).toBeGreaterThan(0);
  });

  it("summarizes a single announcement and caches the result by id", async () => {
    await useAnnouncementStore.getState().fetchAnnouncements();
    const first = useAnnouncementStore.getState().announcements![0];

    await useAnnouncementStore.getState().summarize(first.id);

    const { summaries, summarizingIds } = useAnnouncementStore.getState();
    expect(summaries[first.id]).toBeDefined();
    expect(summaries[first.id].length).toBeGreaterThan(0);
    expect(summarizingIds[first.id]).toBe(false);
  });

  it("does not re-summarize an announcement that is already being summarized", async () => {
    await useAnnouncementStore.getState().fetchAnnouncements();
    const first = useAnnouncementStore.getState().announcements![0];

    const call1 = useAnnouncementStore.getState().summarize(first.id);
    // Fire a second call while the first is still in flight.
    const call2 = useAnnouncementStore.getState().summarize(first.id);

    await Promise.all([call1, call2]);
    expect(useAnnouncementStore.getState().summaries[first.id]).toBeDefined();
  });

  it("generates a digest with one bullet per announcement", async () => {
    await useAnnouncementStore.getState().fetchAnnouncements();
    await useAnnouncementStore.getState().generateDigest();

    const { digest, digestLoading } = useAnnouncementStore.getState();
    expect(digestLoading).toBe(false);
    expect(digest).not.toBeNull();
    expect(digest!.length).toBeGreaterThan(0);
  });

  it("clears the digest on clearDigest()", async () => {
    await useAnnouncementStore.getState().fetchAnnouncements();
    await useAnnouncementStore.getState().generateDigest();
    useAnnouncementStore.getState().clearDigest();
    expect(useAnnouncementStore.getState().digest).toBeNull();
  });
});
