/**
 * A small, dependency-free extractive summarizer.
 *
 * How it works (classic TF-based sentence scoring — the same family of
 * technique used by early "AI" summarizers before LLMs):
 *   1. Split the text into sentences.
 *   2. Build a word-frequency table, ignoring common stopwords.
 *   3. Score each sentence by the sum of its (non-stopword) word frequencies,
 *      normalized by sentence length so long sentences don't win purely on size.
 *   4. Keep the top-N highest scoring sentences, re-ordered back into their
 *      original position so the summary still reads naturally.
 *
 * This is intentionally isolated behind a small function surface
 * (`summarizeText`, `summarizeAnnouncement`, `summarizeDigest`) so it can be
 * swapped for a real LLM call later without touching any UI code — the
 * calling stores/components only care about the async signature.
 */

const STOPWORDS = new Set(
  `a an the this that these those is are was were be been being do does did
   have has had having will would shall should may might must can could
   of in on at by for with about against between into through during
   before after above below to from up down out off over under again
   further then once here there when where why how all any both each
   few more most other some such no nor not only own same so than too
   very s t just don now and or but if because as until while it its
   we you your our their his her they i me my mine yours ours theirs
   please note also will be`
    .split(/\s+/)
    .filter(Boolean),
);

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function wordsOf(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function buildFrequencyTable(sentences: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const sentence of sentences) {
    for (const word of wordsOf(sentence)) {
      if (STOPWORDS.has(word)) continue;
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
  }
  return freq;
}

export interface SummaryOptions {
  /** Max number of sentences to keep in the summary. Default: 2. */
  maxSentences?: number;
}

/**
 * Summarize a single block of text down to its most information-dense
 * sentences. Deterministic and synchronous — safe to unit test directly.
 */
export function summarizeText(
  text: string,
  options: SummaryOptions = {},
): string {
  const { maxSentences = 2 } = options;
  const sentences = splitSentences(text);

  if (sentences.length <= maxSentences) return sentences.join(" ");

  const freq = buildFrequencyTable(sentences);

  const scored = sentences.map((sentence, index) => {
    const words = wordsOf(sentence);
    const score =
      words.reduce((sum, w) => sum + (freq.get(w) ?? 0), 0) /
      Math.max(words.length, 1);
    // Small positional bonus: opening sentences of an announcement tend to
    // carry the key point ("Office closed...", "Starting next month...").
    const positionBonus = index === 0 ? 0.15 * score : 0;
    return { sentence, index, score: score + positionBonus };
  });

  const top = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences);
  const inOriginalOrder = top.sort((a, b) => a.index - b.index);

  return inOriginalOrder.map((s) => s.sentence).join(" ");
}

// Simulated "thinking" latency so the UI can show a realistic loading state,
// consistent with the rest of the app's mock-API pattern.
function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Summarize a single announcement's body into a 1-2 sentence TL;DR.
 * Async by design — this is the seam where a real LLM API call would go.
 */
export async function summarizeAnnouncement(body: string): Promise<string> {
  const summary = summarizeText(body, { maxSentences: 2 });
  return delay(summary, 500 + Math.random() * 400);
}

/**
 * Summarize a batch of announcements into a single "daily digest" — one
 * short bullet per announcement, most recent first.
 */
export async function summarizeDigest(
  announcements: { title: string; body: string }[],
): Promise<{ title: string; bullet: string }[]> {
  const bullets = announcements.map((a) => ({
    title: a.title,
    bullet: summarizeText(a.body, { maxSentences: 1 }),
  }));
  return delay(bullets, 700 + Math.random() * 500);
}
