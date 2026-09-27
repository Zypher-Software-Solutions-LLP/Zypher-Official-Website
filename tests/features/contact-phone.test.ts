import { describe, expect, it } from "vitest";
import {
  formatPhoneNumber,
  getPhonePlaceholder,
  phoneCountryOptions,
} from "@/features/contact/phone-format";

describe("phone formatting", () => {
  it("should format Indian numbers in two five-digit groups", () => {
    const india = phoneCountryOptions.find((country) => country.id === "india");
    if (!india) throw new Error("India phone rule is missing");

    expect(formatPhoneNumber("8075725045", india)).toBe("80757 25045");
    expect(getPhonePlaceholder(india)).toBe("+91 12345 67890");
  });

  it("should format UAE numbers in two-three-four groups", () => {
    const uae = phoneCountryOptions.find((country) => country.id === "uae");
    if (!uae) throw new Error("UAE phone rule is missing");

    expect(formatPhoneNumber("501234567", uae)).toBe("50 123 4567");
  });

  it("should cap international fallback input at fifteen digits", () => {
    const international = phoneCountryOptions.find((country) => country.id === "international");
    if (!international) throw new Error("International phone rule is missing");

    expect(formatPhoneNumber("1234567890123456", international)).toBe("123 456 789 012 345");
  });
});
