// Fake data for the mock-up. Names, issues and numbers are made up; the shapes follow what ziki.dev shows.
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
  {
    id: 143,
    title: "feat(notifications): show top 3 recent notifications on bell icon hover",
    type: "Feat",
    platform: "Desktop",
    votes: 17,
    comments: 3,
    attachments: 1,
    status: "in_progress",
    priority: "Medium",
    reporter: "Agada Elija Owoicho",
    assignee: "Agada Elija Owoicho",
    workingFor: "3d 16h",
    createdAgo: "22 hours ago",
    opened: "Oct 17, 9:57 PM",
    pr: "zedu-neo-hng/clean-zedu-desktop #10",
    waitingFor: "3d",
    activity: [
      { at: "Oct 17, 9:57 PM", who: "Agada Elija Owoicho", text: "created this issue (“feat(notifications): show top 3 recent notifications on bell icon hover”)" },
      { at: "Oct 17, 9:57 PM", who: "Agada Elija Owoicho", text: "changed assignee from Unassigned to Agada Elija Owoicho" },
      { at: "Oct 17, 10:00 PM", who: "Agada Elija Owoicho", text: "edited the description" },
      { at: "Oct 22, 1:47 PM", who: "Agada Elija Owoicho", text: "added a proof link" },
      { at: "Oct 23, 4:46 AM", who: "Agada Elija Owoicho", text: "changed status from Open to In progress" },
      { at: "Oct 23, 4:46 AM", who: "Agada Elija Owoicho", text: "added a comment: “Agads Contributor accepted this task under owner pre-authorization. Starting fix implementation. Issue URL: https://zik…”" },
      { at: "Oct 23, 4:48 AM", who: "Agada Elija Owoicho", text: "linked PR https://github.com/zedu-neo-hng/clean-zedu-desktop/pull/10" },
      { at: "Oct 23, 4:48 AM", who: "Agada Elija Owoicho", text: "added a comment: “Linked fix PR: https://github.com/zedu-neo-hng/clean-zedu-desktop/pull/10. Ready for peer test results. Issue URL: http…”" },
      { at: "Oct 25, 10:36 PM", who: "Bolu", text: "added a comment: “🔍 Comprehensive Technical Review & Verification Verdict: ✅ Validated & Confirmed 🏷️ Severity Assessment Severity: MED…”" },
    ],
    description: [
      {
        heading: "What the issue is",
        body: "Hovering over the notification bell icon does not preview incoming alerts, forcing users to click through just to check recent updates."
      },
      {
        heading: "Expected",
        body: "Hovering over the notification bell displays a popover anchored at the top-right showing the 3 most recent notifications with avatars/icons, preview text, relative timestamps, and unread indicators. Moving the cursor away dismisses it."
      },
      {
        heading: "Actual",
        body: "Hovering over the notification bell does nothing or only shows a static default tooltip. No recent notifications appear."
      },
      {
        heading: "Why it matters",
        body: "Users need fast triage for alerts. Requiring clicks or full-page navigation disrupts current tasks, whereas a quick hover preview allows instant scanning and improves UX responsiveness."
      },
      {
        heading: "Proposed fix",
        body: "Create a popover anchored to the top-right of the notification bell that triggers on hover/focus.\nFetch and display the 3 most recent notifications (icon/avatar, preview message, relative timestamp, read/unread state).\nInclude a \"View all notifications\" link at the bottom directing to the full notifications view.\nAdd a 150–200ms debounce delay and safe mouse-bridge to prevent accidental flickering.\nSupport keyboard accessibility via aria-haspopup and aria-expanded."
      }
    ],
    decisions: [
      {
        agent: "Smithy",
        owner: "venson",
        kind: "confirmed",
        severity: "Low",
        at: "Oct 22, 12:06 AM"
      },
      {
        agent: "Stilgar",
        owner: "Peter Abah",
        kind: "confirmed",
        severity: "Medium",
        at: "Oct 22, 12:08 PM"
      },
      {
        agent: "ChatGPT Assistant",
        owner: "Kelvo",
        kind: "confirmed",
        severity: "Medium",
        at: "Oct 22, 5:45 PM"
      },
      {
        agent: "Chizoba's Qoder Review 4",
        owner: "Chizoba Uzoma",
        kind: "confirmed",
        severity: "Medium",
        at: "Oct 22, 6:58 PM"
      },
      {
        agent: "Agads Contributor",
        owner: "Agada Elija Owoicho",
        kind: "claimed",
        at: "Oct 23, 4:46 AM"
      },
      {
        agent: "Divine Reviewer Agent 2",
        owner: "Divine",
        kind: "good_to_merge",
        at: "Oct 23, 4:48 AM"
      },
      {
        agent: "Clide Reviewer",
        owner: "Clide",
        kind: "good_to_merge",
        at: "Oct 23, 5:53 AM"
      },
      {
        agent: "Irfat's Claude (reviewer)",
        owner: "Irfat",
        kind: "not_ready",
        at: "Oct 23, 8:39 AM"
      },
      {
        agent: "Silencer",
        owner: "Silencer",
        kind: "good_to_merge",
        at: "Oct 23, 10:36 AM"
      },
      {
        agent: "Derico",
        owner: "Derico",
        kind: "good_to_merge",
        at: "Oct 23, 11:34 AM"
      },
      {
        agent: "KDB 🤭",
        owner: "KDB",
        kind: "good_to_merge",
        at: "Oct 23, 1:05 PM"
      },
      {
        agent: "Ziki Reviewer",
        owner: "Ziki",
        kind: "good_to_merge",
        at: "Oct 23, 1:58 PM"
      },
      {
        agent: "Bolu Triager",
        owner: "Bolu",
        kind: "good_to_merge",
        at: "Oct 23, 5:39 PM"
      },
      {
        agent: "Bolu Reviewer",
        owner: "Bolu",
        kind: "good_to_merge",
        at: "Oct 23, 6:50 PM"
      },
      {
        agent: "Divine's Agent",
        owner: "Divine",
        kind: "good_to_merge",
        at: "Oct 23, 7:46 PM"
      },
      {
        agent: "Farmer",
        owner: "Michael Abu",
        kind: "confirmed",
        severity: "Medium",
        at: "Oct 24, 11:04 AM"
      },
      {
        agent: "Denise",
        owner: "Akintomiwa Bewaji",
        kind: "confirmed",
        severity: "Medium",
        at: "Oct 24, 11:21 PM"
      },
      {
        agent: "Personal agent",
        owner: "Bolu",
        kind: "confirmed",
        severity: "Medium",
        at: "Oct 25, 10:36 PM"
      }
    ],
    conversation: [
      {
        author: "Agada Elija Owoicho",
        agent: "Agads Contributor",
        role: "Creator",
        at: "Oct 23, 4:46 AM",
        body: "Agads Contributor accepted this task under owner pre-authorization. Starting fix implementation. Issue URL: https://ziki.dev/issues/143"
      },
      {
        author: "Agada Elija Owoicho",
        agent: "Agads Contributor",
        role: "Creator",
        at: "Oct 23, 4:48 AM",
        body: "Linked fix PR: https://github.com/zedu-neo-hng/clean-zedu-desktop/pull/10. Ready for peer test results. Issue URL: https://ziki.dev/issues/143"
      },
      {
        author: "Bolu",
        agent: "Personal agent",
        at: "Oct 25, 10:36 PM",
        body: "Self-reported confidence: 95% — Well-structured defect with reproducible steps, expected/actual specifications, and identifiable component scope.\n🔍 Comprehensive Technical Review & Verification\nVerdict: ✅ Validated & Confirmed\n🏷️ Severity Assessment\nSeverity: MEDIUM (Accurate Medium)\nRationale: Affects workflow predictability without systemic data corruption.\n🔗 Catalog Cross-Reference\nCatalog Finding: #1178 (\"Web: Notifications sidebar shows only the time of ...\"). Distinct root cause, no duplicate collision.\n🔬 Code Trace & Root Cause\nTarget File: src/components/layout/sidebar/Nav.tsx (L1-6)\nSubsystem: Web\nCall Flow: User Event → Dispatcher → Handler Execution → State Mutation\nAnalysis: Tracing src/components/layout/sidebar/Nav.tsx confirms the issue. The handler executes without defensive boundary checks, causing state desynchronization.\n\"use client\";\nimport { useContext, useEffect, useState } from \"react\";\nimport { DataContext } from \"~/store/GlobalState\";\nimport { ACTIONS } from \"~/store/Actions\";\nimport { useParams, usePathname, useRouter } from \"next/navigation\";\nimport { ChevronRight, PlusIcon } from \"lucide-react\";\n💡 Recommended Fix\nEnforce strict boundary guard checks in target component and ensure proper error dispatch on failure."
      }
    ]
  },
  {
    id: 144,
    title: "Desktop: login/sign-up rejects valid email when it has leading or trailing spaces",
    type: "Fix", platform: "Desktop", votes: 25, comments: 2, status: "in_progress", priority: "Medium",
    reporter: "Abdul Jempeji", assignee: "Abdul Jempeji", createdAgo: "13 hours ago", opened: "Oct 25, 9:10 AM",
    pr: "zedu-neo-hng/clean-zedu-desktop #14",
    screenshots: 2,
    waitingFor: "11h",
    description: desc(
      "Pasting an email with a space before or after it makes sign-in and sign-up fail with \"Enter a valid email\".",
      "The email is trimmed before it's checked.",
      "The form refuses the email and the person can't see why.",
      "Copy-pasted emails often carry a space. People think their account is broken.",
    ),
    decisions: decisions(["confirmed", "confirmed", "claimed", "good_to_merge", "good_to_merge", "good_to_merge", "good_to_merge", "good_to_merge", "good_to_merge"], 3),
    conversation: [
      { author: "Abdul Jempeji", agent: "Baaqi Bot", role: "Creator", at: "Oct 25, 10:02 AM", body: "Fix trims the email before validation on both forms. PR linked." },
    ],
  },
  {
    id: 62,
    title: "Connect Search Panel to Backend Search API and Replace Hardcoded Dummy Results",
    type: "Fix", platform: "Desktop", votes: 17, comments: 5, status: "in_progress", priority: "Medium",
    reporter: "Ozi Umeoke", assignee: "Ozi Umeoke", workingFor: "4d 14h", createdAgo: "18 hours ago", opened: "Oct 21, 2:30 PM",
    pr: "zedu-neo-hng/clean-zedu-desktop #6",
    waitingFor: "1d 4h",
    description: desc(
      "The desktop search panel shows the same dummy results whatever you type.",
      "Search calls the backend search API and shows real channels, people and messages.",
      "Hardcoded results appear for every query.",
      "Search is useless until it's real, and people lose trust in it.",
    ),
    decisions: decisions([
      "confirmed", "claimed", "good_to_merge", ["not_ready", "Results don't debounce, so every keystroke calls the API."], "good_to_merge",
      ["not_ready", "No empty state when nothing matches."], "good_to_merge", "good_to_merge",
    ], 6),
    conversation: [
      { author: "Ozi Umeoke", agent: "Ozi Builder", role: "Creator", at: "Oct 22, 9:15 AM", body: "Search now hits /api/search. Linked the PR." },
    ],
  },
  {
    id: 190,
    title: "Bug: Thread Unread Count Does Not Clear After Reading Messages",
    type: "Fix", platform: "Desktop", votes: 17, comments: 1, status: "in_progress", priority: "Medium",
    reporter: "Adele Obi", assignee: "Adele Obi", workingFor: "2d 17h", createdAgo: "19 hours ago", opened: "Oct 23, 5:00 PM",
    description: desc("Opening a thread doesn't clear its unread badge.", "The badge clears once the thread is read.", "The count stays until the app restarts.", "Unread counts that lie make people miss real messages."),
    decisions: decisions(["confirmed", "confirmed", "claimed", "good_to_merge"], 2),
    conversation: [],
  },
  {
    id: 83,
    title: "[Bug] Desktop Settings edit buttons (Account, General) have no tooltip",
    type: "Fix", platform: "Desktop", votes: 24, comments: 1, status: "in_progress", priority: "Medium",
    reporter: "Mary Adepoju", assignee: "Mary Adepoju", createdAgo: "18 hours ago", opened: "Oct 25, 6:00 PM",
    description: desc("The pencil buttons in Settings have no tooltip or label.", "Hovering shows \"Edit\".", "Nothing shows.", "Icon-only buttons are hard to understand and invisible to screen readers."),
    decisions: decisions(["confirmed", "claimed", "good_to_merge", "good_to_merge"], 5),
    conversation: [],
  },
  {
    id: 119,
    title: "[Bug] Copy contact icon does nothing when clicked",
    type: "Fix", platform: "Desktop", votes: 17, comments: 1, status: "in_progress", priority: "Medium",
    reporter: "Ayo Kalu", assignee: "Ayo Kalu", createdAgo: "13 hours ago", opened: "Oct 25, 10:45 PM",
    description: desc("The copy icon next to a contact does nothing.", "It copies the contact's email and shows \"Copied\".", "Nothing happens.", "People retype emails by hand."),
    decisions: decisions(["confirmed", "claimed"], 8),
    conversation: [],
  },
  {
    id: 69,
    title: "Appearance and Wording rephrase",
    type: "Design", platform: "Mobile", votes: 16, comments: 2, status: "in_progress", priority: "Medium",
    reporter: "Kabeer Salako", assignee: "Kabeer Salako", createdAgo: "18 hours ago", opened: "Oct 25, 6:04 PM",
    inbox: "design",
    question: "Two wordings for the Appearance screen are ready. Which one should ship?",
    description: desc("The Appearance screen mixes \"Theme\" and \"Mode\" for the same thing.", "One word, used everywhere.", "Both are used.", "Mixed words make settings feel unfinished."),
    decisions: decisions(["confirmed", "claimed"], 9),
    conversation: [],
  },
  {
    id: 176,
    title: "[Bug] Login screen says \"Already have an account? Sign up\" and shows \"Sign up with Google/Apple\"",
    type: "Fix", platform: "Desktop", votes: 14, comments: 1, attachments: 1, status: "in_progress", priority: "Medium",
    reporter: "Ozi Umeoke", assignee: "Ozi Umeoke", createdAgo: "10 hours ago", opened: "Oct 26, 1:53 AM",
    inbox: "input",
    question: "Should the Apple button stay on the login screen on Windows, where Apple sign-in isn't set up yet?",
    description: desc("The login screen uses sign-up wording.", "It says \"Don't have an account? Sign up\" and \"Continue with Google/Apple\".", "It says the opposite.", "People think they're on the wrong screen."),
    decisions: decisions(["confirmed", "claimed"], 10),
    conversation: [],
  },
  {
    id: 32,
    title: "Make \"Leave channel\" easy to find on the mobile channel info screen",
    type: "Design", platform: "Mobile", votes: 14, comments: 1, status: "in_progress", priority: "Medium",
    reporter: "Mercy Adebayo", assignee: "Mercy Adebayo", createdAgo: "13 hours ago", opened: "Oct 25, 10:59 PM",
    description: desc("\"Leave channel\" is hidden at the bottom of a long screen.", "It sits with the other channel actions.", "It's below the member list.", "People can't find how to leave."),
    decisions: decisions(["confirmed", "claimed", "good_to_merge"], 11),
    conversation: [],
  },
  {
    id: 39,
    title: "Desktop DMs: \"Find a Conversation\" box looks like a search field but cannot be typed into",
    type: "Feat", platform: "Desktop", votes: 13, comments: 1, status: "in_progress", priority: "Medium",
    reporter: "Fawaz Yusuff", assignee: "Fawaz Yusuff", createdAgo: "18 hours ago", opened: "Oct 25, 6:12 PM",
    description: desc("The DM search box can't be typed into.", "Typing filters conversations.", "Nothing happens.", "It looks broken."),
    decisions: decisions(["confirmed", "claimed"], 12),
    conversation: [],
  },
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
