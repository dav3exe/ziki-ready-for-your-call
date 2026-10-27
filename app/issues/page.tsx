import type { Metadata } from "next";
import ClassicInbox from "@/components/classic/classic-inbox";
import InboxView from "@/components/inbox-view";
import IssueTable from "@/components/issue-table";
import IssuesToolbar, { type ListView } from "@/components/issues-toolbar";
import ViewSwitch from "@/components/view-switch";
import { BY_VOTES, COUNTS, ISSUES, SPLIT_COUNTS } from "@/lib/data";
import { verdictOf } from "@/lib/verdict";

export const metadata: Metadata = { title: "Issues · Ziki" };

const LABEL: Record<Exclude<ListView, "inbox">, string> = { open: "open", in_progress: "in progress", ready: "ready for merge", resolved: "done", merged: "merged", live: "live", all: "" };
const VIEWS = ["open", "in_progress", "ready", "resolved", "merged", "live", "all"] as const;

// A fix is ready for merge once five agents have reviewed it and the recommendation is to merge.
const isReady = (i: (typeof ISSUES)[number]) => i.status === "in_progress" && (verdictOf(i)?.route === "person" || verdictOf(i)?.route === "merger") && verdictOf(i)?.recommend === "merge";

export default async function IssuesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const view: ListView = VIEWS.find((v) => v === status) ?? "inbox";
  const readyCount = ISSUES.filter(isReady).length;
  const counts = { ...COUNTS, ...SPLIT_COUNTS, ready: readyCount };
  const list =
    view === "all" ? BY_VOTES
    : view === "ready" ? BY_VOTES.filter(isReady)
    : view === "merged" ? BY_VOTES.filter((i) => i.status === "resolved" && !i.live)
    : view === "live" ? BY_VOTES.filter((i) => i.status === "resolved" && i.live)
    : BY_VOTES.filter((i) => i.status === view);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 rounded-xl bg-zk-surface p-3 sm:p-5">
      <IssuesToolbar view={view} readyCount={readyCount} />
      {view === "inbox" ? (
        <ViewSwitch current={<ClassicInbox />} proposed={<InboxView issues={ISSUES} />} />
      ) : (
        <>
          <p className="sr-only">{counts[view]} {LABEL[view]} issues, sorted by top votes</p>
          <IssueTable issues={list} />
        </>
      )}
    </div>
  );
}
