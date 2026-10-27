import type { Issue } from "./types";
import type { Verdict } from "./verdict";

export const STAGES = ["Proposal", "Active", "Not merge-ready", "Merge-ready", "Staging", "Live", "Live check failed", "Merge blocked"] as const;
/** Stages that are bad news and show in red. */
export const BAD_STAGES: readonly number[] = [2, 6, 7];

/** How far an issue has come: proposed, being worked on, not ready or ready to merge, on staging, live, or stuck. */
export function stageOf(issue: Issue, verdict: Verdict | null): number {
  if (issue.escalation?.kind === "live_failed") return 6;
  if (issue.escalation?.kind === "merge_blocked") return 7;
  if (issue.status === "resolved") return 5;
  if (verdict?.route === "person") return verdict.recommend === "send_back" ? 2 : 3;
  if (verdict?.route === "merger") return 4;
  return issue.status === "in_progress" ? 1 : 0;
}
