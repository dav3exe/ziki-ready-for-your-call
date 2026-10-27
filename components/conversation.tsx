"use client";

import { useState } from "react";
import { CornerDownRight, Plus } from "lucide-react";
import { ME } from "@/lib/data";
import type { Comment } from "@/lib/types";
import Avatar from "./avatar";

type Added = { after: number | null; body: string };

/** Long comments (an agent's pasted review, say) show three lines, with the rest one tap away. */
function Body({ text }: { text: string }) {
  const [more, setMore] = useState(false);
  const long = text.length > 200;
  return (
    <div className="mt-1 text-sm text-zk-text2">
      <p className={`break-words whitespace-pre-wrap ${long && !more ? "line-clamp-3" : ""}`}>{text}</p>
      {long && (
        <button type="button" onClick={() => setMore(!more)} className="mt-0.5 cursor-pointer text-xs font-semibold text-zk-accent hover:underline">
          {more ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function Composer({ placeholder, onSend, onCancel }: { placeholder: string; onSend: (body: string) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState("");
  const send = () => draft.trim() && onSend(draft.trim());
  return (
    <div className="mt-2 flex items-end gap-2">
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
        }}
        rows={2}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 resize-none rounded-lg border border-zk-border bg-zk-bg px-2.5 py-1.5 text-sm text-zk-text outline-none focus:border-zk-accent"
      />
      <button type="button" onClick={onCancel} className="cursor-pointer px-1.5 py-1.5 text-xs font-semibold text-zk-text2 hover:text-zk-text">
        Cancel
      </button>
      <button
        type="button"
        onClick={send}
        disabled={!draft.trim()}
        className="cursor-pointer rounded-[10px] bg-zk-blue px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}

/** An issue's conversation as a plain list, not a stack of boxes. Reply under any comment, or add a new one; what you write stays on this page only. */
export default function Conversation({ comments }: { comments: Comment[] }) {
  const [composer, setComposer] = useState<number | "new" | null>(null);
  const [added, setAdded] = useState<Added[]>([]);

  const send = (after: number | null) => (body: string) => {
    setAdded((a) => [...a, { after, body }]);
    setComposer(null);
  };
  const repliesTo = (i: number) => added.filter((a) => a.after === i);

  return (
    <div>
      <div className="flex justify-end pb-1">
        <button type="button" onClick={() => setComposer(composer === "new" ? null : "new")} className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-zk-accent hover:underline">
          <Plus className="size-3.5" /> Add comment
        </button>
      </div>
      {composer === "new" && <Composer placeholder="Write a comment" onSend={send(null)} onCancel={() => setComposer(null)} />}
      {comments.length === 0 && added.length === 0 && composer !== "new" && <p className="py-2 text-sm text-zk-muted">No comments yet.</p>}
      <ul className="divide-y divide-zk-divider">
        {comments.map((c, i) => (
          <li key={i} className="py-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
              <Avatar name={c.author} size={20} />
              <b className="text-zk-text">{c.author}</b>
              {c.agent && <span className="text-zk-muted">via {c.agent}</span>}
              <span className="ml-auto text-zk-muted">{c.at}</span>
            </div>
            <Body text={c.body} />
            <button
              type="button"
              onClick={() => setComposer(composer === i ? null : i)}
              className="mt-1 flex cursor-pointer items-center gap-1 text-xs font-semibold text-zk-text2 hover:text-zk-accent"
            >
              <CornerDownRight className="size-3" /> Reply
            </button>
            {repliesTo(i).map((r, k) => (
              <div key={k} className="mt-2 flex gap-2 border-l-2 border-zk-divider pl-3 text-sm">
                <Avatar name={ME.name} size={20} />
                <p className="min-w-0 break-words whitespace-pre-wrap text-zk-text2">
                  <b className="text-zk-text">{ME.name}</b> {r.body}
                </p>
              </div>
            ))}
            {composer === i && <Composer placeholder={`Reply to ${c.author}`} onSend={send(i)} onCancel={() => setComposer(null)} />}
          </li>
        ))}
        {added
          .filter((a) => a.after === null)
          .map((a, k) => (
            <li key={`new-${k}`} className="py-3">
              <div className="flex items-center gap-2 text-xs">
                <Avatar name={ME.name} size={20} />
                <b className="text-zk-text">{ME.name}</b>
                <span className="ml-auto text-zk-muted">Just now</span>
              </div>
              <p className="mt-1 break-words whitespace-pre-wrap text-sm text-zk-text2">{a.body}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
