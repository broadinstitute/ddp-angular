import type { PlaywrightTestConfig } from '@playwright/test';
import testConfig from 'playwright.config';
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.resolve(__dirname, '.env.dsm') })

const dsmConfig: PlaywrightTestConfig = {
  ...testConfig,
  testDir: './'
};

export default dsmConfig;
