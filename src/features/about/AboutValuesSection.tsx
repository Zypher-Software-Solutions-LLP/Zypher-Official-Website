"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AboutValuesSection.module.css";

const VALUES = [
  {
    title: "Family First, Agency Second",
    description:
      "We work as people before we work as colleagues. Space, trust, and honesty come before the actual output.",
    image: "https://media.zypher-solutions.com/about-page/section-3/Family%20First.png",
  },
  {
    title: "Zero Shortcuts",
    description:
      "Every decision gets made properly, not quickly. Precision isn't optional, it is the baseline foundation at Zypher.",
    image: "https://media.zypher-solutions.com/about-page/section-3/Zero%20Shortcuts.png",
  },
  {
    title: "Direct Always",
    description:
      "No hierarchy blocking the conversation. Internally or with clients, you talk to the person, not just a layer.",
    image: "https://media.zypher-solutions.com/about-page/section-3/Direct.png",
  },
  {
    title: "Space to Grow",
    description:
      "Room to breathe when you need it. A commitment to upskilling when you're ready for more.",
    image: "https://media.zypher-solutions.com/about-page/section-3/Space.png",
  },
  {
    title: "Built to Last",
    description:
      "Everything we make, internally and externally, is built to survive, not to impress in the moment.",
    image: "https://media.zypher-solutions.com/about-page/section-3/Built.png",
  },
] as const;

export function AboutValuesSection(): ReactNode {
  return (
    <section
      aria-labelledby="about-values-title"
      className={styles.aboutValuesSection}
      data-motion-section="true"
      data-testid="about-values"
      id="about-values"
    >
      <div className={styles.aboutValuesShell}>
        <div className={styles.aboutValuesGrid} data-testid="about-values-grid">
          <div
            className={styles.aboutValueCell + " " + styles.aboutValuesIntro}
            data-testid="about-value-guide"
          >
            <h2 className={styles.aboutValuesEyebrow}>Our Values</h2>
            <h3 className={styles.aboutValuesTitle} id="about-values-title">
              Structured doesn’t mean slow. Fast doesn’t mean loose.
            </h3>
            <p className={styles.aboutValuesDescription}>
              Everything at Zypher, the fixed scope, the direct access to the people building your
              product, the stack chosen for the job, comes from the same place. We&apos;ve been the
              client who got burned, and we built Zypher to not be that.
            </p>
          </div>

          {VALUES.map((value) => (
            <article
              className={styles.aboutValueCell + " " + styles.aboutValueCard}
              data-testid="about-value-card"
              key={value.title}
            >
              <div
                aria-hidden="true"
                className={styles.aboutValueIcon}
                data-image-src={value.image}
                data-testid="about-value-icon"
              >
                <Image
                  alt=""
                  className={styles.aboutValueIconImage}
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) 80px, (max-width: 1023px) 96px, 120px"
                  src={value.image}
                />
              </div>
              <h3 className={styles.aboutValueTitle}>{value.title}</h3>
              <p className={styles.aboutValueDescription}>{value.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
