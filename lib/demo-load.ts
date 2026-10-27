"use client";

// Whether the 150 demo issues are on. Kept in this browser only, like the calls.
import { useSyncExternalStore } from "react";

const KEY = "ziki-mock-load";
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setDemoLoad(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    // Blocked storage: the setting lasts until the page reloads.
  }
  listeners.forEach((l) => l());
}

export function useDemoLoad(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => false,
  );
}
