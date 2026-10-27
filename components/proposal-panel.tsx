"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { setView } from "@/lib/view";
import ResetDemo from "./reset-demo";

const CHANGES = [
  { title: "Agents handle what they agree on", text: "All five agree and a screenshot shows it working: the agents merge it. You get one line, with Pull back.", href: "/issues" },
  { title: "You only see what is contested", text: "Any “not ready”, High priority, or no screenshot brings it to you, grouped by reason.", href: "/issues/62" },
  { title: "One recommendation, one tap", text: "Each card says what the agents think and offers “Go with agents”. Overruling is smaller.", href: "/issues/143" },
  { title: "Five reviews, then done", text: "Ziki stops asking agents after five. 4 or 5 merge votes recommend merge; 3 or fewer recommend send back.", href: "/issues/143" },
];

/** The proposal as a pill stuck to the side of the screen. Open it for the problem, what changes and how to try it. */
export default function ProposalPanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open the proposal"
          className="fixed top-1/2 right-0 z-50 flex -translate-y-1/2 cursor-pointer flex-col items-center gap-2 rounded-l-2xl border border-r-0 border-zk-accent/60 bg-zk-surface px-2 py-3.5 text-xs font-bold text-zk-accent shadow-lg transition hover:bg-zk-tint"
        >
          <FileText className="size-4" />
          <span className="[writing-mode:vertical-rl]">The proposal</span>
        </button>
      )}
      {open && (
        <aside aria-label="The proposal" className="fixed top-20 right-3 bottom-24 z-50 flex w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-zk-border bg-zk-surface shadow-2xl lg:bottom-6">
          <div className="flex items-start justify-between gap-3 border-b border-zk-divider px-4 py-3">
            <div>
              <p className="text-[11px] font-bold tracking-wider text-zk-accent uppercase">Human-agent interaction</p>
              <h2 className="font-display text-lg leading-snug font-extrabold text-zk-text">Agents first, people on the hard calls</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close the proposal" className="cursor-pointer rounded-full p-1.5 text-zk-text2 hover:bg-zk-chip hover:text-zk-text">
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-5 overflow-y-auto px-4 py-4 text-sm leading-relaxed text-zk-text2">
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold tracking-wider text-zk-text uppercase">The problem</h3>
              <p>
                On live issue #143, 9 agents said merge and 1 said not ready, with no reason. It sat in progress for three days and the Inbox showed 0. Deciding meant reading a page of about 1,100 words that shows the 18 agent decisions twice.
              </p>
              <p>Asking a person about every finished fix wouldn’t scale. At 100 or 150 items it becomes a second job.</p>
            </section>
            <section className="space-y-2">
              <h3 className="text-xs font-bold tracking-wider text-zk-text uppercase">What changes</h3>
              <ol className="space-y-2">
                {CHANGES.map((c, i) => (
                  <li key={c.title} className="rounded-xl border border-zk-border p-3">
                    <p className="font-semibold text-zk-text">{i + 1}. {c.title}</p>
                    <p className="mt-0.5">{c.text}</p>
                    <Link href={c.href} onClick={() => { setView("proposed"); setOpen(false); }} className="mt-1 inline-block text-xs font-semibold text-zk-accent">See it →</Link>
                  </li>
                ))}
              </ol>
            </section>
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold tracking-wider text-zk-text uppercase">Try it</h3>
              <p>Use the switch at the top to flip between Ziki today and the proposal. In the Inbox, “Load 150 demo issues” shows it at Mark’s 100 to 200 item size: about 100 collapse into one line.</p>
            </section>
            <footer className="space-y-2 border-t border-zk-divider pt-3 text-xs">
              <p>The Inbox and In progress issues are copied from ziki.dev as of Oct 27. The 150 demo issues are made up. Your choices stay in this browser.</p>
              <ResetDemo />
            </footer>
          </div>
        </aside>
      )}
    </>
  );
}
