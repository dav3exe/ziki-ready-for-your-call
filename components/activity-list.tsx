import type { Activity } from "@/lib/types";

/** Read-only history of an issue, one short line per change, newest last. */
export default function ActivityList({ activity }: { activity: Activity[] }) {
  return (
    <ol className="space-y-1.5 border-l border-zk-divider pl-3">
      {activity.map((a, i) => (
        <li key={i} className="text-sm text-zk-text2">
          <b className="text-zk-text">{a.who}</b> {a.text}
          <span className="ml-2 text-xs text-zk-muted">{a.at}</span>
        </li>
      ))}
    </ol>
  );
}
