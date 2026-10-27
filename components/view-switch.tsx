"use client";

import { useView } from "@/lib/view";

/** Shows one of two versions of a screen: Ziki as it is today, or the proposal. Both come from the server; the viewer's choice picks which one appears. */
export default function ViewSwitch({ current, proposed }: { current: React.ReactNode; proposed: React.ReactNode }) {
  return useView() === "current" ? current : proposed;
}
