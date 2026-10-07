import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import styles from "./NotFoundPage.module.css";

const notFoundIllustrationSrc =
  "https://media.zypher-solutions.com/404-page/404%20Illustration.webp";

export default function NotFound(): ReactNode {
  return (
    <>
      <Header />
      <main className={styles.notFoundPage} data-testid="not-found-page" id="main-content">
        <div
          aria-hidden="true"
          className={styles.notFoundBackgroundImage}
          data-image-src={notFoundIllustrationSrc}
          data-testid="not-found-background-illustration"
        >
          <Image alt="" fill priority sizes="100vw" src={notFoundIllustrationSrc} />
        </div>
        <div
          aria-hidden="true"
          className={styles.notFoundImageOverlay}
          data-testid="not-found-image-overlay"
        />
        <div className={styles.notFoundGrid} data-motion-intro="true" data-testid="not-found-grid">
          <p aria-hidden="true" className={styles.notFoundNumber} data-testid="not-found-number">
            <span
              aria-hidden="true"
              className={styles.notFoundNumberGlow}
              data-testid="not-found-number-glow"
            >
              404
            </span>
            <span
              aria-hidden="true"
              className={styles.notFoundNumberCore}
              data-testid="not-found-number-core"
            >
              404
            </span>
          </p>
          <div className={styles.notFoundContent} data-testid="not-found-content">
            <h1 className={styles.notFoundTitle}>UH OH!</h1>
            <p className={styles.notFoundDescription}>
              Looks like this page caught the wrong wind. It’s not here anymore, or maybe it never
              was.
            </p>
            <Link className={styles.notFoundHomeButton} href="/">
              Go Back Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
