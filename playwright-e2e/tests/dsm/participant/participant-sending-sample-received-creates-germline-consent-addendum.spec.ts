import { APIRequestContext, Page, TestInfo, expect } from '@playwright/test';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import * as user from 'data/fake-user.json';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';

test.describe.serial('Sending SAMPLE_RECEIVED event to DSS', () => {
  const studies = [StudyEnum.OSTEO2, StudyEnum.LMS]; //Only clinical (pecgs) studies get this event
  let navigation;
  let shortID = '';
  let mfCode = '';

  for (const study of studies) {
    test(`${study} - Scenario 1: SALIVA kit received first, TUMOR sample received second`, async ({ page, request }, testInfo) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.assertPageTitle();
      await participantListPage.waitForReady();

      shortID = await findParticipantForGermlineConsentCreation(participantListPage);
      console.log(`Chosen short id: ${shortID}`);
      mfCode = await prepareSentKit(shortID, KitTypeEnum.SALIVA, study, page, request, testInfo);
    });

    test(`${study} - Scenario 2: BLOOD kit received first, TUMOR sample received second`, async ({ page, request }) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.assertPageTitle();
      await participantListPage.waitForReady();

      shortID = await findParticipantForGermlineConsentCreation(participantListPage);
    });

    test(`${study} - Scenario 3: TUMOR sample received first, SALIVA kit received second`, async ({ page, request }) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.assertPageTitle();
      await participantListPage.waitForReady();

      shortID = await findParticipantForGermlineConsentCreation(participantListPage);
    });

    test(`${study} - Scenario 4: TUMOR sample received first, BLOOD kit received second`, async ({ page, request }) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.assertPageTitle();
      await participantListPage.waitForReady();

      shortID = await findParticipantForGermlineConsentCreation(participantListPage);
    });
  }
});

/**
 * TODO Use an adult study participant after PEPPER-1210 is fixed
 * Find an E2E playwright participant who meets the following criteria:
 * Answered 'Yes' in consent
 * Answered 'Yes' in consent addendum
 * Submitted medical release with at least one physician or institution
 * Does not already have a germline consent addendum
 * Does not already have a normal kit (i.e. a blood or saliva kit) sent out (for ease of testing)
 */
async function findParticipantForGermlineConsentCreation(participantListPage: ParticipantListPage): Promise<string> {
  const searchPanel = participantListPage.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
  await searchPanel.search();

  const customizeViewPanel = participantListPage.filters.customizeViewPanel;
  await customizeViewPanel.open();
  await customizeViewPanel.selectColumns('Research Consent & Assent Form Columns', ['CONSENT_ASSENT_BLOOD', 'CONSENT_ASSENT_TISSUE']);
  await customizeViewPanel.selectColumnsByID('Medical Release Form Columns', ['PHYSICIAN'], 'RELEASE_MINOR', { nth: 1 });
  await customizeViewPanel.selectColumns('Sample Columns', ['Sample Type', 'Status']);
  await customizeViewPanel.selectColumns(
    `Additional Consent & Assent: Learning About Your Child’s Tumor Columns`,
    ['SOMATIC_CONSENT_TUMOR_PEDIATRIC', 'SOMATIC_ASSENT_ADDENDUM']
  );
  await customizeViewPanel.selectColumns(
    `Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`,
    ['GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created']
  );

  await searchPanel.open();
  await searchPanel.checkboxes('CONSENT_ASSENT_BLOOD', { checkboxValues: ['Yes'] });
  await searchPanel.checkboxes('CONSENT_ASSENT_TISSUE', { checkboxValues: ['Yes'] });
  await searchPanel.search();

  const participantListTable = participantListPage.participantListTable;
  const resultsPerPage = await participantListTable.rowsCount;
  let shortID = '';
  for (let index = 0; index < resultsPerPage; index++) {
    const consentAssentTissue = (await participantListTable.getParticipantDataAt(index, 'CONSENT_ASSENT_TISSUE')).trim();
    const consentAssentBlood = (await participantListTable.getParticipantDataAt(index, 'CONSENT_ASSENT_BLOOD')).trim();
    const somaticAssentAddendum = (await participantListTable.getParticipantDataAt(index, 'SOMATIC_ASSENT_ADDENDUM')).trim();
    const somaticConsentTumorPediatric = (await participantListTable.getParticipantDataAt(index, 'SOMATIC_CONSENT_TUMOR_PEDIATRIC')).trim();
    const physician = (await participantListTable.getParticipantDataAt(index, 'PHYSICIAN')).trim();
    const germlineInfo = (await participantListTable.getParticipantDataAt(index, 'GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created')).trim();

    if ((consentAssentTissue === 'Yes') &&
        (consentAssentBlood === 'Yes') &&
        (somaticAssentAddendum === 'Yes') &&
        (somaticConsentTumorPediatric === 'Yes') &&
        (physician != null) &&
        (germlineInfo === '')
      ) {
        shortID = await participantListTable.getParticipantDataAt(index, 'Short ID');
        break;
    }

    if (index === (resultsPerPage - 1)) {
      index = 0;
      await participantListTable.nextPage();
    }

    //TODO add logic for if there are no more pages to use to search for participants
  }

  return shortID;
}

