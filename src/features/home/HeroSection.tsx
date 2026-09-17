import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const BACKGROUND_GRID_URL =
  "https://media.zypher-solutions.com/home-page/section-1/Background%20Grid.png";
const HERO_SUBJECT_URL =
  "https://media.zypher-solutions.com/home-page/section-1/Hero%20Section%20-%20Main%20Subject.png";
const HERO_SUBJECT_MOBILE_URL =
  "https://media.zypher-solutions.com/home-page/section-1/Hero%20section%20-%20Mobile.png";

export function HeroSection(): React.ReactNode {
  return (
    <section aria-labelledby="hero-title" className="hero-section">
      <div
        aria-hidden="true"
        className="hero-background"
        data-layer="background-illustration"
        data-opacity="0.13"
        data-testid="hero-background"
      >
        <Image
          alt=""
          className="hero-background-image"
          fill
          priority
          sizes="100vw"
          src={BACKGROUND_ILLUSTRATION_SRC}
        />
      </div>

      <div
        aria-hidden="true"
        className="hero-grid-overlay hero-grid-overlay--top-left"
        data-testid="hero-grid-overlay"
      >
        <div className="hero-grid-overlay-crop">
          <Image
            alt=""
            className="hero-grid-overlay-image"
            fill
            sizes="(max-width: 900px) 75vw, 547px"
            src={BACKGROUND_GRID_URL}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hero-subject hero-subject--anchored"
        data-opacity="0.4"
        data-testid="hero-subject"
      >
        <div className="hero-subject-image-crop">
          <picture className="hero-subject-picture">
            <source media="(max-width: 767px)" srcSet={HERO_SUBJECT_MOBILE_URL} />
            <Image
              alt=""
              className="hero-subject-image"
              fill
              priority
              sizes="(max-width: 480px) 180vw, (max-width: 899px) 120vw, 60.14vw"
              src={HERO_SUBJECT_URL}
            />
          </picture>
        </div>
      </div>

      <div className="hero-grid hero-content">
        <div className="hero-copy">
          <h1
            aria-label="Solutions that move the way your business already does"
            className="hero-title"
            id="hero-title"
          >
            <span className="hero-title-accent hero-fade">Solutions that move</span>
            <span className="hero-title-main hero-fade hero-fade--delay-1">
              the way your business already does
            </span>
          </h1>

          <p className="hero-description hero-fade hero-fade--delay-2">
            No templates, no bolt-on features you&apos;ll never touch, just systems shaped around
            how you actually work, built by a team that stays in the room after launch.
          </p>

          <div className="hero-actions hero-fade hero-fade--delay-3">
            <ButtonLink
              className="hero-primary-button"
              href="/contact"
              trackingLabel="Book a Discovery Call"
              trackingLocation="hero"
            >
              Book a Discovery Call
            </ButtonLink>
            <ButtonLink
              className="hero-secondary-button"
              href="/work"
              trackingLabel="See Our Work"
              trackingLocation="hero"
              variant="secondary"
            >
              See Our Work
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
