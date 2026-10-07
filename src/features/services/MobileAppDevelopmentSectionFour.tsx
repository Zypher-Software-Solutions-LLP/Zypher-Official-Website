"use client";

import Image from "next/image";
import { usePageScrollController } from "@/components/motion/MotionProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import styles from "./AiLlmAutomationSectionFour.module.css";

type ProcessStage = {
  id: string;
  number: string;
  label: string;
  heading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const MOBILE_APP_DEVELOPMENT_AUTOMATION_STAGES: readonly ProcessStage[] = [
  {
    id: "discovery",
    number: "1",
    label: "Discovery",
    heading: "Discovery",
    description:
      "We start by understanding the problem the app needs to solve, not by collecting a list of screens you want. Who uses it, how they use it, what they're doing before and after they open it, and what success looks like in six months. Platform choice, backend requirements, and third-party integrations all get mapped here. No proposal before this conversation is done.",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-4/Discovery.webp",
    imageAlt: "Illustration for the discovery stage",
  },
  {
    id: "architecture-and-scope",
    number: "2",
    label: "Architecture & Scope",
    heading: "Architecture & Scope",
    description:
      "We design the system before we design the screens. Backend architecture, API structure, authentication, data models, and the Flutter or native decision, all confirmed and documented before any UI work begins. You get a scoped brief and a fixed quote. One number, not a range. Scope and price are locked here before anything is built.",
    imageSrc: "https://media.zypher-solutions.com/03-services-page/section-4/Architecture.webp",
    imageAlt: "Illustration for the architecture and scope stage",
  },
  {
    id: "build-and-platform-testing",
    number: "3",
    label: "Build & Platform Testing",
    heading: "Build & Platform Testing",
    description:
      "Engineering and design run in parallel. As screens are built, they're tested on real iOS and Android devices, not just simulators. Edge cases, device-specific behaviour, OS version compatibility, and app store submission requirements are all addressed before launch, not discovered after. You see working builds throughout the process, not just at the end.",
    imageSrc:
      "https://media.zypher-solutions.com/03-services-page/section-4/Build%20%26%20Integration.webp",
    imageAlt: "Illustration for the build and platform testing stage",
  },
  {
    id: "handoff-and-documentation",
    number: "4",
    label: "Handoff & Documentation",
    heading: "Handoff & Documentation",
    description:
      "App store submission, approval, and launch are handled as part of the engagement, not handed back to you as a final task. Full ownership transfers at handoff: codebase, credentials, store accounts, and documentation written for the people maintaining the app. Post-launch support scope is agreed before the build starts, not introduced after.",
    imageSrc:
      "https://media.zypher-solutions.com/03-services-page/section-4/Handoff%20%26%20Documentation.webp",
    imageAlt: "Illustration for the handoff and documentation stage",
  },
];

function getPanelElementId(stageId: string): string {
  return "mobile-app-development-section-four-panel-" + stageId;
}

function getScrollBehavior(): ScrollBehavior {
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

type ProcessNavigation = {
  activeStageId: string;
  isDockVisible: boolean;
  registerPanel: (stageId: string, node: HTMLElement | null) => void;
  scrollToStage: (stageId: string) => void;
};

function useProcessNavigation(
  stages: readonly ProcessStage[],
  sectionRef: RefObject<HTMLElement | null>,
): ProcessNavigation {
  const [activeStageId, setActiveStageId] = useState(stages[0]?.id ?? "");
  const [isDockVisible, setIsDockVisible] = useState(false);
  const panelRefs = useRef<Map<string, HTMLElement>>(new Map());
  const scrollTargetIdRef = useRef<string | null>(null);
  const pageScrollController = usePageScrollController();

  const registerPanel = useCallback((stageId: string, node: HTMLElement | null): void => {
    if (node) {
      panelRefs.current.set(stageId, node);
    } else {
      panelRefs.current.delete(stageId);
    }
  }, []);

  const scrollToStage = useCallback(
    (stageId: string): void => {
      const panel =
        panelRefs.current.get(stageId) ?? document.getElementById(getPanelElementId(stageId));

      setActiveStageId(stageId);

      if (!panel) {
        return;
      }

      const clearScrollTarget = (): void => {
        if (scrollTargetIdRef.current === stageId) {
          scrollTargetIdRef.current = null;
        }
      };

      scrollTargetIdRef.current = stageId;

      if (pageScrollController) {
        pageScrollController.scrollTo(panel, {
          behavior: getScrollBehavior(),
          onComplete: clearScrollTarget,
        });
        return;
      }

      panel.scrollIntoView?.({ behavior: getScrollBehavior(), block: "start" });
    },
    [pageScrollController],
  );

  useEffect((): (() => void) => {
    const section = sectionRef.current;
    let animationFrame: number | null = null;

    const updateDockVisibility = (): void => {
      if (!section) {
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const finalStage = stages.at(-1);
      const finalPanelElement = finalStage ? panelRefs.current.get(finalStage.id) : undefined;
      const finalPanelRect = finalPanelElement?.getBoundingClientRect();
      const entryThreshold = window.innerHeight * 0.8;
      const activePanelAnchor = window.innerHeight * 0.35;
      const hasNotReachedFinalStage = finalPanelRect
        ? finalPanelRect.top > activePanelAnchor
        : sectionRect.bottom > 0;
      const shouldShowDock = sectionRect.top <= entryThreshold && hasNotReachedFinalStage;

      setIsDockVisible((currentVisibility) =>
        currentVisibility === shouldShowDock ? currentVisibility : shouldShowDock,
      );
    };

    const cancelProgrammaticNavigation = (): void => {
      scrollTargetIdRef.current = null;
    };

    const updateActiveStage = (): void => {
      animationFrame = null;
      updateDockVisibility();
      const anchor = window.innerHeight * 0.35;
      const scrollTargetId = scrollTargetIdRef.current;

      if (scrollTargetId) {
        const targetElement = panelRefs.current.get(scrollTargetId);
        const targetRect = targetElement?.getBoundingClientRect();
        const targetReached = Boolean(
          targetRect && targetRect.top <= anchor && targetRect.bottom >= anchor,
        );

        if (!targetReached) {
          return;
        }

        scrollTargetIdRef.current = null;
      }

      const candidates = stages
        .map((stage) => {
          const element = panelRefs.current.get(stage.id);
          const rect = element?.getBoundingClientRect();

          return rect ? { stage, rect } : null;
        })
        .filter((candidate): candidate is { stage: ProcessStage; rect: DOMRect } =>
          Boolean(candidate),
        )
        .sort(
          (first, second) =>
            Math.abs(first.rect.top + first.rect.height / 2 - anchor) -
            Math.abs(second.rect.top + second.rect.height / 2 - anchor),
        );
      const nextStage = candidates[0]?.stage;

      if (nextStage) {
        setActiveStageId((currentStageId) =>
          currentStageId === nextStage.id ? currentStageId : nextStage.id,
        );
      }
    };

    const scheduleActiveStageUpdate = (): void => {
      if (animationFrame !== null) {
        return;
      }

      if (typeof window.requestAnimationFrame !== "function") {
        updateActiveStage();
        return;
      }

      animationFrame = window.requestAnimationFrame(updateActiveStage);
    };

    const unsubscribeFromUserScrollIntent = pageScrollController?.subscribeToUserScrollIntent(
      cancelProgrammaticNavigation,
    );

    window.addEventListener("scroll", scheduleActiveStageUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveStageUpdate);

    if (!pageScrollController) {
      window.addEventListener("wheel", cancelProgrammaticNavigation, { passive: true });
      window.addEventListener("touchmove", cancelProgrammaticNavigation, { passive: true });
    }

    updateDockVisibility();

    return (): void => {
      window.removeEventListener("scroll", scheduleActiveStageUpdate);
      window.removeEventListener("resize", scheduleActiveStageUpdate);
      unsubscribeFromUserScrollIntent?.();

      if (!pageScrollController) {
        window.removeEventListener("wheel", cancelProgrammaticNavigation);
        window.removeEventListener("touchmove", cancelProgrammaticNavigation);
      }

      if (animationFrame !== null && typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [pageScrollController, sectionRef, stages]);

  return { activeStageId, isDockVisible, registerPanel, scrollToStage };
}

function ProcessStepButton({
  isActive,
  label,
  number,
  onSelect,
}: {
  isActive: boolean;
  label: string;
  number: string;
  onSelect: () => void;
}): ReactNode {
  return (
    <button
      aria-current={isActive ? "true" : undefined}
      className={styles.stepButton}
      data-testid="mobile-app-development-section-four-step-button"
      onClick={(event): void => {
        if (event.detail === 0) {
          onSelect();
        }
      }}
      onPointerDown={onSelect}
      type="button"
    >
      <span aria-hidden="true" className={styles.stepNumber}>
        {number}
      </span>
      <span>{label}</span>
    </button>
  );
}

export function MobileAppDevelopmentSectionFour(): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { activeStageId, isDockVisible, registerPanel, scrollToStage } = useProcessNavigation(
    MOBILE_APP_DEVELOPMENT_AUTOMATION_STAGES,
    sectionRef,
  );

  return (
    <section
      aria-labelledby="mobile-app-development-section-four-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="mobile-app-development-section-four"
      id="mobile-app-development-process"
      ref={sectionRef}
    >
      <div className={styles.sectionInner} data-motion-item="true">
        <div className={styles.sectionLayout}>
          <aside className={styles.rail} data-testid="mobile-app-development-section-four-rail">
            <h2
              aria-label="HOW WE WORK"
              className={styles.sectionTitle}
              id="mobile-app-development-section-four-title"
            >
              <span>HOW</span>
              <strong>WE WORK</strong>
            </h2>

            <nav aria-label="Mobile app development stages" className={styles.navigation}>
              {MOBILE_APP_DEVELOPMENT_AUTOMATION_STAGES.map((stage) => (
                <ProcessStepButton
                  isActive={activeStageId === stage.id}
                  key={stage.id}
                  label={stage.label}
                  number={stage.number}
                  onSelect={(): void => scrollToStage(stage.id)}
                />
              ))}
            </nav>
          </aside>

          <div className={styles.content}>
            {MOBILE_APP_DEVELOPMENT_AUTOMATION_STAGES.map((stage, index) => (
              <article
                className={styles.panel}
                data-active={activeStageId === stage.id ? "true" : "false"}
                data-testid={"mobile-app-development-section-four-panel-" + stage.id}
                id={getPanelElementId(stage.id)}
                key={stage.id}
                ref={(node): void => registerPanel(stage.id, node)}
              >
                <header className={styles.panelHeader}>
                  <h3>{stage.heading}</h3>
                </header>
                <p className={styles.description}>{stage.description}</p>
                <div className={styles.media}>
                  <Image
                    alt={stage.imageAlt}
                    className={styles.image}
                    data-testid="mobile-app-development-section-four-image"
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 767px) min(100vw - 2rem, 36rem), (max-width: 1199px) min(100vw - 4rem, 48rem), 54vw"
                    src={stage.imageSrc}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <nav
        aria-label="Mobile app development quick navigation"
        className={styles.jumpDock}
        data-state={isDockVisible ? "visible" : "hidden"}
        data-testid="mobile-app-development-section-four-jump-dock"
      >
        {MOBILE_APP_DEVELOPMENT_AUTOMATION_STAGES.map((stage) => (
          <button
            aria-current={activeStageId === stage.id ? "true" : undefined}
            aria-label={stage.label}
            className={styles.jumpButton}
            data-testid="mobile-app-development-section-four-jump-button"
            key={stage.id}
            onClick={(event): void => {
              if (event.detail === 0) {
                scrollToStage(stage.id);
              }
            }}
            onPointerDown={(): void => scrollToStage(stage.id)}
            type="button"
          >
            {stage.number}
          </button>
        ))}
      </nav>
    </section>
  );
}
