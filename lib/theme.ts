"use client";

// Light by default; dark if chosen, kept in this browser. The choice lives on <html data-theme>, which the colours in globals.css read; a small script in the layout applies a saved dark choice before the first paint so a dark page never flashes light.
import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const THEME_KEY = "ziki-mock-theme"; // the layout's pre-paint script reads the same key
const listeners = new Set<() => void>();

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light");
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the choice holds until the page reloads.
  }
  listeners.forEach((l) => l());
}
