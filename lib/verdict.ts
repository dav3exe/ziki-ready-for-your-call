import type { Decision, Issue } from "./types";

/** Reviews a fix gets, no more. Once five agents have reviewed it, Ziki stops asking agents and the verdict is final. */
export const QUORUM = 5;

export type Verdict = {
  /** The five reviews the verdict is built from, in the order they came in. */
  reviews: Decision[];
  merge: number;
  notReady: number;
  /** "merge" when most reviewers agree it's good, "mixed" when it's close. */
  lean: "merge" | "mixed" | "send_back";
  dissent: Decision[];
  /** Not-ready reviews that gave no reason. */
  unexplained: Decision[];
  /** What the agents would do: merge it, or send it back to the assignee. */
  recommend: "merge" | "send_back";
  /** Who deals with it next. A person only when a reviewer has explained a block, or something went wrong or is too sensitive for agents alone. */
  route: "person" | "merger" | "reviewer" | "assignee";
  /** True when route is "person". */
  needsPerson: boolean;
  /** For the reviewer and assignee routes: who the agents are waiting on. */
  waitingOn?: string;
};

const isReview = (d: Decision) => d.kind === "good_to_merge" || d.kind === "not_ready";

/** The agent decisions the proposal shows: never more than five. Once a fix is being reviewed, those are the first five reviews; before that, the first five confirmations. */
export function proposedDecisions(issue: Issue): Decision[] {
  const reviews = issue.decisions.filter(isReview).slice(0, QUORUM);
  return reviews.length > 0 ? reviews : issue.decisions.slice(0, QUORUM);
}

/** The agents' verdict on a fix, once five of them have reviewed it. null while reviews are still coming in. */
export function verdictOf(issue: Issue): Verdict | null {
  const reviews = issue.decisions.filter(isReview).slice(0, QUORUM);
  if (reviews.length < QUORUM) return null;
  const merge = reviews.filter((d) => d.kind === "good_to_merge").length;
  const notReady = reviews.length - merge;
  const share = merge / reviews.length;
  const dissent = reviews.filter((d) => d.kind === (share >= 0.5 ? "not_ready" : "good_to_merge"));
  const blocks = reviews.filter((d) => d.kind === "not_ready");
  const explained = blocks.filter((d) => d.reason);
  const silent = blocks.find((d) => !d.reason);
  // A "not ready" with no reason is not a block: the agent is asked to explain and a person isn't pulled in.
  const route: Verdict["route"] = issue.escalation || explained.length > 0 ? "person" : silent ? "reviewer" : !(issue.screenshots ?? issue.attachments) ? "assignee" : "merger";
  const escalated = issue.escalation ? (issue.escalation.recommend === "approve" ? "merge" : "send_back") : null;
  return {
    reviews,
    merge,
    notReady,
    lean: share >= 0.75 ? "merge" : share <= 0.25 ? "send_back" : "mixed",
    dissent,
    unexplained: dissent.filter((d) => d.kind === "not_ready" && !d.reason),
    // With five reviews: 4 or 5 merge votes recommend merge; 3 or fewer recommend sending it back.
    recommend: escalated ?? (share >= 0.75 ? "merge" : "send_back"),
    route,
    needsPerson: route === "person",
    waitingOn: route === "reviewer" ? silent?.agent : route === "assignee" ? issue.assignee : undefined,
  };
}

export const DECISION_TEXT: Record<Decision["kind"], (d: Decision) => string> = {
  confirmed: (d) => `Confirmed it’s real · ${d.severity ?? "Medium"}`,
  claimed: (d) => `Working on it for ${d.owner}`,
  good_to_merge: () => "Fix is good to merge",
  not_ready: () => "Fix not ready to merge",
  not_real: () => "Not a real issue",
};
