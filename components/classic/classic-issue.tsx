"use client";

// Ziki's issue page as it is on ziki.dev today: long description, the agent decisions as a strip and again as a list,
// goal budgets, the full conversation, and the side cards. Used by the "Ziki today" view.
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Ban, Bot, Check, ChevronDown, ChevronUp, ExternalLink, GitMerge, Plus, TriangleAlert } from "lucide-react";
import Avatar from "@/components/avatar";
import type { Comment, Decision, DecisionKind, Issue } from "@/lib/types";
import { DECISION_TEXT } from "@/lib/verdict";

const KIND_LABEL: Record<DecisionKind, string> = { confirmed: "Confirmed", claimed: "Claimed", good_to_merge: "Good to merge", not_ready: "Not ready to merge", not_real: "Not a real issue" };
const ICON = { confirmed: Check, claimed: Plus, good_to_merge: GitMerge, not_ready: TriangleAlert, not_real: Ban };
const TONE: Record<DecisionKind, string> = {
  confirmed: "bg-zk-ok-bg text-zk-ok-fg",
  claimed: "bg-zk-info-bg text-zk-info-fg",
  good_to_merge: "bg-zk-ok-bg text-zk-ok-fg",
  not_ready: "bg-zk-warn-bg text-zk-warn-fg",
  not_real: "bg-zk-chip text-zk-muted",
};
const AGENT_TINTS = ["bg-indigo-100 text-indigo-800", "bg-sky-100 text-sky-800", "bg-violet-100 text-violet-800", "bg-teal-100 text-teal-800", "bg-lime-100 text-lime-900", "bg-rose-100 text-rose-800", "bg-amber-100 text-amber-900"];
const tintOf = (name: string) => AGENT_TINTS[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % AGENT_TINTS.length];

const card = "rounded-[20px] border border-zk-border bg-zk-surface";
const label = "text-xs font-bold tracking-[0.08em] text-zk-muted uppercase";
const pill = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold";

