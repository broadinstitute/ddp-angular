import { Fixtures } from '@playwright/test';
import { fixtureBase as base } from 'fixtures/fixture-base';

const fixture = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await use(page);
  }
});

export const test = fixture;
