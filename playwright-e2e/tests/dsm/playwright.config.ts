import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';

const dsmConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './'
};

export default dsmConfig;
