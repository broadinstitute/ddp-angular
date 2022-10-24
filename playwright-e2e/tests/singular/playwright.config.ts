import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';

const singularConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './'
};

export default singularConfig;
