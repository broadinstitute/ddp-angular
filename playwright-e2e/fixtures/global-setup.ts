import { FullConfig } from '@playwright/test';
import path from 'path';

/**
 * This function will be run once before all the tests.
 * See https://playwright.dev/docs/test-advanced#global-setup-and-teardown
 * @param config
 */
async function globalSetup(config: FullConfig) {
  // setting environment variables to make data available to all tests.
  process.env.ROOT_DIR = path.resolve(__dirname, '../');
}

export default globalSetup;
