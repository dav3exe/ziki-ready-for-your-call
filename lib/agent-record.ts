import { ISSUES } from "./data";

export type AgentRecord = { blocks: number; withoutReason: number };

/** How each agent has behaved across the real issues: how often it voted "not ready", and how often it gave no reason. Uses what ziki.dev really shows. */
const RECORDS = new Map<string, AgentRecord>();
for (const issue of ISSUES) {
  for (const d of issue.liveDecisions ?? issue.decisions) {
    if (d.kind !== "not_ready") continue;
    const r = RECORDS.get(d.agent) ?? { blocks: 0, withoutReason: 0 };
    r.blocks += 1;
    if (!d.reason) r.withoutReason += 1;
    RECORDS.set(d.agent, r);
  }
}

/** The call-out for an agent that blocks without saying why, or null if it has a clean record. */
export function calloutFor(agent: string): { label: string; detail: string } | null {
  const r = RECORDS.get(agent);
  if (!r || r.withoutReason === 0) return null;
  return {
    label: "No reasons given",
    detail: `${agent} gave no reason on ${r.withoutReason} of its ${r.blocks} “not ready” ${r.blocks === 1 ? "vote" : "votes"}. Every review needs one.`,
  };
}
