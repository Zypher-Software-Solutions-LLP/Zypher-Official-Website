"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

type PageScrollOptions = {
  behavior?: ScrollBehavior;
  offset?: number;
  onComplete?: () => void;
};

type PageScrollController = {
  scrollTo: (target: HTMLElement, options?: PageScrollOptions) => void;
  subscribeToUserScrollIntent: (listener: () => void) => () => void;
};

const PageScrollContext = createContext<PageScrollController | null>(null);

export function usePageScrollController(): PageScrollController | null {
  return useContext(PageScrollContext);
}

export function MotionProvider({ children }: { children: ReactNode }): ReactNode {
  const lenisRef = useRef<Lenis | null>(null);
  const userScrollIntentListenersRef = useRef<Set<() => void>>(new Set());
  const pageScrollController = useMemo<PageScrollController>(
    () => ({
      scrollTo: (target, options = {}): void => {
        const { behavior = "smooth", offset = 0, onComplete } = options;
        const lenis = lenisRef.current;

        if (lenis && behavior === "smooth") {
          lenis.scrollTo(target, {
            offset,
            onComplete: (): void => onComplete?.(),
          });
          return;
        }

        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ behavior, top });

        if (behavior === "auto") {
          onComplete?.();
        }
      },
      subscribeToUserScrollIntent: (listener): (() => void) => {
        userScrollIntentListenersRef.current.add(listener);
        return (): void => {
          userScrollIntentListenersRef.current.delete(listener);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    const notifyUserScrollIntent = (): void => {
      userScrollIntentListenersRef.current.forEach((listener) => listener());
    };
    const listenerOptions: AddEventListenerOptions = { capture: true, passive: true };

    window.addEventListener("wheel", notifyUserScrollIntent, listenerOptions);
    window.addEventListener("touchmove", notifyUserScrollIntent, listenerOptions);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      "connection" in navigator &&
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
      );

    if (reducedMotion || saveData) {
      return (): void => {
        window.removeEventListener("wheel", notifyUserScrollIntent, listenerOptions);
        window.removeEventListener("touchmove", notifyUserScrollIntent, listenerOptions);
      };
    }

    const lenis = new Lenis({ autoRaf: true });
    lenisRef.current = lenis;

    return (): void => {
      lenisRef.current = null;
      lenis.destroy();
      window.removeEventListener("wheel", notifyUserScrollIntent, listenerOptions);
      window.removeEventListener("touchmove", notifyUserScrollIntent, listenerOptions);
    };
  }, []);

  return (
    <PageScrollContext.Provider value={pageScrollController}>{children}</PageScrollContext.Provider>
  );
}
