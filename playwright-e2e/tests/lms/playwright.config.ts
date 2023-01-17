import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';

const lmsConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './'
};

export default lmsConfig;
