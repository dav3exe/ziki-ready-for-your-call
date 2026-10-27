"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** A small box that pops up above the buttons it belongs to, with one text box for the note that goes with "Send back" or a question for an agent. It has no backdrop: click away, press Escape or tap the X to close it. */
export default function NotePopover({
  title,
  value,
  onChange,
  submitLabel,
  onSubmit,
  onClose,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  submitLabel: string;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = area.current;
    el?.focus();
    el?.setSelectionRange(el.value.length, el.value.length);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    // A click on the buttons that open this box is left to them, so a second tap switches or closes it.
    const away = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      if (box.current?.contains(e.target) || e.target.closest("[data-note-trigger]")) return;
      onClose();
    };
    window.addEventListener("keydown", esc);
    document.addEventListener("pointerdown", away, true);
    return () => {
      window.removeEventListener("keydown", esc);
      document.removeEventListener("pointerdown", away, true);
    };
  }, [onClose]);

  return (
    <div
      ref={box}
      role="dialog"
      aria-label={title}
      className="absolute bottom-full left-0 z-30 mb-2 w-[min(22rem,calc(100vw-2rem))] space-y-2 rounded-xl border border-zk-border bg-zk-surface p-3 shadow-xl"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-zk-text">{title}</p>
        <button type="button" aria-label="Close" onClick={onClose} className="cursor-pointer rounded-md p-0.5 text-zk-muted hover:text-zk-text">
          <X className="size-4" />
        </button>
      </div>
      <textarea
        ref={area}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        aria-label={title}
        className="w-full resize-none rounded-lg border border-zk-border bg-zk-bg px-2.5 py-2 text-sm text-zk-text outline-none focus:border-zk-accent"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim()}
          className="cursor-pointer rounded-[10px] bg-zk-blue px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
