import type { Issue } from "./types";
import type { Verdict } from "./verdict";

export const STAGES = ["Proposal", "Active", "Merge-ready", "Staging", "Live"] as const;

/** How far an issue has come: proposed, being worked on, ready to merge, on staging, live. */
export function stageOf(issue: Issue, verdict: Verdict | null): number {
  if (issue.status === "resolved") return STAGES.length - 1;
  if (verdict) return verdict.needsPerson ? 2 : 3;
  return issue.status === "in_progress" ? 1 : 0;
}
