"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import styles from "./ContactProcessSection.module.css";

const OFFICE_MAP_SRC = "https://www.google.com/maps?q=WORK%20WELL%20COWORKING&output=embed";

const processSteps = [
  {
    id: "01",
    title: "We read it, Within 24 Hours",
    description: "A real person, not an autoresponder",
    image: "https://media.zypher-solutions.com/contact-us/section-3/Step%20-%201.webp",
    alt: "Illustration of a message being read",
  },
  {
    id: "02",
    title: "If it’s a fit, we schedule a call",
    description: "Same discovery format as the cal path, no separate “sales call”",
    image: "https://media.zypher-solutions.com/contact-us/section-3/Step%20-%202.webp",
    alt: "Illustration of a scheduled call",
  },
  {
    id: "03",
    title: "If it’s not a fit, we’ll tell you",
    description: "And point you somewhere useful if we can.",
    image: "https://media.zypher-solutions.com/contact-us/section-3/Step%20-%203.webp",
    alt: "Illustration of a path toward a useful next step",
  },
] as const;

export function ContactProcessSection(): ReactNode {
  const [activeStep, setActiveStep] = useState("01");

  return (
    <section
      aria-labelledby="contact-process-title"
      className={styles.contactProcessSection}
      data-motion-section="true"
      data-layout="12-column"
      data-testid="contact-process-section"
      id="contact-process"
    >
      <div className={styles.contactProcessInner} data-motion-item="true">
        <h2 className={styles.contactProcessTitle} id="contact-process-title">
          What happens after you <span>hit send?</span>
        </h2>

        <div className={styles.contactProcessSteps}>
          {processSteps.map((step) => {
            const isActive = activeStep === step.id;

            return (
              <article
                aria-label={`Step ${step.id}: ${step.title}`}
                className={styles.contactProcessStep}
                data-active={isActive}
                data-testid={`contact-process-step-${step.id}`}
                tabIndex={0}
                key={step.id}
                onFocus={() => setActiveStep(step.id)}
                onMouseEnter={() => setActiveStep(step.id)}
                onMouseLeave={() => setActiveStep("01")}
              >
                <div className={styles.contactProcessStepCopy}>
                  <p className={styles.contactProcessStepNumber}>{step.id}</p>
                  <h3>{step.title}</h3>
                  <p className={styles.contactProcessStepDescription}>{step.description}</p>
                </div>
                <div className={styles.contactProcessStepImage}>
                  <Image
                    alt={step.alt}
                    height={115}
                    loading="lazy"
                    quality={100}
                    sizes="115px"
                    src={step.image}
                    width={115}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.contactProcessMap} data-testid="contact-process-map">
        <iframe
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={OFFICE_MAP_SRC}
          title="Work Well Coworking office location map"
        />
      </div>
    </section>
  );
}
