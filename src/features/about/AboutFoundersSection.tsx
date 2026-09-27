import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AboutFoundersSection.module.css";

const GRADIENT_SRC = "https://media.zypher-solutions.com/about-page/section-4/Gradient.png";

const FOUNDERS = [
  {
    id: "hasheem",
    name: "Muhammed Hasheem",
    namePrefix: "Muhammed ",
    nameHighlight: "Hasheem",
    role: "CO-FOUNDER & CEO",
    description:
      "The driving force behind how Zypher operates, client relationships, company structure, and keeping every part of the business pointed in the same direction. Bold, direct, and unusually structured for someone who moves as fast as he does.",
    image: "https://media.zypher-solutions.com/about-page/section-4/Hasheem.png",
    linkedin: "https://www.linkedin.com/in/muhammedhasheem/",
    portfolio: "https://www.muhammed-hasheem.me/",
  },
  {
    id: "ziyan",
    name: "Mohammed Ziyan",
    namePrefix: "Mohammed ",
    nameHighlight: "Ziyan",
    role: "CO-FOUNDER & COO",
    description:
      "Runs the operational backbone of Zypher, finance, documentation, client mapping, and marketing. Background spans internship experience and hands-on work with a cybersecurity firm. Precise in execution, unconventional in thinking. The reason everything else runs without friction.",
    image: "https://media.zypher-solutions.com/about-page/section-4/Ziyan.png",
    linkedin: "https://www.linkedin.com/in/mohammedziyan7/",
    portfolio: "https://www.mohammedziyan.me/",
  },
  {
    id: "hank",
    name: "Hank Emmanuel Nixon",
    namePrefix: "Hank ",
    nameHighlight: "Emmanuel Nixon",
    role: "CO-FOUNDER & CTO",
    description:
      "Leads Zypher's technical direction, architecture, stack decisions, and the quality bar every build is held to. Four years freelancing and two years of internship experience building systems for real organizations. Precise by nature, accountable by choice. The technical vision at Zypher is his.",
    image: "https://media.zypher-solutions.com/about-page/section-4/Hank.png",
    linkedin: "https://www.linkedin.com/in/hanknixon/",
    portfolio: "https://www.hanknixon.online/",
  },
] as const;

type Founder = (typeof FOUNDERS)[number];

function FounderSocialLinks({ founder }: { founder: Founder }): ReactNode {
  return (
    <div className={styles.aboutFounderSocials} data-testid="about-founder-socials">
      <a
        aria-label={`${founder.name} on LinkedIn`}
        className={styles.aboutFounderSocialLink}
        href={founder.linkedin}
        rel="noreferrer"
        target="_blank"
      >
        <span
          aria-hidden="true"
          className={styles.aboutFounderLinkedInIcon}
          data-testid="about-founder-linkedin-icon"
        />
      </a>
      <a
        aria-label={`${founder.name} portfolio`}
        className={styles.aboutFounderSocialLink}
        href={founder.portfolio}
        rel="noreferrer"
        target="_blank"
      >
        <span
          aria-hidden="true"
          className={styles.aboutFounderPortfolioIcon}
          data-testid="about-founder-portfolio-icon"
        />
      </a>
    </div>
  );
}

function FounderCard({ founder }: { founder: Founder }): ReactNode {
  return (
    <article
      className={styles.aboutFounderCard}
      data-founder={founder.id}
      data-testid="about-founder-card"
    >
      <div className={styles.aboutFounderVisual} data-testid="about-founder-visual">
        <span
          aria-hidden="true"
          className={styles.aboutFounderArcTop}
          data-testid="about-founder-arc-top"
        />
        <span
          aria-hidden="true"
          className={styles.aboutFounderArcBottom}
          data-testid="about-founder-arc-bottom"
        />
        <div
          aria-hidden="true"
          className={styles.aboutFounderFrame}
          data-image-src={GRADIENT_SRC}
          data-testid="about-founder-frame"
        />
        <div
          className={styles.aboutFounderPortraitInsideMask}
          data-testid="about-founder-portrait-inside-mask"
        >
          <div
            className={styles.aboutFounderPortraitStage}
            data-testid="about-founder-portrait-inside-stage"
          >
            <Image
              alt={`${founder.name} portrait`}
              className={styles.aboutFounderPortrait}
              data-image-src={founder.image}
              data-testid="about-founder-image"
              fill
              quality={100}
              unoptimized
              sizes="(max-width: 767px) 86vw, (max-width: 1023px) 43vw, 24rem"
              src={founder.image}
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className={styles.aboutFounderPortraitPopoutMask}
          data-testid="about-founder-portrait-popout-mask"
        >
          <div className={styles.aboutFounderPortraitPopoutCanvas}>
            <div
              className={styles.aboutFounderPortraitStage}
              data-testid="about-founder-portrait-popout-stage"
            >
              <Image
                alt=""
                className={styles.aboutFounderPortrait}
                data-image-src={founder.image}
                data-testid="about-founder-portrait-popout"
                fill
                quality={100}
                unoptimized
                sizes="(max-width: 767px) 86vw, (max-width: 1023px) 43vw, 24rem"
                src={founder.image}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.aboutFounderDetails}>
        <h3 className={styles.aboutFounderName}>
          {founder.namePrefix}
          <span
            className={styles.aboutFounderNameHighlight}
            data-testid="about-founder-name-highlight"
          >
            {founder.nameHighlight}
          </span>
        </h3>
        <p className={styles.aboutFounderRole}>{founder.role}</p>
        <p className={styles.aboutFounderDescription}>{founder.description}</p>
        <FounderSocialLinks founder={founder} />
      </div>
    </article>
  );
}

export function AboutFoundersSection(): ReactNode {
  return (
    <section
      aria-labelledby="about-founders-title"
      className={styles.aboutFoundersSection}
      data-motion-section="true"
      data-testid="about-founders"
      id="about-founders"
    >
      <div className={styles.aboutFoundersShell} data-motion-item="true">
        <h2
          aria-label="Three co-founders. One standard."
          className={styles.aboutFoundersTitle}
          id="about-founders-title"
        >
          <span>Three co-founders. </span>
          <span>
            One <strong>standard.</strong>
          </span>
        </h2>

        <div className={styles.aboutFoundersGrid}>
          {FOUNDERS.map((founder) => (
            <FounderCard founder={founder} key={founder.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
