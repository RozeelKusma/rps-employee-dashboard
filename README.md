# RPS — Employee Dashboard

A polished, fully client-side Employee Dashboard built with **React 19 + TypeScript + Tailwind CSS v4 + Zustand**. All data is mocked locally (no backend required) — attendance, leave, team directory, and announcements are served through a simulated API layer with realistic network latency, so loading states, error handling, and optimistic UI patterns all behave the way they would against a real backend.

---

## ✨ Features

| Area                           | Details                                                                                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Dashboard**                  | Overview stats, attendance trend chart, leave balance donut, mini calendar, latest announcements                                                                                                 |
| **Attendance**                 | 6-week GitHub-style heatmap, check-in/out times, present/late/absent/half-day breakdown, trend chart                                                                                             |
| **Leave Summary & Requests**   | Per-type balance donut chart, validated request form (start/end date, type, reason), leave history table with status badges                                                                      |
| **Team Directory**             | Search by name/role/skill, department filter, **voice search** (Web Speech API), responsive card grid                                                                                            |
| **Announcements**              | Category-filterable feed, pinned posts                                                                                                                                                           |
| **AI Announcement Summarizer** | One-click "AI Summarize" per announcement, plus an "AI Daily Digest" that condenses all announcements into a bullet-point summary — see [AI Feature](#-ai-feature-announcement-summarizer) below |
| **AI Chat Assistant**          | Floating assistant that answers questions about your own attendance, leave balance, pending requests, and announcements using live app state                                                     |
| **Calendar**                   | Month-grid calendar with holiday/leave/event/birthday markers, click-to-expand day details                                                                                                       |
| **Profile**                    | Personal + employment details, skills, quick stats                                                                                                                                               |
| **Dark Mode**                  | Persisted to `localStorage` via a Zustand store, respects system preference on first load                                                                                                        |
| **Notifications**              | Toast system for success/error/info/warning events                                                                                                                                               |
| **Loading States**             | Skeleton loaders for every async section, simulated network latency (400–900ms)                                                                                                                  |
| **Animations**                 | Framer Motion for toasts/chat panel, CSS keyframes for route transitions, skeleton shimmer, pulse effects                                                                                        |
| **Responsive Design**          | Mobile-first; collapsible sidebar drawer on small screens, responsive grid layouts throughout                                                                                                    |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io) (`npm install -g pnpm` if you don't have it)

### Setup

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:5173`.

### Other scripts

```bash
pnpm build        # Type-check + production build to /dist
pnpm preview      # Preview the production build locally
pnpm lint         # ESLint (flat config)
pnpm test         # Run the Vitest suite once
pnpm test:watch   # Vitest in watch mode
pnpm test:ui      # Vitest with the browser UI
```

No environment variables, API keys, or backend services are required — everything runs entirely in the browser.

---

## 🧠 AI Feature: Announcement Summarizer

The dashboard implements **one** focused AI feature end-to-end rather than several shallow ones: an **extractive text summarizer** for company announcements.

- **Per-announcement summaries** — click "AI Summarize" on any announcement card (Dashboard or Announcements page) to get a 1–2 sentence TL;DR, generated on demand and cached so it's never recomputed.
- **AI Daily Digest** — on the Announcements page, "Generate AI Digest" reads through all current announcements and produces a one-line bullet per item, so you can scan the week's updates in seconds.

**How it works:** `src/lib/summarizer.ts` implements classic TF-based extractive summarization (no external API, no network call, no API key):

1. Split the announcement into sentences.
2. Build a word-frequency table (ignoring stopwords).
3. Score each sentence by its average word frequency, with a small bonus for the opening sentence (announcements tend to lead with the key point).
4. Keep the top-N sentences, restored to their original order so the summary reads naturally.

This is deliberately isolated behind two small async functions — `summarizeAnnouncement(body)` and `summarizeDigest(announcements)` — that already simulate realistic "thinking" latency and return `Promise`s. That means:

- The UI layer (`AnnouncementsFeed.tsx`, `AnnouncementsPage.tsx`) never touches the algorithm directly — it just awaits a promise and shows a loading spinner.
- Swapping in a real LLM call (e.g. the Anthropic Messages API) later is a one-file change: replace the body of `summarizeAnnouncement`/`summarizeDigest`, keep the same signature.
- The algorithm is pure and synchronous under the hood, so it's fully unit-tested in `src/test/summarizer.test.ts` (determinism, sentence-order preservation, edge cases) without any network mocking.

State (per-announcement summary cache, in-flight tracking, digest state) lives in `src/store/announcementStore.ts` as a Zustand store, so the summary a user generates on the Dashboard is already there if they navigate to the full Announcements page.

---

## 🏗️ Architecture

### Folder structure

```
src/
├── components/
│   ├── ui/              # Design-system primitives: Button, Card, Badge, Skeleton, Toast, NotificationHost
│   ├── layout/           # Sidebar, Topbar, AppLayout (route shell)
│   ├── dashboard/         # StatCard, AttendanceChart, LeaveBalanceChart
│   ├── attendance/        # AttendanceHeatmap
│   ├── leave/              # LeaveRequestForm, LeaveHistoryTable
│   ├── team/                 # TeamMemberCard, TeamSearchBar (incl. voice search)
│   ├── announcements/         # AnnouncementsFeed (AI summarize button)
│   ├── calendar/                # MonthCalendar
│   └── chat/                      # ChatAssistant widget + assistantEngine (rule-based NLU)
├── pages/                 # One component per route, composes the above
├── store/                  # Zustand stores: theme, notifications, announcements
├── hooks/                    # useVoiceSearch (Web Speech API)
├── lib/                        # summarizer.ts (AI feature), leaveValidation.ts (pure form validation)
├── data/                       # employees.json, announcements.json, mockGenerators.ts, mockApi.ts
├── types/                        # Shared TypeScript interfaces
└── test/                          # Vitest test suite + setup
```

### Key design decisions

**Mock API layer (`src/data/mockApi.ts`)**
All "network" calls go through a single `mockApi` object that wraps local JSON/generated data in `Promise`s with artificial delay (400–900ms). This is the seam where a real backend would plug in.

**State management — Zustand**
The application uses Zustand only for shared global state that needs to be accessed across multiple components. Currently, there are three stores under `src/store/`: theme, notifications, and announcements. These stores manage application-wide state without requiring React Context or prop drilling.

For asynchronous data fetching, the application uses a custom `useAsync()` hook. Each page or component is responsible for fetching the data it needs, while `useAsync()` handles the `loading`, `success`, and `error` states, keeping the data-fetching logic simple, reusable, and easy to maintain. This approach keeps global state focused on truly shared application state while allowing page-specific data to remain local to the components that consume it.

**Styling**
Tailwind CSS v4 (CSS-first config via `@import "tailwindcss"` + `@custom-variant dark`) with a consistent set of reusable primitives (`Card`, `Badge`, `Button`, `Skeleton`) so every page shares the same visual language.

**AI Chat Assistant**
Implemented as a deterministic, keyword-matching engine (`assistantEngine.ts`) that reads the same Zustand-cached data the dashboard renders (attendance summary, leave balances, pending requests, announcements). This keeps the app 100% offline/dependency-free while still demonstrating realistic "AI assistant" UX — typing indicators, suggested prompts, contextual answers grounded in the user's actual data.

**AI Announcement Summarizer**
See the dedicated section above. Same philosophy as the chat assistant — real algorithmic text processing, wrapped in an async interface designed to be swapped for a hosted LLM without touching the UI.

**Voice search**
Uses the browser-native `SpeechRecognition` / `webkitSpeechRecognition` API directly (no external dependency). Gracefully hides the mic button when unsupported (e.g. Firefox) via feature detection in `useVoiceSearch`.

**Charts**
Recharts for the attendance trend (area chart) and leave balance (donut chart) — lightweight and integrates cleanly with dark mode.

**Testing — Vitest + React Testing Library**
Tests are colocated under `src/test/` and cover:

- `summarizer.test.ts` — the AI feature's core algorithm (determinism, sentence ordering, edge cases)
- `leaveValidation.test.ts` — pure form-validation logic
- `mockGenerators.test.ts` — attendance data generation and summary math
- `announcementStore.test.ts` — Zustand store behavior, including the fetch-caching guard and the summarizer's in-flight tracking
- `LeaveRequestForm.test.tsx` / `Badge.test.tsx` — component-level tests with `@testing-library/react` and `user-event`

Run `pnpm test` for a one-off run or `pnpm test:ui` for the interactive runner.

**Linting — ESLint (flat config)**
`eslint.config.js` uses `typescript-eslint`, `eslint-plugin-react-hooks` (rules-of-hooks + exhaustive-deps), and `eslint-plugin-react-refresh`. Run `pnpm lint`.

---

## 🤔 Assumptions & Trade-offs

- **Single mock user.** The app assumes one logged-in employee (`emp-001`, seeded in `employees.json`). There's no auth flow.
- **In-memory writes.** Submitting a leave request updates the `mockApi` module's in-memory array and the Zustand store; both reset on a full page reload. A real backend would persist this via a database.
- **Deterministic "random" attendance data.** Attendance records use a seeded pseudo-random function (not `Math.random()`) so the dashboard and its tests see consistent, believable data across runs.
- **Zustand over Redux/Context.** Given the app's data needs are domain-scoped rather than deeply nested, Zustand's flat `create()` API kept boilerplate low while still solving real problems: cross-component data sharing (chat assistant + pages), a persisted theme store, and a global notification queue — all without providers wrapping the tree.
- **The AI summarizer is a local algorithm, not a hosted LLM call.** This trades genuine open-ended language understanding for zero external dependencies, zero latency/cost, full offline capability, and a fully unit-testable core. The architecture isolates this behind `summarizeAnnouncement()`/`summarizeDigest()` specifically so it's a drop-in swap for a real API later — the loading states, caching, and UI are already built for an async call.
- **Chat assistant is rule-based, not a real LLM**, for the same reasons as above — see `assistantEngine.ts`.
- **Voice search covers the Team Directory only** — the surface with the clearest hands-free UX win. Extending it elsewhere would reuse the same `useVoiceSearch` hook.
- **Accessibility.** Form fields use proper `label`/`htmlFor` pairs, icon-only buttons have `aria-label`s, and both themes maintain solid color contrast, but a full WCAG audit (focus trapping in the chat panel/sidebar drawer, complete keyboard-nav testing) was not performed.

---

## 🧩 Extending this project

- Swap `mockApi.ts` calls for real `fetch`/GraphQL calls — the Zustand store actions are already the seam; component code doesn't change.
- Replace `summarizer.ts`'s internals with a call to an LLM API (e.g. the Anthropic Messages API) for genuinely abstractive summaries — `summarizeAnnouncement`/`summarizeDigest` keep the same async signature.
- Replace `assistantEngine.ts` similarly for the chat assistant.
- Add authentication and scope `useEmployeeStore.fetchCurrentUser()` to a real session.

---

## 📦 Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first configuration)
- **Zustand** for state management
- **React Router v7** for client-side routing
- **Recharts** for data visualization
- **Framer Motion** for animation
- **Lucide React** for icons
- **Vite** for tooling/build
- **Vitest** + **React Testing Library** for testing
- **ESLint** (flat config) for linting
- **pnpm** as the package manager
