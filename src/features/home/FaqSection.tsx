"use client";

import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { faqItems } from "@/features/home/faq-data";

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
    <section aria-labelledby="faq-title" className="faq-section" data-testid="faq-section" id="faq">
      <header className="faq-section__intro">
        <div className="faq-section__intro-inner">
          <h2 id="faq-title">Questions you’re probably already asking</h2>
          <p>No generic answers, just what you’d actually want to know before reaching out.</p>
        </div>
      </header>

      <div className="faq-section__inner">
        <div className="faq-section__layout">
          <aside className="faq-section__rail">
            <nav aria-label="Frequently asked questions" className="faq-section__navigation">
              {faqItems.map((item, index) => {
                const isActive = item.id === activeFaqItem.id;

                return (
                  <button
                    aria-controls="faq-answer"
                    aria-current={isActive ? "true" : undefined}
                    className="faq-section__question-button"
                    data-testid="faq-question"
                    key={item.id}
                    onClick={(): void => setActiveFaqId(item.id)}
                    type="button"
                  >
                    <span aria-hidden="true" className="faq-section__question-number">
                      {formatQuestionListNumber(index)}
                    </span>
                    <span>{item.question}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="faq-section__content">
            <div className="faq-section__selector-wrap">
              <label className="sr-only" htmlFor="faq-question-select">
                Choose a frequently asked question
              </label>
              <select
                aria-label="Choose a frequently asked question"
                className="faq-section__selector"
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
              <span aria-hidden="true" className="faq-section__selector-chevron" />
            </div>

            <article
              aria-live="polite"
              className="faq-section__answer"
              data-testid="faq-answer"
              id="faq-answer"
            >
              <h3 className="faq-section__answer-title">The Answers to the Questions</h3>
              <div className="faq-section__answer-detail">
                <div className="faq-section__answer-question" data-testid="faq-answer-question">
                  <p className="faq-section__answer-number">
                    {formatQuestionNumber(activeFaqIndex)}
                  </p>
                  <h4>{activeFaqItem.question}</h4>
                </div>
                <p className="faq-section__answer-copy">{activeFaqItem.answer}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
