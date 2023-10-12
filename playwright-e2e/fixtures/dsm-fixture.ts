import { Fixtures } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { fixtureBase as base } from 'fixtures/fixture-base';

const { DSM_USER1_EMAIL, DSM_USER1_PASSWORD } = process.env;

// Use this fixture for login in DSM tests
const fixture = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await login(page);
    await use(page);
  }
});

// Use this for login in DSM tests with limited permissions - view sequencing permission test
const fixtureForLimitedPermissions = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await login(page, {email: DSM_USER1_EMAIL, password: DSM_USER1_PASSWORD});
    await use(page);
  }
});

export const test = fixture;
export const testLimitedPermissions = fixtureForLimitedPermissions;
