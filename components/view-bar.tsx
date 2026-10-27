"use client";

import { setView, useView, type View } from "@/lib/view";

const OPTIONS: { view: View; label: string }[] = [
  { view: "current", label: "Ziki today" },
  { view: "proposed", label: "Proposed fix" },
];

/** A strip under the header with one switch: the same screens as Ziki shows them today, or as the proposal changes them. */
export default function ViewBar() {
  const view = useView();
  return (
    <div className="border-b border-zk-border bg-zk-seg">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-3 py-2 sm:px-6">
        <div role="group" aria-label="Which version to show" className="flex rounded-full bg-zk-chip p-0.5 text-xs font-semibold">
          {OPTIONS.map((o) => (
            <button
              key={o.view}
              type="button"
              aria-pressed={view === o.view}
              onClick={() => setView(o.view)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 transition ${view === o.view ? "bg-zk-blue text-white" : "text-zk-text2 hover:text-zk-text"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-zk-text2">{view === "current" ? "Ziki as it is today, copied from ziki.dev." : "The same screens with the proposed changes."}</p>
      </div>
    </div>
  );
}
