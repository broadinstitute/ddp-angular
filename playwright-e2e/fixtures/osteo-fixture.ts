import { fixtureBase as base } from 'fixtures/fixture-base';
import { fillSitePassword } from 'utils/test-utils';

const { OSTEO_BASE_URL } = process.env;

// Use this fixture in Osteo test
const fixture = base.extend({
  page: async ({ page }, use) => {
    await page.goto(`${OSTEO_BASE_URL}/password`);
    await fillSitePassword(page);
    await use(page);
  }
});

export const test = fixture;
