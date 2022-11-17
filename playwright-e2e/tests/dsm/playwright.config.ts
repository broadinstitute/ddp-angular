import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../config/.env.dev') });

const dsmConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './'
};

export default dsmConfig;
