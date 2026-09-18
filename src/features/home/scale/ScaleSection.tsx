"use client";

import Image from "next/image";
import styles from "./ScaleSection.module.css";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode, RefObject } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useViewportReveal } from "@/components/motion/useViewportReveal";
import { scaleClientLogos, scaleMetrics, scaleProjects } from "./scale-data";
type ScaleProjectRecord = (typeof scaleProjects)[number];
type NavigationDirection = -1 | 1;

const DESKTOP_PROJECT_COUNT = 3;
const TABLET_BREAKPOINT = 1199;
const MOBILE_BREAKPOINT = 767;

function getVisibleProjectCount(): number {
  if (typeof window === "undefined") {
    return DESKTOP_PROJECT_COUNT;
  }

  if (typeof window.matchMedia !== "function") {
    return DESKTOP_PROJECT_COUNT;
  }

  if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
    return 1;
  }

  if (window.matchMedia(`(max-width: ${TABLET_BREAKPOINT}px)`).matches) {
    return 2;
  }

  return DESKTOP_PROJECT_COUNT;
}

function subscribeToViewport(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return (): void => undefined;
  }

  window.addEventListener("resize", callback);
  return (): void => window.removeEventListener("resize", callback);
}

function getServerVisibleProjectCount(): number {
  return DESKTOP_PROJECT_COUNT;
}

function getProjectStep(viewport: HTMLElement): number {
  const firstCard = viewport.querySelector<HTMLElement>('[data-testid="scale-project-card"]');
  const projects = viewport.querySelector<HTMLElement>('[data-testid="scale-projects"]');

  if (!firstCard || !projects) {
    return viewport.clientWidth;
  }

  const gap = Number.parseFloat(getComputedStyle(projects).columnGap) || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

type ScaleCarousel = {
  projectViewportRef: RefObject<HTMLDivElement | null>;
  currentProjectIndex: number;
  carouselEnabled: boolean;
  isAtEnd: boolean;
  handleProjectViewportScroll: () => void;
  handleProjectNavigation: (direction: NavigationDirection) => void;
};

function useScaleCarousel(projectCount: number): ScaleCarousel {
  const projectViewportRef = useRef<HTMLDivElement | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const visibleProjectCount = useSyncExternalStore(
    subscribeToViewport,
    getVisibleProjectCount,
    getServerVisibleProjectCount,
  );

  useEffect(() => {
    projectViewportRef.current?.scrollTo?.({ behavior: "auto", left: 0 });
  }, [visibleProjectCount]);

  const maxProjectIndex = Math.max(0, projectCount - visibleProjectCount);
  const currentProjectIndex = Math.min(activeProjectIndex, maxProjectIndex);
  const carouselEnabled = visibleProjectCount < projectCount;

  const handleProjectViewportScroll = useCallback((): void => {
    if (!carouselEnabled) {
      return;
    }

    const viewport = projectViewportRef.current;

    if (!viewport) {
      return;
    }

    const step = getProjectStep(viewport);

    if (step <= 0) {
      return;
    }

    const nextIndex = Math.min(
      maxProjectIndex,
      Math.max(0, Math.round(viewport.scrollLeft / step)),
    );
    setActiveProjectIndex(nextIndex);
  }, [carouselEnabled, maxProjectIndex]);

  const handleProjectNavigation = useCallback(
    (direction: NavigationDirection): void => {
      if (!carouselEnabled) {
        return;
      }

      const viewport = projectViewportRef.current;

      if (!viewport) {
        return;
      }

      const nextIndex = Math.min(maxProjectIndex, Math.max(0, currentProjectIndex + direction));

      if (nextIndex === currentProjectIndex) {
        return;
      }

      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";

      viewport.scrollTo({
        behavior,
        left: nextIndex * getProjectStep(viewport),
      });
      setActiveProjectIndex(nextIndex);
    },
    [carouselEnabled, currentProjectIndex, maxProjectIndex],
  );

  return {
    carouselEnabled,
    currentProjectIndex,
    isAtEnd: currentProjectIndex === maxProjectIndex,
    handleProjectNavigation,
    handleProjectViewportScroll,
    projectViewportRef,
  };
}
function ProjectCard({ project }: { project: ScaleProjectRecord }): ReactNode {
  return (
    <li className={styles.scaleSectionProjectItem}>
      <Link
        aria-label={project.title + " project"}
        className={styles.scaleSectionProjectCard}
        data-testid="scale-project-card"
        href={project.href}
      >
        <Image
          alt={project.imageAlt}
          className={styles.scaleSectionProjectImage}
          fill
          priority
          sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1199px) 40vw, 368px"
          src={project.imageSrc}
        />
        <div aria-hidden="true" className={styles.scaleSectionProjectOverlay} />
        <div className={styles.scaleSectionProjectContent}>
          <p className={styles.scaleSectionProjectEyebrow}>{project.eyebrow}</p>
          <h4 className={styles.scaleSectionProjectTitle}>{project.title}</h4>
          <p
            className={styles.scaleSectionProjectDescription}
            data-testid="scale-project-description"
          >
            {project.description}
          </p>
          <span
            aria-hidden="true"
            className={styles.scaleSectionProjectArrow}
            data-testid="scale-project-arrow"
          >
            &#8599;
          </span>
        </div>
      </Link>
    </li>
  );
}

