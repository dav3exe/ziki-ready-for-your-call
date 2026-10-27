import { BadgeCheck, ClipboardCheck, FlaskConical, GitMerge, Rocket, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import type { Issue } from "@/lib/types";
import Tip from "./tip";
import type { Verdict } from "@/lib/verdict";

// Who acts at each step in the proposal. These are Ziki's own roles: reviewers confirm and test, a Merger agent approves a fix,
// an Admin Merger agent performs the merge. A person steps in only at the sign-off, and only when the agents are contested.
const STEPS: { name: string; who: string; icon: LucideIcon }[] = [
  { name: "Confirm", who: "Reviewers", icon: ShieldCheck },
  { name: "Fix", who: "Contributor agent", icon: Wrench },
  { name: "Review", who: "5 reviewers", icon: ClipboardCheck },
  { name: "Sign-off", who: "Merger agent approves", icon: BadgeCheck },
  { name: "Merge", who: "Admin Merger agent", icon: GitMerge },
  { name: "Live check", who: "2 agents test live", icon: FlaskConical },
  { name: "Live", who: "Shipped", icon: Rocket },
];

/** Which step an issue is at. */
function stepOf(issue: Issue, verdict: Verdict | null): number {
  if (issue.escalation?.kind === "live_failed") return 5;
  if (issue.escalation?.kind === "merge_blocked") return 4;
  if (issue.status === "resolved") return issue.live ? 6 : 5;
  if (verdict) return verdict.route === "person" ? 3 : verdict.route === "merger" ? 4 : 2;
  if (issue.status === "open") return 0;
  return issue.decisions.some((d) => d.kind === "good_to_merge" || d.kind === "not_ready") ? 2 : 1;
}

/** The pipeline as one slim row of icons joined by a line. Only the current step is spelled out; point at any icon for its name and who acts. */
export default function PipelineStrip({ issue, verdict }: { issue: Issue; verdict: Verdict | null }) {
  const at = stepOf(issue, verdict);
  const waitingOnYou = verdict?.needsPerson === true;
  const current = STEPS[at];
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      <ol aria-label="Pipeline" className="flex min-w-0 flex-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const now = i === at;
          const done = i < at;
          return (
            <li key={s.name} className="relative flex min-w-0 flex-1 flex-col items-center gap-1">
              {/* The line runs from this icon's centre to the next one's, behind the icons. */}
              {i < STEPS.length - 1 && <span aria-hidden="true" className={`absolute top-3.5 left-1/2 h-0.5 w-full -translate-y-1/2 ${done ? "bg-zk-ok-fg/40" : "bg-zk-divider"}`} />}
              <Tip text={`${s.name} · ${s.who}`} align={i === 0 ? "start" : i === STEPS.length - 1 ? "end" : "center"}>
              <span
                aria-current={now ? "step" : undefined}
                className={`relative flex size-7 shrink-0 items-center justify-center rounded-full ${
                  now ? "bg-zk-blue text-white ring-4 ring-zk-blue/20" : done ? "bg-zk-ok-bg text-zk-ok-fg" : "border border-dashed border-zk-border bg-zk-surface text-zk-muted"
                }`}
              >
                <Icon className="size-3.5" />
              </span>
              </Tip>
              <span className={`max-w-full truncate text-[10px] leading-none ${now ? "font-bold text-zk-text" : "text-zk-muted"}`}>{s.name}</span>
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-zk-text2 sm:w-56 sm:shrink-0 sm:text-right">{waitingOnYou ? (at === 3 ? "Waiting on you, then the Merger agent" : "Waiting on you") : current.who}</p>
    </div>
  );
}
