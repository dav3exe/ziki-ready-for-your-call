"use client";

import { useState } from "react";
import { Check, GitMerge, MessageCircleQuestion, RotateCcw, Undo2, Undo } from "lucide-react";
import { CALL_TEXT, type CallKind, makeCall, undoCall, useCalls } from "@/lib/calls";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";
import NotePopover from "./note-popover";
import Tip from "./tip";

const DONE_TEXT: Record<CallKind, (issue: Issue, verdict: Verdict) => string> = {
  merged: () => "The Merger agent picks it up, merges it, and the issue moves to Done.",
  sent_back: (i) => `${i.assignee ?? "The assignee"} gets the note. Agents won't review it again until a new push.`,
  rolled_back: () => "The Admin Merger agent reverts the merge, and the issue goes back to In progress for the assignee.",
  kept: () => "It stays live. The failed live check is noted on the issue so the assignee can fix it next.",
  chose: (i) => `${i.assignee ?? "The agents"} and the voting agents were told.`,
  asked: (_, v) => `${v.dissent[0]?.agent ?? "The agent"} was asked. The answer comes back to this card, and the issue stays here until you decide.`,
};

const BUTTON = "inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition active:scale-[0.98]";

/** What the agents would write to the assignee: their reasons, or a plain line if none gave one. */
function agentNote(issue: Issue, verdict: Verdict): string {
  if (issue.escalation?.kind === "merge_blocked") return "Rebase on dev, resolve the conflict with the PR that was merged first, and keep only one trim of the link.";
  const reasons = verdict.dissent.filter((d) => d.reason).map((d) => `${d.agent}: ${d.reason}`);
  return reasons.length ? reasons.join(" ") : "Agents found problems with this fix.";
}

/** The agents' recommendation as one small button, with "Overrule" for the other choices. Send back and ask open a small pop-up for the note. Once a person has decided, this is the green banner with Undo. */
export default function CallActions({ issue, verdict }: { issue: Issue; verdict: Verdict }) {
  const call = useCalls()[issue.id];
  const [open, setOpen] = useState<"sent_back" | "asked" | null>(null);
  const [overrule, setOverrule] = useState(false);
  const dissenter = verdict.dissent[0];
  const [note, setNote] = useState("");

  if (call) {
    return (
      <div role="status" className="flex flex-wrap items-center gap-3 rounded-lg border border-zk-ok-fg/30 bg-zk-ok-bg px-3 py-2.5 text-sm text-zk-ok-fg">
        <Check className="size-4 shrink-0" />
        <span className="min-w-0 flex-1">
          <b>{CALL_TEXT[call.kind]}.</b> {DONE_TEXT[call.kind](issue, verdict)}
          {call.note && <span className="mt-1 block text-zk-text2">“{call.note}”</span>}
        </span>
        <button type="button" onClick={() => undoCall(issue.id)} className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-zk-text2 hover:text-zk-text">
          <Undo2 className="size-3.5" /> Undo
        </button>
      </div>
    );
  }

  const start = (kind: "sent_back" | "asked") => {
    if (open === kind) return setOpen(null);
    setOpen(kind);
    setNote(
      kind === "sent_back"
        ? (dissenter?.reason ?? "")
        : dissenter
          ? `What would make this ready for you?${dissenter.reason ? ` You said: “${dissenter.reason}”` : ""}`
          : "",
    );
  };

  const submit = () => {
    if (!open) return;
    makeCall(issue.id, { kind: open, note: note.trim() || undefined });
    setOpen(null);
  };

  // What the agents suggest: approve it, roll it back, or send it back. Most cards are approve or send back; a failed live check is a roll back.
  const suggest = issue.escalation?.recommend ?? (verdict.recommend === "merge" ? "approve" : "send_back");
  const merging = suggest === "approve";
  const go = () => makeCall(issue.id, suggest === "approve" ? { kind: "merged" } : suggest === "rollback" ? { kind: "rolled_back" } : { kind: "sent_back", note: agentNote(issue, verdict) });
  const choice = `${BUTTON} border border-zk-border text-zk-text hover:border-zk-muted`;
  // Sits in the review row, between the agents' count and the stage: a small button for what the agents recommend, and Overrule for the rest.
  return (
    <>
      <Tip text={merging ? "Approve for the Merger agent" : suggest === "rollback" ? "Roll back: the Admin Merger agent reverts the merge" : "Send back with the agents' notes"}>
        <button type="button" onClick={go} className={`${BUTTON} bg-zk-blue text-white hover:brightness-110`}>
          {merging ? <GitMerge className="size-3.5" /> : suggest === "rollback" ? <RotateCcw className="size-3.5" /> : <Undo className="size-3.5" />} {merging ? "Approve" : suggest === "rollback" ? "Roll back" : "Send back"}
        </button>
      </Tip>
      <button type="button" aria-expanded={overrule} onClick={() => setOverrule(!overrule)} className="cursor-pointer px-1 py-1 text-xs font-semibold text-zk-text2 hover:text-zk-text">
        Overrule
      </button>
      {(overrule || open) && (
        <div className="relative flex basis-full flex-wrap gap-2">
          {overrule &&
            (merging ? (
              <button type="button" data-note-trigger onClick={() => start("sent_back")} aria-expanded={open === "sent_back"} className={choice}>
                <Undo className="size-3.5" /> Send back
              </button>
            ) : suggest === "rollback" ? (
              <button type="button" onClick={() => makeCall(issue.id, { kind: "kept" })} className={choice}>
                <Check className="size-3.5" /> Keep live
              </button>
            ) : (
              <button type="button" onClick={() => makeCall(issue.id, { kind: "merged" })} className={choice}>
                <GitMerge className="size-3.5" /> Approve anyway
              </button>
            ))}
          {overrule && dissenter && (
            <button type="button" data-note-trigger onClick={() => start("asked")} aria-expanded={open === "asked"} className={choice}>
              <MessageCircleQuestion className="size-3.5" /> Ask {dissenter.agent}
            </button>
          )}
          {open && (
            <NotePopover
              title={open === "sent_back" ? `Tell ${issue.assignee ?? "the assignee"} what to fix` : `Your question for ${dissenter?.agent}`}
              value={note}
              onChange={setNote}
              submitLabel={open === "sent_back" ? "Send back" : "Send question"}
              onSubmit={submit}
              onClose={() => setOpen(null)}
            />
          )}
        </div>
      )}
    </>
  );
}
