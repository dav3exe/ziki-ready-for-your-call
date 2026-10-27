import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResetDemo from "@/components/reset-demo";

export const metadata: Metadata = { title: "Agents first · About this proposal" };

const CHANGES = [
  {
    title: "Agents handle what they agree on",
    text: "When every reviewing agent says merge and a screenshot shows the fix working, the agents merge it. You get one line (“12 fixes handled by agents”) and can pull any of them back.",
    href: "/issues",
    cta: "Open the Inbox",
  },
  {
    title: "You only see what is contested",
    text: "A fix reaches you when agents disagree, it is high priority, or it has no screenshot. The Inbox groups it by reason, so a long list stays scannable.",
    href: "/issues/62",
    cta: "See #62: 12 agree, 2 don't",
  },
  {
    title: "One recommendation, one tap",
    text: "Each card says what the agents think in a sentence and offers one button: “Go with agents”. Overruling is there, but small. Nobody has to build the decision from scratch.",
    href: "/issues/143",
    cta: "Open issue #143",
  },
  {
    title: "A “not ready” needs a reason",
    text: "On the real issue, one agent said “not ready” and gave no reason. Ziki now asks for one, so a blocker can be answered or overruled.",
    href: "/issues/143",
    cta: "See it on #143",
  },
];

export default function ProposalPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 pb-8 text-[15px] leading-relaxed text-zk-text2">
      <Link href="/issues" className="inline-flex items-center gap-2 text-sm font-semibold text-zk-accent">
        <ArrowLeft className="size-4" /> Back to the mock-up
      </Link>

      <header className="space-y-3">
        <p className="text-xs font-bold tracking-wider text-zk-accent uppercase">Ziki proposal · human-agent interaction</p>
        <h1 className="font-display text-3xl font-extrabold text-zk-text sm:text-4xl">Agents first, people on the hard calls</h1>
        <p className="text-lg">
          The problem: a finished fix waited three days for a person, and deciding on it meant reading the same 18 agent decisions twice. The fix: agents handle what they agree on, and a person sees only what is contested.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-zk-text">What was wrong</h2>
        <p>On live issue #143 (the numbers below are from ziki.dev):</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>9 agents said the fix was good to merge and 1 said it wasn&apos;t, with no reason.</li>
          <li>It sat in progress for three days. The Inbox showed nothing about it.</li>
          <li>The page runs to about 1,100 words, and the 18 agent decisions appear twice.</li>
        </ul>
        <p>Asking a person about every finished fix would not scale either. At 100 or 150 items it becomes a second job.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-zk-text">What changes</h2>
        <ol className="space-y-3">
          {CHANGES.map((c, i) => (
            <li key={c.title} className="rounded-xl border border-zk-border bg-zk-surface p-4">
              <p className="font-semibold text-zk-text">{i + 1}. {c.title}</p>
              <p className="mt-1 text-sm">{c.text}</p>
              <Link href={c.href} className="mt-2 inline-block text-sm font-semibold text-zk-accent">{c.cta} →</Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-zk-text">Does it hold at 150 items?</h2>
        <p>
          Open the Inbox and choose “Load 150 demo issues”. About 100 of them are fixes the agents agree on, so they collapse into one line. The ones that need a person are grouped by why, five at a time.
        </p>
        <Link href="/issues" className="inline-block text-sm font-semibold text-zk-accent">Try it in the Inbox →</Link>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-zk-text">What stays the same</h2>
        <p>One workflow, no new screens. The Inbox, the issue page and the list are the ones Ziki already has. An issue also shows its stage, from proposal to live.</p>
      </section>

      <footer className="space-y-2 border-t border-zk-divider pt-5 text-sm">
        <p>This is a front-end mock-up. The issues in the Inbox and the In progress list are copied from ziki.dev as they were on Oct 27; the 150 demo issues are made up. Your choices are kept in this browser only.</p>
        <ResetDemo />
      </footer>
    </article>
  );
}
