import type { ReactNode } from "react";
import Image from "next/image";
import type { BlogPostSummary } from "@/integrations/cms/sanity/types";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./BlogHeroSection.module.css";

const BACKGROUND_ILLUSTRATION_SRC = "/home/section-1/background-illustration.png";
const HERO_TITLE = "Notes from the team actually building this.";
const HERO_DESCRIPTION =
  "Practical notes from the team building software, automation, and systems for real businesses.";

type BlogHeroSectionProps = {
  post?: BlogPostSummary;
  hasError?: boolean;
};

export function BlogHeroSection({ post, hasError = false }: BlogHeroSectionProps): ReactNode {
  const featuredDescription = hasError
    ? "We are having trouble loading the latest Zypher notes right now. Please check back shortly."
    : HERO_DESCRIPTION;

  return (
    <section aria-labelledby="blog-hero-title" className={styles.hero} data-testid="blog-hero">
      <div aria-hidden="true" className={styles.background}>
        <Image
          alt=""
          className={styles.backgroundImage}
          fill
          priority
          sizes="100vw"
          src={BACKGROUND_ILLUSTRATION_SRC}
        />
      </div>

      <div className={styles.grid} data-motion-intro="true">
        <div className={`${styles.featuredColumn} ${styles.fadeIn}`}>
          <p className={styles.eyebrow}>FEATURED POST</p>

          {post?.image?.url ? (
            <div className={styles.imagePlaceholder}>
              <Image
                alt={post.image.alt}
                className={styles.featuredImage}
                fill
                sizes="(max-width: 48rem) 100vw, 50vw"
                src={post.image.url}
              />
            </div>
          ) : (
            <div
              aria-label="No featured post image available"
              className={styles.imagePlaceholder}
              role="img"
            />
          )}

          <p className={styles.featuredDescription}>{post?.excerpt || featuredDescription}</p>
        </div>

        <div className={`${styles.copyColumn} ${styles.fadeIn} ${styles.fadeInDelay}`}>
          <h1 aria-label={HERO_TITLE} className={styles.title} id="blog-hero-title">
            <span className={`${styles.titleAccent} ${styles.desktopTitleLine}`}>
              Notes from the team
            </span>
            <span className={styles.desktopTitleLine}>actually building this.</span>
            <span className={`${styles.titleAccent} ${styles.mobileTitleLine}`}>
              Notes from the
            </span>
            <span className={styles.mobileTitleLine}>team actually</span>
            <span className={styles.mobileTitleLine}>building this.</span>
          </h1>

          <p className={styles.description}>{HERO_DESCRIPTION}</p>

          {post ? (
            <ButtonLink
              className={styles.articleButton}
              href={`/blog/${post.slug}`}
              trackingLabel="Read the Article"
              trackingLocation="blog-hero"
            >
              Read the Article
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
