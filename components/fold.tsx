"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** One section of an issue, folded to a single line (title, count and a short preview) until you open it. */
export default function Fold({ title, count, preview, children }: { title: string; count?: number; preview?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="border-t border-zk-divider first:border-t-0">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left hover:text-zk-accent">
        <span className="min-w-0">
          <span className="text-sm font-semibold text-zk-text">{title}</span>
          {count !== undefined && <span className="ml-2 rounded-md bg-zk-chip px-1.5 font-mono text-xs text-zk-text2">{count}</span>}
          {!open && preview && <span className="mt-0.5 block truncate text-sm font-normal text-zk-text2">{preview}</span>}
        </span>
        <ChevronDown className={`size-4 shrink-0 text-zk-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </section>
  );
}
