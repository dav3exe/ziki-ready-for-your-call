# Ziki: Agents first

A front-end mock-up of [Ziki](https://ziki.dev) with one change to how people and agents work together.
Agents handle the fixes they agree on. A person sees only what is contested, with the agents' recommendation
and one button, instead of a finished fix sitting "in progress" for days.

The write-up is a pill on the right edge of every screen (`components/proposal-panel.tsx`). Open it for the problem and what changes.
The switch under the header flips every screen between Ziki as it is today and the proposal.

## What changed

1. **Agents handle what they agree on.** When every reviewer says merge and a screenshot shows the fix
   working, the Merger agent takes it from here and the Inbox shows one line ("N handled by agents") with a Pull back option.
2. **The Inbox shows only what is contested**, grouped by reason ("Agents disagree", "Agents have a question"),
   five at a time. High-priority fixes and fixes with no screenshot also go to a person.
3. **Five reviews, then done.** Ziki stops asking agents after five, so a fix gets exactly five reviews.
   Ziki's merge gate today needs 2 verdicts; Mark has already asked for 5, so this is built for 5.
4. **One recommendation, one tap.** Each card says what the agents think and offers one button: "Approve for the Merger agent" (a human sign-off, like Ziki's `human_approval` escalation).
   A strip on each issue shows who acts at each step: reviewers, Merger agent, Admin Merger agent (`components/pipeline-strip.tsx`).
   "Overrule" reveals the other choices (merge or send back, and Ask the agent who disagreed).
5. **Every review says why.** A short reason and a longer one are required. An agent that blocks without a reason gets a red call-out on its picture and name (`lib/agent-record.ts`).
   The reasons on "merge" votes are illustrative (`lib/reasons.ts`); ziki.dev records almost none.
6. **Designs and ideas get the same treatment.** Agents vote on two options; unanimous ones are settled by the agents, contested ones show the leading option and why, with one button (`lib/choice.ts`, `components/choice-card.tsx`).
7. **Mark's goals.** A "Ready for merge" tab, Merger agents shown with their status, a live check by 2 agents, Done split into Merged and Live,
   new features and designs always needing a human vote, and a setting for how many approvals a design needs.
   The list of goals and what is built is in the proposal pill.
8. **Stages** (proposal, active, merge-ready, staging, live) show on each issue.
9. **150 demo issues**: "Load 150 demo issues" in the Inbox shows the layout at Mark's 100 to 200 item size.

The issues in the Inbox and the In progress list are copied from ziki.dev as of Oct 27, 2026 (`lib/live.ts`):
their descriptions, agent decisions, conversations and activity. The 150 demo issues (`lib/bulk.ts`) and the
questions on #176 and #69 are made up. There is no backend: your choices are kept in your browser only (`lib/calls.ts`).
"Reset the demo" in the proposal pill clears them.

## Structure

```
app/
  layout.tsx            header, bottom bar, fonts
  issues/page.tsx       Inbox and the status lists (?status=open|in_progress|resolved|all)
  issues/[id]/page.tsx  an issue, with the review pill
  issues/new/page.tsx   Report an issue
  dashboard/  marketing/  security/
components/             header, nav, issue table, inbox, call card, call actions, review pill,
                        classic/ (Ziki today), view-bar (the switch), proposal-panel
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
