"use client";

import { BULK } from "@/lib/bulk";
import { useCalls } from "@/lib/calls";
import { ISSUES } from "@/lib/data";
import { useDemoLoad } from "@/lib/demo-load";
import { useView } from "@/lib/view";
import { choiceOf } from "@/lib/choice";
import { verdictOf } from "@/lib/verdict";

/** Everything in the Inbox that still needs a person: questions, contested fixes waiting on a decision, design feedback and ideas. Fixes the agents handled don't count. */
export default function InboxCount() {
  const calls = useCalls();
  const today = useView() === "current";
  const issues = useDemoLoad() ? [...ISSUES, ...BULK] : ISSUES;
  const waiting = issues.filter((i) => (i.inbox && (!choiceOf(i) || (choiceOf(i)!.needsPerson && !calls[i.id]))) || (i.status === "in_progress" && verdictOf(i)?.needsPerson && !calls[i.id])).length;
  // Ziki today shows 0: it has no place for finished fixes waiting on a person.
  return <>{today ? 0 : waiting}</>;
}
