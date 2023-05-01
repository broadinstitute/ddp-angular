import { fixtureBase as base } from 'fixtures/fixture-base';
import { fillSitePassword } from 'utils/test-utils';

const { PANCAN_BASE_URL } = process.env;

// Use this fixture in Pancan test
const fixture = base.extend({
  page: async ({ page }, use) => {
    await page.goto(`${PANCAN_BASE_URL}/password`);
    await fillSitePassword(page);
    await use(page);
  }
});

export const test = fixture;
