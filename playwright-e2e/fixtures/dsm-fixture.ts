import { Fixtures } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { fixtureBase as base } from 'fixtures/fixture-base';

const { DSM_BASE_URL } = process.env;

const fixture = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.goto(`${DSM_BASE_URL}`);
    await login(page);
    await use(page);
  }
});

export const test = fixture;
