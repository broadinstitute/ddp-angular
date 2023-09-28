import type { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

/**
 * Read environment variables from .env.dsm.singular file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Base Playwright TestConfig.
 * See https://playwright.dev/docs/test-configuration.
 */
const testConfig: PlaywrightTestConfig = {
  globalSetup: require.resolve('./fixtures/global-setup'),
  testDir: __dirname,
  testMatch: '**/*.spec.ts',
  /* Maximum timeout per test. Each test should be short and takes less than 4 min to run */
  timeout: 4 * 60 * 1000,
  /* For expect() calls */
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 30 * 1000,
    toMatchSnapshot: {
      // Account for minor difference in text rendering and resolution between headless and headed mode
      threshold: 1,
      maxDiffPixelRatio: 0.3
    },
    toHaveScreenshot: {
      scale: 'css',
      // Account for minor difference in text rendering and resolution between headless and headed mode
      threshold: 1,
      maxDiffPixelRatio: 0.5
    }
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 3,
  maxFailures: 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      'html',
      {
        open: 'never',
        outputFolder: 'html-test-results',
        host: '0.0.0.0',
        port: 9223
      }
    ],
    ['list'],
    ['junit', { outputFile: 'junit/results/results.xml' }]
  ],
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName: 'chromium',
    headless: true,
    launchOptions: {
      slowMo: 100,
      // Account for minor difference in text rendering and resolution between headless and headed mode
      ignoreDefaultArgs: ['--hide-scrollbars']
    },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 960 },
    ignoreHTTPSErrors: true,

    /* Maximum time each (browser) action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 50 * 1000,
    navigationTimeout: 50 * 1000,
    acceptDownloads: true,
    testIdAttribute: 'data-ddp-test',

    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    video: 'retain-on-failure',
  },

  /* Configure projects for chromium browser */
  projects: [
    {
      // Listing tests: npx playwright test --list --project="dsm"
      // Running tests serially: npx playwright test --project="kit" --workers=1
      name: 'dsm',
      testDir: 'tests/dsm',
      use: {}
    },
    {
      name: 'dss',
      testDir: 'tests',
      testIgnore: ['tests/dsm/**/*.spec.ts'],
      use: {}
    }
  ]
};

export default testConfig;
