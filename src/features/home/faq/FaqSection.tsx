"use client";

import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import type { FaqItem } from "./faq-data";
import { faqItems } from "./faq-data";
import styles from "./FaqSection.module.css";

type FaqSectionProps = {
  items?: readonly FaqItem[];
  sectionId?: string;
  title?: string;
  intro?: string | null;
  variant?: "default" | "plain";
};

const DEFAULT_TITLE = "Questions you’re probably already asking";
const DEFAULT_INTRO =
  "No generic answers, just what you’d actually want to know before reaching out.";

function formatQuestionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function formatQuestionListNumber(index: number): string {
  return String(index + 1) + ".";
}

export function FaqSection({
  items = faqItems,
  sectionId = "faq",
  title = DEFAULT_TITLE,
  intro = DEFAULT_INTRO,
  variant = "default",
}: FaqSectionProps = {}): ReactNode {
  const firstFaqItem = items[0];
  const [activeFaqId, setActiveFaqId] = useState(firstFaqItem?.id ?? "");
  const activeFaqItem = items.find((item) => item.id === activeFaqId) ?? firstFaqItem;

  if (!activeFaqItem) {
    return null;
  }

  const activeFaqIndex = items.indexOf(activeFaqItem);
  const answerId = `${sectionId}-answer`;
  const questionSelectId = `${sectionId}-question-select`;
  const titleId = `${sectionId}-title`;
  const introClassName =
    variant === "plain"
      ? styles.faqSectionIntro + " " + styles.faqSectionIntroPlain
      : styles.faqSectionIntro;
  const handleFaqChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setActiveFaqId(event.target.value);
  };

  return (
    <section
      aria-labelledby={titleId}
      className={styles.faqSection}
      data-motion-section="true"
      data-testid={`${sectionId}-section`}
      id={sectionId}
    >
      <header className={introClassName}>
        <div className={styles.faqSectionIntroInner}>
          <h2 id={titleId}>{title}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
      </header>

      <div className={styles.faqSectionInner}>
        <div className={styles.faqSectionLayout}>
          <aside className={styles.faqSectionRail}>
            <nav
              aria-label="Frequently asked questions"
              className={styles.faqSectionNavigation}
              data-testid="faq-question-navigation"
            >
              {items.map((item, index) => {
                const isActive = item.id === activeFaqItem.id;

                return (
                  <button
                    aria-controls={answerId}
                    aria-current={isActive ? "true" : undefined}
                    className={styles.faqSectionQuestionButton}
                    data-testid="faq-question"
                    key={item.id}
                    onClick={(): void => setActiveFaqId(item.id)}
                    type="button"
                  >
                    <span aria-hidden="true" className={styles.faqSectionQuestionNumber}>
                      {formatQuestionListNumber(index)}
                    </span>
                    <span>{item.question}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className={styles.faqSectionContent}>
            <div className={styles.faqSectionSelectorWrap}>
              <label className="sr-only" htmlFor={questionSelectId}>
                Choose a frequently asked question
              </label>
              <select
                aria-label="Choose a frequently asked question"
                className={styles.faqSectionSelector}
                id={questionSelectId}
                onChange={handleFaqChange}
                value={activeFaqItem.id}
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.question}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className={styles.faqSectionSelectorChevron} />
            </div>

            <article
              aria-live="polite"
              className={styles.faqSectionAnswer}
              data-testid="faq-answer"
              id={answerId}
            >
              <h3 className={styles.faqSectionAnswerTitle}>The Answers to the Questions</h3>
              <div className={styles.faqSectionAnswerDetail} key={activeFaqItem.id}>
                <div className={styles.faqSectionAnswerQuestion} data-testid="faq-answer-question">
                  <p className={styles.faqSectionAnswerNumber} data-testid="faq-answer-number">
                    {formatQuestionNumber(activeFaqIndex)}
                  </p>
                  <p
                    className={styles.faqSectionAnswerQuestionText}
                    data-testid="faq-answer-question-text"
                  >
                    {activeFaqItem.question}
                  </p>
                </div>
                <p className={styles.faqSectionAnswerCopy} data-testid="faq-answer-copy">
                  {activeFaqItem.answer}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
