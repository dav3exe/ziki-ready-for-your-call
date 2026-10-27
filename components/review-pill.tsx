"use client";

import { useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { makeCall, useCalls } from "@/lib/calls";
import { STAGES, stageOf } from "@/lib/stage";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";
import CallActions from "./call-actions";
import WaitChip from "./wait-chip";

/** The agents' review in one small chip: a robot and a pill split green and red by how many say merge. Tap it for who disagrees and the admin's choices. */
export default function ReviewPill({ issue, verdict, actions = true }: { issue: Issue; verdict: Verdict | null; actions?: boolean }) {
  const [open, setOpen] = useState(false);
  const decided = useCalls()[issue.id];
  const stage = STAGES[stageOf(issue, verdict)];

  // Once a person has decided, what they decided shows in place of the pill, with Undo.
  if (verdict && decided) return <CallActions issue={issue} verdict={verdict} />;
  if (!verdict) return <span className="inline-block rounded-md bg-zk-chip px-2 py-0.5 text-xs font-semibold text-zk-text2">{stage}</span>;

  const total = verdict.merge + verdict.notReady;
  const mergePct = Math.round((verdict.merge / total) * 100);
  return (
    <div className="space-y-3">
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
        <span className="rounded-md bg-zk-chip px-2 py-0.5 text-xs font-semibold text-zk-text2">{stage}</span>
        {verdict.needsPerson && issue.waitingFor && <WaitChip time={issue.waitingFor} />}
        {!verdict.needsPerson && (
          <>
            <span className="text-xs text-zk-text2">Agents handled this on their own.</span>
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
          <ul className="space-y-1.5 text-sm text-zk-text2">
            {verdict.dissent.map((d) => (
              <li key={d.agent + d.at}>
                <b className="text-zk-text">{d.agent}</b> {d.kind === "not_ready" ? "says not ready" : "says merge"}
                {d.reason ? <>: “{d.reason}”</> : <span className="text-zk-muted"> (no reason given, so Ziki now asks for one)</span>}
              </li>
            ))}
            {verdict.dissent.length === 0 && <li className="text-zk-muted">Every reviewing agent agrees.</li>}
          </ul>
          {actions && verdict.needsPerson && (
            <div className="space-y-2 border-t border-zk-divider pt-3">
              <p className="text-xs font-semibold text-zk-muted">Admin decision</p>
              <CallActions issue={issue} verdict={verdict} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
