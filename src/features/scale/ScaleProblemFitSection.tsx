"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { scaleProblemFitItems } from "./scale-problem-fit-data";
import styles from "./ScaleProblemFitSection.module.css";

const initialItemId = scaleProblemFitItems[0].id;
const mobileSwipeThresholdPx = 48;

type MobileSwipeGesture = {
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
};

export function ScaleProblemFitSection(): ReactNode {
  const activeSwipe = useRef<MobileSwipeGesture | null>(null);
  const [activeItemId, setActiveItemId] = useState<string>(initialItemId);
  const activeItem =
    scaleProblemFitItems.find((item) => item.id === activeItemId) ?? scaleProblemFitItems[0];
  const activeItemIndex = scaleProblemFitItems.findIndex((item) => item.id === activeItem.id);

  const selectRelativeItem = (offset: number): void => {
    const nextIndex =
      (activeItemIndex + offset + scaleProblemFitItems.length) % scaleProblemFitItems.length;
    setActiveItemId(scaleProblemFitItems[nextIndex].id);
  };

  const handleMobilePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType === "mouse") {
      return;
    }

    activeSwipe.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };

    if (event.nativeEvent.isTrusted) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handleMobilePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    const swipe = activeSwipe.current;
    if (!swipe || swipe.pointerId !== event.pointerId) {
      return;
    }

    const horizontalDistance = event.clientX - swipe.startX;
    const verticalDistance = event.clientY - swipe.startY;
    if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      event.preventDefault();
    }
  };

  const handleMobilePointerEnd = (event: PointerEvent<HTMLDivElement>): void => {
    const swipe = activeSwipe.current;
    if (!swipe || swipe.pointerId !== event.pointerId) {
      return;
    }

    const horizontalDistance = event.clientX - swipe.startX;
    const verticalDistance = event.clientY - swipe.startY;
    const isHorizontalSwipe =
      Math.abs(horizontalDistance) >= mobileSwipeThresholdPx &&
      Math.abs(horizontalDistance) > Math.abs(verticalDistance);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    activeSwipe.current = null;

    if (isHorizontalSwipe) {
      selectRelativeItem(horizontalDistance < 0 ? 1 : -1);
    }
  };

  const handleMobilePointerCancel = (event: PointerEvent<HTMLDivElement>): void => {
    if (activeSwipe.current?.pointerId === event.pointerId) {
      activeSwipe.current = null;
    }
  };

  return (
    <section
      aria-labelledby="scale-problem-fit-title"
      className={styles.scaleProblemFitSection}
      data-motion-section="true"
      data-testid="scale-problem-fit-section"
      id="scale-problem-fit"
    >
      <svg
        aria-hidden="true"
        className={`${styles.scaleProblemFitBoundary} ${styles.scaleProblemFitBoundaryTop}`}
        data-testid="scale-problem-fit-boundary-top"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 28 C220 8 430 8 690 48 C920 82 1220 74 1440 32 L1440 140 L0 140 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <svg
        aria-hidden="true"
        className={`${styles.scaleProblemFitBoundary} ${styles.scaleProblemFitBoundaryBottom}`}
        data-testid="scale-problem-fit-boundary-bottom"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <div aria-hidden="true" className={styles.scaleProblemFitSurface} />

      <div className={styles.scaleProblemFitGrid} data-testid="scale-problem-fit-grid">
        <div className={styles.scaleProblemFitCopy} data-testid="scale-problem-fit-copy">
          <h2 className={styles.scaleProblemFitTitle} id="scale-problem-fit-title">
            You don&rsquo;t need to have the answer. You need to know the problem.
          </h2>
          <p className={styles.scaleProblemFitIntro}>
            The best engagements we&rsquo;ve had with a client who was on what wasn&rsquo;t working,
            not necessarily on how to fix it. That&rsquo;s our job.
          </p>

          <div
            aria-label="What makes a strong fit"
            className={styles.scaleProblemFitChoices}
            data-testid="scale-problem-fit-choices"
          >
            {scaleProblemFitItems.map((item) => {
              const isActive = item.id === activeItem.id;

              return (
                <button
                  aria-pressed={isActive}
                  className={styles.scaleProblemFitTrigger}
                  data-state={isActive ? "active" : "inactive"}
                  data-testid="scale-problem-fit-trigger"
                  key={item.id}
                  onClick={(): void => setActiveItemId(item.id)}
                  type="button"
                >
                  {item.title}
                </button>
              );
            })}
          </div>

          <div className={styles.scaleProblemFitDetails} key={activeItem.id}>
            <div aria-hidden="true" className={styles.scaleProblemFitDivider} />
            <p
              aria-live="polite"
              className={styles.scaleProblemFitDescription}
              data-testid="scale-problem-fit-description"
            >
              {activeItem.description}
            </p>
          </div>

          <div
            className={styles.scaleProblemFitMobileCarousel}
            aria-label="What makes a strong fit"
            data-swipe-area="true"
            data-testid="scale-problem-fit-mobile-carousel"
            onPointerCancel={handleMobilePointerCancel}
            onPointerDown={handleMobilePointerDown}
            onPointerMove={handleMobilePointerMove}
            onPointerUp={handleMobilePointerEnd}
            role="region"
          >
            <div className={styles.scaleProblemFitMobileHeadingRow}>
              <h3
                aria-live="polite"
                className={styles.scaleProblemFitMobileTitle}
                data-testid="scale-problem-fit-mobile-title"
              >
                {activeItem.title}
              </h3>
              <div className={styles.scaleProblemFitMobileControls}>
                <button
                  aria-controls="scale-problem-fit-mobile-panel"
                  aria-label="Show previous fit criterion"
                  className={styles.scaleProblemFitMobileArrow}
                  onClick={(): void => selectRelativeItem(-1)}
                  type="button"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="m14.5 5-7 7 7 7" />
                  </svg>
                </button>
                <button
                  aria-controls="scale-problem-fit-mobile-panel"
                  aria-label="Show next fit criterion"
                  className={styles.scaleProblemFitMobileArrow}
                  onClick={(): void => selectRelativeItem(1)}
                  type="button"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="m9.5 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              className={styles.scaleProblemFitMobilePanel}
              id="scale-problem-fit-mobile-panel"
              key={activeItem.id}
            >
              <div aria-hidden="true" className={styles.scaleProblemFitMobileDivider} />
              <p
                className={styles.scaleProblemFitMobileDescription}
                data-testid="scale-problem-fit-mobile-description"
              >
                {activeItem.description}
              </p>
              <div
                className={styles.scaleProblemFitMobileMedia}
                data-testid="scale-problem-fit-mobile-media"
              >
                <Image
                  alt={activeItem.imageAlt}
                  className={styles.scaleProblemFitImage}
                  data-image-src={activeItem.imageSrc}
                  data-testid="scale-problem-fit-mobile-image"
                  fill
                  loading={activeItem.id === initialItemId ? "eager" : "lazy"}
                  priority={activeItem.id === initialItemId}
                  quality={100}
                  sizes="min(100vw - 2rem, 36rem)"
                  src={activeItem.imageSrc}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.scaleProblemFitMedia} ${styles.scaleProblemFitDesktopMedia}`}
          data-testid="scale-problem-fit-media"
        >
          <Image
            alt={activeItem.imageAlt}
            className={styles.scaleProblemFitImage}
            data-image-src={activeItem.imageSrc}
            data-testid="scale-problem-fit-image"
            fill
            key={activeItem.id}
            loading={activeItem.id === initialItemId ? "eager" : "lazy"}
            priority={activeItem.id === initialItemId}
            quality={100}
            sizes="(max-width: 767px) min(100vw - 2rem, 30rem), (max-width: 1199px) min(100vw - 4rem, 36rem), 368px"
            src={activeItem.imageSrc}
          />
        </div>
      </div>
    </section>
  );
}
