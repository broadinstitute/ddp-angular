import type { PlaywrightTestConfig } from '@playwright/test';
import singularConfig from './playwright.config';

const ciConfig: PlaywrightTestConfig = {
  ...singularConfig,

  use: {
    video: 'retain-on-failure'
  }

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default ciConfig;
