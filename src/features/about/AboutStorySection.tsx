import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AboutStorySection.module.css";

const STORY_ILLUSTRATION_SRC =
  "https://media.zypher-solutions.com/about-page/section-2/Section%202%20Illustration.png";

const STORY_STEPS = [
  {
    number: "01",
    text: "Three founders met in their first year of college and quickly fell into the same pattern: noticing problems in the people and places around them, then building something to fix it, not because anyone asked, but because they already knew how to.",
  },
  {
    number: "02",
    text: "That pattern became a question worth answering seriously: why not do this properly, at scale? Zypher wasn't built from a business plan. It was built around a standard the founders already held, software engineered to last, structured for the long term, free of shortcuts.",
  },
  {
    number: "03",
    text: "That standard hasn't changed as the company has grown. Alongside client work, the team is building independent products of its own, solutions shaped by problems the founders ran into and couldn't find a simple enough answer for. More will be shared as they near release.",
  },
] as const;

export function AboutStorySection(): ReactNode {
  return (
    <section
      aria-labelledby="about-story-title"
      className={styles.aboutStorySection}
      data-motion-section="true"
      data-testid="about-story"
      id="about-story"
    >
      <div className={styles.aboutStoryContent} data-motion-item="true">
        <h2 className={styles.aboutStoryTitle} id="about-story-title">
          Our Story
        </h2>

        <span
          aria-hidden="true"
          className={styles.aboutStoryDivider}
          data-testid="about-story-divider"
        />

        <div className={styles.aboutStorySteps}>
          {STORY_STEPS.map((step, index) => (
            <article className={styles.aboutStoryStep} key={step.number}>
              <span
                aria-label={"Story milestone " + step.number}
                className={styles.aboutStoryNumber}
                data-testid="about-story-number"
                tabIndex={0}
              >
                {step.number}
              </span>
              <p data-testid={"about-story-copy-" + (index + 1)}>{step.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.aboutStoryIllustration}
        data-image-src={STORY_ILLUSTRATION_SRC}
        data-testid="about-story-illustration"
      >
        <Image
          alt=""
          className={styles.aboutStoryIllustrationImage}
          sizes="100vw"
          src={STORY_ILLUSTRATION_SRC}
          width={1440}
          height={540}
          quality={100}
          unoptimized
        />
      </div>
    </section>
  );
}
