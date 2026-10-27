"use client";

// Which version of Ziki the mock-up shows: how Ziki is today ("current") or the proposal ("proposed"). Kept in this browser only.
import { useSyncExternalStore } from "react";

export type View = "current" | "proposed";

const KEY = "ziki-mock-view";
const listeners = new Set<() => void>();

function read(): View {
  try {
    return localStorage.getItem(KEY) === "current" ? "current" : "proposed";
  } catch {
    return "proposed";
  }
}

export function setView(view: View) {
  try {
    localStorage.setItem(KEY, view);
  } catch {
    // Storage blocked: the choice holds until the page reloads.
  }
  listeners.forEach((l) => l());
}

export function useView(): View {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => "proposed",
  );
}
