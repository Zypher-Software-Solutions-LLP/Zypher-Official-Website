"use client";

import styles from "./FaqSection.module.css";
import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { faqItems } from "./faq-data";
function formatQuestionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function formatQuestionListNumber(index: number): string {
  return String(index + 1) + ".";
}

export function FaqSection(): ReactNode {
  const firstFaqItem = faqItems[0];
  const [activeFaqId, setActiveFaqId] = useState(firstFaqItem?.id ?? "");
  const activeFaqItem = faqItems.find((item) => item.id === activeFaqId) ?? firstFaqItem;

  if (!activeFaqItem) {
    return null;
  }

  const activeFaqIndex = faqItems.indexOf(activeFaqItem);
  const handleFaqChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setActiveFaqId(event.target.value);
  };

  return (
    <section
      aria-labelledby="faq-title"
      className={styles.faqSection}
      data-testid="faq-section"
      id="faq"
    >
      <header className={styles.faqSectionIntro}>
        <div className={styles.faqSectionIntroInner}>
          <h2 id="faq-title">Questions you’re probably already asking</h2>
          <p>No generic answers, just what you’d actually want to know before reaching out.</p>
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
              {faqItems.map((item, index) => {
                const isActive = item.id === activeFaqItem.id;

                return (
                  <button
                    aria-controls="faq-answer"
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
              <label className="sr-only" htmlFor="faq-question-select">
                Choose a frequently asked question
              </label>
              <select
                aria-label="Choose a frequently asked question"
                className={styles.faqSectionSelector}
                id="faq-question-select"
                onChange={handleFaqChange}
                value={activeFaqItem.id}
              >
                {faqItems.map((item) => (
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
              id="faq-answer"
            >
              <h3 className={styles.faqSectionAnswerTitle}>The Answers to the Questions</h3>
              <div className={styles.faqSectionAnswerDetail}>
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
