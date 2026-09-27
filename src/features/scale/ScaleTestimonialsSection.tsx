"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { scaleTestimonials } from "./scale-testimonials-data";
import styles from "./ScaleTestimonialsSection.module.css";

type TestimonialDrag = {
  readonly cycleDistance: number;
  readonly originOffset: number;
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
};

function normalizeDragOffset(offset: number, cycleDistance: number): number {
  if (cycleDistance <= 0) {
    return offset;
  }

  const normalizedOffset = offset % cycleDistance;
  return normalizedOffset > 0 ? normalizedOffset - cycleDistance : normalizedOffset;
}

function TestimonialCards(): ReactNode {
  return scaleTestimonials.map((testimonial) => (
    <article
      className={styles.scaleTestimonialsCard}
      data-testid="scale-testimonial-card"
      key={testimonial.id}
    >
      <span aria-hidden="true" className={styles.scaleTestimonialsQuoteMark}>
        “
      </span>
      <blockquote className={styles.scaleTestimonialsQuote} data-testid="scale-testimonial-quote">
        {testimonial.quote}
      </blockquote>
      <div className={styles.scaleTestimonialsPerson}>
        <Image
          alt={testimonial.imageAlt}
          className={styles.scaleTestimonialsAvatar}
          data-image-src={testimonial.imageSrc}
          fill
          loading="lazy"
          quality={100}
          sizes="40px"
          src={testimonial.imageSrc}
        />
        <div className={styles.scaleTestimonialsMeta}>
          <h3>{testimonial.name}</h3>
          <p>
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  ));
}

export function ScaleTestimonialsSection(): ReactNode {
  const activeDrag = useRef<TestimonialDrag | null>(null);
  const duplicateTrackRef = useRef<HTMLDivElement>(null);
  const primaryTrackRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const dragLayerStyle = {
    transform: `translate3d(${dragOffset}px, 0, 0)`,
  } satisfies CSSProperties;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType === "mouse") {
      return;
    }

    const primaryTrackBounds = primaryTrackRef.current?.getBoundingClientRect();
    const duplicateTrackBounds = duplicateTrackRef.current?.getBoundingClientRect();
    const cycleDistance =
      primaryTrackBounds && duplicateTrackBounds
        ? Math.abs(duplicateTrackBounds.x - primaryTrackBounds.x)
        : (primaryTrackBounds?.width ?? 0);

    activeDrag.current = {
      cycleDistance,
      originOffset: dragOffset,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    setIsTouchInteracting(true);

    if (event.nativeEvent.isTrusted) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    const drag = activeDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const horizontalDistance = event.clientX - drag.startX;
    const verticalDistance = event.clientY - drag.startY;
    if (Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) {
      return;
    }

    event.preventDefault();
    setDragOffset(normalizeDragOffset(drag.originOffset + horizontalDistance, drag.cycleDistance));
  };

  const finishTouchInteraction = (event: PointerEvent<HTMLDivElement>): void => {
    const drag = activeDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    activeDrag.current = null;
    setIsTouchInteracting(false);
  };

  return (
    <section
      aria-labelledby="scale-testimonials-title"
      className={styles.scaleTestimonialsSection}
      data-motion-section="true"
      data-testid="scale-testimonials-section"
      id="scale-testimonials"
    >
      <div className={styles.scaleTestimonialsContainer}>
        <h2 className={styles.scaleTestimonialsTitle} id="scale-testimonials-title">
          <span>Heard it from us. Now hear it </span>
          <span
            className={styles.scaleTestimonialsTitleAccent}
            data-testid="scale-testimonials-title-accent"
          >
            from them.
          </span>
        </h2>

        <div
          className={styles.scaleTestimonialsViewport}
          data-interacting={isTouchInteracting ? "true" : "false"}
          data-testid="scale-testimonials-viewport"
          onPointerCancel={finishTouchInteraction}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishTouchInteraction}
          tabIndex={0}
        >
          <div
            className={styles.scaleTestimonialsDragLayer}
            data-testid="scale-testimonials-drag-layer"
            style={dragLayerStyle}
          >
            <div
              className={styles.scaleTestimonialsTrack}
              data-testid="scale-testimonials-primary-track"
              ref={primaryTrackRef}
            >
              <TestimonialCards />
            </div>
            <div
              aria-hidden="true"
              className={`${styles.scaleTestimonialsTrack} ${styles.scaleTestimonialsDuplicateTrack}`}
              data-testid="scale-testimonials-duplicate-track"
              ref={duplicateTrackRef}
            >
              <TestimonialCards />
            </div>
          </div>
        </div>

        <p className={styles.scaleTestimonialsClosingCopy}>
          Across five countries, different industries, different scales. One Consistent Experience.
        </p>
      </div>
    </section>
  );
}