export function ScaleSection(): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasEnteredViewport = useViewportReveal(sectionRef);
  const {
    carouselEnabled,
    currentProjectIndex,
    isAtEnd,
    handleProjectNavigation,
    handleProjectViewportScroll,
    projectViewportRef,
  } = useScaleCarousel(scaleProjects.length);
  return (
    <section
      aria-labelledby="scale-section-title"
      className={styles.scaleSection}
      data-reveal-state={hasEnteredViewport ? "visible" : "hidden"}
      data-testid="scale-section"
      id="scale"
      ref={sectionRef}
    >
      <div className={styles.scaleSectionInner} data-testid="scale-section-inner">
        <div className={styles.scaleSectionTop}>
          <h2
            aria-label="TRUSTED BY TEAMS AT EVERY SCALE"
            className={styles.scaleSectionTitle}
            data-testid="scale-section-title"
            id="scale-section-title"
          >
            <span>TRUSTED BY TEAMS AT</span>
            <strong>EVERY SCALE</strong>
          </h2>

          <div
            aria-hidden="true"
            className={styles.scaleSectionIllustration}
            data-testid="scale-illustration"
          >
            <Image
              alt=""
              className={styles.scaleSectionIllustrationImage}
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1199px) 45vw, 578px"
              src="https://media.zypher-solutions.com/home-page/section-2/Scale%20Section.png"
            />
          </div>
        </div>

        <ul
          aria-label="Zypher delivery milestones"
          className={styles.scaleSectionMetrics}
          data-testid="scale-metrics"
        >
          {scaleMetrics.map((metric) => (
            <li
              className={styles.scaleSectionMetricCard}
              data-testid="scale-metric-card"
              key={metric.id}
            >
              <h3 aria-label={metric.title} className={styles.scaleSectionMetricTitle}>
                {"prefix" in metric && metric.prefix ? <span>{metric.prefix}&nbsp;</span> : null}
                <span className={styles.scaleSectionMetricValue}>{metric.value}</span>{" "}
                <span className={styles.scaleSectionMetricLabel}>{metric.label}</span>
              </h3>
              <p>{metric.description}</p>
            </li>
          ))}
        </ul>

        <div
          aria-label="Clients Zypher has worked with"
          className={styles.scaleSectionLogoViewport}
          role="region"
        >
          <div className={styles.scaleSectionLogoTrack} data-testid="scale-logo-track">
            <ul className={styles.scaleSectionLogoGroup} role="list">
              {scaleClientLogos.map((logo) => (
                <li data-testid="scale-client-logo" key={logo.id}>
                  <Image alt={logo.alt} height={480} src={logo.src} width={1200} />
                </li>
              ))}
            </ul>
            <ul aria-hidden="true" className={styles.scaleSectionLogoGroup} role="list">
              {scaleClientLogos.map((logo) => (
                <li key={logo.id + "-duplicate"}>
                  <Image alt="" height={480} src={logo.src} width={1200} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.scaleSectionProjectsHeader}>
          <ButtonLink
            className={styles.scaleSectionViewAll}
            href="/work"
            trackingLabel="View All Works"
            trackingLocation="scale"
          >
            View All Works <span aria-hidden="true">&#8594;</span>
          </ButtonLink>
          <h3 className={styles.scaleSectionProjectsTitle} data-testid="scale-projects-title">
            <span>TAILORED SOLUTIONS, BUILT FOR</span>
            <strong>REAL PROBLEMS</strong>
          </h3>
        </div>

        <div className={styles.scaleSectionProjectsRow}>
          <button
            aria-label="Previous projects"
            className={styles.scaleSectionCarouselButton}
            disabled={!carouselEnabled || currentProjectIndex === 0}
            onClick={() => handleProjectNavigation(-1)}
            type="button"
          >
            &#8592;
          </button>
          <div
            aria-label="Featured projects"
            className={styles.scaleSectionProjectsViewport}
            data-testid="scale-projects-viewport"
            onScroll={handleProjectViewportScroll}
            ref={projectViewportRef}
            role="region"
          >
            <ul className={styles.scaleSectionProjects} data-testid="scale-projects">
              {scaleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ul>
          </div>
          <p
            aria-hidden="true"
            className={styles.scaleSectionSwipeHint}
            data-testid="scale-swipe-hint"
          >
            Swipe to explore
          </p>
          <button
            aria-label="Next projects"
            className={styles.scaleSectionCarouselButton}
            disabled={!carouselEnabled || isAtEnd}
            onClick={() => handleProjectNavigation(1)}
            type="button"
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
}
