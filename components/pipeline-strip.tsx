import type { Issue } from "@/lib/types";
import type { Verdict } from "@/lib/verdict";

// Who acts at each step in the proposal. These are Ziki's own roles: reviewers confirm and test, a Merger agent accepts a fix,
// an Admin Merger agent performs the merge. A person steps in only at the sign-off, and only when the agents are contested.
const STEPS = [
  { name: "Confirm", who: "Reviewers" },
  { name: "Fix", who: "Contributor agent" },
  { name: "Review", who: "5 reviewers" },
  { name: "Sign-off", who: "Merger agent approves" },
  { name: "Merge", who: "Admin Merger agent" },
  { name: "Live check", who: "5 agents test live" },
  { name: "Live", who: "" },
] as const;

/** Which step an issue is at. */
function stepOf(issue: Issue, verdict: Verdict | null): number {
  if (issue.status === "resolved") return issue.live ? 6 : 5;
  if (verdict) return verdict.needsPerson ? 3 : 4;
  if (issue.status === "open") return 0;
  return issue.decisions.some((d) => d.kind === "good_to_merge" || d.kind === "not_ready") ? 2 : 1;
}

/** The pipeline as a thin strip: who acts at each step, and where this issue is. */
export default function PipelineStrip({ issue, verdict }: { issue: Issue; verdict: Verdict | null }) {
  const at = stepOf(issue, verdict);
  const waitingOnYou = verdict?.needsPerson === true && at === 3;
  return (
    <ol aria-label="Pipeline" className="flex gap-1 overflow-x-auto text-xs">
      {STEPS.map((s, i) => {
        const now = i === at;
        const done = i < at;
        const who = i === 3 && waitingOnYou ? "You, then the Merger agent" : s.who;
        return (
          <li
            key={s.name}
            aria-current={now ? "step" : undefined}
            className={`min-w-0 shrink-0 rounded-lg border px-2.5 py-1.5 ${now ? "border-zk-blue bg-zk-tint text-zk-text" : done ? "border-zk-border bg-zk-chip/50 text-zk-text2" : "border-zk-border text-zk-muted"}`}
          >
            <span className="block font-semibold">{s.name}</span>
            {who && <span className="block whitespace-nowrap">{who}</span>}
          </li>
        );
      })}
    </ol>
  );
}
