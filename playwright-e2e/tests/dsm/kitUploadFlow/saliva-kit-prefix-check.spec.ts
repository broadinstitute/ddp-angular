import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import crypto from 'crypto';
import * as mock from 'data/mock-address.json';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import KitsSentPage from 'dsm/pages/kitsInfo-pages/kitsSentPage';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import ErrorPage from 'dsm/pages/samples/error-page';
import FinalScanPage from 'dsm/pages/scanner-pages/finalScan-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';
import { waitForResponse } from 'utils/test-utils';
import InitialScanPage from 'dsm/pages/scanner-pages/initialScan-page';

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

  const studies = [StudyEnum.OSTEO2];
  const kitType = KitTypeEnum.SALIVA;
  const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];
  const kitLabel = `saliva-${crypto.randomUUID().toString().substring(0, 7)}`; // alphanumerical string length should be 14

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
      const testResultDir = testInfo.outputDir;

      await welcomePage.selectStudy(study);

      await test.step('Find a suitable participant', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        // Find an existing suitable participant
        const testParticipantIndex = await participantListPage.findParticipantForKitUpload();

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
        logInfo(`shortId: ${shortID}`);

        kitUploadInfo = new KitUploadInfo(
          shortID,
          firstName,
          lastName,
          Math.round(Math.random() * 1) === 0 ? mockedCanadaAddress : mockedNewYorkAddress
        );
      });

      await test.step('Deactivate existing blood and saliva kits', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForReady();
        // Note: This could break other Kit tests running concurrently
        for (const kit of expectedKitTypes) {
          await kitsWithoutLabelPage.selectKitType(kit);
          await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);
        }
      });

      await test.step('Upload new saliva kit', async () => {
        const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
        await kitUploadPage.waitForReady();
        await kitUploadPage.assertPageTitle();
        await kitUploadPage.selectKitType(kitType);
        await kitUploadPage.skipAddressValidation(true); // because mocked address is different from participant's address
        await kitUploadPage.assertBrowseBtn();
        await kitUploadPage.assertUploadKitsBtn();
        await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDir);
      });

      await test.step('Create kit label', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForReady();
        await kitsWithoutLabelPage.selectKitType(kitType);
        await kitsWithoutLabelPage.assertCreateLabelsBtn();
        await kitsWithoutLabelPage.assertReloadKitListBtn();
        await kitsWithoutLabelPage.assertTableHeader();
        await kitsWithoutLabelPage.assertPageTitle();

        const kitsTable = kitsWithoutLabelPage.kitsWithoutLabelTable;
        await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortID);
        await expect(kitsTable.rowLocator()).toHaveCount(1);
        shippingID = (await kitsTable.getRowText(0, KitsColumnsEnum.SHIPPING_ID)).trim();

        await kitsTable.selectSingleRowByIndex();
        await Promise.all([
          waitForResponse(page, { uri: '/kitLabel' }),
          kitsWithoutLabelPage.createLabelsButton.click()
        ]);
        await Promise.all([
          expect(page.locator('[data-icon="cog"]')).toBeVisible(),
          expect(page.locator('h3')).toHaveText(/Triggered label creation/i)
        ]);
        logInfo(`shippingID: ${shippingID}`);
      });

      // New kit will be listed on Error page because address is in either Canada or New York
      await test.step('New kit will be listed on Error page', async () => {
        const errorPage = await navigation.selectFromSamples<ErrorPage>(SamplesNavEnum.ERROR);
        const kitListTable = errorPage.kitListTable;
        await errorPage.waitForReady();
        await errorPage.selectKitType(kitType);
        await expect(async () => {
          const noKit = await page.getByText('There are no kit requests').isVisible();
          if (noKit) {
            await errorPage.reloadKitList();
          }
          await expect(kitListTable.tableLocator()).toHaveCount(1, { timeout: 10 * 1000 });
        }).toPass({ timeout: 60 * 1000 });
        await kitListTable.searchByColumn(KitsColumnsEnum.SHIPPING_ID, shippingID);
        await expect(async () => {
          // create label (previous step) could take some time
          await errorPage.reloadKitList();
          await expect(kitListTable.rows).toHaveCount(1, { timeout: 10 * 1000 });
        }).toPass({ timeout: 90 * 1000 });
      });

      await test.step('Initial scan', async () => {
        const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
        await initialScanPage.assertPageTitle();
        await initialScanPage.fillScanPairs([kitLabel, shortID]);
        await initialScanPage.save();
      });

      await test.step('Final scan', async () => {
        const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(SamplesNavEnum.FINAL_SCAN);
        await finalScanPage.waitForReady();
        await finalScanPage.fillScanPairs([kitLabel, shippingID]);
        await finalScanPage.save();
      });

      await test.step('Verification: Kit is no longer listed on Kit without Label page', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForReady();
        await kitsWithoutLabelPage.selectKitType(kitType);
        const kitsTable = kitsWithoutLabelPage.kitsWithoutLabelTable;
        await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortID);
        await expect(kitsTable.rowLocator()).toHaveCount(0);
      });

      await test.step('Verification: Kit sent', async () => {
        const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(SamplesNavEnum.SENT);
        await kitsSentPage.waitForLoad();
        await kitsSentPage.selectKitType(kitType);
        await kitsSentPage.search(KitsColumnsEnum.MF_CODE, kitLabel);
        await kitsSentPage.assertDisplayedRowsCount(1);
      });
    });
  }
})