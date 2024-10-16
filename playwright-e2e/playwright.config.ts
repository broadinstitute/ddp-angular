import type { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

/**
 * Read environment variables from .env file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { CI, TEST_SLOW_MO } = process.env;

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
  forbidOnly: !!CI,
  retries: CI ? 1 : 0,
  workers: CI ? 1 : 2,
  maxFailures: CI ? 10 : 0,

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
      slowMo: TEST_SLOW_MO ? parseInt(TEST_SLOW_MO) : 100,
      // Account for minor difference in text rendering and resolution between headless and headed mode
      ignoreDefaultArgs: ['--hide-scrollbars']
    },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    viewport: { width: 1600, height: 960 },
    ignoreHTTPSErrors: true,

    /* Maximum time each (browser) action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 50 * 1000,
    navigationTimeout: 50 * 1000,
    acceptDownloads: true,
    testIdAttribute: 'data-ddp-test',

    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer#using-traceplaywrightdev */
    trace: CI ? 'on-first-retry' : 'retain-on-failure', // https://playwright.dev/docs/trace-viewer#recording-a-trace-on-ci
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    video: CI ? 'on-first-retry' : 'retain-on-failure', // https://playwright.dev/docs/videos#record-video
  },

  /* Configure projects for chromium browser */
  projects: [
    {
      // command examples:
      // Listing DSM tests: npx playwright test --list --project="dsm"
      // Running DSM tests serially: npx playwright test --project="dsm" --workers=1
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
