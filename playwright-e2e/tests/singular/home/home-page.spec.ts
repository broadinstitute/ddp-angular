import { expect } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';
import { NavSelectors } from 'dss/pages/singular/navbar';

/**
 * Functional tests
 */
test.describe.skip('Home page', () => {
  test('go to "Contact Us" @singular', async ({ page, homePage }) => {
    const aboutUs = page.locator(NavSelectors.AboutUs);
    await expect(aboutUs).toHaveAttribute('href', '/about');
    await expect(aboutUs).toBeVisible();
    await Promise.all([page.waitForNavigation(), aboutUs.click()]);

    // Verify page is About Us
    // Expects the About Us header.
    const header = page.locator('h1 >> text="About Us"');

    await expect(header).toBeVisible();

    const childImgDescription = page.locator('.img-description:below(img[src="assets/images/Judson_2x.png"])');

    await expect(childImgDescription).toBeVisible();

    const childImg = page.locator('img[src="assets/images/Judson_2x.png"]');

    await expect(childImg).toBeVisible();
  });

  test('go to "Study Progress" @singular', async ({ page, context, homePage }) => {
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

  test('go to "FAQs" @singular', async ({ page, homePage }) => {
    const faq = page.locator(NavSelectors.FAQs);

    await expect(faq).toHaveAttribute('href', '/faq');
    await expect(faq).toBeVisible();

    await Promise.all([page.waitForNavigation(), faq.click()]);

    await expect(page.locator('h1')).toHaveText('Frequently Asked Questions');
  });

  test('go to "For Researchers" @singular', async ({ page, homePage }) => {
    const forResearchers = page.locator(NavSelectors.ForResearchers);

    await expect(forResearchers).toHaveAttribute('href', '/for-researchers');
    await expect(forResearchers).toBeVisible();

    await Promise.all([page.waitForNavigation(), forResearchers.click()]);

    await expect(page.locator('h1').first()).toHaveText('Uncovering Single Ventricle Etiology');
  });

  test('go to "For Clinicians" @singular', async ({ page, homePage }) => {
    const forClinicians = page.locator(NavSelectors.ForClinicians);

    await expect(forClinicians).toHaveAttribute('href', '/for-clinicians');
    await expect(forClinicians).toBeVisible();

    await Promise.all([page.waitForNavigation(), forClinicians.click()]);

    await expect(page.locator('h1')).toHaveText('For Clinicians');
  });
});
