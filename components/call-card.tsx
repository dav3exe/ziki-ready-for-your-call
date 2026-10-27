"use client";

import Link from "next/link";
import { useCalls } from "@/lib/calls";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";
import CallActions from "./call-actions";
import ReviewPill from "./review-pill";

/** What the agents would tell a person, in one or two sentences. */
function message(issue: Issue, verdict: Verdict): string {
  const total = verdict.merge + verdict.notReady;
  const who = verdict.dissent[0];
  if (verdict.recommend === "merge") {
    if (!who) return `All ${verdict.merge} agents say ship it, but ${issue.priority === "High" ? "it's high priority" : "nothing shows it working"}, so it needs a person.`;
    return `${who.agent} isn't sure${who.reason ? `: “${who.reason.replace(/\.$/, "")}”` : " and gave no reason"}. The other ${verdict.merge} say ship it.`;
  }
  return `${verdict.merge} of ${total} agents say it's ready; ${verdict.notReady} found problems. Agents recommend sending it back with their notes.`;
}

/** A contested fix in the Inbox: what the agents think as a short message, the recommended action, and the review chip. */
export default function CallCard({ issue, verdict }: { issue: Issue; verdict: Verdict }) {
  const decided = useCalls()[issue.id];
  const shots = issue.screenshots ?? issue.attachments ?? 0;
  return (
    <article className="space-y-3 rounded-xl border border-zk-border bg-zk-surface p-4">
      <div className="min-w-0">
        <Link href={`/issues/${issue.id}`} className="font-semibold text-zk-text hover:text-zk-accent">
          <span className="text-zk-muted">#{issue.id}</span> {issue.title}
        </Link>
        <p className="mt-1 text-xs text-zk-muted">
          {issue.type} · {issue.platform && `${issue.platform} · `}by {issue.assignee}
          {issue.pr && <> · PR {issue.pr}</>}
          {" · "}
          {shots > 0 ? `${shots} ${shots === 1 ? "screenshot" : "screenshots"}` : "No screenshots"}
        </p>
      </div>
      {!decided && <p className="text-sm text-zk-text2">{message(issue, verdict)}</p>}
      {!decided && <CallActions issue={issue} verdict={verdict} />}
      <ReviewPill issue={issue} verdict={verdict} actions={false} />
    </article>
  );
}
