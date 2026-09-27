import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TurnstileField } from "@/features/contact/TurnstileField";

describe("TurnstileField", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    document.head
      .querySelectorAll('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')
      .forEach((script) => script.remove());
  });

  it("should reset the invisible widget after the parent requests a new token", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "0x4AAAAAAFDJidlqq1CMuF8d");
    const resetMock = vi.fn();
    const renderMock = vi.fn().mockReturnValue("widget-id");
    const onTokenChange = vi.fn();
    vi.stubGlobal("turnstile", {
      render: renderMock,
      reset: resetMock,
    });

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    document.head.appendChild(script);

    const { rerender } = render(
      <TurnstileField
        action="contact"
        onTokenChange={onTokenChange}
        resetSignal={0}
        showDevelopmentMessage={false}
      />,
    );

    await waitFor(() => expect(renderMock).toHaveBeenCalled());
    expect(document.querySelector('[aria-label="Spam protection"]')).toHaveClass("turnstileField");
    rerender(
      <TurnstileField
        action="contact"
        onTokenChange={onTokenChange}
        resetSignal={1}
        showDevelopmentMessage={false}
      />,
    );

    await waitFor(() => expect(resetMock).toHaveBeenCalledWith("widget-id"));
  });
});
