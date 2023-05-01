import { expect } from '@playwright/test';
import * as auth from 'authentication/auth-rgp';
import { test } from 'fixtures/rgp-fixture';
import HowItWorksPage from 'pages/rgp/how-it-works-page';
import TellUsYourStoryPage, { WHO } from 'pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'pages/rgp/home-page';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD, RGP_BASE_URL } = process.env;

test.describe('Registration requires email Verification', () => {
  test('Login is blocked without verification @functional @enrollment @rgp', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickGetStarted();

    const howItWorks = new HowItWorksPage(page);
    await howItWorks.startApplication();

    const tellUsYourStoryPage = new TellUsYourStoryPage(page);
    await tellUsYourStoryPage.waitForReady();

    await tellUsYourStoryPage.who().check(WHO.UnderstandEnglishOrSpanish);
    await tellUsYourStoryPage.who().check(WHO.LivesInUS);
    await tellUsYourStoryPage.who().check(WHO.HasRareGeneticallyUndiagnosedCondition);
    await tellUsYourStoryPage.who().check(WHO.IsUnderCare);
    await tellUsYourStoryPage.submit();

    const userEmail = await auth.createAccountWithEmailAlias(page, {
      email: RGP_USER_EMAIL,
      password: RGP_USER_PASSWORD,
      waitForNavigation: false,
      waitForAuth: false
    });
    await expect(page.locator('text="Account Verification"')).toBeVisible();

    await auth.login(page, { email: userEmail });

    await expect(page.locator('.PageHeader-title')).toHaveText('Email verification required');
    await expect(page.locator('p.Paragraph')).toHaveText('Please verify your email using the link that was sent to your email address.');
    expect(page.url()).toEqual(`${RGP_BASE_URL}/email-verification-required`);
  });
});
