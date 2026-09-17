"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { scaleClientLogos, scaleMetrics, scaleProjects } from "@/features/home/scale-data";

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

function getProjectStep(viewport: HTMLElement): number {
  const firstCard = viewport.querySelector<HTMLElement>(".scale-section__project-item");
  const projects = viewport.querySelector<HTMLElement>(".scale-section__projects");

  if (!firstCard || !projects) {
    return viewport.clientWidth;
  }

  const gap = Number.parseFloat(getComputedStyle(projects).columnGap) || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

function ProjectCard({ project }: { project: ScaleProjectRecord }): ReactNode {
  return (
    <li className="scale-section__project-item">
      <Link
        aria-label={project.title + " project"}
        className="scale-section__project-card"
        data-testid="scale-project-card"
        href={project.href}
      >
        <Image
          alt={project.imageAlt}
          className="scale-section__project-image"
          fill
          priority
          sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1199px) 40vw, 368px"
          src={project.imageSrc}
          unoptimized
        />
        <div aria-hidden="true" className="scale-section__project-overlay" />
        <div className="scale-section__project-content">
          <p className="scale-section__project-eyebrow">{project.eyebrow}</p>
          <h4 className="scale-section__project-title">{project.title}</h4>
          <p className="scale-section__project-description" data-testid="scale-project-description">
            {project.description}
          </p>
          <span
            aria-hidden="true"
            className="scale-section__project-arrow"
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
  const projectViewportRef = useRef<HTMLDivElement | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [visibleProjectCount, setVisibleProjectCount] = useState(DESKTOP_PROJECT_COUNT);

  useEffect(() => {
    const updateVisibleProjectCount = (): void => {
      setVisibleProjectCount(getVisibleProjectCount());
    };

    updateVisibleProjectCount();
    window.addEventListener("resize", updateVisibleProjectCount);

    return (): void => {
      window.removeEventListener("resize", updateVisibleProjectCount);
    };
  }, []);

  useEffect(() => {
    setActiveProjectIndex(0);
    projectViewportRef.current?.scrollTo?.({ behavior: "auto", left: 0 });
  }, [visibleProjectCount]);

  const maxProjectIndex = Math.max(0, scaleProjects.length - visibleProjectCount);
  const carouselEnabled = visibleProjectCount < scaleProjects.length;

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

      const nextIndex = Math.min(maxProjectIndex, Math.max(0, activeProjectIndex + direction));

      if (nextIndex === activeProjectIndex) {
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
    [activeProjectIndex, carouselEnabled, maxProjectIndex],
  );

  return (
    <section
      aria-labelledby="scale-section-title"
      className="scale-section"
      data-testid="scale-section"
      id="scale"
    >
      <div className="scale-section__inner">
        <div className="scale-section__top">
          <h2
            aria-label="TRUSTED BY TEAMS AT EVERY SCALE"
            className="scale-section__title"
            id="scale-section-title"
          >
            <span>TRUSTED BY TEAMS AT</span>
            <strong>EVERY SCALE</strong>
          </h2>

          <div aria-hidden="true" className="scale-section__illustration">
            <Image
              alt=""
              className="scale-section__illustration-image"
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1199px) 45vw, 578px"
              src="https://media.zypher-solutions.com/home-page/section-2/Scale%20Section.png"
            />
          </div>
        </div>

        <ul aria-label="Zypher delivery milestones" className="scale-section__metrics">
          {scaleMetrics.map((metric) => (
            <li className="scale-section__metric-card" key={metric.id}>
              <h3 aria-label={metric.title} className="scale-section__metric-title">
                {"prefix" in metric && metric.prefix ? <span>{metric.prefix}&nbsp;</span> : null}
                <span className="scale-section__metric-value">{metric.value}</span>{" "}
                <span className="scale-section__metric-label">{metric.label}</span>
              </h3>
              <p>{metric.description}</p>
            </li>
          ))}
        </ul>

        <div
          aria-label="Clients Zypher has worked with"
          className="scale-section__logo-viewport"
          role="region"
        >
          <div className="scale-section__logo-track">
            <ul className="scale-section__logo-group" role="list">
              {scaleClientLogos.map((logo) => (
                <li data-testid="scale-client-logo" key={logo.id}>
                  <Image alt={logo.alt} height={480} src={logo.src} unoptimized width={1200} />
                </li>
              ))}
            </ul>
            <ul aria-hidden="true" className="scale-section__logo-group" role="list">
              {scaleClientLogos.map((logo) => (
                <li key={logo.id + "-duplicate"}>
                  <Image alt="" height={480} src={logo.src} unoptimized width={1200} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="scale-section__projects-header">
          <ButtonLink
            className="scale-section__view-all"
            href="/work"
            trackingLabel="View All Works"
            trackingLocation="scale"
          >
            View All Works <span aria-hidden="true">&#8594;</span>
          </ButtonLink>
          <h3 className="scale-section__projects-title">
            <span>TAILORED SOLUTIONS, BUILT FOR</span>
            <strong>REAL PROBLEMS</strong>
          </h3>
        </div>

        <div className="scale-section__projects-row">
          <button
            aria-label="Previous projects"
            className="scale-section__carousel-button"
            disabled={!carouselEnabled || activeProjectIndex === 0}
            onClick={() => handleProjectNavigation(-1)}
            type="button"
          >
            &#8592;
          </button>
          <div
            aria-label="Featured projects"
            className="scale-section__projects-viewport"
            data-testid="scale-projects-viewport"
            onScroll={handleProjectViewportScroll}
            ref={projectViewportRef}
            role="region"
          >
            <ul className="scale-section__projects">
              {scaleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ul>
          </div>
          <p aria-hidden="true" className="scale-section__swipe-hint">
            Swipe to explore
          </p>
          <button
            aria-label="Next projects"
            className="scale-section__carousel-button"
            disabled={!carouselEnabled || activeProjectIndex === maxProjectIndex}
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
