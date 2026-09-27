import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./CareersHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const CAREERS_LETTERING_IMAGE_SRC = "https://media.zypher-solutions.com/careers-page/Careers.png";
const APPLICATION_EMAIL =
  "mailto:info@zypher-solutions.com?subject=Career%20Application%20-%20Zypher";

export function CareersHeroSection(): ReactNode {
  return (
    <section
      aria-labelledby="careers-hero-title"
      className={styles.careersHeroSection}
      data-testid="careers-hero"
    >
      <div
        aria-hidden="true"
        className={styles.careersHeroBackground}
        data-image-src={BACKGROUND_ILLUSTRATION_SRC}
        data-testid="careers-hero-background"
      >
        <Image
          alt=""
          className={styles.careersHeroBackgroundImage}
          fill
          priority
          sizes="100vw"
          src={BACKGROUND_ILLUSTRATION_SRC}
        />
      </div>

      <div
        className={styles.careersHeroGrid}
        data-motion-intro="true"
        data-testid="careers-hero-grid"
      >
        <div className={styles.careersHeroCopy} data-testid="careers-hero-copy">
          <h1
            aria-label="No open roles right now. But the right person does not wait for a listing."
            className={styles.careersHeroTitle}
            id="careers-hero-title"
          >
            <span>No open roles right now</span>
            <span>But the right person</span>
            <span>doesn’t wait for a listing.</span>
          </h1>

          <p className={styles.careersHeroDescription}>
            We’re a small team that grows slowly and carefully. When we bring in someone it’s
            because we found someone who fits. If you think that’s you, tell us.
          </p>

          <ButtonLink
            className={styles.careersHeroButton}
            href={APPLICATION_EMAIL}
            trackingLabel="Send Your Application"
            trackingLocation="careers-hero"
          >
            Send Your Application
          </ButtonLink>

          <div className={styles.careersHeroApplicationNote}>
            <p>
              Your name, the role or area you&apos;re interested in, a link to your portfolio or
              LinkedIn, and a short note on why Zypher, 3 to 4 sentences is enough. Attach your CV
              or resume as a PDF. We read every submission. If there&apos;s a fit, we&apos;ll reach
              out.
            </p>
          </div>
        </div>

        <div className={styles.careersHeroVisual} data-testid="careers-hero-visual">
          <p className={styles.careersHeroVisualLabel}>CAREERS AT ZYPHER</p>
          <h2
            aria-label="Join us?"
            className={styles.careersHeroJoinTitle}
            data-image-src={CAREERS_LETTERING_IMAGE_SRC}
            data-testid="careers-hero-join-title"
          >
            JOIN
            <br />
            US?
          </h2>
        </div>
      </div>
    </section>
  );
}
