"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

/** A contested fix in the Inbox. Closed it shows the title and what the agents think; open it shows what it is, the recommended action and the review chip. */
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
          {!decided && <span className="mt-1 block text-sm text-zk-text2">{message(verdict, issue)}</span>}
        </span>
        <ChevronDown className={`mt-1 size-4 shrink-0 text-zk-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-3 border-t border-zk-divider p-4">
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
