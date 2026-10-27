"use client";

import { useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { makeCall, useCalls } from "@/lib/calls";
import { NOT_READY_STAGE, STAGES, stageOf } from "@/lib/stage";
import type { Issue } from "@/lib/types";
import { proposedDecisions, type Verdict } from "@/lib/verdict";
import CallActions from "./call-actions";
import DecisionList from "./decision-list";
import ReviewRows from "./review-rows";
import WaitChip from "./wait-chip";

/** The agents' review in one small chip: a robot and a pill split green and red by how many say merge. Tap it for each reviewer's reason. A person's button sits beside it. */
export default function ReviewPill({ issue, verdict, actions = true }: { issue: Issue; verdict: Verdict | null; actions?: boolean }) {
  const [open, setOpen] = useState(false);
  const decided = useCalls()[issue.id];
  const stageIndex = stageOf(issue, verdict);
  const stage = STAGES[stageIndex];
  const stageTone = stageIndex === NOT_READY_STAGE ? "bg-zk-bad-bg text-zk-bad-fg" : "bg-zk-chip text-zk-text2";

  // Before five agents have reviewed it there is no verdict, so the pill is a small chip for the decisions so far (never more than five).
  if (!verdict) {
    const so_far = proposedDecisions(issue);
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {so_far.length > 0 && (
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-zk-border bg-zk-surface py-1 pr-2.5 pl-2 text-xs font-semibold text-zk-text2 transition-[border-color,transform] hover:border-zk-muted active:scale-[0.98]"
            >
              <Bot className="size-4 text-zk-accent" /> {so_far.length} agent {so_far.length === 1 ? "decision" : "decisions"}
              <ChevronDown className={`size-3.5 text-zk-muted transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          )}
          <span className="rounded-md bg-zk-chip px-2 py-0.5 text-xs font-semibold text-zk-text2">{stage}</span>
        </div>
        {open && so_far.length > 0 && (
          <div className="rounded-xl border border-zk-border bg-zk-surface p-4">
            <DecisionList decisions={so_far} />
          </div>
        )}
      </div>
    );
  }

  const total = verdict.merge + verdict.notReady;
  const mergePct = Math.round((verdict.merge / total) * 100);
  return (
    <div className="space-y-3">
      {/* Once a person has decided, what they decided shows here, with Undo. The pill stays. */}
      {decided && <CallActions issue={issue} verdict={verdict} />}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          aria-label={`${verdict.merge} of ${total} agents say merge. ${open ? "Hide" : "Show"} details`}
          className="group relative flex cursor-pointer items-center gap-2 rounded-full border border-zk-border bg-zk-surface py-1 pr-2.5 pl-2 transition-[border-color,transform] hover:border-zk-muted active:scale-[0.98]"
        >
          <Bot className="size-4 text-zk-accent" />
          <span className="flex h-3 w-24 overflow-hidden rounded-full bg-zk-chip" aria-hidden="true">
            <span className="bg-zk-ok-fg" style={{ width: `${mergePct}%` }} />
            <span className="flex-1 bg-zk-bad-fg" />
          </span>
          <span className="text-xs font-semibold text-zk-text2" aria-hidden="true">
            <b className="text-zk-ok-fg">{verdict.merge}</b> · <b className="text-zk-bad-fg">{verdict.notReady}</b>
          </span>
          <ChevronDown className={`size-3.5 text-zk-muted transition-transform ${open ? "rotate-180" : ""}`} />
          <span aria-hidden="true" className="pointer-events-none absolute top-full left-0 z-20 mt-2 hidden w-max space-y-1 rounded-lg border border-zk-border bg-zk-surface px-3 py-2 text-left text-xs font-normal text-zk-text shadow-lg group-hover:block group-focus-visible:block">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-zk-ok-fg" /> {verdict.merge} {verdict.merge === 1 ? "agent says" : "agents say"} merge
            </span>
            {verdict.notReady > 0 && (
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-zk-bad-fg" /> {verdict.notReady} {verdict.notReady === 1 ? "says" : "say"} not ready
              </span>
            )}
          </span>
        </button>
        {!decided && actions && verdict.needsPerson && <CallActions issue={issue} verdict={verdict} />}
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${stageTone}`}>{stage}</span>
        {!decided && verdict.needsPerson && issue.waitingFor && <WaitChip time={issue.waitingFor} />}
        {!decided && !verdict.needsPerson && (
          <>
            <span className="text-xs text-zk-text2">Handed to the Merger agent.</span>
            <button
              type="button"
              onClick={() => makeCall(issue.id, { kind: "sent_back", note: "Pulled back from automatic merge." })}
              className="cursor-pointer text-xs font-semibold text-zk-text2 hover:text-zk-text"
            >
              Pull back
            </button>
          </>
        )}
      </div>
      {open && (
        <div className="space-y-3 rounded-xl border border-zk-border bg-zk-surface p-4">
          <ReviewRows reviews={verdict.reviews} />
        </div>
      )}
    </div>
  );
}
