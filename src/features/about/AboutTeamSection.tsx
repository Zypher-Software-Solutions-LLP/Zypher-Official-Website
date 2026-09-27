import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AboutTeamSection.module.css";

const GRADIENT_SRC = "https://media.zypher-solutions.com/about-page/section-5/Gradient.png";
const ANONYMOUS_SRC = "https://media.zypher-solutions.com/about-page/section-5/Anonymous.jpg";
const RESUME_EMAIL = "info@zypher-solutions.com";

const TEAM_MEMBERS = [
  {
    id: "rehen",
    name: "Rehen Manoy",
    role: "AI Backend Engineer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Rehen.png",
    linkedin: "https://www.linkedin.com/in/rehenmanoy/",
  },
  {
    id: "sanjana",
    name: "Sanjana Dev",
    role: "Software Developer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Sanjana.png",
    linkedin: "https://www.linkedin.com/in/sanjana-dev-658aa4324/",
  },
  {
    id: "keerthana",
    name: "Keerthana Abhilash",
    role: "QA Engineer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Keerthana.png",
    linkedin: "https://www.linkedin.com/in/keerthana-abhilash-7b8350322/",
  },
  {
    id: "hanna",
    name: "Hanna Ann Renju",
    role: "Frontend Developer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Hanna.png",
    linkedin: "https://www.linkedin.com/in/hannarenju/",
  },
  {
    id: "vivek",
    name: "Vivek Vinod",
    role: "Product Designer",
    image: "https://media.zypher-solutions.com/about-page/section-5/Vivek.png",
    linkedin: "https://www.linkedin.com/in/viwvwek/",
  },
  {
    id: "divin",
    name: "Divin Siby",
    role: "Head of Marketing",
    image: "https://media.zypher-solutions.com/about-page/section-5/Divin.png",
    linkedin: "https://www.linkedin.com/in/divin-siby-7862b0363/",
  },
] as const;

type TeamMember = (typeof TEAM_MEMBERS)[number];

function TeamPortrait({ member }: { member: TeamMember }): ReactNode {
  return (
    <div className={styles.aboutTeamVisual} data-testid="about-team-visual">
      <span
        aria-hidden="true"
        className={`${styles.aboutTeamArc} ${styles.aboutTeamArcTop}`}
        data-testid="about-team-arc-top"
      />
      <span
        aria-hidden="true"
        className={`${styles.aboutTeamArc} ${styles.aboutTeamArcBottom}`}
        data-testid="about-team-arc-bottom"
      />
      <div
        aria-hidden="true"
        className={styles.aboutTeamFrame}
        data-image-src={GRADIENT_SRC}
        data-testid="about-team-frame"
      />
      <div
        className={styles.aboutTeamPortraitInsideMask}
        data-testid="about-team-portrait-inside-mask"
      >
        <div
          className={styles.aboutTeamPortraitStage}
          data-testid="about-team-portrait-inside-stage"
        >
          <Image
            alt={`${member.name} portrait`}
            className={styles.aboutTeamPortrait}
            data-image-src={member.image}
            data-testid="about-team-image"
            fill
            quality={100}
            unoptimized
            sizes="(max-width: 767px) 12.5rem, 12.5rem"
            src={member.image}
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className={styles.aboutTeamPortraitPopoutMask}
        data-testid="about-team-portrait-popout-mask"
      >
        <div
          className={styles.aboutTeamPortraitStage}
          data-testid="about-team-portrait-popout-stage"
        >
          <Image
            alt=""
            className={styles.aboutTeamPortrait}
            data-image-src={member.image}
            data-testid="about-team-portrait-popout"
            fill
            quality={100}
            unoptimized
            sizes="(max-width: 767px) 12.5rem, 12.5rem"
            src={member.image}
          />
        </div>
      </div>
    </div>
  );
}

function TeamSocialLink({ member }: { member: TeamMember }): ReactNode {
  return (
    <div className={styles.aboutTeamSocials}>
      <a
        aria-label={`${member.name} on LinkedIn`}
        className={styles.aboutTeamSocialLink}
        href={member.linkedin}
        rel="noreferrer"
        target="_blank"
      >
        <span aria-hidden="true" className={styles.aboutTeamLinkedInIcon} />
      </a>
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }): ReactNode {
  return (
    <article className={styles.aboutTeamCard} data-member={member.id} data-testid="about-team-card">
      <TeamPortrait member={member} />
      <div className={styles.aboutTeamDetails}>
        <h3 className={styles.aboutTeamName}>{member.name}</h3>
        <p className={styles.aboutTeamRole}>{member.role}</p>
        <TeamSocialLink member={member} />
      </div>
    </article>
  );
}

function AnonymousCard(): ReactNode {
  return (
    <article
      className={`${styles.aboutTeamCard} ${styles.aboutTeamAnonymousCard}`}
      data-member="anonymous"
      data-testid="about-team-card"
    >
      <div className={styles.aboutTeamAnonymousVisual} data-testid="about-team-anonymous-card">
        <span
          aria-hidden="true"
          className={`${styles.aboutTeamArc} ${styles.aboutTeamArcTop}`}
          data-testid="about-team-anonymous-arc"
        />
        <div className={styles.aboutTeamAnonymousFrame}>
          <Image
            alt=""
            className={styles.aboutTeamAnonymousImage}
            data-image-src={ANONYMOUS_SRC}
            data-testid="about-team-anonymous-image"
            fill
            quality={100}
            unoptimized
            sizes="12.5rem"
            src={ANONYMOUS_SRC}
          />
        </div>
      </div>
      <div className={styles.aboutTeamDetails}>
        <h3 className={styles.aboutTeamName}>You Next?</h3>
        <p className={styles.aboutTeamRole}>Open to the right person</p>
      </div>
    </article>
  );
}

export function AboutTeamSection(): ReactNode {
  return (
    <section
      aria-labelledby="about-team-title"
      className={styles.aboutTeamSection}
      data-motion-section="true"
      data-testid="about-team"
      id="about-team"
    >
      <div className={styles.aboutTeamShell} data-motion-item="true">
        <p className={styles.aboutTeamEyebrow}>
          WHO ELSE HAS <strong>BUILT WITH US</strong>
        </p>
        <h2 className={styles.aboutTeamTitle} id="about-team-title">
          Our <strong>Team</strong>
        </h2>

        <div className={styles.aboutTeamGrid} data-testid="about-team-grid">
          {TEAM_MEMBERS.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>

        <div className={styles.aboutTeamFooter}>
          <div className={styles.aboutTeamInvitation}>
            <h3 aria-label="Think you belong here?" className={styles.aboutTeamInvitationTitle}>
              Think <strong>you</strong>
              <br />
              belong here?
            </h3>
            <p className={styles.aboutTeamInvitationCopy}>
              If you’re good at what you do, care about the work, and want to be part of something
              being built from the ground up, send us your work. We’re more than happy to welcome
              you to our family
            </p>
          </div>

          <AnonymousCard />

          <div className={styles.aboutTeamResume}>
            <p>
              Send us your resume at
              <br />
              <a href={`mailto:${RESUME_EMAIL}`}>{RESUME_EMAIL}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
