"use client";

import { BULK } from "@/lib/bulk";
import { useCalls } from "@/lib/calls";
import { ISSUES } from "@/lib/data";
import { useDemoLoad } from "@/lib/demo-load";
import { verdictOf } from "@/lib/verdict";

/** Everything in the Inbox that still needs a person: questions, contested fixes waiting on a decision, design feedback and ideas. Fixes the agents handled don't count. */
export default function InboxCount() {
  const calls = useCalls();
  const issues = useDemoLoad() ? [...ISSUES, ...BULK] : ISSUES;
  const waiting = issues.filter((i) => i.inbox || (i.status === "in_progress" && verdictOf(i)?.needsPerson && !calls[i.id])).length;
  return <>{waiting}</>;
}
