import { Bot, TriangleAlert } from "lucide-react";
import { calloutFor } from "@/lib/agent-record";

const TINTS = ["bg-indigo-100 text-indigo-800", "bg-sky-100 text-sky-800", "bg-violet-100 text-violet-800", "bg-teal-100 text-teal-800", "bg-lime-100 text-lime-900", "bg-rose-100 text-rose-800", "bg-amber-100 text-amber-900"];
const tintOf = (name: string) => TINTS[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % TINTS.length];

/** An agent's picture. An agent with a bad record gets a red warning on it. */
export function AgentAvatar({ name, size = 32, badge }: { name: string; size?: number; badge?: React.ReactNode }) {
  const flagged = calloutFor(name);
  return (
    <span className="relative inline-flex shrink-0" title={flagged?.detail}>
      <span className={`flex items-center justify-center rounded-full ${tintOf(name)}`} style={{ width: size, height: size }}>
        <Bot style={{ width: size * 0.5, height: size * 0.5 }} />
      </span>
      {flagged && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-zk-bad-fg text-zk-surface ring-2 ring-zk-surface">
          <TriangleAlert className="size-2.5" strokeWidth={3} />
        </span>
      )}
      {badge}
    </span>
  );
}

/** The agent's name, with a red tag next to it when it has been blocking without reasons. */
export function AgentName({ name }: { name: string }) {
  const flagged = calloutFor(name);
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <b className="text-zk-text">{name}</b>
      {flagged && (
        <span title={flagged.detail} className="inline-flex items-center gap-1 rounded-full bg-zk-bad-bg px-2 py-0.5 text-[11px] font-bold text-zk-bad-fg">
          <TriangleAlert className="size-3" /> {flagged.label}
        </span>
      )}
    </span>
  );
}
