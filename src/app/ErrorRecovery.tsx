"use client";

import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./ErrorRecovery.module.css";

type ErrorRecoveryProps = {
  onRetry: () => void;
};

export default function ErrorRecovery({ onRetry }: ErrorRecoveryProps): ReactNode {
  return (
    <main aria-labelledby="error-recovery-title" className={styles.errorPage} id="main-content">
      <section aria-describedby="error-recovery-description" className={styles.errorPanel}>
        <p className={styles.errorEyebrow}>Zypher Software Solutions</p>
        <h1 className={styles.errorTitle} id="error-recovery-title">
          Something went wrong
        </h1>
        <p className={styles.errorDescription} id="error-recovery-description">
          We couldn’t load this page right now. Please try again, or return to the home page.
          Reference details are available to our support team if the problem continues.
        </p>
        <div className={styles.errorActions}>
          <button className={styles.errorRetry} onClick={onRetry} type="button">
            Try again
          </button>
          <ButtonLink href="/" variant="secondary" trackingLabel="Go home" trackingLocation="error">
            Go home
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
