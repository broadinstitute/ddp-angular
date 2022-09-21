import type { PlaywrightTestConfig } from '@playwright/test';

import testConfig from './playwright.config';

const config: PlaywrightTestConfig = {
  ...testConfig,
  workers: 5,
  maxFailures: 5,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
};

export default config;
