import { fixtureBase as base } from 'fixtures/fixture-base';
import { fillSitePassword } from 'utils/test-utils';

const { LMS_BASE_URL } = process.env;

// Use this fixture in LMS test
const fixture = base.extend({
  page: async ({ page }, use) => {
    await page.goto(`${LMS_BASE_URL}/password`, { waitUntil: 'networkidle' });
    await fillSitePassword(page);
    await use(page);
  }
});

export const test = fixture;
