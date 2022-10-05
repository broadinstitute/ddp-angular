import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';

/**
 * Read environment variables from .env.dsm.singular file.
 * https://github.com/motdotla/dotenv
 */
// import path from 'path';
// import * as dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env.singular') });

const singularConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './'
};

export default singularConfig;
