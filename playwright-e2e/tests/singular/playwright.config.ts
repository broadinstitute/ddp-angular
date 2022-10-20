import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';
import path from 'path';

/**
 * Read environment variables from .env.dsm.singular file.
 * https://github.com/motdotla/dotenv
 */
// import path from 'path';
// import * as dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env.singular') });

const singularConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './',
  globalSetup: require.resolve('../../../global-setup-singular'),
  use: {
    ...testConfig.use,
    storageState: path.relative(__dirname, '../../storageState.json') // Short name is relative to config
  }
};

export default singularConfig;
