import { expect, Locator } from '@playwright/test';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import { CustomizeView, DataFilter, Label, SequencingOrderColumn, Tab } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import SequeuncingOrderTab from 'dsm/pages/tablist/sequencing-order-tab';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { getToday } from 'utils/date-utils';
import { studyShortName } from 'utils/test-utils';

const pecgsStudies = [StudyName.OSTEO2]; //Checking OS2 first
test.describe.serial('Verify that clinical orders can be placed in mercury @dsm @functional', () => {
  let navigation;
  let shortID: string;
  let participantPage: ParticipantPage;
  let sequencingOrderTab: SequeuncingOrderTab;
  let normalSample: Locator;
  let tumorSample: Locator;
  let previousLatestOrderNumberTumor: string;
  let previousLatestOrderNumberNormal: string;

  for (const study of pecgsStudies) {
    test(`${study}: Verify a clinical order can be placed for a participant with Enrolled status`, async ({ page, request }) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(study);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();
      const participantListTable = participantListPage.participantListTable;

      await test.step('Chose an enrolled participant that will get a clinical order placed', async () => {
        shortID = await findParticipantForGermlineSequencing({
          enrollmentStatus: DataFilter.ENROLLED,
          participantList: participantListPage,
          participantTable: participantListTable,
          studyName: study
        });

        await participantListPage.filterListByShortId(shortID);
        participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
        await participantPage.waitForReady();
      });

      await test.step('Make sure that the Sequencing Order tab is visible', async () => {
        await participantPage.tablist(Tab.SEQUENCING_ORDER).isVisible();
        sequencingOrderTab = await participantPage.tablist(Tab.SEQUENCING_ORDER).click<SequeuncingOrderTab>();
        await sequencingOrderTab.waitForReady();
      });

      await test.step('Place a clinical order using the Sequencing Order tab', async () => {
        normalSample = await sequencingOrderTab.getFirstAvailableNormalSample();
        await sequencingOrderTab.selectSampleCheckbox(normalSample);
        //console.log(`normal xpath: ${normalSample}`);
        await sequencingOrderTab.fillCollectionDateIfNeeded(normalSample);
        previousLatestOrderNumberNormal = await sequencingOrderTab.getColumnDataForSample(normalSample, SequencingOrderColumn.LATEST_ORDER_NUMBER);
        console.log(`previous Latest Order Number for normal sample: ${previousLatestOrderNumberNormal}`);

        tumorSample = await sequencingOrderTab.getFirstAvailableTumorSample();
        await sequencingOrderTab.selectSampleCheckbox(tumorSample);
        //console.log(`tumor xpath: ${tumorSample}`);
        previousLatestOrderNumberTumor = await sequencingOrderTab.getColumnDataForSample(tumorSample, SequencingOrderColumn.LATEST_ORDER_NUMBER);
        console.log(`previous Latest Order Number for tumor sample: ${previousLatestOrderNumberTumor}`);

        await sequencingOrderTab.assertPlaceOrderButtonDisplayed();
        await sequencingOrderTab.placeOrder();

        await sequencingOrderTab.assertClinicalOrderModalDisplayed();
        await sequencingOrderTab.submitClinicalOrder();
      });

      /* NOTE: Need to go from Participant Page -> Participant List -> (refresh) -> Participant Page in order to see the new info */
      await test.step('Use the new Latest Order Number to place the order in mercury', async () => {
        await participantPage.backToList();
        await participantListPage.filterListByShortId(shortID);
        await participantListTable.openParticipantPageAt({ position: 0 });

        await participantPage.waitForReady();
        sequencingOrderTab = await participantPage.tablist(Tab.SEQUENCING_ORDER).click<SequeuncingOrderTab>();
        await sequencingOrderTab.waitForReady();

        //Verify that Latest Sequencing Order Date is the current date and Latest Order Number has received new input
        const today = getToday();

        const orderDateNormal = await sequencingOrderTab.getColumnDataForSample(normalSample, SequencingOrderColumn.LATEST_SEQUENCING_ORDER_DATE);
        expect(orderDateNormal).toBe(today);

        const orderDateTumor = await sequencingOrderTab.getColumnDataForSample(tumorSample, SequencingOrderColumn.LATEST_SEQUENCING_ORDER_DATE);
        expect(orderDateTumor).toBe(today);

        const newLatestOrderNumberNormal = await sequencingOrderTab.getColumnDataForSample(normalSample, SequencingOrderColumn.LATEST_ORDER_NUMBER);
        expect(newLatestOrderNumberNormal).not.toBe(previousLatestOrderNumberNormal);

        const newLatestOrderNumberTumor = await sequencingOrderTab.getColumnDataForSample(tumorSample, SequencingOrderColumn.LATEST_ORDER_NUMBER);
        expect(newLatestOrderNumberTumor).not.toBe(previousLatestOrderNumberTumor);
      });
    })

    test(`${study}: Verify a clinical order can be placed for a participant with Lost-to-FollowUp status`, async ({ page, request }) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(study);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const participantListTable = participantListPage.participantListTable;
    })
  }
})

