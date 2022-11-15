import { expect } from '@playwright/test';
import { test } from 'fixtures/rgp-fixture';
import HowItWorksPage from 'pages/rgp/enrollment/how-it-works-page';
import TellUsYourStoryPage, { WHO } from 'pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'pages/rgp/home/home-page';
import CreateAccountPage from 'pages/rgp/enrollment/create-account-page';

test.describe('Adult Joining', () => {
  test('Start an application for self @functional @join @rgp', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.getStarted();

    const howItWorks = new HowItWorksPage(page);
    await howItWorks.startApplication();

    const tellUsYourStoryPage = new TellUsYourStoryPage(page);
    await tellUsYourStoryPage.waitForReady();
    // Check all checkboxes
    await tellUsYourStoryPage.who().check(WHO.UnderstandEnglishOrSpanish);
    await tellUsYourStoryPage.who().check(WHO.LivesInUS);
    await tellUsYourStoryPage.who().check(WHO.HasRareGeneticallyUndiagnosedCondition);
    await tellUsYourStoryPage.who().check(WHO.IsUnderCare);
    await tellUsYourStoryPage.submit();

    const createAccountPage = new CreateAccountPage(page);
    await createAccountPage.createAccountWithEmailAlias();

    await expect(page.locator('#view__account-verification p:first-child')).toHaveText(
      'An email has been sent to the address that you provided. ' +
        'Please check your inbox, ' +
        'open the email and click "Verify my account and complete questionnaire" ' +
        'to move forward in the submission process.'
    );

    await expect(page.locator('#view__account-verification p:last-child')).toHaveText(
      'If you do not receive an email, contact us at raregenomes@broadinstitute.org.'
    );

    // BLOCKED by Email Verification. See https://broadworkbench.atlassian.net/browse/PEPPER-317
  });
});
