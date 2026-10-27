/** A tooltip that appears the moment you point at or focus its content. The browser's own title tooltips wait about a second; this doesn't wait at all. */
export default function Tip({ text, align = "center", className = "", children }: { text: string; align?: "start" | "center" | "end"; className?: string; children: React.ReactNode }) {
  const place = align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span tabIndex={0} aria-label={text} className={`group/tip relative inline-flex rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zk-accent ${className}`}>
      {children}
      <span
        role="tooltip"
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-full z-30 mb-1.5 hidden w-max max-w-56 rounded-md border border-zk-border bg-zk-surface px-2 py-1 text-left text-xs font-normal whitespace-normal text-zk-text shadow-lg group-focus-within/tip:block group-hover/tip:block ${place}`}
      >
        {text}
      </span>
    </span>
  );
}
