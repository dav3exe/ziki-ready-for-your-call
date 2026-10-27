import { Clock } from "lucide-react";

const UNITS: Record<string, [string, string]> = { d: ["day", "days"], h: ["hour", "hours"], m: ["minute", "minutes"] };

/** "1d 4h" in words: "1 day 4 hours". */
function spoken(time: string): string {
  return time
    .split(/\s+/)
    .map((part) => {
      const m = part.match(/^(\d+)([dhm])$/);
      if (!m) return part;
      const [one, many] = UNITS[m[2]];
      return `${m[1]} ${m[1] === "1" ? one : many}`;
    })
    .join(" ");
}

const ORANGE = "border-zk-warn-bd bg-zk-warn-bg text-zk-warn-fg";

/** How long something has waited on a person, as a clock and the time ("3d"). Hover or focus it and, straight away, an orange tag says it in words ("Waiting 3 days"). */
export default function WaitChip({ time }: { time: string }) {
  const text = `Waiting ${spoken(time)}`;
  return (
    <span
      tabIndex={0}
      aria-label={text}
      className={`group relative inline-flex cursor-default items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-zk-accent ${ORANGE}`}
    >
      <Clock className="size-3" aria-hidden="true" /> {time}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-full left-1/2 z-20 mt-1.5 hidden -translate-x-1/2 rounded-md border px-2 py-1 text-xs font-semibold whitespace-nowrap shadow-md group-hover:block group-focus-visible:block ${ORANGE}`}
      >
        {text}
      </span>
    </span>
  );
}
