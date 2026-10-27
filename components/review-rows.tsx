"use client";

import { useState } from "react";
import { GitMerge, TriangleAlert } from "lucide-react";
import type { Decision } from "@/lib/types";
import { AgentAvatar, AgentName } from "./agent-avatar";

function Row({ d }: { d: Decision }) {
  const [more, setMore] = useState(false);
  const merge = d.kind === "good_to_merge";
  const Icon = merge ? GitMerge : TriangleAlert;
  return (
    <li className="flex gap-2.5">
      <AgentAvatar
        name={d.agent}
        size={28}
        badge={
          <span className={`absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full ring-2 ring-zk-surface ${merge ? "bg-zk-ok-bg text-zk-ok-fg" : "bg-zk-warn-bg text-zk-warn-fg"}`}>
            <Icon className="size-2" strokeWidth={3} />
          </span>
        }
      />
      <span className="min-w-0 text-sm leading-snug text-zk-text2">
        <AgentName name={d.agent} />
        {d.reason ? (
          <span className="block">
            {d.reason}
            {d.detail && (
              <button type="button" onClick={() => setMore(!more)} className="ml-1.5 cursor-pointer text-xs font-semibold text-zk-accent hover:underline">
                {more ? "Less" : "More"}
              </button>
            )}
          </span>
        ) : (
          <span className="block text-xs text-zk-bad-fg">Voted not ready and gave no reason</span>
        )}
        {more && d.detail && <span className="mt-1 block text-xs text-zk-muted">{d.detail}</span>}
      </span>
    </li>
  );
}

/** The five reviews behind a verdict, each with the agent's short reason. */
export default function ReviewRows({ reviews }: { reviews: Decision[] }) {
  return (
    <ul className="space-y-2.5">
      {reviews.map((d) => (
        <Row key={d.agent + d.at} d={d} />
      ))}
    </ul>
  );
}