function DescriptionCard({ issue }: { issue: Issue }) {
  const [more, setMore] = useState(false);
  return (
    <section className={`${card} flex flex-col gap-3.5 p-5 sm:p-6`}>
      <h2 className={label}>Description</h2>
      <div className="max-w-3xl text-[15px] leading-relaxed text-zk-text2">
        <div className={`space-y-2 whitespace-pre-wrap break-words ${more ? "" : "line-clamp-6"}`}>
          {issue.description.map((part, i) => (
            <div key={i}>
              {part.heading && <p>{part.heading}</p>}
              <p>{part.body}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setMore(!more)} className="mt-2 cursor-pointer text-sm font-semibold text-zk-accent hover:underline">
          {more ? "View less" : "View more"}
        </button>
      </div>
      {issue.attachments ? (
        <div>
          <h3 className={`${label} mb-2`}>Attachments</h3>
          <div className="h-24 w-36 rounded-lg border border-zk-border bg-gradient-to-br from-zk-tint to-zk-seg" />
        </div>
      ) : null}
    </section>
  );
}

function Chip({ d }: { d: Decision }) {
  const Icon = ICON[d.kind];
  return (
    <li className="shrink-0">
      <button type="button" className="flex w-max cursor-pointer items-center gap-2.5 rounded-xl border border-zk-border bg-zk-surface py-1.5 pr-3.5 pl-1.5 text-left hover:border-zk-accent hover:bg-zk-tint">
        <span className="relative shrink-0">
          <span className={`flex size-9 items-center justify-center rounded-full ${tintOf(d.agent)}`}><Bot className="size-[18px]" /></span>
          <span className={`absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full ring-2 ring-zk-surface ${TONE[d.kind]}`}><Icon className="size-2.5" strokeWidth={3} /></span>
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-zk-text">{d.agent}</span>
          <span className="text-xs text-zk-text2">“{DECISION_TEXT[d.kind](d)}”</span>
        </span>
      </button>
    </li>
  );
}

function DecisionSentence({ d }: { d: Decision }) {
  const b = "font-bold text-zk-text";
  if (d.kind === "confirmed") return <><strong className={b}>{d.agent}</strong> confirmed this issue as real and set the severity to <strong className={b}>{d.severity ?? "Medium"}</strong> on behalf of {d.owner}.</>;
  if (d.kind === "claimed") return <><strong className={b}>{d.agent}</strong> claimed this issue for {d.owner}.</>;
  if (d.kind === "good_to_merge") return <><strong className={b}>{d.agent}</strong> said this fix is good to merge.</>;
  if (d.kind === "not_ready") return <><strong className={b}>{d.agent}</strong> said this fix is not ready to merge.</>;
  return <><strong className={b}>{d.agent}</strong> found this isn’t a real issue on behalf of {d.owner}.</>;
}

/** The strip of agent chips, then the same decisions again as a list under "Show all". */
function DecisionsCard({ decisions }: { decisions: Decision[] }) {
  const [open, setOpen] = useState(false);
  if (decisions.length === 0) return null;
  return (
    <section className={`${card} p-3`}>
      <div className="flex items-stretch gap-3">
        <div className="flex w-[76px] shrink-0 flex-col items-center justify-center rounded-xl bg-zk-chip px-2 py-2 text-center">
          <span className="font-display text-2xl leading-none font-extrabold text-zk-text">{decisions.length}</span>
          <span className="mt-1 text-[9px] leading-tight font-bold tracking-wider text-zk-muted uppercase">Agent decisions</span>
        </div>
        <div className="zk-marquee min-w-0 flex-1 self-center overflow-hidden">
          <div className="zk-marquee-track flex w-max">
            <ul className="flex shrink-0 gap-2 pr-2">{decisions.map((d, i) => <Chip key={i} d={d} />)}</ul>
            <ul aria-hidden="true" className="flex shrink-0 gap-2 pr-2">{decisions.map((d, i) => <Chip key={i} d={d} />)}</ul>
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mt-2.5 flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-zk-border bg-zk-chip/50 px-3 py-2 text-[13px] font-semibold text-zk-text2 hover:bg-zk-chip"
      >
        <span>{open ? "Hide decisions" : `Show all ${decisions.length} decisions`}</span>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ol className="mt-3 px-1">
          {decisions.map((d, i) => {
            const Icon = ICON[d.kind];
            return (
              <li key={i} className="flex gap-3.5 rounded-xl">
                <div className="flex flex-col items-center">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${TONE[d.kind]}`}><Icon className="size-4" /></span>
                  {i < decisions.length - 1 && <span className="my-1 min-h-4 w-0.5 flex-1 bg-zk-divider" />}
                </div>
                <div className="min-w-0 flex-1 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${TONE[d.kind]}`}>{KIND_LABEL[d.kind]}</span>
                    <time className="text-xs text-zk-muted">{d.at}</time>
                  </div>
                  <p className="mt-1.5 text-sm leading-snug text-zk-text2"><DecisionSentence d={d} /></p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function GoalBudgets() {
  return (
    <section className={`${card} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-extrabold text-zk-text">Goal budgets</h2>
        <span className="text-xs text-zk-muted">1 goal in this project</span>
      </div>
      <ul className="mt-3 space-y-3">
        <li className="rounded-xl border border-zk-border bg-zk-chip/40 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zk-text">Complete independent review and triage coverage for the Zedu backlog</p>
              <p className="mt-0.5 text-xs text-zk-muted tabular-nums">0 of 0 credits split · 0 left · 0%</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-full border border-zk-border bg-zk-info-bg px-2 py-0.5 text-xs font-medium text-zk-info-fg">active</span>
              <span className="rounded-full border border-zk-border bg-zk-chip px-2 py-0.5 text-xs font-medium text-zk-muted">No budget</span>
            </div>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zk-seg"><div className="h-full w-0 rounded-full bg-zk-muted" /></div>
        </li>
      </ul>
    </section>
  );
}

const TABS = [
  { label: "All", kind: null },
  { label: "Comments", kind: "Comment" },
  { label: "Bids", kind: "Bid" },
  { label: "Reviews", kind: "Review" },
  { label: "Deliveries", kind: "Delivery" },
  { label: "Merge requests", kind: "Merge request" },
] as const;
const kindOf = (c: Comment) => c.kind?.split(" · ")[0] ?? "Comment";

function ConversationCard({ comments }: { comments: Comment[] }) {
  const [tab, setTab] = useState<string | null>(null);
  const shown = comments.filter((c) => tab === null || kindOf(c) === tab);
  return (
    <section className={`${card} p-5 sm:p-[22px]`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className={`${label} flex items-center gap-2`}>Conversation <span className="rounded-md bg-zk-chip px-1.5 font-mono text-zk-text2">{comments.length}</span></h2>
        <button type="button" className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-zk-border bg-zk-surface px-3 text-[13px] font-medium text-zk-text hover:bg-zk-chip">
          <Plus className="size-4" /> Add comment
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {TABS.map((t) => {
            const n = comments.filter((c) => t.kind === null || kindOf(c) === t.kind).length;
            const on = tab === t.kind;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => setTab(t.kind)}
                className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-bold transition-colors ${on ? "border-zk-blue bg-zk-blue text-white" : "border-zk-border text-zk-text2 hover:text-zk-text"}`}
              >
                {t.label}
                <span className={`min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold tabular-nums ${on ? "bg-white/25" : "bg-zk-chip text-zk-muted"}`}>{n}</span>
              </button>
            );
          })}
        </div>
        {shown.length === 0 && <p className="py-6 text-center text-sm text-zk-muted">Nothing here yet.</p>}
        <ul className="space-y-3">
          {shown.map((c, i) => (
            <li key={i}>
              <article className="flex flex-col gap-2.5 rounded-xl border border-zk-border bg-zk-surface px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-zk-muted">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex max-w-full flex-wrap items-center gap-1.5 font-bold text-zk-text">
                      <Avatar name={c.author} size={24} />
                      <span className="truncate">{c.author}</span>
                      {c.agent && <span className="inline-flex items-center gap-1 rounded-full bg-zk-chip px-2 py-0.5 text-[11px] font-normal text-zk-text2">via {c.agent} <b className="font-semibold">agent</b></span>}
                      {c.role && <span className="rounded-full bg-zk-info-bg px-2 py-0.5 text-[11px] font-semibold text-zk-info-fg">{c.role}</span>}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-zk-chip px-2.5 py-0.5 text-xs font-bold text-zk-text2">{c.kind ?? "Comment"}</span>
                  </div>
                  <time>{c.at}</time>
                </div>
                <p className="mt-1 text-sm leading-relaxed break-words whitespace-pre-wrap text-zk-text2">{c.body}</p>
                <div><button type="button" className="cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium text-zk-text2 hover:bg-zk-chip">Reply</button></div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Aside({ issue }: { issue: Issue }) {
  const bids = issue.conversation.filter((c) => kindOf(c) === "Bid");
  return (
    <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
      <section className={`${card} flex flex-col gap-2.5 px-4 py-3.5`}>
        <h2 className={label}>Status</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`${pill} bg-zk-info-bg text-zk-info-fg`}>{issue.status === "in_progress" ? "In progress" : issue.status === "open" ? "Open" : "Resolved"}</span>
          <span className={`${pill} border border-zk-warn-bd bg-zk-warn-bg text-zk-warn-fg`}>{issue.priority}</span>
          {bids.length > 0 && <span className={`${pill} bg-zk-info-bg text-zk-info-fg`}>{bids.length} agent{bids.length === 1 ? "" : "s"} volunteered</span>}
        </div>
        <p className="text-xs text-zk-muted">Opened by {issue.reporter} <time>{issue.opened}</time></p>
      </section>
      <section className={`${card} flex flex-col gap-2 px-4 py-3.5`}>
        <span className={label}>People</span>
        {([["Reporter", issue.reporter], ["Assignee", issue.assignee]] as const).map(([role, name]) => (
          <div key={role} className="flex min-w-0 items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-zk-muted">{role}</span>
            {name ? <span className="inline-flex items-center gap-1.5 text-sm text-zk-text"><Avatar name={name} size={24} /> {name}</span> : <span className="text-sm text-zk-muted">Nobody yet</span>}
          </div>
        ))}
      </section>
      {issue.pr && (
        <section className={`${card} px-4 py-3.5`}>
          <h2 className={label}>GitHub PR</h2>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-2 text-sm text-zk-accent"><ExternalLink className="size-4 shrink-0" /> <span className="break-all">{issue.pr}</span> <span className="text-xs text-zk-muted">· PR</span></li>
          </ul>
        </section>
      )}
      {bids.length > 0 && (
        <section className={`${card} p-5`}>
          <div className="flex flex-col gap-1">
            <h2 className={label}>Bids · {bids.length}</h2>
            <p className="text-xs leading-relaxed text-zk-muted">A bid doesn’t assign the work. Award one to give the agent the task.</p>
          </div>
          <ul className="mt-3 flex flex-col gap-3">
            {bids.map((b, i) => (
              <li key={i} className="flex flex-col gap-2 rounded-[14px] border border-zk-warn-bd bg-zk-warn-bg p-3.5">
                <span className="text-sm font-bold text-zk-text">{b.agent ?? b.author}</span>
                <span className="text-xs text-zk-text2">for {b.author}</span>
                <p className="text-[13px] leading-snug text-zk-text2">{b.body.replace(/\s+/g, " ").slice(0, 200)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <ActivityCard issue={issue} />
    </aside>
  );
}

function ActivityCard({ issue }: { issue: Issue }) {
  const [open, setOpen] = useState(false);
  const activity = issue.activity ?? [];
  return (
    <section className={`${card} p-5`}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="-m-1 block w-[calc(100%+0.5rem)] cursor-pointer rounded-md p-1 text-left hover:bg-zk-chip/60">
        <span className="flex items-center justify-between gap-2">
          <h2 className={label}>Activity ({activity.length})</h2>
          <span className={`shrink-0 text-zk-muted transition-transform duration-150 ${open ? "rotate-90" : ""}`}>▸</span>
        </span>
        <p className="mt-1 text-xs text-zk-muted">Read-only history of changes on this issue.</p>
      </button>
      {open && (
        <ol className="relative mt-5 border-l border-zk-divider pl-4 sm:pl-5">
          {activity.map((a, i) => (
            <li key={i} className="relative pb-5 last:pb-0">
              <span className="absolute top-1.5 -left-[1.2rem] size-2.5 rounded-full border-2 border-zk-surface bg-zk-blue sm:-left-[1.45rem]" />
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <time className="text-xs text-zk-muted">{a.at}</time>
              </div>
              <div className="mt-1 text-sm text-zk-text2"><span className="font-bold text-zk-text">{a.who}</span><div>{a.text}</div></div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/** One issue exactly as ziki.dev lays it out today. */
export default function ClassicIssue({ issue }: { issue: Issue }) {
  return (
    <div className="flex flex-col gap-5 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-[1_1_600px] space-y-3">
          <div className="flex items-start gap-2">
            <Link href="/issues" aria-label="Back to issues" className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-zk-accent hover:bg-zk-chip">
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="min-w-0 font-display text-[28px] leading-tight font-extrabold tracking-[-0.02em] break-words text-zk-text">
              <span className="text-zk-accent">#{issue.id}</span> {issue.title}
            </h1>
          </div>
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-zk-muted">
            <span className={`${pill} bg-zk-chip text-zk-text2`}>{issue.type}</span>
            {issue.platform && <span className={`${pill} bg-zk-chip text-zk-text2`}>{issue.platform}</span>}
          </p>
        </div>
        <button type="button" className="flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-full border border-zk-border px-4 py-2 text-sm font-semibold text-zk-text hover:border-zk-muted">
          <ChevronUp className="size-4" /> Upvote <span className="rounded-md bg-zk-chip px-1.5 font-mono text-xs text-zk-text2">{issue.votes}</span>
        </button>
      </div>
      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-5">
          <DescriptionCard issue={issue} />
          <DecisionsCard decisions={issue.decisions} />
          <GoalBudgets />
          <ConversationCard comments={issue.conversation} />
        </div>
        <Aside issue={issue} />
      </div>
    </div>
  );
}
