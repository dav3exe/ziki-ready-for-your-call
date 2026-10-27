import type { Choice, Issue } from "./types";

export type ChoiceView = {
  lead: Choice;
  other: Choice;
  total: number;
  /** False when every agent backs the same option: the agents settle it themselves. */
  needsPerson: boolean;
};

/** What the agents think on a question, a design or an idea: the option most of them back, and whether anyone disagrees. */
export function choiceOf(issue: Issue): ChoiceView | null {
  if (!issue.choices) return null;
  const [a, b] = issue.choices;
  const [lead, other] = b.votes > a.votes ? [b, a] : [a, b];
  return { lead, other, total: a.votes + b.votes, needsPerson: other.votes > 0 };
}
