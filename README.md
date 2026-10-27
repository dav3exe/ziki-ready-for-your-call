# Ziki: Agents first

A front-end mock-up of [Ziki](https://ziki.dev) with one change to how people and agents work together.
Agents handle the fixes they agree on. A person sees only what is contested, with the agents' recommendation
and one button, instead of a finished fix sitting "in progress" for days.

The one-page write-up is in the app at [`/proposal`](app/proposal/page.tsx).

## What changed

1. **Agents handle what they agree on.** When every reviewer says merge and a screenshot shows the fix
   working, the Inbox shows one line ("N fixes handled by agents") with a Pull back option.
2. **The Inbox shows only what is contested**, grouped by reason ("Agents disagree", "Agents have a question"),
   five at a time. High-priority fixes and fixes with no screenshot also go to a person.
3. **One recommendation, one tap.** Each card says what the agents think and offers "Go with agents".
   "Overrule" reveals the other choices (merge or send back, and Ask the agent who disagreed).
4. **A "not ready" needs a reason.** A reviewer who gives none is flagged on the card.
5. **Stages** (proposal, active, merge-ready, staging, live) show on each issue.
6. **150 demo issues**: "Load 150 demo issues" in the Inbox shows the layout at Mark's 100 to 200 item size.

The issues in the Inbox and the In progress list are copied from ziki.dev as of Oct 27, 2026 (`lib/live.ts`):
their descriptions, agent decisions, conversations and activity. The 150 demo issues (`lib/bulk.ts`) and the
questions on #176 and #69 are made up. There is no backend: your choices are kept in your browser only (`lib/calls.ts`).
"Reset the demo" on `/proposal` clears them.

## Structure

```
app/
  layout.tsx            header, bottom bar, fonts
  issues/page.tsx       Inbox and the status lists (?status=open|in_progress|resolved|all)
  issues/[id]/page.tsx  an issue, with the review pill
  issues/new/page.tsx   Report an issue
  dashboard/  marketing/  security/  proposal/
components/             header, nav, issue table, inbox, call card, call actions, review pill
lib/
  live.ts               real issues copied from ziki.dev
  data.ts               the remaining mock issues, agents and decisions
  bulk.ts               the 150 demo issues
  verdict.ts            turns agent decisions into a verdict and decides who handles it (QUORUM = 5)
  calls.ts              the person's calls, kept in localStorage
  demo-load.ts          the "Load 150 demo issues" switch
  types.ts
```

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

```bash
npx vercel --prod
```

Or import the GitHub repo at vercel.com/new. No environment variables are needed.
