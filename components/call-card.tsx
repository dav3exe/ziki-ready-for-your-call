"use client";

import Link from "next/link";
import { useCalls } from "@/lib/calls";
import { summaryOf } from "@/lib/summary";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";
import CallActions from "./call-actions";
import ReviewPill from "./review-pill";

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text);

/** What the agents would tell a person, in one short line. */
function message(issue: Issue, verdict: Verdict): string {
  const total = verdict.merge + verdict.notReady;
  const who = verdict.dissent[0];
  if (verdict.recommend === "merge") {
    if (!who) return `All ${total} say merge. ${issue.priority === "High" ? "High priority." : "No screenshot."}`;
    return `${verdict.merge} of ${total} say merge. ${who.agent} ${who.reason ? `says: “${clip(who.reason.replace(/\.$/, ""), 90)}”` : "hasn't said why."}`;
  }
  return `Only ${verdict.merge} of ${total} say merge. Agents recommend sending it back.`;
}

/** A contested fix in the Inbox: its title and one line on what it is, what the agents think, the recommended action, and the review chip. */
export default function CallCard({ issue, verdict }: { issue: Issue; verdict: Verdict }) {
  const decided = useCalls()[issue.id];
  const shots = issue.screenshots ?? issue.attachments ?? 0;
  return (
    <article className="space-y-3 rounded-xl border border-zk-border bg-zk-surface p-4">
      <div className="min-w-0">
        <Link href={`/issues/${issue.id}`} className="block truncate font-semibold text-zk-text hover:text-zk-accent">
          <span className="text-zk-muted">#{issue.id}</span> {issue.title}
        </Link>
        <p className="mt-0.5 truncate text-sm text-zk-text2">{summaryOf(issue)}</p>
        <p className="mt-1 text-xs text-zk-muted">
          {issue.type}
          {issue.platform && ` · ${issue.platform}`} · {issue.assignee} · {shots > 0 ? `${shots} ${shots === 1 ? "screenshot" : "screenshots"}` : "No screenshots"}
        </p>
      </div>
      {!decided && <p className="text-sm text-zk-text2">{message(issue, verdict)}</p>}
      {!decided && <CallActions issue={issue} verdict={verdict} />}
      <ReviewPill issue={issue} verdict={verdict} actions={false} />
    </article>
  );
}
