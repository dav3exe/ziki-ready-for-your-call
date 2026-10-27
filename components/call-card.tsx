"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { useCalls } from "@/lib/calls";
import { summaryOf } from "@/lib/summary";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";
import ReviewPill from "./review-pill";

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text);

const WHY = { security: "Security sign-off", live_failed: "Live check failed", merge_blocked: "Merge blocked" } as const;

/** What the agents would tell a person, in one short line. */
function message(verdict: Verdict, issue: Issue): string {
  if (issue.escalation) return issue.escalation.headline;
  const total = verdict.merge + verdict.notReady;
  const who = verdict.dissent.find((d) => d.reason) ?? verdict.dissent[0];
  if (verdict.recommend === "merge") return `${verdict.merge} of ${total} say merge. ${who.agent} says: “${clip(who.reason!.replace(/.$/, ""), 90)}”`;
  return `Only ${verdict.merge} of ${total} say merge. Agents recommend sending it back with their notes.`;
}

/** The closed card's version of the review pill: the same robot and green and red bar, with the same hover note. Clicking the card opens it. */
function PillPreview({ verdict }: { verdict: Verdict }) {
  const total = verdict.merge + verdict.notReady;
  const mergePct = Math.round((verdict.merge / total) * 100);
  return (
    <span className="group relative mt-2 inline-flex items-center gap-2 rounded-full border border-zk-border bg-zk-surface py-1 pr-2.5 pl-2" aria-label={`${verdict.merge} of ${total} agents say merge`}>
      <Bot className="size-4 text-zk-accent" />
      <span className="flex h-3 w-24 overflow-hidden rounded-full bg-zk-chip" aria-hidden="true">
        <span className="bg-zk-ok-fg" style={{ width: `${mergePct}%` }} />
        <span className="flex-1 bg-zk-bad-fg" />
      </span>
      <span className="text-xs font-semibold text-zk-text2" aria-hidden="true">
        <b className="text-zk-ok-fg">{verdict.merge}</b> · <b className="text-zk-bad-fg">{verdict.notReady}</b>
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute top-full left-0 z-20 mt-2 hidden w-max space-y-1 rounded-lg border border-zk-border bg-zk-surface px-3 py-2 text-left text-xs font-normal text-zk-text shadow-lg group-hover:block">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-zk-ok-fg" /> {verdict.merge} {verdict.merge === 1 ? "agent says" : "agents say"} merge
        </span>
        {verdict.notReady > 0 && (
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-zk-bad-fg" /> {verdict.notReady} {verdict.notReady === 1 ? "says" : "say"} not ready
          </span>
        )}
      </span>
    </span>
  );
}

/** A contested fix in the Inbox. Closed it shows the title and the agents' pill; open it shows what the agents say, what it is, the recommended action and the full review chip. */
export default function CallCard({ issue, verdict }: { issue: Issue; verdict: Verdict }) {
  const decided = useCalls()[issue.id];
  const [open, setOpen] = useState(false);
  const shots = issue.screenshots ?? issue.attachments ?? 0;
  return (
    <article className="rounded-xl border border-zk-border bg-zk-surface">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full cursor-pointer items-start justify-between gap-3 p-4 text-left">
        <span className="min-w-0">
          <span className="block font-semibold text-zk-text">
            <span className="text-zk-muted">#{issue.id}</span> {issue.title}
          </span>
          {!open && <PillPreview verdict={verdict} />}
        </span>
        <ChevronDown className={`mt-1 size-4 shrink-0 text-zk-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-3 border-t border-zk-divider p-4">
          {!decided && <p className="text-sm text-zk-text2">{message(verdict, issue)}</p>}
          <div className="min-w-0">
            {issue.escalation && <span className="mb-1.5 inline-block rounded-md bg-zk-warn-bg px-2 py-0.5 text-[11px] font-bold text-zk-warn-fg">{WHY[issue.escalation.kind]}</span>}
            <p className="text-sm text-zk-text2">{summaryOf(issue)}</p>
            <p className="mt-1 text-xs text-zk-muted">
              {issue.type}
              {issue.platform && ` · ${issue.platform}`} · {issue.assignee} · {shots > 0 ? `${shots} ${shots === 1 ? "screenshot" : "screenshots"}` : "No screenshots"}
            </p>
          </div>
          <ReviewPill issue={issue} verdict={verdict} />
          <Link href={`/issues/${issue.id}`} className="inline-block text-sm font-semibold text-zk-accent hover:underline">Open issue</Link>
        </div>
      )}
    </article>
  );
}
