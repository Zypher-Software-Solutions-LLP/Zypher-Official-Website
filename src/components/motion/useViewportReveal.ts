"use client";

import { useEffect, useState, type RefObject } from "react";

type UseViewportRevealOptions = {
  rootMargin?: string;
  threshold?: number;
};

export function useViewportReveal<T extends Element>(
  ref: RefObject<T | null>,
  options: UseViewportRevealOptions = {},
): boolean {
  const { rootMargin = "0px", threshold = 0.1 } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect((): (() => void) | void => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    if (!("IntersectionObserver" in globalThis)) {
      const fallbackFrame = window.requestAnimationFrame(() => setIsVisible(true));

      return (): void => window.cancelAnimationFrame(fallbackFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(element);

    return (): void => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return isVisible;
}
