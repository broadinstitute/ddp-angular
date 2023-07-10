import { Fixtures } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { fixtureBase as base } from 'fixtures/fixture-base';

// Use this fixture for login in DSM tests
const fixture = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await login(page);
    await use(page);
  }
});

export const test = fixture;
