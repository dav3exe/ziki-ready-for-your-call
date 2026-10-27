import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronUp, ExternalLink } from "lucide-react";
import ActivityList from "@/components/activity-list";
import Avatar from "@/components/avatar";
import Conversation from "@/components/conversation";
import DecisionList from "@/components/decision-list";
import Fold from "@/components/fold";
import ReviewPill from "@/components/review-pill";
import { ALL_ISSUES, findIssue } from "@/lib/bulk";
import { verdictOf } from "@/lib/verdict";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return ALL_ISSUES.map((i) => ({ id: String(i.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const issue = findIssue(Number((await params).id));
  return { title: issue ? `#${issue.id} ${issue.title} · Ziki` : "Issue not found · Ziki" };
}

export default async function IssuePage({ params }: Props) {
  const issue = findIssue(Number((await params).id));
  if (!issue) notFound();
  const verdict = issue.status === "in_progress" ? verdictOf(issue) : null;
  const count = (kind: string) => issue.decisions.filter((d) => d.kind === kind).length;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-3">
          <h1 className="flex gap-2 font-display text-2xl leading-tight font-extrabold sm:text-[28px]">
            <Link href="/issues" aria-label="Back to issues" className="mt-1.5 shrink-0 text-zk-text2 hover:text-zk-text">
              <ArrowLeft className="size-5" />
            </Link>
            <span>
              <span className="text-zk-text2">#{issue.id}</span> {issue.title}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
            <span className="flex gap-2 font-semibold">
              <span className="rounded-md bg-zk-chip px-2 py-0.5 text-zk-text2">{issue.type}</span>
              {issue.platform && <span className="rounded-md bg-zk-chip px-2 py-0.5 text-zk-text2">{issue.platform}</span>}
            </span>
            <span className="flex items-center gap-1.5 text-zk-muted">
              {issue.assignee && <Avatar name={issue.assignee} />}
              {issue.assignee ?? issue.reporter} · {issue.priority} priority
            </span>
            {issue.pr && (
              <span className="flex items-center gap-1 text-zk-accent">
                <ExternalLink className="size-3.5" /> {issue.pr}
              </span>
            )}
          </div>
        </div>
        <button type="button" className="flex cursor-pointer items-center gap-2 rounded-full border border-zk-border px-4 py-2 text-sm font-semibold hover:border-zk-muted">
          <ChevronUp className="size-4" /> Upvote <span className="rounded-md bg-zk-chip px-1.5 font-mono text-xs text-zk-text2">{issue.votes}</span>
        </button>
      </div>

      <ReviewPill issue={issue} verdict={verdict} />

      <div className="rounded-xl border border-zk-border bg-zk-surface px-4">
        <Fold title="Description" preview={issue.description[0].body}>
          <div className="space-y-2 text-sm leading-relaxed text-zk-text2">
            {issue.description.map((part) => (
              <div key={part.heading}>
                <p className="font-bold text-zk-text">{part.heading}</p>
                <p className="whitespace-pre-line">{part.body}</p>
              </div>
            ))}
          </div>
        </Fold>
        {issue.decisions.length > 0 && (
          <Fold
            title="Agent decisions"
            count={issue.decisions.length}
            preview={`${count("good_to_merge")} merge · ${count("not_ready")} not ready · ${count("confirmed")} confirmed`}
          >
            <DecisionList decisions={issue.decisions} />
          </Fold>
        )}
        {issue.attachments ? (
          <Fold title="Attachments" count={issue.attachments}>
            <div className="h-24 w-36 rounded-lg border border-zk-border bg-gradient-to-br from-zk-tint to-zk-seg" />
          </Fold>
        ) : null}
        <Fold title="Conversation" count={issue.conversation.length} preview={issue.conversation.at(-1)?.body}>
          <Conversation comments={issue.conversation} />
        </Fold>
        {issue.activity && (
          <Fold title="Activity" count={issue.activity.length} preview={`${issue.activity.at(-1)?.who} ${issue.activity.at(-1)?.text}`}>
            <ActivityList activity={issue.activity} />
          </Fold>
        )}
      </div>
    </div>
  );
}
