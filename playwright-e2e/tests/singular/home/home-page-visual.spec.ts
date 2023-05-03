import { ElementHandle, expect, Locator } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';
import _ from 'lodash';

/**
 * Visual screenshots tests for the Home page
 */
test.describe.skip('Home page', () => {
  test('match navigation-links @visual @singular', async ({ page, homePage }) => {
    const nav = page.locator('.header__nav');
    expect(await nav.screenshot({ omitBackground: true })).toMatchSnapshot('nav.png');

    const navLinks = page.locator('.header__nav li');
    await expect(navLinks).toContainText(['About Us', 'Study Progress', 'FAQs', 'For Researchers', 'For Clinicians']);
  });

  test('match partners links @home @visual @singular', async ({ page, homePage }) => {
    const orderedHrefs = [
      'https://www.additionalventures.org',
      'https://www.broadinstitute.org',
      'https://www.childrenshospital.org',
      'https://www.genomemedical.com'
    ];

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

  test('match participating steps @home @visual @singular', async ({ page, homePage }) => {
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
