"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { workCategories, workProjects, type WorkCategory } from "./work-projects-data";
import styles from "./WorkProjectsSection.module.css";

export function WorkProjectsSection(): ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<WorkCategory>("All");

  const visibleProjects = useMemo(
    () =>
      selectedCategory === "All"
        ? workProjects
        : workProjects.filter((project) => project.tags.includes(selectedCategory)),
    [selectedCategory],
  );

  return (
    <section
      aria-labelledby="work-projects-title"
      className={styles.workProjectsSection}
      data-motion-section="true"
      data-layout="12-column"
      data-testid="work-projects-section"
      id="work-projects"
    >
      <div
        aria-hidden="true"
        className={styles.workProjectsSurface}
        data-testid="work-projects-surface"
      />
      <svg
        aria-hidden="true"
        className={styles.workProjectsBoundary}
        data-testid="work-projects-boundary-top"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 28 C220 8 430 8 690 48 C920 82 1220 74 1440 32 L1440 140 L0 140 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <div className={styles.workProjectsInner} data-motion-item="true">
        <h2 className={styles.workProjectsTitle} id="work-projects-title">
          Built for Real Problems.
        </h2>

        <div aria-label="Work categories" className={styles.workProjectsFilters} role="toolbar">
          {workCategories.map((category) => (
            <button
              aria-pressed={selectedCategory === category}
              className={`${styles.workProjectsFilter} ${
                selectedCategory === category ? styles.workProjectsFilterActive : ""
              }`.trim()}
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        <div
          aria-live="polite"
          className={styles.workProjectsGrid}
          data-testid="work-projects-grid"
        >
          {visibleProjects.map((project) => (
            <article
              className={styles.workProjectCard}
              data-testid="work-project-card"
              key={`${selectedCategory}-${project.id}`}
              tabIndex={0}
            >
              <div className={styles.workProjectMedia} data-testid="work-project-media">
                <Image
                  alt={project.imageAlt}
                  className={styles.workProjectImage}
                  data-image-position={project.imagePosition}
                  data-image-quality="100"
                  data-image-src={project.imageSrc}
                  fill
                  quality={100}
                  sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1199px) 42vw, 368px"
                  src={project.imageSrc}
                />
              </div>
              <h3 className={styles.workProjectTitle}>{project.title}</h3>
              <p className={styles.workProjectDescription}>{project.description}</p>
              <ul aria-label={project.title + " categories"} className={styles.workProjectTags}>
                {project.tags.map((tag) => (
                  <li className={styles.workProjectTag} key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
