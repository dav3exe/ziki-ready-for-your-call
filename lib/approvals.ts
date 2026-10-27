"use client";

// How many human approvals a design needs before it goes live. Mark's goal: a setting, not a fixed number. Kept in this browser only.
import { useSyncExternalStore } from "react";

const KEY = "ziki-mock-approvals";
const listeners = new Set<() => void>();

function read(): number {
  try {
    const n = Number(localStorage.getItem(KEY));
    return n >= 1 && n <= 5 ? n : 2;
  } catch {
    return 2;
  }
}

export function setApprovalsNeeded(n: number) {
  try {
    localStorage.setItem(KEY, String(Math.min(5, Math.max(1, n))));
  } catch {
    // Storage blocked: the setting holds until the page reloads.
  }
  listeners.forEach((l) => l());
}

export function useApprovalsNeeded(): number {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => 2,
  );
}
