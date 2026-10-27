import { Ban, Check, GitMerge, Plus, TriangleAlert } from "lucide-react";
import type { Decision } from "@/lib/types";
import { DECISION_TEXT } from "@/lib/verdict";

// The same glyphs ziki.dev uses on its agent decisions: a check, a plus, the merge fork and the alert triangle.
const ICON = { confirmed: Check, claimed: Plus, good_to_merge: GitMerge, not_ready: TriangleAlert, not_real: Ban };
const TONE = { confirmed: "text-zk-accent", claimed: "text-zk-warn-fg", good_to_merge: "text-zk-ok-fg", not_ready: "text-zk-bad-fg", not_real: "text-zk-muted" };

/** Every agent decision on an issue, one line each. Shown once, inside a fold. */
export default function DecisionList({ decisions }: { decisions: Decision[] }) {
  return (
    <ol className="space-y-2">
      {decisions.map((d, i) => {
        const Icon = ICON[d.kind];
        return (
          <li key={i} className="flex gap-2.5 text-sm">
            <Icon strokeWidth={2.5} className={`mt-0.5 size-4 shrink-0 ${TONE[d.kind]}`} />
            <span className="min-w-0 text-zk-text2">
              <b className="text-zk-text">{d.agent}</b> “{DECISION_TEXT[d.kind](d)}”
              <span className="block text-xs text-zk-muted">{d.at}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
