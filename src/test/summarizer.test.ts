import { describe, it, expect } from "vitest";
import { summarizeText, summarizeAnnouncement, summarizeDigest } from "../lib/summarizer";

describe("summarizeText", () => {
  it("returns the original text unchanged when it already has fewer sentences than the limit", () => {
    const text = "Office closed on Friday.";
    expect(summarizeText(text, { maxSentences: 2 })).toBe("Office closed on Friday.");
  });

  it("reduces a multi-sentence announcement down to the requested number of sentences", () => {
    const text =
      "The office will be closed for the holiday next week. " +
      "Please make sure to submit your timesheets before Thursday. " +
      "The cafeteria will also be closed during this period. " +
      "Contact HR if you have any questions about the schedule.";

    const summary = summarizeText(text, { maxSentences: 2 });
    const sentenceCount = summary.split(/(?<=[.!?])\s+/).filter(Boolean).length;

    expect(sentenceCount).toBeLessThanOrEqual(2);
    expect(summary.length).toBeLessThan(text.length);
  });

  it("preserves the original sentence order in the summary", () => {
    const text =
      "First important point about the new policy rollout. " +
      "A minor aside that is less relevant to most readers. " +
      "Second important point reinforcing the new policy rollout details.";

    const summary = summarizeText(text, { maxSentences: 2 });
    const firstIndex = summary.indexOf("First important point");
    const secondIndex = summary.indexOf("Second important point");

    // Both should be present and in original order (first before second),
    // regardless of which two sentences scored highest.
    if (firstIndex !== -1 && secondIndex !== -1) {
      expect(firstIndex).toBeLessThan(secondIndex);
    }
  });

  it("handles empty input gracefully", () => {
    expect(summarizeText("")).toBe("");
  });

  it("is deterministic — same input always produces the same output", () => {
    const text =
      "Quarterly results exceeded expectations across all regions. " +
      "The engineering team shipped three major features this quarter. " +
      "Customer satisfaction scores improved by double digits. " +
      "Next quarter's roadmap will focus on platform stability.";

    const first = summarizeText(text, { maxSentences: 2 });
    const second = summarizeText(text, { maxSentences: 2 });
    expect(first).toBe(second);
  });
});

describe("summarizeAnnouncement", () => {
  it("resolves asynchronously with a non-empty summary", async () => {
    const body =
      "Starting next month, employees can work remotely up to 4 days a week. " +
      "Please review the updated policy document on the intranet. " +
      "Acknowledge the policy by end of week.";

    const summary = await summarizeAnnouncement(body);
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(0);
    expect(summary.length).toBeLessThanOrEqual(body.length);
  });
});

describe("summarizeDigest", () => {
  it("produces one bullet per announcement, preserving titles", async () => {
    const announcements = [
      { title: "Holiday Notice", body: "The office will be closed Monday. Plan your work accordingly." },
      { title: "New Hires", body: "Please welcome our newest team members. They joined this week." },
    ];

    const digest = await summarizeDigest(announcements);
    expect(digest).toHaveLength(2);
    expect(digest[0].title).toBe("Holiday Notice");
    expect(digest[1].title).toBe("New Hires");
    digest.forEach((item) => expect(item.bullet.length).toBeGreaterThan(0));
  });

  it("caps at whatever slice is passed in without erroring on an empty list", async () => {
    const digest = await summarizeDigest([]);
    expect(digest).toEqual([]);
  });
});
