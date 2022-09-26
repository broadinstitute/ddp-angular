import { ElementHandle, expect, Locator, test } from '@playwright/test';
import _ from 'lodash';
import { visitHomePage } from '../nav';

import HomePage from './home-page';

/**
 * Visual screenshots tests for the Home page
 */
test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await visitHomePage(page);
  });

  test('match header title and description', async ({ page }) => {
    const home = new HomePage(page);

    await home.waitForReady();

    await expect(page).toHaveTitle('Project Singular'); // checks page title

    // Header logo/image
    const logo = home.pageLogoLocator;

    await expect(logo).toHaveAttribute('src', 'assets/images/logo-black.png');
    expect(await logo.screenshot()).toMatchSnapshot('logo.png');

    // Header title
    const title = home.headerTitleLocator;

    await expect(title).toContainText(
      'Discoveries in single ventricle heart defects are on the horizon.But we need your help.'
    );
    expect(await title.screenshot()).toMatchSnapshot('Title.png');

    // Header description. Split checks because header description is very long
    const description = home.headerDescriptionLocator;

    await expect(description).toContainText(
      'We are on a mission to find out what causes single ventricle heart disease and find better ways to treat it.'
    );
    await expect(description).toContainText('By sharing your health information,you can help us make it happen.');
    await expect(description).toContainText(
      'Join our community of patients and familieswho are committed to making discoveries!' // familieswho is not a typo
    );
    expect(await description.screenshot()).toMatchSnapshot('Description.png');
  });

  test('match nav-links', async ({ page }) => {
    const nav = page.locator('.header__nav');

    expect(await nav.screenshot({ omitBackground: true })).toMatchSnapshot('nav.png');

    const navLinks = page.locator('.header__nav li');

    await expect(navLinks).toContainText(['About Us', 'Study Progress', 'FAQs', 'For Researchers', 'For Clinicians']);
  });

  test('match login button', async ({ page }) => {
    const loginButton = page.locator('.header__nav li button[data-ddp-test="signInButton"]');

    await expect(loginButton).toContainText('Log In');
    expect(await loginButton.screenshot()).toMatchSnapshot('login-button.png');
  });

  test('match Sign me up button', async ({ page }) => {
    const signMeUpButton = page.locator('.header__nav li a[href="/pre-screening"]');

    await expect(signMeUpButton).toContainText('Sign me up!');
    expect(await signMeUpButton.screenshot()).toMatchSnapshot('sign-me-up-button.png');
  });

  test('match privacy note', async ({ page }) => {
    const privacyNote = page.locator('.privacy');

    await expect(privacyNote).toContainText(
      'We are committed to protecting your privacy. ' +
        'Learn about how we are keeping your information safe, ' +
        'why we are asking for medical records, and more in our FAQs.'
    );
    expect(await privacyNote.screenshot()).toMatchSnapshot('privacy-note.png');
  });

  test('match partners links', async ({ page }) => {
    const orderedHrefs = [
      'https://www.additionalventures.org',
      'https://www.broadinstitute.org',
      'https://www.childrenshospital.org',
      'https://www.genomemedical.com'
    ];
    const partnersHeader = page.locator('.partners h1');
    await expect(partnersHeader).toContainText('Our Partners');
    expect(await partnersHeader.screenshot()).toMatchSnapshot('our-partners-text.png');

    const partners: Locator = page.locator('.partners .partners-list-item a');
    const count = await partners.count();

    expect(count).toEqual(4); // Total 4 partners at the time of writing
    for (let i = 0; i < count; i++) {
      await expect(partners.nth(i)).toBeVisible(); // Ensure visible
    }
    const actualHrefs = await Promise.all(
      _.map(await partners.elementHandles(), async (partner: ElementHandle) => {
        return await partner.getAttribute('href');
      })
    );

    expect(actualHrefs).toEqual(orderedHrefs); // Ensure href match
  });

  test('match participating steps', async ({ page }) => {
    // participating steps are three steps
    const steps = page.locator('.participating-steps-step');

    await expect(steps.first()).toBeVisible();
    const count = await steps.count();

    expect(count).toEqual(3);

    const step1Title = page.locator('.participating-steps-step', { hasText: 'STEP 1' });

    expect(await step1Title.screenshot()).toMatchSnapshot('participating-step-1.png');

    const step2Title = page.locator('.participating-steps-step', { hasText: 'STEP 2' });

    expect(await step2Title.screenshot()).toMatchSnapshot('participating-step-2.png');

    const step3Title = page.locator('.participating-steps-step', { hasText: 'STEP 3' });

    expect(await step3Title.screenshot()).toMatchSnapshot('participating-step-3.png');
  });
});
