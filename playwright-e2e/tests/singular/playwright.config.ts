import type { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';
import testConfig from 'playwright.config';

/**
 * Read environment variables from .env file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const singularConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './',
  use: {
    ...testConfig.use,
    video: 'retain-on-failure'
  }
};

export default singularConfig;
