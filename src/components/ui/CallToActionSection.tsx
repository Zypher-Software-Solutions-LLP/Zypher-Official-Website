"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { trackEvent } from "@/integrations/analytics/events";
import styles from "./CallToActionSection.module.css";

const backgroundSrc =
  "https://media.zypher-solutions.com/home-page/section-7/Background%20Image.png";
const whatsappMessage = encodeURIComponent("Hi Zypher, I'd like to discuss a project.").replaceAll(
  "'",
  "%27",
);
const whatsappHref = `https://wa.me/918075725045?text=${whatsappMessage}`;

export function CallToActionSection(): ReactNode {
  function handleWhatsAppClick(): void {
    trackEvent({
      name: "cta_clicked",
      properties: {
        label: "WhatsApp Us",
        location: "final-cta",
        destination: whatsappHref,
      },
    });
  }

  return (
    <section
      aria-labelledby="cta-title"
      className={styles.ctaSection}
      data-testid="cta-section"
      id="contact-cta"
    >
      <Image
        alt=""
        aria-hidden="true"
        className={styles.ctaBackgroundImage}
        data-image-src={backgroundSrc}
        fill
        sizes="100vw"
        src={backgroundSrc}
      />
      <div aria-hidden="true" className={styles.ctaOverlay} />

      <div className={styles.ctaContent}>
        <p className={styles.ctaEyebrow}>YOUR VISION, OUR CODE</p>
        <h2
          aria-label="Ready to build something that moves with you?"
          className={styles.ctaTitle}
          id="cta-title"
        >
          <span className={styles.ctaTitleLine}>
            <span className={styles.ctaTitleAccent}>Ready to build</span> something
          </span>
          <span className={styles.ctaTitleLine}>that moves with you?</span>
        </h2>
        <p className={styles.ctaDescription}>
          No obligation on the first call. Just a conversation about what you’re actually trying to
          solve
        </p>

        <div className={styles.ctaActions}>
          <div className={styles.ctaPrimaryActions}>
            <button
              className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
              disabled
              type="button"
            >
              Book a Discovery Call
            </button>
            <button
              className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}
              disabled
              type="button"
            >
              See Our Work
            </button>
          </div>
          <a
            className={`${styles.ctaButton} ${styles.ctaButtonWhatsApp}`}
            href={whatsappHref}
            onClick={handleWhatsAppClick}
            rel="noreferrer"
            target="_blank"
          >
            <Image alt="" aria-hidden="true" height={23} src="/footer/whatsapp.svg" width={23} />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
