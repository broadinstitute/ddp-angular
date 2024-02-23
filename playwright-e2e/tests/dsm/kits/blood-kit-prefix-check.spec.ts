import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import crypto from 'crypto';
import * as mock from 'data/mock-address.json';
import { Kit } from 'dsm/enums';
import { Navigation, Samples, Study, StudyName } from 'dsm/component/navigation';
import KitUploadPage from 'dsm/pages/kit-upload-page';
import { KitUploadInfo } from 'dsm/pages/kit-upload/models/kitUpload-model';
import { KitsColumnsEnum } from 'dsm/pages/kits-info/enums/kitsColumns-enum';
import KitsSentPage from 'dsm/pages/kits-sent-page';
import KitsWithoutLabelPage from 'dsm/pages/kits-without-label-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import KitsWithErrorPage from 'dsm/pages/kits-with-error-page';
import KitsFinalScanPage from 'dsm/pages/kits-final-scan-page';
import KitsTrackingScanPage from 'dsm/pages/kits-tracking-scan-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';

/**
 * Prefix check for Blood kit with Canada and New York address for LMS and Osteo2 studies.
 *
 * For Blood kit:
 *  - Upload a kit with address for Canada or NY state
 *  - Create kit label without PECGS prefix
 *  - Kit will be on error page
 *  - Tracking scan
 *  - Final scan
 */

