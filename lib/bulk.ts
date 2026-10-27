// 150 made-up issues, to show the Inbox at the size Mark asked about (100 to 200 items). Off by default;
// "Load 150 demo issues" in the Inbox turns them on. Most are fixes the agents agree on, so they never reach a person.
import { decisions, desc, ISSUES } from "./data";
import type { DecisionKind, InboxTab, Issue, IssueType, Platform } from "./types";

const PEOPLE = ["Ada Nwosu", "Seun Ade", "Kemi Bello", "Tobi Lawal", "Ife Musa", "Chi Uzor", "Mike Abu", "Ren Okafor", "Pita Adeyemi", "Divine Eze"];
const TITLES = [
  "Unread badge doesn't clear after reading", "Avatar upload fails on large images", "Typing indicator stays after sending", "Emoji picker closes on scroll",
  "Search ignores accented letters", "Channel list flickers on resize", "Mute toggle resets after restart", "Invite link copies with a trailing space",
  "Date separators show the wrong day", "Draft message lost when switching channels", "Notification sound plays twice", "Profile card cut off on small screens",
  "File preview shows a blank frame", "Reaction count off by one", "Pinned messages don't scroll into view", "Sidebar collapses on window focus",
  "Link preview never loads", "Read receipts show for muted channels", "Settings page loses scroll position", "Tooltip covers the button it describes",
];
const KINDS: IssueType[] = ["Fix", "Fix", "Fix", "Feat", "Design"];
const PLATFORMS: Platform[] = ["Desktop", "Mobile", "Web"];
const WAITS = ["2h", "5h", "9h", "14h", "1d 2h", "1d 20h", "2d 6h", "3d"];

const REASONS = [
  "Doesn't handle an empty state.",
  "Breaks on a slow connection.",
  "No test covers the new branch.",
  "Changes the keyboard order.",
];

function bulkIssue(n: number): Issue {
  const id = 1001 + n;
  const slot = n % 10;
  const title = `${TITLES[n % TITLES.length]}${n >= TITLES.length ? ` (${Math.floor(n / TITLES.length) + 1})` : ""}`;
  const person = PEOPLE[n % PEOPLE.length];
  const type = KINDS[n % KINDS.length];
  const platform = PLATFORMS[n % PLATFORMS.length];
  const base = {
    id,
    title,
    type,
    platform,
    votes: 3 + ((n * 7) % 24),
    comments: n % 4,
    priority: n % 17 === 0 ? ("High" as const) : n % 3 === 0 ? ("Low" as const) : ("Medium" as const),
    reporter: person,
    assignee: person,
    createdAgo: `${1 + (n % 20)} hours ago`,
    opened: `Oct ${20 + (n % 7)}, ${1 + (n % 11)}:${String((n * 13) % 60).padStart(2, "0")} PM`,
    description: desc(`${title}.`, "It works the first time.", "It doesn't.", "People notice and lose trust."),
    conversation: [],
  };

  // Slots 0 to 6: the agents agree and the fix is shown working. Slots 7 and 8: they disagree. Slot 9: an agent has a question.
  if (slot <= 6) {
    const merges = 5 + (n % 4);
    const spec: DecisionKind[] = ["confirmed", "claimed", ...Array.from({ length: merges }, (): DecisionKind => "good_to_merge")];
    return { ...base, status: "in_progress", screenshots: 1 + (n % 3), pr: `zedu-neo-hng/clean-zedu-desktop #${20 + n}`, decisions: decisions(spec, n) };
  }
  if (slot <= 8) {
    const spec: (DecisionKind | [DecisionKind, string])[] = ["confirmed", "claimed", "good_to_merge", "good_to_merge", "good_to_merge", "good_to_merge", n % 3 === 0 ? "not_ready" : ["not_ready", REASONS[n % REASONS.length]]];
    if (n % 2) spec.push(["not_ready", REASONS[(n + 1) % REASONS.length]]);
    return { ...base, status: "in_progress", screenshots: n % 4 === 0 ? 0 : 1, pr: `zedu-neo-hng/clean-zedu-desktop #${20 + n}`, waitingFor: WAITS[n % WAITS.length], decisions: decisions(spec, n) };
  }
  const inbox: InboxTab = n % 30 === 9 ? "idea" : n % 20 === 9 ? "design" : "input";
  const question =
    inbox === "idea" ? "A new idea from an agent. Worth working on?" : inbox === "design" ? "Two designs are ready. Which one should ship?" : "Which behaviour do you want here?";
  return { ...base, status: inbox === "idea" ? "open" : "in_progress", inbox, question, decisions: decisions(["confirmed", "claimed"], n) };
}

export const BULK: Issue[] = Array.from({ length: 150 }, (_, n) => bulkIssue(n));

/** The hand-made issues plus the 150 demo ones, for pages that open any issue by id. */
export const ALL_ISSUES: Issue[] = [...ISSUES, ...BULK];
export const findIssue = (id: number) => ALL_ISSUES.find((i) => i.id === id);
