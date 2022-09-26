import type { PlaywrightTestConfig } from '@playwright/test';

import testConfig from './playwright.config';

const config: PlaywrightTestConfig = {
  ...testConfig,
  workers: 5,

  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
};

export default config;