async function findParticipantForGermlineSequencing(opts: {
  enrollmentStatus: DataFilter.ENROLLED | DataFilter.LOST_TO_FOLLOWUP,
  participantList: ParticipantListPage,
  participantTable: ParticipantListTable,
  studyName: StudyName,
  usePediatricParticipant?: boolean,
  residenceInUSTerritory?: boolean
}): Promise<string> {
  const { enrollmentStatus, participantList, participantTable, studyName, usePediatricParticipant = false, residenceInUSTerritory = false } = opts;

  const studyInformation = studyShortName(studyName);
  let participantPrefix = studyInformation.playwrightPrefixAdult;
  if (usePediatricParticipant) {
    participantPrefix = studyInformation.playwrightPrefixChild;
  }
  console.log(`prefix: ${participantPrefix}`);

  const customizeViewPanel = participantList.filters.customizeViewPanel;
  await customizeViewPanel.open();
  await customizeViewPanel.selectColumns(CustomizeView.CLINICAL_ORDERS, [
    Label.CLINICAL_ORDER_DATE,
    Label.CLINICAL_ORDER_ID,
    Label.CLINICAL_ORDER_PDO_NUMBER,
    Label.CLINICAL_ORDER_STATUS,
    Label.CLINICAL_ORDER_STATUS_DATE
  ]);
  await customizeViewPanel.selectColumns(CustomizeView.CONTACT_INFORMATION, [Label.CITY, Label.COUNTRY]);
  await customizeViewPanel.close();

  const searchPanel = participantList.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.text(Label.FIRST_NAME, { textValue: participantPrefix, additionalFilters: [DataFilter.EXACT_MATCH], exactMatch: false });
  await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [enrollmentStatus] });
  await searchPanel.dates(Label.CLINICAL_ORDER_DATE, { additionalFilters: [DataFilter.NOT_EMPTY] });
  await searchPanel.text(Label.CLINICAL_ORDER_ID, { additionalFilters: [DataFilter.NOT_EMPTY] });

  if (residenceInUSTerritory) {
    //Location used: Yigo, Guam
    await searchPanel.text(Label.CITY, { textValue: 'YIGO' });
    await searchPanel.text(Label.COUNTRY, { textValue: 'GU' });
  } else {
    await searchPanel.text(Label.CITY, { textValue: 'CAMBRIDGE' });
    await searchPanel.text(Label.COUNTRY, { textValue: 'US' });
  }

  await searchPanel.search({ uri: 'filterList' });

  const numberOfReturnedParticipants = await participantTable.getRowsCount();
  expect(numberOfReturnedParticipants).toBeGreaterThanOrEqual(1);

  //Randomly chose a participant to get a clinical order who had previously had an order placed
  const randomizedParticipantRows = await participantTable.randomizeRows();
  const rowNumber = randomizedParticipantRows[0];

  const shortID = await participantTable.getParticipantDataAt(rowNumber, Label.SHORT_ID);
  console.log(`Participant chosen for clinical order: ${shortID}`);

  return shortID;
}

