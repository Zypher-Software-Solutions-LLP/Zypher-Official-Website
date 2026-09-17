import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { solutionCards } from "@/features/home/solutions-data";

export function SolutionsSection(): ReactNode {
  return (
    <section aria-labelledby="solutions-section-title" className="solutions-section" id="solutions">
      <div className="solutions-section__inner">
        <header className="solutions-section__header">
          <div className="solutions-section__copy">
            <h2
              aria-label="Why Zypher is different from Everyone else you've worked with"
              className="solutions-section__title"
              id="solutions-section-title"
            >
              <span className="solutions-section__title-accent">Why Zypher is different</span>
              <span className="solutions-section__title-rest">
                from Everyone else you&rsquo;ve worked with
              </span>
            </h2>
            <p className="solutions-section__subtitle">
              Here&rsquo;s what your solution actually looks like.
            </p>
          </div>

          <ButtonLink
            className="solutions-section__cta"
            href="/about"
            trackingLabel="About Zypher"
            trackingLocation="solutions"
            variant="secondary"
          >
            About Zypher <span aria-hidden="true">&#8594;</span>
          </ButtonLink>
        </header>

        <div className="solutions-section__grid">
          {solutionCards.map((card) => (
            <article
              className={"solutions-card solutions-card--" + card.id}
              data-card-number={card.number}
              data-testid="solution-card"
              key={card.id}
            >
              <div aria-hidden="true" className="solutions-card__art">
                <Image
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 2999px) 40vw, 44rem"
                  src={card.imageSrc}
                  unoptimized
                />
              </div>
              <div className="solutions-card__content">
                <p className="solutions-card__number">{card.number}</p>
                <h3 className="solutions-card__heading">{card.heading}</h3>
                <p className="solutions-card__description">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
