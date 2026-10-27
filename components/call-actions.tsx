"use client";

import { useState } from "react";
import { Check, GitMerge, MessageCircleQuestion, Undo2, Undo } from "lucide-react";
import { CALL_TEXT, type CallKind, makeCall, undoCall, useCalls } from "@/lib/calls";
import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";
import NotePopover from "./note-popover";

const DONE_TEXT: Record<CallKind, (issue: Issue, verdict: Verdict) => string> = {
  merged: () => "The Merger agent picks it up, merges it, and the issue moves to Done.",
  sent_back: (i) => `${i.assignee ?? "The assignee"} gets the note. Agents won't review it again until a new push.`,
  chose: (i) => `${i.assignee ?? "The agents"} and the voting agents were told.`,
  asked: (_, v) => `${v.dissent[0]?.agent ?? "The agent"} was asked. The answer comes back to this card, and the issue stays here until you decide.`,
};

const BUTTON = "flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-sm font-semibold transition active:scale-[0.98]";

/** What the agents would write to the assignee: their reasons, or a plain line if none gave one. */
function agentNote(verdict: Verdict): string {
  const reasons = verdict.dissent.filter((d) => d.reason).map((d) => `${d.agent}: ${d.reason}`);
  return reasons.length ? reasons.join(" ") : "Agents found problems with this fix.";
}

/** The agents' recommendation as one button, with "Overrule" for the other choices. Send back and ask open a small pop-up for the note. */
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

  const merging = verdict.recommend === "merge";
  const go = () => makeCall(issue.id, merging ? { kind: "merged" } : { kind: "sent_back", note: agentNote(verdict) });
  const choice = `${BUTTON} border border-zk-border text-zk-text hover:border-zk-muted`;
  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={go} className={`${BUTTON} bg-zk-blue text-white hover:brightness-110`}>
          {merging ? <GitMerge className="size-4" /> : <Undo className="size-4" />} {merging ? "Approve for the Merger agent" : "Go with agents: send back"}
        </button>
        <button type="button" aria-expanded={overrule} onClick={() => setOverrule(!overrule)} className="cursor-pointer px-2 py-2 text-sm font-semibold text-zk-text2 hover:text-zk-text">
          Overrule
        </button>
      </div>
      {overrule && (
        <div className="mt-2 flex flex-wrap gap-2">
          {merging ? (
            <button type="button" data-note-trigger onClick={() => start("sent_back")} aria-expanded={open === "sent_back"} className={choice}>
              <Undo className="size-4" /> Send back
            </button>
          ) : (
            <button type="button" onClick={() => makeCall(issue.id, { kind: "merged" })} className={choice}>
              <GitMerge className="size-4" /> Approve anyway
            </button>
          )}
          {dissenter && (
            <button type="button" data-note-trigger onClick={() => start("asked")} aria-expanded={open === "asked"} className={choice}>
              <MessageCircleQuestion className="size-4" /> Ask {dissenter.agent}
            </button>
          )}
        </div>
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
  );
}
