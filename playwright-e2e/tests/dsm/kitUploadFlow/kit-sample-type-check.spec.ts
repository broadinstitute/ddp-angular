import { expect } from '@playwright/test';
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
import InitialScanPage from 'dsm/pages/scanner-pages/initialScan-page';
import TrackingScanPage from 'dsm/pages/scanner-pages/trackingScan-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { test } from 'fixtures/dsm-fixture';
import { logInfo } from 'utils/log-utils';
import { waitForResponse } from 'utils/test-utils';

// don't run in parallel
test.describe('Kit Upload', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;
  let participantPage: ParticipantPage;
  let shippingID: string;
  let kitUploadInfo: KitUploadInfo;
  let shortID: string;

  const studies = [StudyEnum.LMS];
  const kitType = KitTypeEnum.BLOOD;
  const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];
  const kitLabel = `${crypto.randomUUID().toString().substring(0, 10)}`;

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

  for (const [index, study] of studies.entries()) {
    test.beforeEach(async ({ page, request }) => {
      welcomePage = new WelcomePage(page);
      navigation = new Navigation(page, request);
      await welcomePage.selectStudy(study);
    });

    test(`CMI Research kit type check @functional @pecgs @cmi-lms @dsm @${study} @kit`, async ({ page }, testInfo) => {
      const testResultDir = testInfo.outputDir;

      await test.step('Find a suitable participant', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        // Find an existing suitable participant
        const testParticipantIndex = await participantListPage.findParticipantForKitUpload();
        expect(testParticipantIndex).not.toBeUndefined();

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
          index % 2 === 0 ? mockedCanadaAddress : mockedNewYorkAddress
        );
      });

      await test.step('Deactivate existing blood and saliva kits', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForLoad();
        for (const kit of expectedKitTypes) {
          await kitsWithoutLabelPage.selectKitType(kit);
          await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);
        }
      });

      // Uploads new kit
      await test.step('Upload new blood kit', async () => {
        const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
        await kitUploadPage.waitForLoad();
        await kitUploadPage.assertPageTitle();
        await kitUploadPage.assertDisplayedKitTypes(expectedKitTypes);
        await kitUploadPage.selectKitType(kitType);
        await kitUploadPage.skipAddressValidation(true); // because mocked address is different from participant's address
        await kitUploadPage.assertBrowseBtn();
        await kitUploadPage.assertUploadKitsBtn();
        await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDir);
      });

      await test.step('Create kit label', async () => {
        const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForLoad();
        await kitsWithoutLabelPage.selectKitType(kitType);
        await kitsWithoutLabelPage.assertCreateLabelsBtn();
        await kitsWithoutLabelPage.assertReloadKitListBtn();
        await kitsWithoutLabelPage.assertTableHeader();
        await kitsWithoutLabelPage.assertPageTitle();

        const kitsTable = kitsWithoutLabelPage.kitsWithoutLabelTable;
        await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortID);
        await expect(kitsTable.rowLocator()).toHaveCount(1);
        shippingID = (await kitsTable.getRowText(0, KitsColumnsEnum.SHIPPING_ID)).trim();

        await kitsTable.selectRowByRowIndex();
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

      await page.pause();

      // New kit will be listed on Error page because address is in either Canada or New York
      await test.step('New kit will be listed on Error page', async () => {
        const errorPage = await navigation.selectFromSamples<ErrorPage>(SamplesNavEnum.ERROR);
        const kitListTable = errorPage.kitListTable;
        await errorPage.waitForReady();
        await errorPage.selectKitType(kitType);
        await expect(async () => {
          const noKit = await page.getByText('There are no kit requests').isVisible();
          if (noKit) {
            await errorPage.reloadKitListButton.click();
          }
          await expect(kitListTable.tableLocator()).toHaveCount(1, { timeout: 10 * 1000 });
        }).toPass({ timeout: 60 * 1000 });
        await kitListTable.searchByColumn(KitsColumnsEnum.SHIPPING_ID, shippingID);
        await expect(async () => {
          // create label could take little time
          await errorPage.reloadKitListButton.click();
          await expect(kitListTable.rows).toHaveCount(1, { timeout: 10 * 1000 });
        }).toPass({ timeout: 90 * 1000 });
      });

      await page.pause();

      await test.step('Initial scan', async () => {
        const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
        await initialScanPage.waitForReady();
        await initialScanPage.fillScanPairs([kitLabel, shortID]);
        await initialScanPage.save();
        logInfo(`kitLabel: ${kitLabel}`);
      });

      await page.pause();

      // For blood kit, requires tracking label
      await test.step('Create tracking label', async () => {
        const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(SamplesNavEnum.TRACKING_SCAN);
        await trackingScanPage.assertPageTitle();
        const trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;
        await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
        await trackingScanPage.save();
      });

      await page.pause();

      await test.step('Final scan', async () => {
        const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(SamplesNavEnum.FINAL_SCAN);
        await finalScanPage.waitForReady();
        await finalScanPage.fillScanPairs([kitLabel, shippingID]);
        await finalScanPage.save();
      });

      await page.pause();

      await test.step('Kit will no longer listed on Error page', async () => {
        const errorPage = await navigation.selectFromSamples<ErrorPage>(SamplesNavEnum.ERROR);
        await errorPage.waitForReady();
        await errorPage.selectKitType(kitType);
        await expect(page.getByText('There are no kit requests')).toBeVisible();
      });

      await page.pause();

      await test.step('Sent kit', async () => {
        const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(SamplesNavEnum.SENT);
        await kitsSentPage.waitForLoad();
        await kitsSentPage.selectKitType(kitType);
        await kitsSentPage.search(KitsColumnsEnum.MF_CODE, kitLabel);
        await kitsSentPage.assertDisplayedRowsCount(1);
      });

      await page.pause();
    });
  }
})
