"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }): ReactNode {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      "connection" in navigator &&
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
      );

    if (reducedMotion || saveData) {
      return undefined;
    }

    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return children;
}
