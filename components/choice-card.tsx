"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, Check, Undo2 } from "lucide-react";
import { makeCall, undoCall, useCalls } from "@/lib/calls";
import { choiceOf } from "@/lib/choice";
import { summaryOf } from "@/lib/summary";
import type { Issue } from "@/lib/types";

const BUTTON = "flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-sm font-semibold transition active:scale-[0.98]";

/** A question, design or idea where the agents disagree: what most of them back and why, as one button, with the other option behind Overrule. */
export default function ChoiceCard({ issue }: { issue: Issue }) {
  const call = useCalls()[issue.id];
  const [overrule, setOverrule] = useState(false);
  const view = choiceOf(issue);
  if (!view) return null;
  const { lead, other, total } = view;
  const choose = (label: string) => makeCall(issue.id, { kind: "chose", note: label });

  return (
    <article className="space-y-3 rounded-xl border border-zk-border bg-zk-surface p-4">
      <div className="min-w-0">
        <Link href={`/issues/${issue.id}`} className="block truncate font-semibold text-zk-text hover:text-zk-accent">
          <span className="text-zk-muted">#{issue.id}</span> {issue.title}
        </Link>
        <p className="mt-0.5 truncate text-sm text-zk-text2">{summaryOf(issue)}</p>
      </div>
      {call ? (
        <div role="status" className="flex flex-wrap items-center gap-3 rounded-lg border border-zk-ok-fg/30 bg-zk-ok-bg px-3 py-2.5 text-sm text-zk-ok-fg">
          <Check className="size-4 shrink-0" />
          <span className="min-w-0 flex-1">
            <b>Chosen: “{call.note}”.</b> The agents were told.
          </span>
          <button type="button" onClick={() => undoCall(issue.id)} className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-zk-text2 hover:text-zk-text">
            <Undo2 className="size-3.5" /> Undo
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-zk-text2">
            {lead.votes} of {total} back “{lead.label}”: {lead.reason}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => choose(lead.label)} className={`${BUTTON} bg-zk-blue text-white hover:brightness-110`}>
              <Bot className="size-4" /> Go with agents: {lead.label}
            </button>
            <button type="button" aria-expanded={overrule} onClick={() => setOverrule(!overrule)} className="cursor-pointer px-2 py-2 text-sm font-semibold text-zk-text2 hover:text-zk-text">
              Overrule
            </button>
          </div>
          {overrule && (
            <div className="space-y-1.5">
              <button type="button" onClick={() => choose(other.label)} className={`${BUTTON} border border-zk-border text-zk-text hover:border-zk-muted`}>
                Choose “{other.label}” instead
              </button>
              <p className="text-xs text-zk-muted">
                {other.votes} of {total} back it: {other.reason}
              </p>
            </div>
          )}
        </>
      )}
    </article>
  );
}
