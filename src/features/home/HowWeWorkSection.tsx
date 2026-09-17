"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { howWeWorkSteps, type HowWeWorkPanel } from "@/features/home/how-we-work-data";

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
      className="how-we-work__step-button"
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className="how-we-work__step-number">
        {number}
      </span>
      <span>{label}</span>
    </button>
  );
}

export function HowWeWorkSection(): ReactNode {
  const panelRecords = useMemo<HowWeWorkPanelRecord[]>(() => getPanelRecords(), []);
  const [activePanelId, setActivePanelId] = useState(panelRecords[0]?.id ?? "");
  const [isJumpDockVisible, setIsJumpDockVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRefs = useRef<Map<string, HTMLElement>>(new Map());
  const scrollTargetIdRef = useRef<string | null>(null);

  const activePanel = panelRecords.find((panel) => panel.id === activePanelId) ?? panelRecords[0];
  const activeStepId = activePanel?.stepId;

  const registerPanel = useCallback((panelId: string, node: HTMLElement | null): void => {
    if (node) {
      panelRefs.current.set(panelId, node);
    } else {
      panelRefs.current.delete(panelId);
    }
  }, []);

  const scrollToPanel = useCallback((panelId: string): void => {
    const panel = panelRefs.current.get(panelId);

    if (!panel) {
      return;
    }

    scrollTargetIdRef.current = panelId;
    setActivePanelId(panelId);
    panel.scrollIntoView?.({ behavior: getScrollBehavior(), block: "start" });
  }, []);

  useEffect((): (() => void) => {
    const section = sectionRef.current;
    let sectionObserver: IntersectionObserver | null = null;
    let animationFrame: number | null = null;

    const updateActivePanel = (): void => {
      animationFrame = null;
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
        .filter(({ rect }) => rect.top <= anchor && rect.bottom >= anchor)
        .sort(
          (first, second) => Math.abs(first.rect.top - anchor) - Math.abs(second.rect.top - anchor),
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

    if (section && "IntersectionObserver" in window) {
      sectionObserver = new IntersectionObserver(
        ([entry]) => setIsJumpDockVisible(Boolean(entry?.isIntersecting)),
        { rootMargin: "0px", threshold: 0 },
      );
      sectionObserver.observe(section);
    }

    return (): void => {
      window.removeEventListener("scroll", scheduleActivePanelUpdate);
      window.removeEventListener("resize", scheduleActivePanelUpdate);
      sectionObserver?.disconnect();

      if (animationFrame !== null && typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [panelRecords]);

  return (
    <section
      aria-labelledby="how-we-work-title"
      className="how-we-work-section"
      data-testid="how-we-work-section"
      id="how-we-work"
      ref={sectionRef}
    >
      <div className="how-we-work-section__inner">
        <div className="how-we-work-section__layout">
          <aside className="how-we-work__rail" data-testid="how-we-work-rail">
            <h2 aria-label="HOW WE WORK" className="how-we-work__title" id="how-we-work-title">
              <span>HOW</span>
              <strong>WE WORK</strong>
            </h2>

            <nav aria-label="How we work stages" className="how-we-work__navigation">
              {howWeWorkSteps.map((step) => {
                const firstPanel = step.children?.[0] ?? step.panels[0];
                const isStepActive = activeStepId === step.id;

                return (
                  <div className="how-we-work__step-group" key={step.id}>
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
                      <div className="how-we-work__subnavigation">
                        {step.children.map((panel) => (
                          <button
                            aria-current={activePanelId === panel.id ? "true" : undefined}
                            className="how-we-work__substep-button"
                            key={panel.id}
                            onClick={(): void => scrollToPanel(panel.id)}
                            type="button"
                          >
                            <span aria-hidden="true" className="how-we-work__substep-marker" />
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

          <div className="how-we-work__content">
            {panelRecords.map((panel) => {
              const isActive = panel.id === activePanelId;

              return (
                <article
                  className="how-we-work__panel"
                  data-active={isActive ? "true" : "false"}
                  data-testid={`how-we-work-panel-${panel.id}`}
                  id={`how-we-work-panel-${panel.id}`}
                  key={panel.id}
                  ref={(node): void => registerPanel(panel.id, node)}
                >
                  <header className="how-we-work__panel-header">
                    <div className="how-we-work__icon-frame" data-testid="how-we-work-icon">
                      <Image
                        alt=""
                        fill
                        loading={panel.id === panelRecords[0]?.id ? "eager" : "lazy"}
                        sizes="(max-width: 767px) 2.75rem, 3.5rem"
                        src={panel.iconSrc}
                        unoptimized
                      />
                    </div>
                    <h3>{panel.heading}</h3>
                  </header>

                  <p className="how-we-work__description">{panel.description}</p>

                  <div className="how-we-work__media">
                    <Image
                      alt={panel.imageAlt}
                      className="how-we-work__image"
                      data-testid="how-we-work-image"
                      fill
                      loading={panel.id === panelRecords[0]?.id ? "eager" : "lazy"}
                      sizes="(max-width: 767px) min(100vw - 2rem, 36rem), (max-width: 1199px) min(100vw - 4rem, 48rem), 54vw"
                      src={panel.imageSrc}
                      unoptimized
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
        className={
          "how-we-work__jump-dock" + (isJumpDockVisible ? " how-we-work__jump-dock--visible" : "")
        }
        data-testid="how-we-work-jump-dock"
      >
        {howWeWorkSteps.map((step) => {
          const firstPanel = step.children?.[0] ?? step.panels[0];

          return (
            <button
              aria-current={activeStepId === step.id ? "true" : undefined}
              aria-label={step.label}
              className="how-we-work__jump-button"
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
