import type { PlaywrightTestConfig } from '@playwright/test';
import lmsConfig from './playwright.config';

const ciConfig: PlaywrightTestConfig = {
  ...lmsConfig,

  use: {
    video: 'retain-on-failure'
  }
};

export default ciConfig;
