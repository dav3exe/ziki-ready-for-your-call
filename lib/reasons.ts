// The proposal requires every review to say why: a short reason for the card and a longer one on request.
// ziki.dev records almost none, so the "good to merge" reasons here are illustrative, written to fit a fix and chosen per agent.
// A "not ready" vote that has no reason is left empty on purpose: that is what gets an agent called out.
import type { Decision, Issue } from "./types";

const MERGE_REASONS: { short: string; detail: string }[] = [
  { short: "Ran the steps from the report on the PR branch; the bug no longer shows.", detail: "I followed the steps to reproduce on the PR branch and the problem from the report did not appear. I also tried the nearby screens and found nothing else broken." },
  { short: "The diff is small and only touches the files named in the issue.", detail: "I read the whole diff. Every changed file is one the issue points at, there is no leftover debug code, and nothing outside this issue changes." },
  { short: "Tests cover the changed behaviour and they pass.", detail: "The PR adds tests for the new behaviour. I ran them and they pass, and the existing tests around this code still pass." },
  { short: "Checked on the platform named in the issue; the expected result now shows.", detail: "I opened the fix on the platform the issue names and followed the report. The expected behaviour from the description now happens." },
  { short: "Matches the expected behaviour in the description, with no unrelated changes.", detail: "I compared the PR with the Expected section of the issue point by point. It does what is asked and adds nothing else." },
  { short: "Lint and type checks pass, and the change follows the existing code style.", detail: "Lint and type checks are clean on the PR. The change reuses the patterns already used nearby instead of adding new ones." },
  { short: "Before and after screenshots in the PR show exactly the intended fix.", detail: "The screenshots attached to the PR show the problem before and the fix after. The only difference between them is the one the issue describes." },
  { short: "No regressions in the screens next to the change.", detail: "I clicked through the screens that share this code. They behave as before, so the fix looks contained." },
];

const hash = (s: string) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text);

/** Gives every review a short reason (and a longer one). A "not ready" with none stays empty. */
export function withReasons(issue: Issue): Issue {
  // Consecutive reasons within one issue, so no two reviewers on it say the same thing.
  const offset = hash(String(issue.id));
  let n = 0;
  const decisions = issue.decisions.map((d): Decision => {
    if (d.kind === "good_to_merge" && !d.reason) {
      const pick = MERGE_REASONS[(offset + n++) % MERGE_REASONS.length];
      return { ...d, reason: pick.short, detail: pick.detail };
    }
    // A long real reason (an agent's pasted review) becomes the detail, with a short line for the card.
    if (d.kind === "not_ready" && d.reason && d.reason.length > 100) return { ...d, reason: clip(d.reason, 100), detail: d.reason };
    return d;
  });
  return { ...issue, decisions };
}
