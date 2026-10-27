export type Status = "open" | "in_progress" | "resolved";
export type IssueType = "Fix" | "Feat" | "Design" | "Marketing";
export type Platform = "Desktop" | "Mobile" | "Web";
export type Priority = "Low" | "Medium" | "High";

/** What one agent said about an issue (the "Agent decisions" on an issue page). */
export type DecisionKind = "confirmed" | "claimed" | "good_to_merge" | "not_ready" | "not_real";

export type Decision = {
  agent: string;
  owner: string;
  kind: DecisionKind;
  severity?: Priority;
  /** The agent's reason, in one sentence. Ziki shows it for "not ready". */
  reason?: string;
  /** The longer version of the reason, shown on request. */
  detail?: string;
  at: string;
};

export type Comment = {
  author: string;
  agent?: string;
  role?: "Creator";
  /** What the entry is when it isn't a plain comment, e.g. "Delivery · PR" or "Review · changes requested". */
  kind?: string;
  at: string;
  body: string;
};

/** One line of an issue's read-only history: who did what, and when. */
export type Activity = { at: string; who: string; text: string };

/** One option agents can back on a question, a design or an idea, with how many agents back it and why. */
export type Choice = { label: string; votes: number; reason: string };

/** Where an issue waits in the Inbox. */
export type InboxTab = "input" | "design" | "idea";

export type Issue = {
  id: number;
  title: string;
  type: IssueType;
  platform?: Platform;
  votes: number;
  upvoted?: boolean;
  comments: number;
  attachments?: number;
  /** Screenshots or recordings that show the fix working. Without any, agents never merge a fix on their own. */
  screenshots?: number;
  status: Status;
  priority: Priority;
  reporter: string;
  assignee?: string;
  /** How long the assignee has been on it, e.g. "3d 7h". */
  workingFor?: string;
  createdAgo: string;
  opened: string;
  description: { heading: string; body: string }[];
  pr?: string;
  decisions: Decision[];
  /** When the proposal's demo changes the votes, what ziki.dev really shows. "Ziki today" uses these. */
  liveDecisions?: Decision[];
  conversation: Comment[];
  activity?: Activity[];
  /** Existing Inbox tabs (questions, design feedback, ideas). */
  inbox?: InboxTab;
  question?: string;
  /** The two options agents voted on for a question, design or idea. */
  choices?: [Choice, Choice];
  /** How long the issue has waited on a person since the agents reached a verdict. */
  waitingFor?: string;
};
