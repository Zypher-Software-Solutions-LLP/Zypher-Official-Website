"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useViewportReveal } from "@/components/motion/useViewportReveal";
import { coreExpertiseCategories, type CoreExpertiseCategory } from "./core-expertise-data";
import styles from "./CoreExpertiseSection.module.css";

function CategoryTabs({
  categories,
  activeCategoryId,
  onSelect,
}: {
  categories: ReadonlyArray<CoreExpertiseCategory>;
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}): ReactNode {
  return (
    <nav
      aria-label="Core expertise services"
      className={styles.tabs}
      data-testid="core-expertise-tabs"
    >
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;

        return (
          <button
            aria-pressed={isActive}
            className={styles.tab}
            data-state={isActive ? "active" : "inactive"}
            key={category.id}
            onClick={() => onSelect(category.id)}
            type="button"
          >
            {category.label}
          </button>
        );
      })}
    </nav>
  );
}

export function CoreExpertiseSection(): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState(coreExpertiseCategories[0].id);
  const hasEnteredViewport = useViewportReveal(sectionRef);
  const activeCategory =
    coreExpertiseCategories.find((category) => category.id === activeCategoryId) ??
    coreExpertiseCategories[0];

  return (
    <section
      aria-labelledby="core-expertise-title"
      className={styles.section}
      data-reveal-state={hasEnteredViewport ? "visible" : "hidden"}
      data-testid="core-expertise-section"
      id="core-expertise"
      ref={sectionRef}
    >
      <div className={styles.shell}>
        <div className={styles.panel} data-testid="core-expertise-panel">
          <div className={styles.grid} key={activeCategory.id}>
            <p className={styles.eyebrow}>Core expertise</p>
            <div className={styles.headingGroup}>
              <h2 className={styles.title} id="core-expertise-title">
                {activeCategory.label}
              </h2>
              <p className={styles.description}>{activeCategory.description}</p>
              <ButtonLink
                className={styles.cta}
                href={activeCategory.ctaHref}
                trackingLabel={activeCategory.ctaLabel}
                trackingLocation="core-expertise-section"
              >
                {activeCategory.ctaLabel} →
              </ButtonLink>
            </div>

            <div className={styles.cards} data-testid="core-expertise-cards">
              {activeCategory.capabilities.map((capability, index) => (
                <article
                  className={styles.card}
                  data-testid="core-expertise-card"
                  key={capability.title}
                >
                  <Image
                    alt={capability.imageAlt}
                    className={styles.cardImage}
                    fill
                    sizes="(max-width: 767px) 42vw, (max-width: 1100px) 20vw, 13rem"
                    src={capability.imageSrc}
                  />
                  <div className={styles.cardOverlay} />
                  <h3 className={styles.cardTitle} data-card-index={index + 1}>
                    {capability.title}
                  </h3>
                </article>
              ))}
            </div>

            <div className={styles.deliverables}>
              <h3 className={styles.deliverablesTitle}>Deliverables</h3>
              <ul className={styles.deliverablesList} data-testid="core-expertise-deliverables">
                {activeCategory.deliverables.map((deliverable, index) => (
                  <li className={styles.deliverable} key={deliverable}>
                    <span aria-hidden="true" className={styles.deliverableMarker}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <CategoryTabs
          activeCategoryId={activeCategory.id}
          categories={coreExpertiseCategories}
          onSelect={setActiveCategoryId}
        />
      </div>
    </section>
  );
}
