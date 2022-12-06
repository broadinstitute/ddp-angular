/**
 * Functional tests for the Home page
 */
import { test } from '@playwright/test';
import { APP } from 'data/constants';
import { getAuth0AccessToken, setAuth0UserEmailVerified } from 'utils/api-utils';

test.describe('Auth0', () => {
  test('request', async ({ page }) => {
    // const accessToken = await getAuth0AccessToken(APP.RPG);

    // const userId = await getAuth0UserId(APP.RPG, 'rgpbug1003@mailinator.com', accessToken);
    // console.log('user_id: ', userId);

    const res = await setAuth0UserEmailVerified(APP.RPG, 'rgpbug1003@mailinator.com',{ isEmailVerified: false });
    console.log(res)
  });
});
