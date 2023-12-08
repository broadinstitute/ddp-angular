import { Fixtures } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { fixtureBase as base } from 'fixtures/fixture-base';

const { DSM_USER1_EMAIL, DSM_USER1_PASSWORD, DSM_USER2_EMAIL, DSM_USER2_PASSWORD, DSM_USER4_EMAIL, DSM_USER4_PASSWORD } = process.env;

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
    if (DSM_USER1_EMAIL === undefined || DSM_USER1_EMAIL === null) {
      throw Error('Invalid parameter: DSM_USER1_EMAIL is undefined or null.');
    }
    if (DSM_USER1_PASSWORD === undefined || DSM_USER1_PASSWORD === null) {
      throw Error('Invalid parameter: DSM_USER1_PASSWORD is undefined or null.');
    }
    await login(page, {email: DSM_USER1_EMAIL, password: DSM_USER1_PASSWORD});
    await use(page);
  }
});

// Use this for general DSM tests with limited permissions
const fixtureForGeneralTesting = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    if (DSM_USER2_EMAIL === undefined || DSM_USER2_EMAIL === null) {
      throw Error('Invalid parameter: DSM_USER2_EMAIL is undefined or null.');
    }
    if (DSM_USER2_PASSWORD === undefined || DSM_USER2_PASSWORD === null) {
      throw Error('Invalid parameter: DSM_USER2_PASSWORD is undefined or null.');
    }
    await login(page, {email: DSM_USER2_EMAIL, password: DSM_USER2_PASSWORD});
    await use(page);
  }
});

const fixtureForGPCollectionDateTest = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    if (DSM_USER4_EMAIL === undefined || DSM_USER4_EMAIL === null) {
      throw Error('Invalid parameter: DSM_USER4_EMAIL is undefined or null.');
    }
    if (DSM_USER4_PASSWORD === undefined || DSM_USER4_PASSWORD === null) {
      throw Error('Invalid parameter: DSM_USER4_PASSWORD is undefined or null.');
    }
    await login(page, {email: DSM_USER4_EMAIL, password: DSM_USER4_PASSWORD});
    await use(page);
  }
});

export const test = fixture;
export const testLimitedPermissions = fixtureForLimitedPermissions;
export const testWithUser2 = fixtureForGeneralTesting;
export const testGPCollectionDate = fixtureForGPCollectionDateTest;
