"use client";

import Link from "next/link";
import { Bot, ChevronDown, Inbox, Settings } from "lucide-react";
import { useState } from "react";
import { BULK } from "@/lib/bulk";
import { useCalls } from "@/lib/calls";
import { MY_AGENT } from "@/lib/data";
import { setDemoLoad, useDemoLoad } from "@/lib/demo-load";
import type { InboxTab, Issue } from "@/lib/types";
import { verdictOf } from "@/lib/verdict";
import CallCard from "./call-card";
import ReviewPill from "./review-pill";

const TABS: { tab: InboxTab; label: string; empty: string }[] = [
  { tab: "input", label: "Need your input", empty: "Nothing needs you. Agents are handling the rest." },
  { tab: "design", label: "Design feedback needed", empty: "No design is waiting on feedback." },
  { tab: "idea", label: "New ideas", empty: "No new ideas right now." },
];

const FIRST = 5;

/** A titled group that shows its first few items and the rest on request, so 100 items stay scannable. */
function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode[] }) {
  const [all, setAll] = useState(false);
  if (count === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold tracking-wider text-zk-text2 uppercase">
        {title} <span className="ml-1 rounded-md bg-zk-chip px-1.5 font-mono text-zk-text2">{count}</span>
      </h2>
      {all ? children : children.slice(0, FIRST)}
      {children.length > FIRST && (
        <button type="button" onClick={() => setAll(!all)} className="cursor-pointer text-sm font-semibold text-zk-accent">
          {all ? "Show fewer" : `Show ${children.length - FIRST} more`}
        </button>
      )}
    </section>
  );
}

/** Fixes the agents agreed on and merged without a person: one line, with the list a click away. */
function Digest({ issues }: { issues: Issue[] }) {
  const [open, setOpen] = useState(false);
  if (issues.length === 0) return null;
  return (
    <section className="rounded-xl border border-zk-border bg-zk-surface">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="text-sm">
          <b className="text-zk-text">{issues.length} {issues.length === 1 ? "fix" : "fixes"} handled by agents.</b>{" "}
          <span className="text-zk-text2">All agreed and showed it working. Nothing needed from you.</span>
        </span>
        <ChevronDown className={`size-4 shrink-0 text-zk-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="max-h-80 divide-y divide-zk-divider overflow-y-auto border-t border-zk-divider">
          {issues.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
              <Link href={`/issues/${i.id}`} className="min-w-0 truncate text-zk-text hover:text-zk-accent">
                <span className="text-zk-muted">#{i.id}</span> {i.title}
              </Link>
              <ReviewPill issue={i} verdict={verdictOf(i)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Ziki's Inbox. Agents handle the fixes they agree on; "Need your input" holds only what is contested or has a question, grouped by why. */
export default function InboxView({ issues }: { issues: Issue[] }) {
  const calls = useCalls();
  const load = useDemoLoad();
  const [tab, setTab] = useState<InboxTab>("input");

  const everything = load ? [...issues, ...BULK] : issues;
  const withVerdict = everything.filter((i) => i.status === "in_progress" && verdictOf(i));
  const contested = withVerdict.filter((i) => verdictOf(i)!.needsPerson);
  const handled = withVerdict.filter((i) => !verdictOf(i)!.needsPerson && !calls[i.id]);
  // Decided fixes stay on screen (with Undo) after the undecided ones; only undecided ones count.
  const waiting = contested.filter((i) => !calls[i.id]);
  const decided = withVerdict.filter((i) => calls[i.id]);
  const lists: Record<InboxTab, Issue[]> = {
    input: everything.filter((i) => i.inbox === "input"),
    design: everything.filter((i) => i.inbox === "design"),
    idea: everything.filter((i) => i.inbox === "idea"),
  };
  const current = TABS.find((t) => t.tab === tab)!;
  const shown = tab === "input" ? contested.length + decided.length + lists.input.length + handled.length : lists[tab].length;

  const questionCard = (issue: Issue) => (
    <Link key={issue.id} href={`/issues/${issue.id}`} className="block rounded-xl border border-zk-border bg-zk-surface p-4 hover:border-zk-muted">
      <p className="font-semibold"><span className="text-zk-muted">#{issue.id}</span> {issue.title}</p>
      {issue.question && <p className="mt-1.5 text-sm text-zk-text2">{issue.question}</p>}
    </Link>
  );
  const fixCard = (issue: Issue) => <CallCard key={issue.id} issue={issue} verdict={verdictOf(issue)!} />;

  return (
    <div className="space-y-5">
      <div className="grid overflow-hidden rounded-xl border border-zk-border md:grid-cols-[1fr_280px]">
        <div className="flex gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zk-tint text-zk-accent"><Inbox className="size-5" /></span>
          <div className="text-sm leading-relaxed text-zk-text2">
            <p className="font-semibold text-zk-text">How the Inbox works</p>
            <p>Agents merge the fixes they agree on. You only see what is contested or needs an answer.</p>
            <button type="button" onClick={() => setDemoLoad(!load)} className="mt-1 cursor-pointer text-xs font-semibold text-zk-accent">
              {load ? "Back to the small demo" : "Load 150 demo issues"}
            </button>
          </div>
        </div>
        <div className="border-t border-zk-border p-4 md:border-t-0 md:border-l">
          <p className="mb-2 text-xs font-bold tracking-wider text-zk-text2 uppercase">Your agents</p>
          <div className="flex items-start gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-zk-tint text-zk-accent"><Bot className="size-5" /></span>
            <div className="min-w-0 flex-1 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{MY_AGENT.name}</span>
                <span className="flex items-center gap-2">
                  <span className="rounded-full border border-zk-border px-2.5 py-0.5 text-xs text-zk-text2">Work</span>
                  <Settings className="size-4 text-zk-muted" />
                </span>
              </div>
              <span className="mt-1 inline-block rounded-md bg-zk-chip px-2 py-0.5 text-xs text-zk-text2">{MY_AGENT.state}</span>
              <p className="mt-1 text-zk-text2">{MY_AGENT.activity}</p>
              <p className="text-xs text-zk-muted">Last 30 days: {MY_AGENT.confirmed} confirmed</p>
            </div>
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="Inbox" className="flex gap-1 overflow-x-auto border-b border-zk-divider">
        {TABS.map((t) => (
          <button
            key={t.tab}
            role="tab"
            type="button"
            aria-selected={tab === t.tab}
            onClick={() => setTab(t.tab)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 pb-2.5 text-sm font-semibold ${tab === t.tab ? "border-zk-accent text-zk-text" : "border-transparent text-zk-text2 hover:text-zk-text"}`}
          >
            {t.label}
            <span className="rounded-md bg-zk-chip px-1.5 font-mono text-xs text-zk-text2">{t.tab === "input" ? waiting.length + lists.input.length : lists[t.tab].length}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" className="space-y-5">
        {tab === "input" && <Digest issues={handled} />}
        {tab === "input" && <Group title="Agents disagree" count={waiting.length + decided.length}>{[...waiting, ...decided].map(fixCard)}</Group>}
        {tab === "input" && <Group title="Agents have a question" count={lists.input.length}>{lists.input.map(questionCard)}</Group>}
        {tab !== "input" && <div className="space-y-3">{lists[tab].map(questionCard)}</div>}
        {shown === 0 && (
          <div className="rounded-xl border border-zk-border px-4 py-12 text-center">
            <p className="font-semibold">Nothing here right now.</p>
            <p className="mt-1 text-sm text-zk-text2">{current.empty}</p>
          </div>
        )}
      </div>
    </div>
  );
}
