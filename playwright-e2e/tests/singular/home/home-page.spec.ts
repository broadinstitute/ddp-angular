import { expect, test } from '@playwright/test';
import { goToAboutUs, goToPath, NavSelectors } from 'tests/singular/nav';
import { fillSitePassword } from 'tests/lib/authentication';

/**
 * Functional tests
 */
test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
  });

  test('go to Contact Us', async ({ page }) => {
    const aboutUs = page.locator(NavSelectors.AboutUs);

    await expect(aboutUs).toHaveAttribute('href', '/about');
    await expect(aboutUs).toBeVisible();

    await goToAboutUs(page);

    // Verify page is About Us
    // Expects the About Us header.
    const header = page.locator('h1 >> text="About Us"');

    await expect(header).toBeVisible();

    const childImgDescription = page.locator('.img-description:below(img[src="assets/images/Judson_2x.png"])');

    await expect(childImgDescription).toBeVisible();

    const childImg = page.locator('img[src="assets/images/Judson_2x.png"]');

    await expect(childImg).toBeVisible();

    // await expect(page).toHaveScreenshot('singular-about-us-page', {fullPage: true});
  });

  test('go to Study Progress', async ({ page, context }) => {
    const studyProgress = page.locator(NavSelectors.StudyProgress);

    await expect(studyProgress).toHaveAttribute(
      'href',
      'https://www.additionalventures.org/initiatives/biomedical-research/foundational-resources/project-singular/'
    );
    await expect(studyProgress).toBeVisible();

    // New tab open
    const [newPage] = await Promise.all([context.waitForEvent('page'), studyProgress.click()]);

    await expect(newPage).toHaveTitle('Project Singular - Additional Ventures');
  });

  test('go to FAQs', async ({ page }) => {
    const faq = page.locator(NavSelectors.FAQs);

    await expect(faq).toHaveAttribute('href', '/faq');
    await expect(faq).toBeVisible();

    await Promise.all([page.waitForNavigation(), faq.click()]);

    await expect(page.locator('h1')).toHaveText('Frequently Asked Questions');
  });

  test('go to For Researchers', async ({ page }) => {
    const forResearchers = page.locator(NavSelectors.ForResearchers);

    await expect(forResearchers).toHaveAttribute('href', '/for-researchers');
    await expect(forResearchers).toBeVisible();

    await Promise.all([page.waitForNavigation(), forResearchers.click()]);

    await expect(page.locator('h1').first()).toHaveText('Uncovering Single Ventricle Etiology');
  });

  test('go to For Clinicians', async ({ page }) => {
    const forClinicians = page.locator(NavSelectors.ForClinicians);

    await expect(forClinicians).toHaveAttribute('href', '/for-clinicians');
    await expect(forClinicians).toBeVisible();

    await Promise.all([page.waitForNavigation(), forClinicians.click()]);

    await expect(page.locator('h1')).toHaveText('For Clinicians');
  });
});
