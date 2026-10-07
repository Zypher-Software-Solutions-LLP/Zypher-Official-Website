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

const CRM_ERP_SOLUTIONS_AUTOMATION_STAGES: readonly ProcessStage[] = [
  {
    id: "discovery",
    number: "1",
    label: "Discovery",
    heading: "Discovery",
    description:
      "We start by understanding your actual workflow, not what your org chart says it is, but how your team operates day to day. Where data lives, what gets missed, what needs to connect, and what working looks like for the people using the system. No proposal before this is done.",
    imageSrc: "https://media.zypher-solutions.com/05-services-page/section-4/Discovery.webp",
    imageAlt: "Illustration for the discovery stage",
  },
  {
    id: "system-mapping-and-config",
    number: "2",
    label: "System Mapping & Config",
    heading: "System Mapping & Config",
    description:
      "We design the system around your workflow, pipeline stages, custom fields, automation rules, user permissions, and integrations all mapped before anything is built or configured. For custom builds, this is where architecture is locked. For platform implementations, this is where the configuration blueprint is confirmed. Scope and price are fixed here.",
    imageSrc:
      "https://media.zypher-solutions.com/05-services-page/section-4/System%20Mapping%20%26%20Config.webp",
    imageAlt: "Illustration for the system mapping and configuration stage",
  },
  {
    id: "data-migration-and-integration",
    number: "3",
    label: "Data Migration & Integration",
    heading: "Data Migration & Integration",
    description:
      "Existing data is cleaned, validated, and migrated into the new system, contacts, deal history, documents, and records all verified before go-live. Third-party integrations are connected and tested against real data, not sample sets. Nothing goes live until it works end to end.",
    imageSrc:
      "https://media.zypher-solutions.com/05-services-page/section-4/Data%20Migration%20%26%20Integration.webp",
    imageAlt: "Illustration for the data migration and integration stage",
  },
  {
    id: "training-and-handoff",
    number: "4",
    label: "Training & Handoff",
    heading: "Training & Handoff",
    description:
      "Your team is trained on the system before handoff, not after. Documentation covers how to use it, how to maintain it, and how to extend it without breaking what works. Post-launch support scope is agreed before the build starts.",
    imageSrc:
      "https://media.zypher-solutions.com/05-services-page/section-4/Training%20%26%20Handoff.webp",
    imageAlt: "Illustration for the training and handoff stage",
  },
];

function getPanelElementId(stageId: string): string {
  return "crm-erp-solutions-section-four-panel-" + stageId;
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
      data-testid="crm-erp-solutions-section-four-step-button"
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

export function CrmErpSolutionsSectionFour(): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { activeStageId, isDockVisible, registerPanel, scrollToStage } = useProcessNavigation(
    CRM_ERP_SOLUTIONS_AUTOMATION_STAGES,
    sectionRef,
  );

  return (
    <section
      aria-labelledby="crm-erp-solutions-section-four-title"
      className={styles.section}
      data-motion-section="true"
      data-testid="crm-erp-solutions-section-four"
      id="crm-erp-solutions-process"
      ref={sectionRef}
    >
      <div className={styles.sectionInner} data-motion-item="true">
        <div className={styles.sectionLayout}>
          <aside className={styles.rail} data-testid="crm-erp-solutions-section-four-rail">
            <h2
              aria-label="HOW WE WORK"
              className={styles.sectionTitle}
              id="crm-erp-solutions-section-four-title"
            >
              <span>HOW</span>
              <strong>WE WORK</strong>
            </h2>

            <nav aria-label="CRM/ERP stages" className={styles.navigation}>
              {CRM_ERP_SOLUTIONS_AUTOMATION_STAGES.map((stage) => (
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
            {CRM_ERP_SOLUTIONS_AUTOMATION_STAGES.map((stage, index) => (
              <article
                className={styles.panel}
                data-active={activeStageId === stage.id ? "true" : "false"}
                data-testid={"crm-erp-solutions-section-four-panel-" + stage.id}
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
                    data-testid="crm-erp-solutions-section-four-image"
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
        aria-label="CRM/ERP quick navigation"
        className={styles.jumpDock}
        data-state={isDockVisible ? "visible" : "hidden"}
        data-testid="crm-erp-solutions-section-four-jump-dock"
      >
        {CRM_ERP_SOLUTIONS_AUTOMATION_STAGES.map((stage) => (
          <button
            aria-current={activeStageId === stage.id ? "true" : undefined}
            aria-label={stage.label}
            className={styles.jumpButton}
            data-testid="crm-erp-solutions-section-four-jump-button"
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
