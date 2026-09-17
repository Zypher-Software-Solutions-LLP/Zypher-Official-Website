"use client";

import Image from "next/image";
import styles from "./HowWeWorkSection.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { howWeWorkSteps, type HowWeWorkPanel } from "./how-we-work-data";
type HowWeWorkPanelRecord = HowWeWorkPanel & {
  stepId: (typeof howWeWorkSteps)[number]["id"];
  stepNumber: string;
  stepLabel: string;
};

function getPanelRecords(): HowWeWorkPanelRecord[] {
  return howWeWorkSteps.flatMap((step) => {
    const panels = step.children ?? step.panels;

    return panels.map((panel) => ({
      ...panel,
      stepId: step.id,
      stepNumber: step.number,
      stepLabel: step.label,
    }));
  });
}

function getScrollBehavior(): ScrollBehavior {
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

type HowWeWorkNavigation = {
  activePanelId: string;
  isDockVisible: boolean;
  registerPanel: (panelId: string, node: HTMLElement | null) => void;
  scrollToPanel: (panelId: string) => void;
};

function useHowWeWorkNavigation(
  panelRecords: HowWeWorkPanelRecord[],
  sectionRef: RefObject<HTMLElement | null>,
): HowWeWorkNavigation {
  const [activePanelId, setActivePanelId] = useState(panelRecords[0]?.id ?? "");
  const [isDockVisible, setIsDockVisible] = useState(false);
  const panelRefs = useRef<Map<string, HTMLElement>>(new Map());
  const scrollTargetIdRef = useRef<string | null>(null);

  const registerPanel = useCallback((panelId: string, node: HTMLElement | null): void => {
    if (node) {
      panelRefs.current.set(panelId, node);
    } else {
      panelRefs.current.delete(panelId);
    }
  }, []);

  const scrollToPanel = useCallback((panelId: string): void => {
    const panel =
      panelRefs.current.get(panelId) ?? document.getElementById(`how-we-work-panel-${panelId}`);

    setActivePanelId(panelId);

    if (!panel) {
      return;
    }

    scrollTargetIdRef.current = panelId;
    panel.scrollIntoView?.({ behavior: getScrollBehavior(), block: "start" });
  }, []);

  useEffect((): (() => void) => {
    const section = sectionRef.current;
    let animationFrame: number | null = null;

    const updateDockVisibility = (): void => {
      if (!section) {
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const entryThreshold = window.innerHeight * 0.8;
      const shouldShowDock = sectionRect.top <= entryThreshold && sectionRect.bottom > 0;

      setIsDockVisible((currentVisibility) =>
        currentVisibility === shouldShowDock ? currentVisibility : shouldShowDock,
      );
    };

    const updateActivePanel = (): void => {
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

      const candidates = panelRecords
        .map((panel) => {
          const element = panelRefs.current.get(panel.id);
          const rect = element?.getBoundingClientRect();

          return rect ? { panel, rect } : null;
        })
        .filter((candidate): candidate is { panel: HowWeWorkPanelRecord; rect: DOMRect } =>
          Boolean(candidate),
        )
        .sort(
          (first, second) =>
            Math.abs(first.rect.top + first.rect.height / 2 - anchor) -
            Math.abs(second.rect.top + second.rect.height / 2 - anchor),
        );
      const nextPanel = candidates[0]?.panel;

      if (nextPanel) {
        setActivePanelId((currentPanelId) =>
          currentPanelId === nextPanel.id ? currentPanelId : nextPanel.id,
        );
      }
    };

    const scheduleActivePanelUpdate = (): void => {
      if (animationFrame !== null) {
        return;
      }

      if (typeof window.requestAnimationFrame !== "function") {
        updateActivePanel();
        return;
      }

      animationFrame = window.requestAnimationFrame(updateActivePanel);
    };

    window.addEventListener("scroll", scheduleActivePanelUpdate, { passive: true });
    window.addEventListener("resize", scheduleActivePanelUpdate);

    updateDockVisibility();

    return (): void => {
      window.removeEventListener("scroll", scheduleActivePanelUpdate);
      window.removeEventListener("resize", scheduleActivePanelUpdate);

      if (animationFrame !== null && typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [panelRecords, sectionRef]);

  return { activePanelId, isDockVisible, registerPanel, scrollToPanel };
}
function HowWeWorkStepButton({
  isActive,
  label,
  number,
  onClick,
}: {
  isActive: boolean;
  label: string;
  number: string;
  onClick: () => void;
}): ReactNode {
  return (
    <button
      aria-current={isActive ? "true" : undefined}
      className={styles.howWeWorkStepButton}
      data-testid="how-we-work-step-button"
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className={styles.howWeWorkStepNumber}>
        {number}
      </span>
      <span>{label}</span>
    </button>
  );
}

export function HowWeWorkSection(): ReactNode {
  const panelRecords = useMemo<HowWeWorkPanelRecord[]>(() => getPanelRecords(), []);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { activePanelId, isDockVisible, registerPanel, scrollToPanel } = useHowWeWorkNavigation(
    panelRecords,
    sectionRef,
  );

  const activePanel = panelRecords.find((panel) => panel.id === activePanelId) ?? panelRecords[0];
  const activeStepId = activePanel?.stepId;

  return (
    <section
      aria-labelledby="how-we-work-title"
      className={styles.howWeWorkSection}
      data-testid="how-we-work-section"
      id="how-we-work"
      ref={sectionRef}
    >
      <div className={styles.howWeWorkSectionInner}>
        <div className={styles.howWeWorkSectionLayout}>
          <aside className={styles.howWeWorkRail} data-testid="how-we-work-rail">
            <h2 aria-label="HOW WE WORK" className={styles.howWeWorkTitle} id="how-we-work-title">
              <span>HOW</span>
              <strong>WE WORK</strong>
            </h2>

            <nav aria-label="How we work stages" className={styles.howWeWorkNavigation}>
              {howWeWorkSteps.map((step) => {
                const firstPanel = step.children?.[0] ?? step.panels[0];
                const isStepActive = activeStepId === step.id;

                return (
                  <div className={styles.howWeWorkStepGroup} key={step.id}>
                    <HowWeWorkStepButton
                      isActive={isStepActive}
                      label={step.label}
                      number={step.number}
                      onClick={(): void => {
                        if (firstPanel) {
                          scrollToPanel(firstPanel.id);
                        }
                      }}
                    />
                    {step.children ? (
                      <div className={styles.howWeWorkSubnavigation}>
                        {step.children.map((panel) => (
                          <button
                            aria-current={activePanelId === panel.id ? "true" : undefined}
                            className={styles.howWeWorkSubstepButton}
                            key={panel.id}
                            onClick={(): void => scrollToPanel(panel.id)}
                            type="button"
                          >
                            <span aria-hidden="true" className={styles.howWeWorkSubstepMarker} />
                            <span>{panel.label}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </aside>

          <div className={styles.howWeWorkContent}>
            {panelRecords.map((panel) => {
              const isActive = panel.id === activePanelId;

              return (
                <article
                  className={styles.howWeWorkPanel}
                  data-active={isActive ? "true" : "false"}
                  data-testid={`how-we-work-panel-${panel.id}`}
                  id={`how-we-work-panel-${panel.id}`}
                  key={panel.id}
                  ref={(node): void => registerPanel(panel.id, node)}
                >
                  <header className={styles.howWeWorkPanelHeader}>
                    <div className={styles.howWeWorkIconFrame} data-testid="how-we-work-icon">
                      <Image
                        alt=""
                        fill
                        loading={panel.id === panelRecords[0]?.id ? "eager" : "lazy"}
                        sizes="(max-width: 767px) 2.75rem, 3.5rem"
                        src={panel.iconSrc}
                      />
                    </div>
                    <h3>{panel.heading}</h3>
                  </header>

                  <p className={styles.howWeWorkDescription}>{panel.description}</p>

                  <div className={styles.howWeWorkMedia}>
                    <Image
                      alt={panel.imageAlt}
                      className={styles.howWeWorkImage}
                      data-testid="how-we-work-image"
                      fill
                      loading={panel.id === panelRecords[0]?.id ? "eager" : "lazy"}
                      sizes="(max-width: 767px) min(100vw - 2rem, 36rem), (max-width: 1199px) min(100vw - 4rem, 48rem), 54vw"
                      src={panel.imageSrc}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <nav
        aria-label="How we work quick navigation"
        className={styles.howWeWorkJumpDock}
        data-state={isDockVisible ? "visible" : "hidden"}
        data-testid="how-we-work-jump-dock"
      >
        {howWeWorkSteps.map((step) => {
          const firstPanel = step.children?.[0] ?? step.panels[0];

          return (
            <button
              aria-current={activeStepId === step.id ? "true" : undefined}
              aria-label={step.label}
              className={styles.howWeWorkJumpButton}
              data-testid="how-we-work-jump-button"
              key={step.id}
              onClick={(): void => {
                if (firstPanel) {
                  scrollToPanel(firstPanel.id);
                }
              }}
              type="button"
            >
              {step.number}
            </button>
          );
        })}
      </nav>
    </section>
  );
}
