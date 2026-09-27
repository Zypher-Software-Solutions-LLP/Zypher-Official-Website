"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MOTION_SECTION_SELECTOR = "[data-motion-section]";
const HIDDEN_STATE = "hidden";
const VISIBLE_STATE = "visible";
const MOTION_SKIP_ATTRIBUTE = "motionSkip";
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "0px 0px -12% 0px",
  threshold: 0.01,
};

type ConnectionWithSaveData = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function prefersSavedData(): boolean {
  return Boolean((navigator as ConnectionWithSaveData).connection?.saveData);
}

function setRevealState(section: HTMLElement, state: string): void {
  section.dataset.revealState = state;
}

function setMotionSkip(section: HTMLElement, shouldSkip: boolean): void {
  if (shouldSkip) {
    section.dataset[MOTION_SKIP_ATTRIBUTE] = "true";
    return;
  }

  delete section.dataset[MOTION_SKIP_ATTRIBUTE];
}

function setDocumentMotionSkip(shouldSkip: boolean): void {
  if (shouldSkip) {
    document.documentElement.dataset[MOTION_SKIP_ATTRIBUTE] = "true";
    return;
  }

  delete document.documentElement.dataset[MOTION_SKIP_ATTRIBUTE];
}

export function ViewportRevealController(): null {
  const pathname = usePathname();

  useEffect((): (() => void) => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(MOTION_SECTION_SELECTOR));
    setDocumentMotionSkip(false);
    const shouldSkipMotion =
      typeof IntersectionObserver === "undefined" || prefersReducedMotion() || prefersSavedData();

    if (sections.length === 0) {
      if (shouldSkipMotion) {
        setDocumentMotionSkip(true);
      }

      return (): void => setDocumentMotionSkip(false);
    }

    if (shouldSkipMotion) {
      setDocumentMotionSkip(true);
      sections.forEach((section) => {
        setRevealState(section, VISIBLE_STATE);
        setMotionSkip(section, true);
      });
      return (): void => setDocumentMotionSkip(false);
    }

    sections.forEach((section) => {
      setRevealState(section, HIDDEN_STATE);
      setMotionSkip(section, false);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
          !entry.isIntersecting ||
          !(entry.target instanceof HTMLElement) ||
          entry.target.dataset.revealState === VISIBLE_STATE
        ) {
          return;
        }

        setRevealState(entry.target, VISIBLE_STATE);
        observer.unobserve(entry.target);
      });
    }, OBSERVER_OPTIONS);

    sections.forEach((section) => observer.observe(section));

    return (): void => {
      observer.disconnect();
      setDocumentMotionSkip(false);
    };
  }, [pathname]);

  return null;
}
