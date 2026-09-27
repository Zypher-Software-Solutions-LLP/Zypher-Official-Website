"use client";

import { usePageScrollController } from "@/components/motion/MotionProvider";
import { useEffect, useRef, useState } from "react";
import type { BlogArticleSection } from "./article-content";
import styles from "./BlogArticle.module.css";

const ACTIVE_READING_LINE = 0.35;
const SECTION_SCROLL_OFFSET = -24;

type ArticleTableOfContentsProps = {
  sections: BlogArticleSection[];
};

export function ArticleTableOfContents({ sections }: ArticleTableOfContentsProps): React.ReactNode {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const listRef = useRef<HTMLOListElement | null>(null);
  const scrollTargetIdRef = useRef<string | null>(null);
  const pageScrollController = usePageScrollController();

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (headings.length === 0) return undefined;

    let animationFrame: number | null = null;

    const cancelProgrammaticNavigation = (): void => {
      scrollTargetIdRef.current = null;
    };

    const updateActiveSection = (): void => {
      animationFrame = null;
      const readingLine = window.innerHeight * ACTIVE_READING_LINE;
      const scrollTargetId = scrollTargetIdRef.current;

      if (scrollTargetId) {
        const targetIndex = headings.findIndex((heading) => heading.id === scrollTargetId);
        const targetHeading = headings[targetIndex];
        const targetRect = targetHeading?.getBoundingClientRect();
        const targetSection = sections.find((section) => section.id === scrollTargetId);
        const nextPeerHeading = headings.slice(targetIndex + 1).find((heading) => {
          const section = sections.find((candidate) => candidate.id === heading.id);
          return section && section.level <= (targetSection?.level ?? 2);
        });
        const targetReached = Boolean(targetRect && targetRect.top <= readingLine);
        const nextPeerReached = Boolean(
          nextPeerHeading && nextPeerHeading.getBoundingClientRect().top <= readingLine,
        );

        if (!targetReached) return;

        if (!nextPeerReached) {
          setActiveId(scrollTargetId);
          return;
        }

        scrollTargetIdRef.current = null;
      }

      const candidates = headings
        .map((heading) => {
          const rect = heading.getBoundingClientRect();
          return {
            heading,
            distance: Math.abs(rect.top + rect.height / 2 - readingLine),
          };
        })
        .sort((first, second) => first.distance - second.distance);

      const currentHeading = candidates[0]?.heading;
      if (currentHeading) {
        setActiveId((currentId) =>
          currentId === currentHeading.id ? currentId : currentHeading.id,
        );
      }
    };

    const scheduleActiveSectionUpdate = (): void => {
      if (animationFrame !== null) return;

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

  useEffect(() => {
    if (!activeId) return;

    const list = listRef.current;
    const activeLink = linkRefs.current.get(activeId);
    if (!list || !activeLink) return;

    const isHorizontal = list.scrollWidth > list.clientWidth;
    const behavior =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";

    if (isHorizontal) {
      const linkCenter = activeLink.offsetLeft + activeLink.offsetWidth / 2;
      list.scrollTo({
        behavior,
        left: Math.max(0, linkCenter - list.clientWidth / 2),
      });
      return;
    }

    const linkTop = activeLink.offsetTop;
    const linkBottom = linkTop + activeLink.offsetHeight;
    const visibleTop = list.scrollTop;
    const visibleBottom = visibleTop + list.clientHeight;

    if (linkTop < visibleTop) {
      list.scrollTo({ behavior, top: linkTop });
    } else if (linkBottom > visibleBottom) {
      list.scrollTo({ behavior, top: linkBottom - list.clientHeight });
    }
  }, [activeId]);

  if (sections.length === 0) return null;

  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string): void => {
    event.preventDefault();
    const heading = document.getElementById(id);
    if (!heading) return;

    setActiveId(id);
    scrollTargetIdRef.current = id;

    const behavior =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";

    if (pageScrollController) {
      pageScrollController.scrollTo(heading, {
        behavior,
        offset: SECTION_SCROLL_OFFSET,
      });
    } else {
      const top = heading.getBoundingClientRect().top + window.scrollY + SECTION_SCROLL_OFFSET;
      window.scrollTo({ behavior, top });
    }

    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="On this page" className={styles.tableOfContents}>
      <p className={styles.tableOfContentsLabel}>On this page</p>
      <ol className={styles.tableOfContentsList} ref={listRef}>
        {sections.map((section) => (
          <li className={styles.tableOfContentsItem} data-level={section.level} key={section.id}>
            <a
              aria-current={activeId === section.id ? "location" : undefined}
              className={`${styles.tableOfContentsLink} ${activeId === section.id ? styles.tableOfContentsLinkActive : ""}`}
              href={`#${section.id}`}
              onClick={(event) => handleSectionClick(event, section.id)}
              ref={(element) => {
                if (element) {
                  linkRefs.current.set(section.id, element);
                } else {
                  linkRefs.current.delete(section.id);
                }
              }}
            >
              {section.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
