import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';

const rgpConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './',
  use: {
    video: 'on',
  }
};

export default rgpConfig;