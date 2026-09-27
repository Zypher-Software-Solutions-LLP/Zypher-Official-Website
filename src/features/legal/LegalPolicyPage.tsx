"use client";

import { usePageScrollController } from "@/components/motion/MotionProvider";
import { useEffect, useRef, useState } from "react";
import type { LegalPolicyBlock, LegalPolicySection } from "./legal-policy-types";
import styles from "./PrivacyPolicyPage.module.css";

export type LegalPolicyPageProps = {
  bodyLabel: string;
  eyebrow: string;
  heroDescription: string;
  indexLabel: string;
  intro: readonly string[];
  lastUpdated: string;
  lastUpdatedDateTime?: string;
  lastUpdatedLabel: string;
  pageKey: string;
  sections: readonly LegalPolicySection[];
  title: string;
};

function renderPolicyBlock(block: LegalPolicyBlock, key: string): React.ReactNode {
  if (block.type === "paragraph") {
    return <p key={key}>{block.text}</p>;
  }

  if (block.type === "subheading") {
    return <h3 key={key}>{block.text}</h3>;
  }

  if (block.type === "list") {
    return (
      <ul key={key}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <address key={key}>
      {block.lines.map((line, index) => (
        <span key={line + "-" + index}>
          {line}
          {index < block.lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </address>
  );
}

function getScrollBehavior(): ScrollBehavior {
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function LegalPolicyPage({
  bodyLabel,
  eyebrow,
  heroDescription,
  indexLabel,
  intro,
  lastUpdated,
  lastUpdatedDateTime,
  lastUpdatedLabel,
  pageKey,
  sections,
  title,
}: LegalPolicyPageProps): React.ReactNode {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const policyBodyRef = useRef<HTMLDivElement>(null);
  const scrollTargetIdRef = useRef<string | null>(null);
  const pageScrollController = usePageScrollController();

  useEffect((): (() => void) => {
    const policyBody = policyBodyRef.current;
    if (!policyBody) {
      return (): void => {};
    }

    const sectionElements = Array.from(
      policyBody.querySelectorAll<HTMLElement>("[data-policy-section]"),
    );
    let animationFrame: number | null = null;

    const cancelProgrammaticNavigation = (): void => {
      scrollTargetIdRef.current = null;
    };

    const updateActiveSection = (): void => {
      animationFrame = null;
      const anchor = window.innerHeight * 0.35;
      const scrollTargetId = scrollTargetIdRef.current;

      if (scrollTargetId) {
        const targetElement = sectionElements.find(
          (section) => section.dataset.policySection === scrollTargetId,
        );
        const targetRect = targetElement?.getBoundingClientRect();
        const targetReached = Boolean(
          targetRect && targetRect.top <= anchor && targetRect.bottom >= anchor,
        );

        if (!targetReached) {
          return;
        }

        scrollTargetIdRef.current = null;
      }

      const candidates = sectionElements
        .map((section) => {
          const rect = section.getBoundingClientRect();
          return {
            section,
            distance: Math.abs(rect.top + rect.height / 2 - anchor),
          };
        })
        .sort((first, second) => first.distance - second.distance);

      const nextSection = candidates[0]?.section;
      if (nextSection) {
        const nextSectionId = nextSection.dataset.policySection ?? sections[0]?.id ?? "";
        setActiveSectionId((currentSectionId) =>
          currentSectionId === nextSectionId ? currentSectionId : nextSectionId,
        );
      }
    };

    const scheduleActiveSectionUpdate = (): void => {
      if (animationFrame !== null) {
        return;
      }

      if (typeof window.requestAnimationFrame !== "function") {
        updateActiveSection();
        return;
      }

      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    const unsubscribeFromUserScrollIntent = pageScrollController?.subscribeToUserScrollIntent(
      cancelProgrammaticNavigation,
    );

    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    if (!pageScrollController) {
      window.addEventListener("wheel", cancelProgrammaticNavigation, { passive: true });
      window.addEventListener("touchmove", cancelProgrammaticNavigation, { passive: true });
    }

    scheduleActiveSectionUpdate();

    return (): void => {
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
      unsubscribeFromUserScrollIntent?.();

      if (!pageScrollController) {
        window.removeEventListener("wheel", cancelProgrammaticNavigation);
        window.removeEventListener("touchmove", cancelProgrammaticNavigation);
      }

      if (animationFrame !== null && typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [pageScrollController, sections]);

  function handleSectionClick(event: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void {
    event.preventDefault();
    const policyBody = policyBodyRef.current;
    const section = policyBody?.querySelector<HTMLElement>("#" + sectionId);
    if (!policyBody || !section) {
      return;
    }

    setActiveSectionId(sectionId);
    scrollTargetIdRef.current = sectionId;

    if (pageScrollController) {
      pageScrollController.scrollTo(section, {
        behavior: getScrollBehavior(),
        offset: -24,
        onComplete: (): void => {
          if (scrollTargetIdRef.current === sectionId) {
            scrollTargetIdRef.current = null;
          }
        },
      });
    } else {
      const top = section.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ behavior: getScrollBehavior(), top });
    }

    window.history.replaceState(null, "", "#" + sectionId);
  }

  return (
    <main className={styles.privacyPolicyPage} id="main-content">
      <section className={styles.privacyPolicyHero} data-testid={pageKey + "-hero"}>
        <div className={styles.privacyPolicyHeroGrid}>
          <div className={styles.privacyPolicyHeroContent} data-motion-intro="true">
            <p className={styles.privacyPolicyEyebrow}>{eyebrow}</p>
            <h1>{title}</h1>
            <p className={styles.privacyPolicyHeroDescription}>{heroDescription}</p>
          </div>
        </div>
      </section>

      <section
        className={styles.privacyPolicyReader}
        data-motion-section="true"
        data-testid={pageKey + "-reader"}
      >
        <aside
          className={styles.privacyPolicyIndex}
          data-motion-item="true"
          data-testid={pageKey + "-index"}
        >
          <nav aria-label={indexLabel}>
            <ol>
              {sections.map((section) => {
                const isActive = activeSectionId === section.id;
                return (
                  <li key={section.id}>
                    <a
                      aria-current={isActive ? "location" : undefined}
                      className={styles.privacyPolicyIndexLink}
                      data-active={isActive}
                      href={"#" + section.id}
                      onClick={(event) => handleSectionClick(event, section.id)}
                    >
                      <span>{section.number}</span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className={styles.privacyPolicyUpdated}>
            <span className={styles.privacyPolicyUpdatedRule} />
            <p>{lastUpdatedLabel}</p>
            <time dateTime={lastUpdatedDateTime}>{lastUpdated}</time>
          </div>
        </aside>

        <div
          aria-label={bodyLabel}
          className={styles.privacyPolicyBody}
          data-motion-item="true"
          data-testid={pageKey + "-body"}
          ref={policyBodyRef}
          tabIndex={0}
        >
          <div className={styles.privacyPolicyIntro}>
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {sections.map((section) => (
            <article
              className={styles.privacyPolicySection}
              data-policy-section={section.id}
              id={section.id}
              key={section.id}
            >
              <div className={styles.privacyPolicySectionHeading}>
                <span>{section.number}</span>
                <span aria-hidden="true" />
                <h2>{section.title}</h2>
              </div>
              <div className={styles.privacyPolicySectionCopy}>
                {section.blocks.map((block, index) =>
                  renderPolicyBlock(block, section.id + "-" + block.type + "-" + index),
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
