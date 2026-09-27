import { defineConfig, devices, type ReporterDescription } from "@playwright/test";

const ciReporters: ReporterDescription[] = [
  ["github", {}],
  ["html", { outputFolder: "playwright-report", open: "never" }],
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? ciReporters : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: process.env.CI ? "retain-on-failure" : "on-first-retry",
    video: process.env.CI ? "retain-on-failure" : "off",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
