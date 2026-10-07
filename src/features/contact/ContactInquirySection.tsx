"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { trackEvent } from "@/integrations/analytics/events";
import { TurnstileField } from "./TurnstileField";
import {
  contactBudgetOptions,
  contactServiceOptions,
  getContactBudgetLabel,
} from "./contact-options";
import {
  formatPhoneNumber,
  getPhoneCountryCode,
  getPhoneCountryFlagUrl,
  getPhoneCountryLabel,
  getPhoneDigits,
  phoneCountryOptions,
} from "./phone-format";
import styles from "./ContactInquirySection.module.css";

const CONTACT_BACKGROUND_SRC =
  "https://media.zypher-solutions.com/contact-us/section-2/Contact%20us%20Background.webp";
const MINIMUM_E164_DIGITS = 7;

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type ContactInquirySelectOption = {
  value: string;
  label: string;
};

type ContactInquirySelectGroup = {
  label?: string;
  options: readonly ContactInquirySelectOption[];
};

type ContactInquirySelectProps = {
  ariaLabel: string;
  className?: string;
  groups?: readonly ContactInquirySelectGroup[];
  leadingContent?: ReactNode;
  menuClassName?: string;
  selectedVisual?: ReactNode;
  name?: string;
  onValueChange: (value: string) => void;
  options?: readonly ContactInquirySelectOption[];
  placeholder?: string;
  renderTrigger?: (selectedOption: ContactInquirySelectOption | undefined) => ReactNode;
  required?: boolean;
  testId: string;
  triggerAriaLabel?: string;
  triggerClassName?: string;
  value: string;
};

const CONTACT_SERVICE_SELECT_GROUPS: readonly ContactInquirySelectGroup[] = [
  {
    label: "Core services",
    options: contactServiceOptions.slice(0, 5).map((service) => ({
      label: service,
      value: service,
    })),
  },
  {
    label: "Extended capabilities",
    options: contactServiceOptions.slice(5).map((service) => ({
      label: service,
      value: service,
    })),
  },
];

const CONTACT_BUDGET_SELECT_OPTIONS: readonly ContactInquirySelectOption[] =
  contactBudgetOptions.map((budget) => ({
    label: getContactBudgetLabel(budget),
    value: budget,
  }));

const CONTACT_COUNTRY_SELECT_OPTIONS: readonly ContactInquirySelectOption[] =
  phoneCountryOptions.map((country) => ({
    label: getPhoneCountryLabel(country),
    value: country.id,
  }));

