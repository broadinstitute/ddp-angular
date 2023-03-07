import { expect } from '@playwright/test';
import { login } from 'authentication/auth-singular';
import { test } from 'fixtures/singular-fixture';
import Modal from 'lib/component/modal';
import { assertActivityHeader } from 'utils/assertion-helper';
import { NavSelectors } from 'pages/singular/navbar';

test('new enrollment can continue after log out @visual @singular', async ({ page, dashboardPage }) => {
  await dashboardPage.logOut();

  await login(page, { email: process.env.SINGULAR_USER_EMAIL_ALIAS, password: process.env.SINGULAR_USER_PASSWORD });
  await dashboardPage.waitForReady();

  const enrollMyselfButton = await page.locator('//*[contains(@class,"controls")]/button[./*[contains(@class,"next-container")]]').nth(0).screenshot();
  expect(enrollMyselfButton).toMatchSnapshot('enroll-myself-button.png');

  const enrollMyChildButton = await page.locator('//*[contains(@class,"controls")]/button[./*[contains(@class,"next-container")]]').nth(1).screenshot();
  expect(enrollMyChildButton).toMatchSnapshot('enroll-my-child-button.png');

  const enrollMyAdultDependentButton = await page.locator('//*[contains(@class,"controls")]/button[./*[contains(@class,"next-container")]]').nth(2).screenshot();
  expect(enrollMyAdultDependentButton).toMatchSnapshot('enroll-my-adult-dependent-button.png');

  // Click Enroll Myself button
  await dashboardPage.enrollMyself();
  await assertActivityHeader(page, 'Enroll myself');

  // Go back to Dashboard
  await page.locator(NavSelectors.MyDashboard).click();
  await dashboardPage.waitForReady();

  // Click button "View Family Enrollment Message"
  await page.locator('button.enrollment-message-btn').click();

  const modal = new Modal(page);
  await expect(modal.toLocator()).toBeVisible();
  expect(await modal.toLocator().screenshot()).toMatchSnapshot('family-enrollment-message-modal.png');
});
