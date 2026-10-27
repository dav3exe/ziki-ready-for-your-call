// Fake data for the mock-up. Names, issues and numbers are made up; the shapes follow what ziki.dev shows.
import { LIVE_ISSUES } from "./live";
import type { Decision, DecisionKind, Issue, Priority } from "./types";

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

export const ISSUES: Issue[] = [
  ...LIVE_ISSUES,
  {
    id: 412,
    title: "Let teams pin a message to the top of a channel",
    type: "Feat", platform: "Web", votes: 9, comments: 0, status: "open", priority: "Low",
    reporter: "Kemi Bello", createdAgo: "2 hours ago", opened: "Oct 26, 8:00 AM",
    inbox: "idea",
    question: "A new idea from an agent. Worth working on?",
    description: desc("Teams want one message always visible in a channel.", "Pin a message to the top.", "No way to pin.", "Rules and links get buried."),
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
