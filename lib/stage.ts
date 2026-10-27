import type { Issue } from "./types";
import type { Verdict } from "./verdict";

export const STAGES = ["Proposal", "Active", "Not merge-ready", "Merge-ready", "Staging", "Live"] as const;
export const NOT_READY_STAGE = 2;

/** How far an issue has come: proposed, being worked on, not ready or ready to merge, on staging, live. */
export function stageOf(issue: Issue, verdict: Verdict | null): number {
  if (issue.status === "resolved") return STAGES.length - 1;
  if (verdict) return verdict.recommend === "send_back" ? NOT_READY_STAGE : verdict.needsPerson ? 3 : 4;
  return issue.status === "in_progress" ? 1 : 0;
}
