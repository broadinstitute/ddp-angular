import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import crypto from 'crypto';
import * as mock from 'data/mock-address.json';
import { Navigation, Samples, Study, StudyName } from 'dsm/navigation';
import KitsUploadPage from 'dsm/pages/kits-upload-page';
import { KitUploadInfo } from 'dsm/pages/models/kit-upload-model';
import KitsSentPage from 'dsm/pages/kits-sent-page';
import KitsWithoutLabelPage from 'dsm/pages/kits-without-label-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import KitsWithErrorPage from 'dsm/pages/kits-with-error-page';
import FinalScanPage from 'dsm/pages/scan/final-scan-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';
import InitialScanPage from 'dsm/pages/scan/initial-scan-page';
import TrackingScanPage from 'dsm/pages/scan/tracking-scan-page';
import { KitType, Label } from 'dsm/enums';

/**
 * Prefix check for Saliva kit with Canada and New York address for Osteo2
 *
 * For Saliva kit:
 *  - Upload a kit with address for Canada or NY state
 *  - Create kit label
 *  - Kit will be on Error page
 *  - Initial scan (with a 14 char kit label)
 *  - Final scan
 */

// don't run in parallel
test.describe.serial('Saliva Kit Upload with a Canadian or New York address', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;
  let participantPage: ParticipantPage;
  let shippingID: string;
  let kitUploadInfo: KitUploadInfo;
  let shortID: string;

  const studies = [StudyName.OSTEO2];
  const kitType = KitType.SALIVA;
  const expectedKitTypes = [KitType.SALIVA, KitType.BLOOD];
  const kitLabel = crypto.randomUUID().toString().substring(0, 14).replace(/-/, 'z'); // alphanumerical string length should be 14
  const trackingLabel = `trackingLabel-${crypto.randomUUID().toString().substring(0, 10).replace(/-/, 'w')}`;

  const mockedCanadaAddress = {
    street1: mock.canada.street,
    street2: mock.canada.street2,
    city: mock.canada.city,
    postalCode: mock.canada.zip,
    state: mock.canada.state.abbreviation,
    country: mock.canada.country.abbreviation,
  }

  const mockedNewYorkAddress = {
    street1: mock.newyork.street,
    street2: mock.newyork.street2,
    city: mock.newyork.city,
    postalCode: mock.newyork.zip,
    state: mock.newyork.state.abbreviation,
    country: mock.newyork.country.abbreviation,
  }

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
        const testParticipantIndex = await participantListPage.findParticipantForKitUpload({
          allowNewYorkerOrCanadian: true,
          hasContactInfomationColumn: true
        });

        // Collects all the necessary data for kit upload
        const participantListTable = participantListPage.participantListTable;
        participantPage = await participantListTable.openParticipantPageAt({ position: testParticipantIndex });
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
        // Note: This could break other Kit tests running concurrently
        for (const kit of expectedKitTypes) {
          await kitsWithoutLabelPage.selectKitType(kit);
          await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);
        }

        const kitErrorPage = await navigation.selectFromSamples<KitsWithErrorPage>(Samples.ERROR);
        await kitErrorPage.waitForReady();
        await kitErrorPage.selectKitType(kitType);
        await kitErrorPage.deactivateAllKitsFor(shortID);
      });

      await test.step('Upload new saliva kit', async () => {
        const kitUploadPage = await navigation.selectFromSamples<KitsUploadPage>(Samples.KIT_UPLOAD);
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
        await kitsTable.searchByColumn(Label.SHORT_ID, shortID);
        await expect(kitsTable.rowLocator()).toHaveCount(1);
        shippingID = (await kitsTable.getRowText(0, Label.SHIPPING_ID)).trim();
        expect(shippingID?.length).toBeTruthy();
        logInfo(`shippingID: ${shippingID}`);

        await kitsTable.selectSingleRowByIndex();
        await kitsWithoutLabelPage.clickCreateLabels();
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
          await expect(kitListTable.tableLocator()).toHaveCount(1, { timeout: 10 * 1000 });
        }).toPass({ timeout: 60 * 1000 });
        await kitListTable.searchByColumn(Label.SHIPPING_ID, shippingID);
        await expect(async () => {
          // create label (previous step) could take some time
          await errorPage.reloadKitList();
          await expect(kitListTable.rows).toHaveCount(1, { timeout: 10 * 1000 });
        }).toPass({ timeout: 3 * 60 * 1000 });
      });

      await test.step('Initial scan', async () => {
        const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(Samples.INITIAL_SCAN);
        await initialScanPage.assertPageTitle();
        await initialScanPage.fillScanPairs([kitLabel, shortID]);
        await initialScanPage.save();
      });

      await test.step('Tracking Scan', async () => {
        const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(Samples.TRACKING_SCAN);
        await trackingScanPage.waitForReady();
        await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
        // Saved without error
        await trackingScanPage.save();
      });

      await test.step('Final scan', async () => {
        const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(Samples.FINAL_SCAN);
        await finalScanPage.waitForReady();
        await finalScanPage.fillScanPairs([kitLabel, shippingID]);
        await finalScanPage.save();
      });

      await test.step('Verification: Kit is no longer listed on Kit without Label page', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForReady();
        await kitsWithoutLabelPage.selectKitType(kitType);
        const kitsTable = kitsWithoutLabelPage.getKitsTable;
        await kitsTable.searchByColumn(Label.SHORT_ID, shortID);
        await expect(kitsTable.rowLocator()).toHaveCount(0);
      });

      await test.step('Verification: Kit sent', async () => {
        const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(Samples.SENT);
        await kitsSentPage.waitForReady();
        await kitsSentPage.selectKitType(kitType);
        await kitsSentPage.search(Label.MF_CODE, kitLabel, { count: 1 });
      });
    });

    test(`Should throw error if same kit label and tracking label is used again @functional @dsm @${study}`, async ({page}) => {
      expect(shortID).toBeTruthy();
      expect(trackingLabel).toBeTruthy();

      await welcomePage.selectStudy(study);

      const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(Samples.TRACKING_SCAN);
      await trackingScanPage.waitForReady();
      await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
      await trackingScanPage.save({verifySuccess: false});

      // Click "Save Scan Pairs" button triggers scan error
      await expect(page.locator('//h3[contains(@class, "Color--warn")]')).toHaveText('Error - Failed to save all changes');
      await expect(page.locator('//p[contains(@class, "Color--warn")]')).toHaveText(/Error occurred sending this scan pair!/);
      const msg1 = `Kit ${kitLabel} was already associated with tracking id ${trackingLabel} by ${process.env.DSM_USER1_EMAIL}`;
      await expect(page.locator('//p[contains(@class, "Color--warn")]')).toHaveText(new RegExp(msg1, 'i'));
    });
  }
})
