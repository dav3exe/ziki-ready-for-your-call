// Fake data for the mock-up. Names, issues and numbers are made up; the shapes follow what ziki.dev shows.
import { LIVE_ISSUES } from "./live";
import { withReasons } from "./reasons";
import type { Choice, Decision, DecisionKind, Issue, Priority } from "./types";

export const ME = { name: "Dave Tolu", points: 819, weeklyTarget: 500, unread: 27 };
export const PROJECT = "Zedu";
export const COUNTS = { open: 960, in_progress: 72, resolved: 342, all: 1380 };

export const MY_AGENT = { name: "Agent Turbo", state: "Offline", activity: "No recent activity", confirmed: 101 };

const AGENTS = [
  ["Smithy", "Ren Okafor"], ["Stilgar", "Pita Adeyemi"], ["Clerk", "Kemi Bello"], ["Qoder Review 4", "Chi Uzor"],
  ["Divine Reviewer 2", "Divine Eze"], ["Clide Reviewer", "Tobi Lawal"], ["Silencer", "Ife Musa"], ["Derico", "Seun Ade"],
  ["KDB", "Kunle Dada"], ["Ziki Reviewer", "Ziki"], ["Bolu Triager", "Bolu Ojo"], ["Bolu Reviewer", "Bolu Ojo"],
  ["Farmer", "Mike Abu"], ["Denise", "Tomi Bewaji"], ["Personal agent", "Bolu Ojo"], ["Nova", "Ada Nwosu"],
] as const;

/** A run of agent decisions, one per agent in AGENTS order, with made-up times. */
export function decisions(spec: (DecisionKind | [DecisionKind, Priority | string])[], from = 0): Decision[] {
  return spec.map((s, i) => {
    const [kind, extra] = Array.isArray(s) ? s : [s, undefined];
    const [agent, owner] = AGENTS[(from + i) % AGENTS.length];
    return {
      agent,
      owner,
      kind,
      severity: kind === "confirmed" ? ((extra as Priority) ?? "Medium") : undefined,
      reason: kind === "not_ready" ? (extra as string) : undefined,
      at: `Oct ${22 + Math.floor(i / 5)}, ${(i * 3 + 9) % 12 || 12}:${String((i * 17) % 60).padStart(2, "0")} ${i % 2 ? "PM" : "AM"}`,
    };
  });
}

export const desc = (what: string, expected: string, actual: string, why: string) => [
  { heading: "What the issue is", body: what },
  { heading: "Expected", body: expected },
  { heading: "Actual", body: actual },
  { heading: "Why it matters", body: why },
];

/** #190 as the proposal's example of a fix that is not merge-ready: three of its first five reviews say not ready, each with a reason. These votes are made up; "Ziki today" still shows the real ones. */
const NOT_READY_REASONS = [
  "The badge clears in the thread view but not in the channel list.",
  "No test covers the count after a thread is reopened.",
  "The count is read once on open, so it comes back after a refresh.",
];
function remixNotReady(issue: Issue): Issue {
  const plan: DecisionKind[] = ["good_to_merge", "not_ready", "not_ready", "good_to_merge", "not_ready"];
  let seen = 0;
  let reasons = 0;
  const decisions = issue.decisions.map((d) => {
    if (d.kind !== "good_to_merge" && d.kind !== "not_ready") return d;
    const kind = seen < plan.length ? plan[seen] : d.kind;
    seen += 1;
    return kind === "not_ready" ? { ...d, kind, reason: NOT_READY_REASONS[reasons++ % NOT_READY_REASONS.length] } : { ...d, kind, reason: undefined };
  });
  return { ...issue, decisions, liveDecisions: issue.decisions };
}

/** What the agents voted on the Inbox questions. The options and votes are made up; ziki.dev has no such votes. */
const CHOICES: Record<number, [Choice, Choice]> = {
  69: [
    { label: "Display Settings", votes: 3, reason: "Says what the row controls without suggesting fonts or layout." },
    { label: "Theme", votes: 2, reason: "Shorter, and it matches the Dark or Light subtitle." },
  ],
  176: [
    { label: "Hide it on Windows", votes: 4, reason: "Apple sign-in isn't set up there, so the button can only fail." },
    { label: "Keep it", votes: 1, reason: "The login screen stays the same on every platform." },
  ],
};