async function prepareSentKit(shortID: string,
  kitType: KitTypeEnum,
  study: StudyEnum,
  page: Page,
  request: APIRequestContext,
  testInfo: TestInfo): Promise<string> {
  const navigation = new Navigation(page, request);
  const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD]; //Studies used for the current test only have Saliva and Blood kits
  const testResultDirectory = testInfo.outputDir;
  let mfCode = '';

  //Deactivate existing kits
  const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
  await kitsWithoutLabelPage.waitForReady();
  await kitsWithoutLabelPage.assertPageTitle();
  await kitsWithoutLabelPage.selectKitType(kitType);
  if (await kitsWithoutLabelPage.hasExistingKitRequests()) {
    await kitsWithoutLabelPage.assertCreateLabelsBtn();
    await kitsWithoutLabelPage.assertReloadKitListBtn();
    await kitsWithoutLabelPage.assertTableHeader();
    await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);
  }

  //Upload saliva kit
  const kitUploadInfo = new KitUploadInfo(shortID, user.patient.firstName, user.patient.lastName);
  kitUploadInfo.address.street1 = user.patient.streetAddress;
  kitUploadInfo.address.city = user.patient.city;
  kitUploadInfo.address.postalCode = user.patient.zip;
  kitUploadInfo.address.state = user.patient.state.abbreviation;
  kitUploadInfo.address.country = user.patient.country.abbreviation;

  const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
  await kitUploadPage.waitForReady(expectedKitTypes);
  await kitUploadPage.assertPageTitle();
  await kitUploadPage.selectKitType(kitType);
  await kitUploadPage.assertBrowseBtn();
  await kitUploadPage.assertUploadKitsBtn();
  await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDirectory);

  //Check for kit in Kits w.o Label and get the shipping ID
  await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
  await kitsWithoutLabelPage.waitForReady();
  await kitsWithoutLabelPage.selectKitType(kitType);
  await kitsWithoutLabelPage.assertCreateLabelsBtn();
  await kitsWithoutLabelPage.assertReloadKitListBtn();
  await kitsWithoutLabelPage.assertPageTitle();

  await kitsWithoutLabelPage.search(KitsColumnsEnum.SHORT_ID, shortID);
  const shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();

  const kitsTable = kitsWithoutLabelPage.kitsWithoutLabelTable;
  await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortID);
  await expect(kitsTable.rowLocator()).toHaveCount(1);

  //Scan saliva kit in Initial Scan

  //If uploading a blood kit - make sure to also scan the kit in Tracking Scan page

  //Scan saliva kit in Final Scan - which marks the kit as sent

  //Return the mf code so that the kit can later be marked as received
  return mfCode;
}