function ContactInquirySelect({
  ariaLabel,
  className,
  groups,
  leadingContent,
  menuClassName,
  selectedVisual,
  name,
  onValueChange,
  options,
  placeholder,
  renderTrigger,
  required = false,
  testId,
  triggerAriaLabel,
  triggerClassName,
  value,
}: ContactInquirySelectProps): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const optionGroups = useMemo(() => groups ?? [{ options: options ?? [] }], [groups, options]);
  const flatOptions = useMemo(() => optionGroups.flatMap((group) => group.options), [optionGroups]);
  const optionIndexes = useMemo(
    () => new Map(flatOptions.map((option, index) => [option.value, index])),
    [flatOptions],
  );
  const selectedOption = flatOptions.find((option) => option.value === value);
  const selectedValue = selectedOption?.value;

  useEffect(() => {
    if (!isOpen) return;
    const selectedIndex = selectedValue ? optionIndexes.get(selectedValue) : 0;
    optionRefs.current[selectedIndex ?? 0]?.focus();
  }, [isOpen, optionIndexes, selectedValue]);

  function focusOption(index: number): void {
    const nextIndex = Math.max(0, Math.min(index, flatOptions.length - 1));
    optionRefs.current[nextIndex]?.focus();
  }

  function selectOption(nextValue: string): void {
    onValueChange(nextValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  function handleOptionKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusOption(flatOptions.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(flatOptions[index].value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }

  function handleBlur(event: FocusEvent<HTMLSpanElement>): void {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsOpen(false);
    }
  }

  return (
    <span
      className={`${styles.contactInquirySelectControl} ${className ?? ""}`.trim()}
      data-testid={testId}
      onBlur={handleBlur}
    >
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={triggerAriaLabel ?? ariaLabel}
        className={`${styles.contactInquirySelectTrigger} ${triggerClassName ?? ""}`.trim()}
        data-testid={`${testId}-trigger`}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        {leadingContent ? (
          <span aria-hidden="true" className={styles.contactInquirySelectLeading}>
            {leadingContent}
          </span>
        ) : null}
        <span className={styles.contactInquirySelectTriggerValue}>
          {renderTrigger ? renderTrigger(selectedOption) : (selectedOption?.label ?? placeholder)}
        </span>
      </button>
      {selectedVisual ? (
        <span aria-hidden="true" className={styles.contactInquirySelectVisual}>
          {selectedVisual}
        </span>
      ) : null}
      <span aria-hidden="true" className={styles.contactInquirySelectChevron}>
        <svg focusable="false" viewBox="0 0 16 16">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </span>
      <select
        aria-label={ariaLabel}
        className={styles.contactInquiryNativeSelect}
        name={name}
        onChange={(event) => onValueChange(event.target.value)}
        required={required}
        tabIndex={-1}
        value={value}
      >
        {placeholder ? (
          <option disabled value="">
            {placeholder}
          </option>
        ) : null}
        {optionGroups.map((group, groupIndex) => (
          <optgroup key={group.label ?? `options-${groupIndex}`} label={group.label}>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <div
        aria-label={ariaLabel}
        className={`${styles.contactInquirySelectMenu} ${menuClassName ?? ""}`.trim()}
        data-lenis-prevent
        data-testid={`${testId}-dropdown-menu`}
        hidden={!isOpen}
        id={listboxId}
        role="listbox"
      >
        {optionGroups.map((group, groupIndex) => (
          <div
            aria-label={group.label}
            className={styles.contactInquirySelectGroup}
            key={group.label ?? `menu-group-${groupIndex}`}
            role={group.label ? "group" : undefined}
          >
            {group.label ? (
              <span className={styles.contactInquirySelectGroupLabel}>{group.label}</span>
            ) : null}
            {group.options.map((option) => {
              const optionIndex = optionIndexes.get(option.value) ?? 0;
              return (
                <button
                  aria-selected={option.value === value}
                  className={styles.contactInquirySelectOption}
                  id={`${listboxId}-option-${optionIndex}`}
                  key={option.value}
                  onClick={() => selectOption(option.value)}
                  onKeyDown={(event) => handleOptionKeyDown(optionIndex, event)}
                  ref={(element) => {
                    optionRefs.current[optionIndex] = element;
                  }}
                  role="option"
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </span>
  );
}

export function ContactInquirySection(): ReactNode {
  const isProduction = process.env.NODE_ENV === "production";
  const isTurnstileConfigured = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [phoneCountryId, setPhoneCountryId] = useState(phoneCountryOptions[0].id);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const phoneCountry =
    phoneCountryOptions.find((country) => country.id === phoneCountryId) ?? phoneCountryOptions[0];
  const phonePlaceholder = formatPhoneNumber("123456789012345", phoneCountry);
  const minimumPhoneDigits = Math.max(
    1,
    MINIMUM_E164_DIGITS - phoneCountry.dialCode.replace(/\D/g, "").length,
  );

  const handleTokenChange = useCallback((token: string): void => {
    setTurnstileToken(token);
  }, []);

  function handleStart(): void {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent({ name: "contact_form_started", properties: { form_name: "contact-inquiry" } });
  }

  function handlePhoneCountryChange(nextCountryId: string): void {
    const nextCountry =
      phoneCountryOptions.find((country) => country.id === nextCountryId) ?? phoneCountryOptions[0];
    setPhoneCountryId(nextCountry.id);
    setPhoneNumber(formatPhoneNumber(getPhoneDigits(phoneNumber, phoneCountry), nextCountry));
  }

  function handlePhoneChange(value: string): void {
    setPhoneNumber(formatPhoneNumber(value, phoneCountry));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    const formData = new FormData(form);
    const phoneDigits = getPhoneDigits(phoneNumber, phoneCountry);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      phone: phoneDigits ? `${phoneCountry.dialCode}${phoneDigits}` : "",
      serviceInterest: String(formData.get("serviceInterest") || ""),
      budgetRange: String(formData.get("budgetRange") || ""),
      message: String(formData.get("message") || ""),
      consentAcknowledged: true,
      turnstileToken,
      submissionId: crypto.randomUUID(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Contact submission failed");
      }

      form.reset();
      setPhoneCountryId(phoneCountryOptions[0].id);
      setPhoneNumber("");
      setServiceInterest("");
      setBudgetRange("");
      setTurnstileToken("");
      setStatus("success");
      trackEvent({ name: "contact_form_submitted", properties: { form_name: "contact-inquiry" } });
    } catch {
      setStatus("error");
      trackEvent({
        name: "contact_form_failed",
        properties: { form_name: "contact-inquiry", reason: "delivery_or_validation" },
      });
    } finally {
      setTurnstileToken("");
      setTurnstileResetSignal((signal) => signal + 1);
    }
  }

  return (
    <section
      aria-labelledby="contact-inquiry-title"
      className={styles.contactInquirySection}
      data-motion-section="true"
      data-layout="12-column"
      data-testid="contact-inquiry-section"
      id="contact-inquiry"
    >
      <div aria-hidden="true" className={styles.contactInquirySurface} />
      <svg
        aria-hidden="true"
        className={`${styles.contactInquiryBoundary} ${styles.contactInquiryBoundaryTop}`}
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 28 C220 8 430 8 690 48 C920 82 1220 74 1440 32 L1440 140 L0 140 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>
      <svg
        aria-hidden="true"
        className={`${styles.contactInquiryBoundary} ${styles.contactInquiryBoundaryBottom}`}
        preserveAspectRatio="none"
        viewBox="0 0 1440 140"
      >
        <path
          d="M0 86 C220 66 430 66 690 106 C920 140 1220 132 1440 90 L1440 0 L0 0 Z"
          fill="var(--color-brand-dark)"
        />
      </svg>

      <div
        className={styles.contactInquiryGrid}
        data-motion-item="true"
        data-testid="contact-inquiry-grid"
      >
        <div className={styles.contactInquiryPanel}>
          <h2 className={styles.contactInquiryTitle} id="contact-inquiry-title">
            What are you trying to <span>build or fix?</span>
          </h2>

          <div className={styles.contactInquiryContent}>
            <div className={styles.contactInquiryChat}>
              <div className={styles.contactInquiryChatImage}>
                <Image
                  alt="Zypher team workspace"
                  className={styles.contactInquiryBackgroundImage}
                  data-image-src={CONTACT_BACKGROUND_SRC}
                  fill
                  loading="lazy"
                  quality={100}
                  sizes="(max-width: 767px) calc(100vw - 4rem), 427px"
                  src={CONTACT_BACKGROUND_SRC}
                />
                <div aria-hidden="true" className={styles.contactInquiryImageOverlay} />
              </div>
              <h3 className={styles.contactInquiryChatTitle}>Prefer Instant Chat?</h3>
              <a
                className={styles.contactInquiryWhatsapp}
                href="https://wa.me/918075725045"
                rel="noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className={styles.contactInquiryWhatsappIcon} />
                WhatsApp Us
              </a>
            </div>

            <div className={styles.contactInquiryFormArea}>
              <form className={styles.contactInquiryForm} onSubmit={handleSubmit}>
                <div className={styles.contactInquiryFields}>
                  <label className={styles.contactInquiryField}>
                    <span>Name</span>
                    <input
                      autoComplete="name"
                      maxLength={100}
                      minLength={2}
                      name="name"
                      onFocus={handleStart}
                      placeholder="John Doe"
                      required
                      type="text"
                    />
                  </label>
                  <label className={styles.contactInquiryField}>
                    <span>Email</span>
                    <input
                      autoComplete="email"
                      maxLength={254}
                      name="email"
                      onFocus={handleStart}
                      placeholder="johndoe@gmail.com"
                      required
                      type="email"
                    />
                  </label>
                  <label className={styles.contactInquiryField}>
                    <span>Company</span>
                    <input
                      autoComplete="organization"
                      maxLength={120}
                      minLength={2}
                      name="company"
                      onFocus={handleStart}
                      placeholder="John Doe Solutions"
                      type="text"
                    />
                  </label>
                  <label
                    className={`${styles.contactInquiryField} ${styles.contactInquiryPhoneField}`}
                  >
                    <span>Phone</span>
                    <span className={styles.contactInquiryPhoneControl}>
                      <span
                        className={styles.contactInquiryPhonePrefix}
                        data-testid="phone-country-prefix"
                      >
                        <ContactInquirySelect
                          ariaLabel="Phone country"
                          className={styles.contactInquiryCountrySelectControl}
                          triggerAriaLabel={`Phone country: ${phoneCountry.name} (${phoneCountry.dialCode})`}
                          onValueChange={handlePhoneCountryChange}
                          selectedVisual={
                            <>
                              {phoneCountry.id === "international" ? (
                                <span
                                  className={styles.contactInquiryCountryGlobe}
                                  data-country-code="international"
                                  data-testid="phone-country-flag"
                                >
                                  <svg aria-hidden="true" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                                  </svg>
                                </span>
                              ) : (
                                <Image
                                  alt=""
                                  className={styles.contactInquiryCountryFlag}
                                  data-country-code={getPhoneCountryCode(phoneCountry)}
                                  data-testid="phone-country-flag"
                                  height={14}
                                  src={getPhoneCountryFlagUrl(phoneCountry)}
                                  unoptimized
                                  width={18}
                                />
                              )}
                              <span className={styles.contactInquiryDialCode}>
                                {phoneCountry.dialCode}
                              </span>
                            </>
                          }
                          options={CONTACT_COUNTRY_SELECT_OPTIONS}
                          renderTrigger={() => null}
                          testId="country-select"
                          triggerClassName={styles.contactInquiryCountryTrigger}
                          value={phoneCountry.id}
                        />
                      </span>
                      <input
                        aria-label="Phone number"
                        autoComplete="tel-national"
                        inputMode="tel"
                        maxLength={30}
                        minLength={minimumPhoneDigits}
                        name="phone"
                        onChange={(event) => handlePhoneChange(event.target.value)}
                        onFocus={handleStart}
                        placeholder={phonePlaceholder}
                        type="tel"
                        value={phoneNumber}
                      />
                    </span>
                  </label>
                  <label className={styles.contactInquiryField}>
                    <span>Service Interest</span>
                    <ContactInquirySelect
                      ariaLabel="Service Interest"
                      groups={CONTACT_SERVICE_SELECT_GROUPS}
                      name="serviceInterest"
                      onValueChange={(value) => {
                        handleStart();
                        setServiceInterest(value);
                      }}
                      placeholder="Select Service..."
                      required
                      testId="service-select"
                      value={serviceInterest}
                    />
                  </label>
                  <label className={styles.contactInquiryField}>
                    <span>Budget Range</span>
                    <ContactInquirySelect
                      ariaLabel="Budget Range"
                      className={styles.contactInquiryBudgetSelectControl}
                      leadingContent="₹"
                      selectedVisual="₹"
                      name="budgetRange"
                      onValueChange={(value) => {
                        handleStart();
                        setBudgetRange(value);
                      }}
                      options={CONTACT_BUDGET_SELECT_OPTIONS}
                      placeholder="Select Budget Range..."
                      required
                      testId="budget-control"
                      triggerClassName={styles.contactInquiryBudgetTrigger}
                      value={budgetRange}
                    />
                  </label>
                  <label
                    className={`${styles.contactInquiryField} ${styles.contactInquiryMessageField}`}
                  >
                    <span>Message</span>
                    <textarea
                      maxLength={5000}
                      minLength={20}
                      name="message"
                      onFocus={handleStart}
                      placeholder="Your Message..."
                      required
                    />
                  </label>
                </div>

                <div className={styles.contactInquiryFormActions}>
                  <button
                    disabled={
                      status === "submitting" ||
                      (isProduction && (!isTurnstileConfigured || !turnstileToken))
                    }
                    type="submit"
                  >
                    {status === "submitting" ? "Sending…" : "Submit Form"}
                  </button>
                  <div className={styles.contactInquiryVerification}>
                    <TurnstileField
                      action="contact"
                      appearance="execute"
                      onTokenChange={handleTokenChange}
                      resetSignal={turnstileResetSignal}
                      showDevelopmentMessage={false}
                    />
                  </div>
                  <p aria-live="polite" className={styles.contactInquiryStatus}>
                    {status === "success"
                      ? "Thanks, your message has been sent. We will be in touch soon."
                      : status === "error"
                        ? "We could not send your message. Please check the details and try again."
                        : null}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
