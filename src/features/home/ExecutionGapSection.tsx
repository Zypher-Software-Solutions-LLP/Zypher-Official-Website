"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { executionGapItems } from "@/features/home/execution-gap-data";

const executionGapIllustrationSrc =
  "https://media.zypher-solutions.com/home-page/section-3/Problem%20Overall%20Graphic.png";
const initialItemId = executionGapItems[0].id;

export function ExecutionGapSection(): ReactNode {
  const [activeItemId, setActiveItemId] = useState<string>(initialItemId);
  const [hasEnteredViewport, setHasEnteredViewport] = useState<boolean>(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeItem =
    executionGapItems.find((item) => item.id === activeItemId) ?? executionGapItems[0];

  useEffect((): (() => void) | void => {
    const section = sectionRef.current;

    if (!section || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHasEnteredViewport(Boolean(entry?.isIntersecting));

        if (entry?.isIntersecting) {
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px 20% 0px", threshold: 0.08 },
    );

    observer.observe(section);

    return (): void => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="execution-gap-title"
      className="execution-gap-section"
      data-reveal-state={hasEnteredViewport ? "visible" : "hidden"}
      data-testid="execution-gap-section"
      id="execution-gap"
      ref={sectionRef}
    >
      <svg
        aria-hidden="true"
        className="execution-gap-section__boundary execution-gap-section__boundary--top"
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
        className="execution-gap-section__boundary execution-gap-section__boundary--bottom"
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <div aria-hidden="true" className="execution-gap-section__surface" />

      <div className="execution-gap-section__inner">
        <header className="execution-gap-section__header">
          <p className="execution-gap-section__eyebrow">THE EXECUTION GAP</p>
          <h2 className="execution-gap-section__title" id="execution-gap-title">
            <span>Most Software isn&rsquo;t broken,</span>
            <span>
              It&rsquo;s just <strong>not yours.</strong>
            </span>
          </h2>
        </header>

        <div className="execution-gap-section__content">
          <div className="execution-gap-section__media">
            <picture className="execution-gap-section__picture">
              <source media="(max-width: 1199px)" srcSet={activeItem.mobileImageSrc} />
              <Image
                alt={activeItem.imageAlt}
                className="execution-gap-section__image is-active"
                data-testid="execution-gap-image"
                fill
                key={activeItem.id}
                loading={activeItem.id === initialItemId ? "eager" : "lazy"}
                priority={activeItem.id === initialItemId}
                sizes="(max-width: 1199px) min(100vw - 2rem, 36rem), 466px"
                src={activeItem.imageSrc}
                unoptimized
              />
            </picture>
          </div>

          <div className="execution-gap-section__details">
            <Image
              alt=""
              aria-hidden="true"
              className="execution-gap-section__illustration"
              fill
              unoptimized
              loading="lazy"
              sizes="(max-width: 767px) 70vw, 312px"
              src={executionGapIllustrationSrc}
            />

            <ButtonLink
              className="execution-gap-section__learn-more"
              href="/contact"
              trackingLabel="Learn More"
              trackingLocation="execution-gap"
              variant="tertiary"
            >
              Learn More <span aria-hidden="true">&#8594;</span>
            </ButtonLink>

            <div className="execution-gap-section__accordion">
              {executionGapItems.map((item) => {
                const isActive = item.id === activeItem.id;
                const buttonId = "execution-gap-trigger-" + item.id;
                const panelId = "execution-gap-panel-" + item.id;

                return (
                  <article
                    className={"execution-gap-section__item" + (isActive ? " is-active" : "")}
                    key={item.id}
                  >
                    <h3 className="execution-gap-section__item-heading">
                      <button
                        aria-controls={panelId}
                        aria-expanded={isActive}
                        className="execution-gap-section__trigger"
                        id={buttonId}
                        onClick={(): void => setActiveItemId(item.id)}
                        type="button"
                      >
                        <span>{item.heading}</span>
                        <span aria-hidden="true" className="execution-gap-section__toggle">
                          {isActive ? "-" : "+"}
                        </span>
                      </button>
                    </h3>

                    <div
                      aria-hidden={!isActive}
                      aria-labelledby={buttonId}
                      className={"execution-gap-section__panel" + (isActive ? " is-open" : "")}
                      id={panelId}
                      role="region"
                    >
                      <div className="execution-gap-section__panel-inner">
                        <p className="execution-gap-section__copy">
                          <strong>Problem:</strong> {item.problem}
                        </p>
                        <p className="execution-gap-section__solution-heading">
                          HOW WE <strong>SOLVE IT</strong>
                        </p>
                        <p className="execution-gap-section__copy">
                          <strong>Solution:</strong> {item.solution}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