// don't run in parallel
test.describe.serial('Blood Kit Upload', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;
  let participantPage: ParticipantPage;
  let shippingID: string;
  let kitUploadInfo: KitUploadInfo;
  let shortID: string;

  const studies = [StudyName.LMS]; // StudyEnum.OSTEO2;
  const kitType = Kit.BLOOD;
  const expectedKitTypes = [Kit.SALIVA, Kit.BLOOD];
  const kitLabel = crypto.randomUUID().toString().substring(0, 14).replace(/-/, 'a');
  const trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;

  const mockedCanadaAddress = {
    street1: mock.canada.street,
    street2: mock.canada.street2,
    city: mock.canada.city,
    postalCode: mock.canada.zip,
    state: mock.canada.state.abbreviation,
    country: mock.canada.country.abbreviation,
  };

  const mockedNewYorkAddress = {
    street1: mock.newyork.street,
    street2: mock.newyork.street2,
    city: mock.newyork.city,
    postalCode: mock.newyork.zip,
    state: mock.newyork.state.abbreviation,
    country: mock.newyork.country.abbreviation,
  };

  test.beforeEach(({ page, request }) => {
    welcomePage = new WelcomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const [index, study] of studies.entries()) {
    test(`Kit prefix check @cmi @dsm @${study} @kit`, async ({ page }, testInfo) => {
      test.slow();

      const testResultDir = testInfo.outputDir;

      await welcomePage.selectStudy(study);

      await test.step('Find a suitable participant', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        // Find an existing suitable participant
        const testParticipantIndex = await participantListPage.findParticipantForKitUpload({ allowNewYorkerOrCanadian: true });

        // Collects all the necessary data for kit upload
        const participantListTable = participantListPage.participantListTable;
        participantPage = await participantListTable.openParticipantPageAt(testParticipantIndex);
      });

      await test.step('Collect participant information', async () => {
        shortID = await participantPage.getShortId();
        const firstName = await participantPage.getFirstName();
        const lastName = await participantPage.getLastName();
        expect(shortID).toBeTruthy();
        expect(firstName).toBeTruthy();
        expect(lastName).toBeTruthy();
        logInfo(`Participant Short ID: ${shortID}`);

        kitUploadInfo = new KitUploadInfo(
          shortID,
          firstName,
          lastName,
          Math.round(Math.random() * 1) === 0 ? mockedCanadaAddress : mockedNewYorkAddress
        );
      });

      await test.step('Deactivate existing blood and saliva kits', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForReady();
        for (const kit of expectedKitTypes) {
          await kitsWithoutLabelPage.selectKitType(kit);
          await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);
        }
      });

      // Uploads new kit
      await test.step('Upload new blood kit', async () => {
        const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(Samples.KIT_UPLOAD);
        await kitUploadPage.waitForReady();
        await kitUploadPage.selectKitType(kitType);
        await kitUploadPage.skipAddressValidation(true); // because mocked address is different from participant's address
        await kitUploadPage.assertBrowseBtn();
        await kitUploadPage.assertUploadKitsBtn();
        await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDir);
      });

      await test.step('Create kit label', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForReady();
        await kitsWithoutLabelPage.selectKitType(kitType);
        await kitsWithoutLabelPage.assertCreateLabelsBtn();
        await kitsWithoutLabelPage.assertReloadKitListBtn();

        const kitsTable = kitsWithoutLabelPage.getKitsTable;
        await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortID);
        await expect(kitsTable.rowLocator()).toHaveCount(1);
        shippingID = (await kitsTable.getRowText(0, KitsColumnsEnum.SHIPPING_ID)).trim();

        await kitsTable.selectSingleRowByIndex();
        await kitsWithoutLabelPage.clickCreateLabels();
        logInfo(`shippingID: ${shippingID}`);
      });

      // New kit will be listed on Error page because address is in either Canada or New York
      await test.step('New kit will be listed on Error page', async () => {
        const errorPage = await navigation.selectFromSamples<KitsWithErrorPage>(Samples.ERROR);
        const kitListTable = errorPage.getKitsTable;
        await errorPage.waitForReady();
        await errorPage.selectKitType(kitType);
        await expect(async () => {
          const noKit = await page.getByText('There are no kit requests').isVisible();
          if (noKit) {
            await errorPage.reloadKitList();
          }
          await expect(kitListTable.tableLocator()).toBeVisible({ timeout: 5000 });
        }).toPass({ timeout: 3 * 60 * 1000 });
        await kitListTable.searchByColumn(KitsColumnsEnum.SHIPPING_ID, shippingID);
        await expect(async () => {
          // create label could take some time
          await errorPage.reloadKitList();
          await expect(kitListTable.rows).toHaveCount(1, { timeout: 10 * 1000 });
        }).toPass({ timeout: 3 * 60 * 1000 });
      });

      // For blood kit, requires tracking label
      await test.step('Create tracking label', async () => {
        const trackingScanPage = await navigation.selectFromSamples<KitsTrackingScanPage>(Samples.TRACKING_SCAN);
        await trackingScanPage.waitForReady();
        await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
        await trackingScanPage.save();
      });

      await test.step('Final scan', async () => {
        const finalScanPage = await navigation.selectFromSamples<KitsFinalScanPage>(Samples.FINAL_SCAN);
        await finalScanPage.waitForReady();
        await finalScanPage.fillScanPairs([kitLabel, shippingID]);
        await finalScanPage.save();
      });

      await test.step('Verification: Kit is no longer listed on Kit without Label page', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForReady();
        await kitsWithoutLabelPage.selectKitType(kitType);
        const kitsTable = kitsWithoutLabelPage.getKitsTable;
        await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortID);
        await expect(kitsTable.rowLocator()).toHaveCount(0);
      });

      await test.step('Verification: Kit sent', async () => {
        const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(Samples.SENT);
        await kitsSentPage.waitForReady();
        await kitsSentPage.selectKitType(kitType);
        await kitsSentPage.search(KitsColumnsEnum.MF_CODE, kitLabel, { count: 1 });
      });
    });
  }

  test('Trigger Tracking Scan error @osteo2 @dsm @kit', async ({ page }) => {
    await welcomePage.selectStudy(StudyName.OSTEO2);

    const trackingScanPage = await navigation.selectFromSamples<KitsTrackingScanPage>(Samples.TRACKING_SCAN);
    await trackingScanPage.waitForReady();

    await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
    await trackingScanPage.save({ verifySuccess: false });

    // Enter the same pair again to trigger the scan error
    const errMsg = `Error occurred sending this scan pair!  Kit ${kitLabel} was already associated with tracking id ${trackingLabel}`;
    await expect(page.locator('//h3[contains(@class, "Color--warn")]')).toHaveText('Error - Failed to save all changes');
    await expect(page.locator('//p[contains(@class, "Color--warn")]')).toHaveText(new RegExp(errMsg));
  });
});
