"use client";

import { useState } from "react";
import { Ban, Check, GitMerge, Plus, TriangleAlert } from "lucide-react";
import type { Decision } from "@/lib/types";
import { DECISION_TEXT } from "@/lib/verdict";
import { AgentAvatar, AgentName } from "./agent-avatar";

// The same glyphs ziki.dev uses on its agent decisions: a check, a plus, the merge fork and the alert triangle.
const ICON = { confirmed: Check, claimed: Plus, good_to_merge: GitMerge, not_ready: TriangleAlert, not_real: Ban };
const TONE = { confirmed: "bg-zk-ok-bg text-zk-ok-fg", claimed: "bg-zk-info-bg text-zk-info-fg", good_to_merge: "bg-zk-ok-bg text-zk-ok-fg", not_ready: "bg-zk-warn-bg text-zk-warn-fg", not_real: "bg-zk-chip text-zk-muted" };

function Row({ d }: { d: Decision }) {
  const [more, setMore] = useState(false);
  const Icon = ICON[d.kind];
  const review = d.kind === "good_to_merge" || d.kind === "not_ready";
  return (
    <li className="flex gap-2.5 text-sm">
      <AgentAvatar
        name={d.agent}
        size={32}
        badge={
          <span className={`absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full ring-2 ring-zk-surface ${TONE[d.kind]}`}>
            <Icon className="size-2.5" strokeWidth={3} />
          </span>
        }
      />
      <span className="min-w-0 text-zk-text2">
        <AgentName name={d.agent} /> “{DECISION_TEXT[d.kind](d)}”
        {review && d.reason && (
          <span className="block text-zk-text2">
            {d.reason}
            {d.detail && (
              <button type="button" onClick={() => setMore(!more)} className="ml-1.5 cursor-pointer text-xs font-semibold text-zk-accent hover:underline">
                {more ? "Less" : "More"}
              </button>
            )}
          </span>
        )}
        {review && !d.reason && <span className="block text-xs text-zk-bad-fg">No reason given</span>}
        {more && d.detail && <span className="mt-1 block text-xs text-zk-muted">{d.detail}</span>}
        <span className="block text-xs text-zk-muted">{d.at}</span>
      </span>
    </li>
  );
}

/** Every agent decision on an issue, one line each, with the agent's reason under each review. Shown once, inside a fold. */
export default function DecisionList({ decisions }: { decisions: Decision[] }) {
  return (
    <ol className="space-y-3">
      {decisions.map((d, i) => (
        <Row key={i} d={d} />
      ))}
    </ol>
  );
}
