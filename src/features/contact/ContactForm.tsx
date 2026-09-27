"use client";

import { useCallback, useRef, useState, type FormEvent, type ReactNode } from "react";
import { trackEvent } from "@/integrations/analytics/events";
import { TurnstileField } from "@/features/contact/TurnstileField";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm(): ReactNode {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const hasStarted = useRef(false);

  const handleTokenChange = useCallback((token: string): void => {
    setTurnstileToken(token);
  }, []);

  function handleStart(): void {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackEvent({ name: "contact_form_started", properties: { form_name: "contact" } });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      phone: String(formData.get("phone") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
      consentAcknowledged: formData.get("consentAcknowledged") === "on",
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
      setTurnstileToken("");
      setStatus("success");
      trackEvent({ name: "contact_form_submitted", properties: { form_name: "contact" } });
    } catch {
      setStatus("error");
      trackEvent({
        name: "contact_form_failed",
        properties: { form_name: "contact", reason: "delivery_or_validation" },
      });
    } finally {
      setTurnstileToken("");
      setTurnstileResetSignal((signal) => signal + 1);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-mist-300">
          <span>Name *</span>
          <input
            className="min-h-12 w-full rounded-xl border border-mist-300/20 bg-ink-900 px-4 text-mist-100 outline-none transition-colors focus:border-cyan-300"
            name="name"
            onFocus={handleStart}
            required
            type="text"
          />
        </label>
        <label className="space-y-2 text-sm text-mist-300">
          <span>Email *</span>
          <input
            className="min-h-12 w-full rounded-xl border border-mist-300/20 bg-ink-900 px-4 text-mist-100 outline-none transition-colors focus:border-cyan-300"
            name="email"
            onFocus={handleStart}
            required
            type="email"
          />
        </label>
        <label className="space-y-2 text-sm text-mist-300">
          <span>Company</span>
          <input
            className="min-h-12 w-full rounded-xl border border-mist-300/20 bg-ink-900 px-4 text-mist-100 outline-none transition-colors focus:border-cyan-300"
            name="company"
            onFocus={handleStart}
            type="text"
          />
        </label>
        <label className="space-y-2 text-sm text-mist-300">
          <span>Phone</span>
          <input
            className="min-h-12 w-full rounded-xl border border-mist-300/20 bg-ink-900 px-4 text-mist-100 outline-none transition-colors focus:border-cyan-300"
            name="phone"
            onFocus={handleStart}
            type="tel"
          />
        </label>
      </div>
      <label className="block space-y-2 text-sm text-mist-300">
        <span>Subject</span>
        <input
          className="min-h-12 w-full rounded-xl border border-mist-300/20 bg-ink-900 px-4 text-mist-100 outline-none transition-colors focus:border-cyan-300"
          name="subject"
          onFocus={handleStart}
          type="text"
        />
      </label>
      <label className="block space-y-2 text-sm text-mist-300">
        <span>How can we help? *</span>
        <textarea
          className="min-h-40 w-full resize-y rounded-xl border border-mist-300/20 bg-ink-900 px-4 py-3 text-mist-100 outline-none transition-colors focus:border-cyan-300"
          minLength={20}
          name="message"
          onFocus={handleStart}
          required
        />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-mist-300">
        <input
          className="mt-1 size-4 accent-cyan-400"
          name="consentAcknowledged"
          required
          type="checkbox"
        />
        <span>
          I agree that Zypher may use these details to respond to my enquiry. See the{" "}
          <a className="underline underline-offset-4 hover:text-cyan-300" href="/privacy-policy">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      <TurnstileField
        action="contact"
        onTokenChange={handleTokenChange}
        resetSignal={turnstileResetSignal}
      />
      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </button>
      <p aria-live="polite" className="text-sm text-mist-300">
        {status === "success"
          ? "Thanks, your message has been sent. We will be in touch soon."
          : status === "error"
            ? "We could not send your message. Please check the details and try again."
            : null}
      </p>
    </form>
  );
}
