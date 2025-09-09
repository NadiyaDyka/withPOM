import { defineConfig, devices } from "@playwright/test";
import { cucumberReporter, defineBddConfig } from "playwright-bdd";
import dotenv from "dotenv";
import path from "path";
import {
  DEFAULT_EXPECT_TIMEOUT,
  DEFAULT_TEST_TIMEOUT,
  DEFAULT_TEST_RUN_TIMEOUT,
  MONTHS,
} from "./test-scenarios/test-data/constants";

//require("dotenv").config({ path: ".env" });
dotenv.config({ path: path.resolve(__dirname, "../.config/.env") });
const today = new Date();
const dateInFileName = [
  today.getDate(),
  MONTHS[today.getMonth()],
  today.getFullYear(),
  today.getHours(),
  today.getMinutes(),
].join("-");

const testDir = defineBddConfig({
  features: [
    "./test-scenarios/features/**/*.feature",
    "./test-scenarios/features/**/**/*.feature",
    "./test-scenarios/api/features/**/*.feature",
    "./test-scenarios/api/features/**/**/*.feature",
  ],
  steps: [
    "./test-scenarios/steps/*.ts",
    "./test-scenarios/steps/**/*.ts",
    "./test-scenarios/utils/fixtures.ts",
    "./test-scenarios/api/steps/*.ts",
    "./test-scenarios/api/steps/**/*.ts",
  ],
});

export default defineConfig({
  // Test directory value is automatically handled by playwright-bdd.
  testDir,

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : 4,

  // Reporter to use
  reporter: [
    ["./test-scenarios/utils/CustomReporter.ts"],
    ["html", { outputFolder: `reports/playwright-${dateInFileName}/` }],
    cucumberReporter("html", { outputFile: "reports/cucumber/index.html" }),
  ],
  globalTimeout: DEFAULT_TEST_RUN_TIMEOUT,
  timeout: DEFAULT_TEST_TIMEOUT,

  use: {
    // Capture screenshot when a test fails.
    screenshot: "on",
    video: "on",
    // Collect trace when retrying the failed test.
    trace: "on-first-retry",
    // Run Headless
    headless: true,
    // Custom TestID
    testIdAttribute: "data-test", // Change to website default
    // Base URL to use in actions like `await page.goto('/')`.
    // baseURL: 'http://127.0.0.1:3000',
    // extraHTTPHeaders: {
    //     // We set this header per GitHub guidelines.
    //     'Accept': 'application/vnd.github.v3+json',
    //     // Add authorization token to all requests.
    //     // Assuming personal access token available in the environment.
    //     'Authorization': `token ${process.env.API_TOKEN}`,
    //   },
  },
  expect: {
    timeout: DEFAULT_EXPECT_TIMEOUT,
  },

  // Configure projects for major browsers.
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1400, height: 920 },
        channel: "chromium",
        acceptDownloads: true,
      },
    },
    //{
    //  name: "webkit",
    //  use: {
    //    ...devices["Desktop Safari"],
    //    viewport: { width: 1400, height: 920 },
    //    channel: "webkit",
    //    acceptDownloads: true,
    //  },
    //},
    //{
    //  name: "msedge",
    //  use: {
    //    ...devices["Desktop Edge"],
    //    viewport: { width: 1400, height: 920 },
    //    channel: "msedge", // Supported MS Edge channes are : msedge, msedge-beta, msedge-dev, msedge-canary
    //    acceptDownloads: true,
    //  },
    //},
    // {
    //     name: 'firefox',
    //     use: {
    //         ...devices[ 'Desktop Firefox' ],
    //         viewport: {width: 1400, height: 920},
    //         channel: 'firefox',
    //         acceptDownloads: true,
    //     },
    // },

    /* Test against mobile viewports. */
    // {
    //     name: 'Mobile Chrome',
    //     use: { ...devices['Pixel 5'] },
    // },
    // {
    //     name: 'Mobile Safari',
    //     use: { ...devices['iPhone 14 Pro Max'] },
    // },
  ],
});
