import { expect, test } from '@playwright/test';

import MyDashboardPage from 'tests/singular/dashboard/my-dashboard-page';
import HomePage from 'tests/singular/home/home-page';
import { clickLogin, goToAboutUs, NavSelectors, visitHomePage } from 'tests/singular/lib/nav';
import { fillSitePassword, login } from 'tests/lib/auth-singular';

import _ from 'lodash';

/**
 * Nightly tests run once per day by CircleCI schedule.
 * For example, to run this test: userEmail=bweng+101@broadinstitute.org userPasswd=NotAnyMora1 yarn test:e2e login-visual.spec.ts
 */
test.describe.skip('Login into Singular', () => {
  test.beforeEach(async ({ page }) => {
    await visitHomePage(page);
    const home = new HomePage(page);
    await home.waitForReady();
  });

  test('should works @visual @singular', async ({ page }) => {
    await login(page, { email: process.env.singularUserEmail, password: process.env.singularUserPassword });

    // On non-prod env, user must enter Site password to continue
    await fillSitePassword(page);
    // My Dashboard page does not load automatically, click "Log In" button again to see My Dashboard
    await clickLogin(page);

    // My Dashboard is visible
    const myDashboardPage = new MyDashboardPage(page);
    await myDashboardPage.waitForReady();

    // Login button is NOT visible
    await expect(page.locator(NavSelectors.Login)).not.toBeVisible();

    await expect(page.locator('h1.title')).toContainText('My Dashboard');
    expect(await page.locator('h1.title').screenshot()).toMatchSnapshot('dashboard-title.png');

    await expect(myDashboardPage.status()).toContainText('Fully Enrolled');
    expect(await myDashboardPage.status().screenshot()).toMatchSnapshot('status-text.png');

    // Table headers
    const orderedTableHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const tHeaders = page.locator('table thead [role="columnheader"]');
    expect(await tHeaders.count()).toEqual(4);

    const headers = await tHeaders.elementHandles();
    const actualHeaders = _.filter(
      await Promise.all(
        _.map(headers, async (header) => {
          const text = await header.textContent();
          return text?.trim();
        })
      )
    );
    expect(actualHeaders).toEqual(orderedTableHeaders);

    const row = page.locator('table.dashboard-table tbody [role="row"]');

    // Consent row
    const consentRow = row.filter({ has: page.locator('[data-label="Title"]', { hasText: 'Consent' }) });
    expect(await consentRow.screenshot()).toMatchSnapshot('consent-row.png');

    // About Me row
    const aboutMeRow = row.filter({ has: page.locator('[data-label="Title"]', { hasText: 'About Me' }) });
    expect(await aboutMeRow.screenshot()).toMatchSnapshot('about-me-row.png');

    // Medical Record Release Form
    const medicalRecordReleaseFormRow = row.filter({
      has: page.locator('[data-label="Title"]', { hasText: 'Medical Record Release Form' })
    });
    expect(await medicalRecordReleaseFormRow.screenshot()).toMatchSnapshot('medical-record-release-form-row.png');

    // Medical Record File Upload
    const medicalRecordFileUploadRow = row.filter({
      has: page.locator('[data-label="Title"]', { hasText: 'Medical Record File Upload' })
    });
    expect(await medicalRecordFileUploadRow.screenshot()).toMatchSnapshot('medical-record-file-upload-row.png');

    // Patient Survey
    const patientSurveyRow = row.filter({ has: page.locator('[data-label="Title"]', { hasText: 'Patient Survey' }) });
    expect(await patientSurveyRow.screenshot()).toMatchSnapshot('patient-survey-row.png');
  });

  test('should fail with invalid credential @visual @singular', async ({ page }) => {
    await goToAboutUs(page);
    await fillSitePassword(page);
    await login(page, { email: process.env.singularUserEmail, password: 'WrongPazzw0rd' });
    const loginErrMessage = page.locator('form .auth0-global-message-error span:not([class])');
    await expect(loginErrMessage).toHaveText('Wrong email or password.');
    expect(await page.locator('form .auth0-lock-widget-container').screenshot()).toMatchSnapshot('wrong-password.png');
  });
});