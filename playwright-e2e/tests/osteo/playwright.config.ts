import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';

const osteoConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './'
};

export default osteoConfig;
