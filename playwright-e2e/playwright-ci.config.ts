import type { PlaywrightTestConfig } from '@playwright/test';

import testConfig from './playwright.config';

const config: PlaywrightTestConfig = {
  ...testConfig,
  retries: 1,

  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
