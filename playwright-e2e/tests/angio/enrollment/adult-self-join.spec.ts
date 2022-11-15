import { test } from 'fixtures/angio-fixture';
import HomePage from 'pages/angio/home/home-page';
import CountMeInPage, { DESCRIBE_SELF } from 'pages/angio/enrollment/count-me-in-page';
import * as user from 'data/fake-user.json';
import { generateUserName } from 'utils/faker-utils';
import * as auth from 'authentication/auth-angio';
import AboutYouPage from 'pages/angio/enrollment/about-you-page';
import { MONTH } from 'data/constants';

test.describe('Adult Joining', () => {
  // Randomize last name
  const lastName = generateUserName(user.patient.lastName);

  test('Join for self @functional @join @angio', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.countMeIn();

    // Step 1:
    // Tell Us About Yourself
    const countMeInPage = new CountMeInPage(page);
    await countMeInPage.waitForReady();
    await countMeInPage.firstName().fill(user.patient.firstName);
    await countMeInPage.lastName().fill(lastName);
    await countMeInPage.diagnosedWithAngiosarcoma(DESCRIBE_SELF.HaveBeenDiagnosedWithAngiosarcoma).check();
    await countMeInPage.submit();

    // Step 2:
    // Create account with an email alias
    await auth.createAccountWithEmailAlias(page);

    // Step 3:
    // Answers questions about youself
    const aboutYourself = new AboutYouPage(page);
    await aboutYourself.whenDiagnosedWithAngiosarcoma(MONTH.AUG, '1950');

    await page.pause();
  });
});
