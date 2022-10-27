import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from './playwright.config';

const ciConfig: PlaywrightTestConfig = {
  ...testConfig,
  workers: 2
};

export default ciConfig;
