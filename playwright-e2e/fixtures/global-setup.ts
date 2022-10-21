import { FullConfig } from '@playwright/test';
import path from 'path';

async function globalSetup(config: FullConfig) {
  process.env.ROOT_DIR = path.resolve(__dirname, '../');
}

export default globalSetup;
