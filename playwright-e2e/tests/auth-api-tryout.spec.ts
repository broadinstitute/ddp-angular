/**
 * Functional tests for the Home page
 */
import {test} from '@playwright/test';
import {getAccessToken, getUserID} from 'utils/user-email-verification';

test.describe('Auth0', () => {
  // eslint-disable-next-line no-empty-pattern
  test('request', async ({ page }) => {
    console.log('begin');
    await getAccessToken();
    // await getUserID('rgpbug1003@mailinator.com', )
  });
});
