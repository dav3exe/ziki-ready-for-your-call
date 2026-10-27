"use client";

import { useView, type View } from "@/lib/view";

/** Shows its children in one version of the mock-up only: Ziki today, or the proposal. */
export default function ViewOnly({ view, children }: { view: View; children: React.ReactNode }) {
  return useView() === view ? <>{children}</> : null;
}
