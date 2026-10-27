import type { Issue } from "./types";

/** One line on what an issue is about: the first sentence of its summary, cut to fit a card. */
export function summaryOf(issue: Issue, max = 110): string {
  const part = issue.description.find((p) => /summary|what the issue|what happens|^description$/i.test(p.heading) && p.body.trim()) ?? issue.description.find((p) => p.body.trim().length > 40);
  const flat = (part?.body ?? "").replace(/\s+/g, " ").trim();
  const sentence = flat.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? flat;
  return sentence.length > max ? `${sentence.slice(0, max).replace(/\s+\S*$/, "")}…` : sentence;
}
