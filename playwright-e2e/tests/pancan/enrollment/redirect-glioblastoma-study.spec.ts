import { expect } from '@playwright/test';
import { test } from 'fixtures/pancan-fixture';
import Modal from 'dss/component/modal';
import PreScreeningDiagnosisPage from 'dss/pages/pancan/enrollment/pre-screening-diagnosis-page';
import PreScreeningPage from 'dss/pages/pancan/enrollment/pre-screeening-page';
import { PatientsData } from 'dss/pages/patient-type';
import HomePage from 'dss/pages/pancan/home-page';
import { assertHeader } from 'utils/assertion-helper';
import { fillSitePassword } from 'utils/test-utils';

test.describe('Redirect to Brain cancer project', () => {
  test('When selecting Glioblastoma as diagnosed cancer @enrollment @pancan', async ({ page }) => {
    const pancanHomePage = new HomePage(page);
    await pancanHomePage.join({ waitForNav: true });

    // Step 1
    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.waitForReady();
    await preScreeningPage.whoIsSigningUp().check(PatientsData.adult.whoIsSigningUp);
    await preScreeningPage.next();

    // On Diagnosis page
    const preScreeningDiagnosisPage = new PreScreeningDiagnosisPage(page);
    await preScreeningDiagnosisPage.waitForReady();
    await Promise.all([
      expect(page.locator('button', { hasText: 'Saving' })).toBeVisible(),
      preScreeningDiagnosisPage.cancerDiagnosed().fill('Glioblastoma')
    ]);
    await preScreeningDiagnosisPage.submit({ waitForNav: false });

    // See a popup redirects
    const modal = new Modal(page);
    await expect(modal.toLocator().locator('.confirm-dialog-title')).toHaveText('Your participation');
    await expect(modal.toLocator()).toHaveScreenshot('modal-redirect.png');
    await modal.getButton({ label: 'Go to project' }).click();

    // Enter site password
    await fillSitePassword(page);

    await expect(page).toHaveTitle('Brain Tumor Project');
    await assertHeader(page, 'Help transform our understanding of brain tumors');
    await expect(page.locator('.introduction__text')).toHaveScreenshot('brain-cancer-project-introduction-text.png');
    await expect(page.locator('.about__info')).toHaveScreenshot('brain-cancer-project-about-info.png');
  });
});