function prepare(issue: Issue): Issue {
  const remixed = issue.id === 190 ? remixNotReady(issue) : issue;
  const out = withReasons(remixed);
  if (remixed.liveDecisions) out.liveDecisions = withReasons({ ...remixed, decisions: remixed.liveDecisions }).decisions;
  if (CHOICES[issue.id]) out.choices = CHOICES[issue.id];
  return out;
}

export const ISSUES: Issue[] = [
  ...LIVE_ISSUES.map(prepare),
  {
    id: 412,
    title: "Let teams pin a message to the top of a channel",
    type: "Feat", platform: "Web", votes: 9, comments: 0, status: "open", priority: "Low",
    reporter: "Kemi Bello", createdAgo: "2 hours ago", opened: "Oct 26, 8:00 AM",
    inbox: "idea",
    question: "Worth working on?",
    choices: [
      { label: "Build it", votes: 4, reason: "Rules and links get buried in busy channels, and pinning is a common request." },
      { label: "Skip it", votes: 1, reason: "Channel descriptions already hold the key links." },
    ],
    description: desc("Teams want one message always visible in a channel.", "A message can be pinned to the top of a channel by an admin, and unpinned again.", "There is no way to pin. Rules and links scroll away.", "New members miss the rules, and people ask the same questions again."),
    decisions: [],
    conversation: [],
  },
  {
    id: 413,
    title: "Show who is typing in a thread",
    type: "Feat", platform: "Web", votes: 6, comments: 0, status: "open", priority: "Low",
    reporter: "Tobi Lawal", createdAgo: "5 hours ago", opened: "Oct 26, 5:10 AM",
    inbox: "idea",
    question: "Worth working on?",
    choices: [
      { label: "Build it", votes: 5, reason: "Channels already show typing, so threads feel broken without it." },
      { label: "Skip it", votes: 0, reason: "" },
    ],
    description: desc("Threads don't show when someone is typing a reply.", "A small \"Ada is typing\" line appears under the last reply, as it does in channels.", "Nothing shows, so two people often reply at once.", "Duplicate replies and talking over each other."),
    decisions: [],
    conversation: [],
  },
  {
    id: 414,
    title: "Mobile tab bar: align the unread badge for multi-digit counts",
    type: "Design", platform: "Mobile", votes: 5, comments: 0, status: "in_progress", priority: "Low",
    reporter: "Ife Musa", createdAgo: "7 hours ago", opened: "Oct 26, 3:20 AM",
    inbox: "design",
    question: "Which alignment should ship?",
    choices: [
      { label: "Right-align", votes: 5, reason: "Keeps the badge clear of the icon for two and three digits." },
      { label: "Centre it", votes: 0, reason: "" },
    ],
    description: desc("The unread badge on the bottom tab bar overlaps the icon once the count has two digits.", "The badge stays in the top-right corner of the icon for any count.", "It grows to the left and covers the icon.", "People can't tell which tab the badge belongs to."),
    decisions: [],
    conversation: [],
  },
  {
    id: 12,
    title: "Web: channel list doesn't scroll on small laptop screens",
    type: "Fix", platform: "Web", votes: 28, upvoted: true, comments: 3, status: "open", priority: "High",
    reporter: "Dave Tolu", createdAgo: "4 days ago", opened: "Oct 22, 11:00 AM",
    description: desc("On a 13\" laptop the channel list is cut off.", "The list scrolls.", "It's clipped.", "People can't reach their channels."),
    decisions: decisions(["confirmed", ["confirmed", "High"]], 13),
    conversation: [],
  },
  {
    id: 16,
    title: "Desktop \"Invite teammates\" window: the \"Add everyone\" button does nothing",
    type: "Fix", platform: "Desktop", votes: 21, comments: 2, status: "resolved", priority: "Medium",
    reporter: "Dave Tolu", assignee: "Dave Tolu", createdAgo: "10 days ago", opened: "Oct 16, 3:00 PM",
    description: desc("\"Add everyone\" doesn't add anyone.", "Everyone is added to the invite.", "Nothing happens.", "Inviting a team takes ages."),
    decisions: decisions(["confirmed", "claimed", "good_to_merge", "good_to_merge", "good_to_merge", "good_to_merge", "good_to_merge"], 1),
    conversation: [],
  },
];

export const issueById = (id: number) => ISSUES.find((i) => i.id === id);

export const BY_VOTES = [...ISSUES].sort((a, b) => b.votes - a.votes);
