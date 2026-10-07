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

const AI_LLM_AUTOMATION_STAGES: readonly ProcessStage[] = [
  {
    id: "discovery",
    number: "1",
    label: "Discover",
    heading: "Discovery",
    description:
      'We start by understanding the process, not the technology. What\'s actually happening, where the friction is, what data exists, and what "working" looks like for your team. No proposal before this is done.',
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-4/Discovery.webp",
    imageAlt: "Illustration for the discovery stage",
  },
  {
    id: "architecture-and-scope",
    number: "2",
    label: "Architecture & Scope",
    heading: "Architecture & Scope",
    description:
      "We map the system before we build it: which model, which orchestration approach, which integrations, and which fail-safes. Scope and price are locked before anything is built.",
    imageSrc: "https://media.zypher-solutions.com/01-services-page/section-4/Architecture.webp",
    imageAlt: "Illustration for the architecture and scope stage",
  },
  {
    id: "build-and-integration",
    number: "3",
    label: "Build & Integration",
    heading: "Build & Integration",
    description:
      "Engineering starts. The system is built to connect to your real data and real tools, not a sandboxed demo environment. Edge cases are scoped and handled before launch, not after.",
    imageSrc:
      "https://media.zypher-solutions.com/01-services-page/section-4/Build%20%26%20Integration.webp",
    imageAlt: "Illustration for the build and integration stage",
  },
  {
    id: "handoff-and-documentation",
    number: "4",
    label: "Handoff & Documentation",
    heading: "Handoff & Documentation",
    description:
      "Full ownership transfers at handoff: code, prompts, configs, credentials. Documentation is written for the people maintaining it, not the people who built it. What happens after launch is scoped before we start.",
    imageSrc:
      "https://media.zypher-solutions.com/01-services-page/section-4/Handoff%20%26%20Documentation.webp",
    imageAlt: "Illustration for the handoff and documentation stage",
  },
];

function getPanelElementId(stageId: string): string {
  return "ai-llm-section-four-panel-" + stageId;
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
      data-testid="ai-llm-section-four-step-button"
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

export function AiLlmAutomationSectionFour(): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { activeStageId, isDockVisible, registerPanel, scrollToStage } = useProcessNavigation(
    AI_LLM_AUTOMATION_STAGES,
    sectionRef,
  );

  return (
    <section
      aria-labelledby="ai-llm-section-four-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="ai-llm-section-four"
      id="ai-llm-automation-process"
      ref={sectionRef}
    >
      <div className={styles.sectionInner} data-motion-item="true">
        <div className={styles.sectionLayout}>
          <aside className={styles.rail} data-testid="ai-llm-section-four-rail">
            <h2
              aria-label="HOW WE WORK"
              className={styles.sectionTitle}
              id="ai-llm-section-four-title"
            >
              <span>HOW</span>
              <strong>WE WORK</strong>
            </h2>

            <nav aria-label="AI automation stages" className={styles.navigation}>
              {AI_LLM_AUTOMATION_STAGES.map((stage) => (
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
            {AI_LLM_AUTOMATION_STAGES.map((stage, index) => (
              <article
                className={styles.panel}
                data-active={activeStageId === stage.id ? "true" : "false"}
                data-testid={"ai-llm-section-four-panel-" + stage.id}
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
                    data-testid="ai-llm-section-four-image"
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
        aria-label="AI automation quick navigation"
        className={styles.jumpDock}
        data-state={isDockVisible ? "visible" : "hidden"}
        data-testid="ai-llm-section-four-jump-dock"
      >
        {AI_LLM_AUTOMATION_STAGES.map((stage) => (
          <button
            aria-current={activeStageId === stage.id ? "true" : undefined}
            aria-label={stage.label}
            className={styles.jumpButton}
            data-testid="ai-llm-section-four-jump-button"
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
