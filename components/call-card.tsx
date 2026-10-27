"use client";

import Link from "next/link";
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

/** A contested fix in the Inbox: its title and one line on what it is, what the agents think, the recommended action, and the review chip. */
export default function CallCard({ issue, verdict }: { issue: Issue; verdict: Verdict }) {
  const decided = useCalls()[issue.id];
  const shots = issue.screenshots ?? issue.attachments ?? 0;
  return (
    <article className="space-y-3 rounded-xl border border-zk-border bg-zk-surface p-4">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/issues/${issue.id}`} className="block min-w-0 truncate font-semibold text-zk-text hover:text-zk-accent">
            <span className="text-zk-muted">#{issue.id}</span> {issue.title}
          </Link>
          {issue.escalation && <span className="shrink-0 rounded-md bg-zk-warn-bg px-2 py-0.5 text-[11px] font-bold text-zk-warn-fg">{WHY[issue.escalation.kind]}</span>}
        </div>
        <p className="mt-0.5 truncate text-sm text-zk-text2">{summaryOf(issue)}</p>
        <p className="mt-1 text-xs text-zk-muted">
          {issue.type}
          {issue.platform && ` · ${issue.platform}`} · {issue.assignee} · {shots > 0 ? `${shots} ${shots === 1 ? "screenshot" : "screenshots"}` : "No screenshots"}
        </p>
      </div>
      {!decided && <p className="text-sm text-zk-text2">{message(verdict, issue)}</p>}
      <ReviewPill issue={issue} verdict={verdict} />
    </article>
  );
}
