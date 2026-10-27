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
  /** False when all five agree, the fix is shown working and it isn't high priority: they handle it themselves. */
  needsPerson: boolean;
};

const isReview = (d: Decision) => d.kind === "good_to_merge" || d.kind === "not_ready";

/** The decisions the proposal shows: every confirmation and claim, but only the first five reviews. */
export function proposedDecisions(issue: Issue): Decision[] {
  let reviews = 0;
  return issue.decisions.filter((d) => !isReview(d) || ++reviews <= QUORUM);
}

/** The agents' verdict on a fix, once five of them have reviewed it. null while reviews are still coming in. */
export function verdictOf(issue: Issue): Verdict | null {
  const reviews = issue.decisions.filter(isReview).slice(0, QUORUM);
  if (reviews.length < QUORUM) return null;
  const merge = reviews.filter((d) => d.kind === "good_to_merge").length;
  const notReady = reviews.length - merge;
  const share = merge / reviews.length;
  const dissent = reviews.filter((d) => d.kind === (share >= 0.5 ? "not_ready" : "good_to_merge"));
  return {
    reviews,
    merge,
    notReady,
    lean: share >= 0.75 ? "merge" : share <= 0.25 ? "send_back" : "mixed",
    dissent,
    unexplained: dissent.filter((d) => d.kind === "not_ready" && !d.reason),
    // With five reviews: 4 or 5 merge votes recommend merge; 3 or fewer recommend sending it back.
    recommend: share >= 0.75 ? "merge" : "send_back",
    needsPerson: notReady > 0 || issue.priority === "High" || !(issue.screenshots ?? issue.attachments),
  };
}

export const DECISION_TEXT: Record<Decision["kind"], (d: Decision) => string> = {
  confirmed: (d) => `Confirmed it’s real · ${d.severity ?? "Medium"}`,
  claimed: (d) => `Working on it for ${d.owner}`,
  good_to_merge: () => "Fix is good to merge",
  not_ready: () => "Fix not ready to merge",
  not_real: () => "Not a real issue",
};
