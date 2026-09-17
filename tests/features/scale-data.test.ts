import { describe, expect, it } from "vitest";
import { scaleClientLogos, scaleMetrics, scaleProjects } from "@/features/home/scale-data";

describe("scale section data", () => {
  it("should expose the three approved metrics and projects", () => {
    expect(scaleMetrics).toHaveLength(3);
    expect(scaleProjects).toHaveLength(3);
    expect(scaleProjects.map((project) => project.title)).toEqual([
      "Custom CRM",
      "VMS - Platform",
      "Rental System",
    ]);
    expect(scaleProjects.map((project) => project.eyebrow)).toEqual([
      "CRM & ERP",
      "CYBERSECURITY",
      "RETAIL OPS",
    ]);
    expect(scaleProjects.map((project) => project.description)).toEqual([
      "A custom CRM connecting one client's business end-to-end, with automation replacing manual work.",
      "A cybersecurity platform catching vulnerabilities before they become incidents.",
      "A rental platform that gave a two-branch business one place to run both.",
    ]);
  });

  it("should provide a meaningful alt text and source for every client logo", () => {
    expect(scaleClientLogos).toHaveLength(10);
    for (const logo of scaleClientLogos) {
      expect(logo.src).toMatch(/^https:\/\//);
      expect(logo.alt.trim()).not.toBe("");
    }
    expect(scaleClientLogos.map((logo) => logo.src)).toEqual([
      "https://media.zypher-solutions.com/home-page/section-2/DiViSe%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/ES%20Decorations%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/LIMINAL%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/Lylux%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/MEIRIS%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/PeopleMaketh%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/SMT%20Malabar%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/SecureThread%20OPS%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/Sonexia%20Logo.png",
      "https://media.zypher-solutions.com/home-page/section-2/USR%20Logo.png",
    ]);
  });
});
