import { fixtureBase as base } from 'fixtures/fixture-base';
import { fillSitePassword } from 'utils/test-utils';

const { RGP_BASE_URL } = process.env;

// Use this fixture in RGP test
const fixture = base.extend({
  page: async ({ page }, use) => {
    await page.goto(`${RGP_BASE_URL}/password`);
    await fillSitePassword(page);
    await use(page);
  }
});

export const test = fixture;
