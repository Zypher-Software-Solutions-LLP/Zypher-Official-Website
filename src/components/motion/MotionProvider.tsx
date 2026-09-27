"use client";

import { RouteScrollReset } from "./RouteScrollReset";
import { ViewportRevealController } from "./ViewportRevealController";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type PageScrollOptions = {
  behavior?: ScrollBehavior;
  offset?: number;
  onComplete?: () => void;
};

type PageScrollController = {
  scrollTo: (target: HTMLElement, options?: PageScrollOptions) => void;
  scrollToTop: () => void;
  subscribeToUserScrollIntent: (listener: () => void) => () => void;
};

const PageScrollContext = createContext<PageScrollController | null>(null);

export function usePageScrollController(): PageScrollController | null {
  return useContext(PageScrollContext);
}

export function MotionProvider({ children }: { children: ReactNode }): ReactNode {
  const pathname = usePathname();
  const isStudioRoute = pathname === "/studio" || pathname?.startsWith("/studio/") === true;
  const scrollCompletionCleanupRef = useRef<(() => void) | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const userScrollIntentListenersRef = useRef<Set<() => void>>(new Set());
  const scrollToTop = useCallback((): void => {
    scrollCompletionCleanupRef.current?.();
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    window.scrollTo({ behavior: "auto", left: 0, top: 0 });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
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
        const scrollMarginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop);
        const resolvedScrollMarginTop = Number.isFinite(scrollMarginTop) ? scrollMarginTop : 0;
        const top =
          target.getBoundingClientRect().top + window.scrollY - resolvedScrollMarginTop + offset;
        scrollCompletionCleanupRef.current?.();
        window.scrollTo({ behavior, top });

        if (behavior === "auto") {
          onComplete?.();
          return;
        }

        let completionTimer: number | null = null;
        const finishScroll = (): void => {
          scrollCompletionCleanupRef.current?.();
          onComplete?.();
        };
        const cleanup = (): void => {
          window.removeEventListener("scrollend", finishScroll);
          if (completionTimer !== null) {
            window.clearTimeout(completionTimer);
          }
          if (scrollCompletionCleanupRef.current === cleanup) {
            scrollCompletionCleanupRef.current = null;
          }
        };

        window.addEventListener("scrollend", finishScroll, { once: true });
        completionTimer = window.setTimeout(finishScroll, 1500);
        scrollCompletionCleanupRef.current = cleanup;
      },
      scrollToTop,
      subscribeToUserScrollIntent: (listener): (() => void) => {
        userScrollIntentListenersRef.current.add(listener);
        return (): void => {
          userScrollIntentListenersRef.current.delete(listener);
        };
      },
    }),
    [scrollToTop],
  );

  useEffect(() => {
    if (isStudioRoute) return;

    const notifyUserScrollIntent = (): void => {
      scrollCompletionCleanupRef.current?.();
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

    if (!reducedMotion && !saveData) {
      lenisRef.current = new Lenis({ autoRaf: true });
    }

    return (): void => {
      scrollCompletionCleanupRef.current?.();
      const lenis = lenisRef.current;
      lenisRef.current = null;
      lenis?.destroy();
      window.removeEventListener("wheel", notifyUserScrollIntent, listenerOptions);
      window.removeEventListener("touchmove", notifyUserScrollIntent, listenerOptions);
    };
  }, [isStudioRoute]);

  if (isStudioRoute) return <>{children}</>;

  return (
    <PageScrollContext.Provider value={pageScrollController}>
      <RouteScrollReset onReset={scrollToTop} />
      <ViewportRevealController />
      {children}
    </PageScrollContext.Provider>
  );
}
