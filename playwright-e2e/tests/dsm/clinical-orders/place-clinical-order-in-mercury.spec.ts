import { expect, Locator } from '@playwright/test';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import { ClinicalOrdersColumn, CustomizeView, DataFilter, Label, SequencingOrderColumn, Tab } from 'dsm/enums';
import { Navigation, Samples, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import SequeuncingOrderTab from 'dsm/pages/tablist/sequencing-order-tab';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { getDateEasternTimeZone, getDateMonthAbbreviated, getToday, getTodayInEastCoastDateTimeFormat, toLocalTime } from 'utils/date-utils';
import { getColumnDataForRow, studyShortName } from 'utils/test-utils';
import { PubSub } from '@google-cloud/pubsub';
import ClinicalOrdersPage from 'dsm/pages/clinical-orders-page';

const pecgsStudies = [StudyName.OSTEO2]; //Checking OS2 first
const MERCURY_PUBSUB_TOPIC_NAME = process.env.MERCURY_PUBSUB_TOPIC_NAME as string;
const MERCURY_PUBSUB_PROJECT_ID = process.env.MERCURY_PUBSUB_PROJECT_ID as string;

test.describe.serial('Verify that clinical orders can be placed in mercury @dsm @functional', () => {
  const approvedOrderStatus = 'Approved';
  const orderStatusDetail = 'Successfully created order via Playwright';
  let navigation: Navigation;
  let shortID: string;
  let participantPage: ParticipantPage;
  let sequencingOrderTab: SequeuncingOrderTab;
  let normalSample: Locator;
  let tumorSample: Locator;
  let sampleNameNormal: string;
  let sampleNameTumor: string;
  let previousLatestOrderNumberTumor: string;
  let latestOrderNumberTumor: string;
  let previousLatestOrderNumberNormal: string;
  let latestOrderNumberNormal: string;
  let orderDateNormal: string;
  let orderDateTumor: string;

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
        sampleNameNormal = await getColumnDataForRow(normalSample, SequencingOrderColumn.SAMPLE, page);
        await sequencingOrderTab.fillCollectionDateIfNeeded(normalSample);
        previousLatestOrderNumberNormal = await getColumnDataForRow(normalSample, SequencingOrderColumn.LATEST_ORDER_NUMBER, page);
        console.log(`previous Latest Order Number for normal sample: ${previousLatestOrderNumberNormal}`);

        tumorSample = await sequencingOrderTab.getFirstAvailableTumorSample();
        await sequencingOrderTab.selectSampleCheckbox(tumorSample);
        sampleNameTumor = await getColumnDataForRow(tumorSample, SequencingOrderColumn.SAMPLE, page);
        previousLatestOrderNumberTumor = await getColumnDataForRow(tumorSample, SequencingOrderColumn.LATEST_ORDER_NUMBER, page);
        console.log(`previous Latest Order Number for tumor sample: ${previousLatestOrderNumberTumor}`);

        await sequencingOrderTab.assertPlaceOrderButtonDisplayed();
        await sequencingOrderTab.placeOrder();

        await sequencingOrderTab.assertClinicalOrderModalDisplayed();
        await sequencingOrderTab.submitClinicalOrder();
      });

      /* NOTE: Need to go from Participant Page -> Participant List -> (refresh) -> Participant Page in order to see the new info */
      await test.step('Verify that the Latest Sequencing Order Date and Latest Order Number have been updated', async () => {
        await participantPage.backToList();
        await participantListPage.filterListByShortId(shortID);
        await participantListTable.openParticipantPageAt({ position: 0 });

        await participantPage.waitForReady();
        sequencingOrderTab = await participantPage.tablist(Tab.SEQUENCING_ORDER).click<SequeuncingOrderTab>();
        await sequencingOrderTab.waitForReady();

        //Verify that Latest Sequencing Order Date is the current date and Latest Order Number has received new input
        const today = getToday();

        orderDateNormal = await getColumnDataForRow(normalSample, SequencingOrderColumn.LATEST_SEQUENCING_ORDER_DATE, page);
        expect(orderDateNormal.trim()).toBe(today);

        orderDateTumor = await getColumnDataForRow(tumorSample, SequencingOrderColumn.LATEST_SEQUENCING_ORDER_DATE, page);
        expect(orderDateTumor.trim()).toBe(today);

        latestOrderNumberNormal = await getColumnDataForRow(normalSample, SequencingOrderColumn.LATEST_ORDER_NUMBER, page);
        expect(latestOrderNumberNormal).not.toBe(previousLatestOrderNumberNormal);

        latestOrderNumberTumor = await getColumnDataForRow(tumorSample, SequencingOrderColumn.LATEST_ORDER_NUMBER, page);
        expect(latestOrderNumberTumor).not.toBe(previousLatestOrderNumberTumor);
      });

      await test.step('Place an order in mercury', async () => {
        const message = createMercuryOrderMessage({
          latestOrderNumber: latestOrderNumberTumor,
          orderStatus: approvedOrderStatus,
          orderDetails: orderStatusDetail
        });
        await placeMercuryOrder(MERCURY_PUBSUB_TOPIC_NAME, message);
      });

      await test.step('Verify that the mercury order was successfully placed', async () => {
        //Check that Latest Order Status, Latest PDO Number are not empty for both Normal and Tumor samples - tab needs info refreshed in order to see changes
        await participantPage.backToList();
        await participantListPage.filterListByShortId(shortID);
        participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
        await participantPage.waitForReady();

        await participantPage.tablist(Tab.SEQUENCING_ORDER).isVisible();
        await participantPage.tablist(Tab.SEQUENCING_ORDER).click<SequeuncingOrderTab>();
        await sequencingOrderTab.waitForReady();

        /* Checking the Normal sample's info */
        const latestOrderStatusNormal = await getColumnDataForRow(normalSample, SequencingOrderColumn.LATEST_ORDER_STATUS, page);
        expect(latestOrderStatusNormal).toBe(approvedOrderStatus);
        const latestPDONumberNormal = await getColumnDataForRow(normalSample, SequencingOrderColumn.LATEST_PDO_NUMBER, page);
        expect(latestPDONumberNormal).toContain(`Made-by-Playwright-on`);

        /* Checking the Tumor sample's info */
        const latestOrderStatusTumor = await getColumnDataForRow(tumorSample, SequencingOrderColumn.LATEST_ORDER_STATUS, page);
        expect(latestOrderStatusTumor).toBe(approvedOrderStatus);
        const latestPDONumberTumor = await getColumnDataForRow(tumorSample, SequencingOrderColumn.LATEST_PDO_NUMBER, page);
        expect(latestPDONumberTumor).toContain(`Made-by-Playwright-on`);
      });

      await test.step('Verify that the mercury order can be seen in Samples -> Clinical Orders', async () => {
        //Check that info of the newest clinical order can be seen in Clinical Orders page
        const clinicalOrderPage = await navigation.selectFromSamples<ClinicalOrdersPage>(Samples.CLINICAL_ORDERS);
        await clinicalOrderPage.waitForReady();

        const clinicalOrderNormal = clinicalOrderPage.getClinicalOrderRow({ sampleType: 'Normal', orderNumber: latestOrderNumberNormal });
        const clinicalOrderTumor = clinicalOrderPage.getClinicalOrderRow({ sampleType: 'Tumor', orderNumber: latestOrderNumberTumor });

        // Check that each sample's info is present: Short ID, Sample Type, Sample, Order Number, Order Date, Status, Status Detail
        /* Normal Sample */
        const normalShortID = await getColumnDataForRow(clinicalOrderNormal, ClinicalOrdersColumn.SHORT_ID, page);
        expect(normalShortID).toBe(shortID);

        const normalSampleType = await getColumnDataForRow(clinicalOrderNormal, ClinicalOrdersColumn.SAMPLE_TYPE, page);
        expect(normalSampleType).toBe('Normal');

        const normalSampleName = await getColumnDataForRow(clinicalOrderNormal, ClinicalOrdersColumn.SAMPLE, page);
        expect(normalSampleName).toBe(sampleNameNormal);

        const normalOrderNumber = await getColumnDataForRow(clinicalOrderNormal, ClinicalOrdersColumn.ORDER_NUMBER, page);
        expect(normalOrderNumber).toBe(latestOrderNumberNormal);

        const normalOrderDate = await getColumnDataForRow(clinicalOrderNormal, ClinicalOrdersColumn.ORDER_DATE, page);
        expect(normalOrderDate).toBe(orderDateNormal);

        const normalOrderStatus = await getColumnDataForRow(clinicalOrderNormal, ClinicalOrdersColumn.STATUS, page);
        expect(normalOrderStatus).toBe(approvedOrderStatus);

        const normalStatusDetail = await getColumnDataForRow(clinicalOrderNormal, ClinicalOrdersColumn.STATUS_DETAIL, page);
        expect(normalStatusDetail).toBe(orderStatusDetail);

        /* Tumor Sample */
        const tumorShortID = await getColumnDataForRow(clinicalOrderTumor, ClinicalOrdersColumn.SHORT_ID, page);
        expect(tumorShortID).toBe(shortID);

        const tumorSampleType = await getColumnDataForRow(clinicalOrderTumor, ClinicalOrdersColumn.SAMPLE_TYPE, page);
        expect(tumorSampleType).toBe('Tumor');

        const tumorSampleName = await getColumnDataForRow(clinicalOrderTumor, ClinicalOrdersColumn.SAMPLE, page);
        expect(tumorSampleName).toBe(sampleNameTumor);

        const tumorOrderNumber = await getColumnDataForRow(clinicalOrderTumor, ClinicalOrdersColumn.ORDER_NUMBER, page);
        expect(tumorOrderNumber).toBe(latestOrderNumberTumor);

        const tumorOrderDate = await getColumnDataForRow(clinicalOrderTumor, ClinicalOrdersColumn.ORDER_DATE, page);
        expect(tumorOrderDate).toBe(orderDateTumor);

        const tumorOrderStatus = await getColumnDataForRow(clinicalOrderTumor, ClinicalOrdersColumn.STATUS, page);
        expect(tumorOrderStatus).toBe(approvedOrderStatus);

        const tumorStatusDetail = await getColumnDataForRow(clinicalOrderTumor, ClinicalOrdersColumn.STATUS_DETAIL, page);
        expect(tumorStatusDetail).toBe(orderStatusDetail);
      });
    })

    test(`${study}: Verify a clinical order can be placed for a participant with Lost-to-FollowUp status`, async ({ page, request }) => {
      //stuff here
    })

    test(`${study}: Verify a clinical order can be placed for a participant located in U.S. territory`, async ({ page, request }) => {
      //stuff here
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

function createMercuryOrderMessage(opts: {
  latestOrderNumber: string,
  orderStatus?: string,
  orderDetails?: string
}): string {
  const { latestOrderNumber, orderStatus = 'Approved', orderDetails = 'Successfully created order' } = opts;
  const readableDate = getTodayInEastCoastDateTimeFormat();

  const message = `
  {
  "status": {
    "orderID":"${latestOrderNumber}",
    "orderStatus": "${orderStatus}",
    "details": "${orderDetails}",
    "pdoKey": "Made-by-Playwright-on ${readableDate}",
    "json": "PDO-123"
    }
  }`;

  const messageObject = JSON.parse(message);
  console.log(`Resulting pubsub message is:\n ${JSON.stringify(messageObject)}`);
  return JSON.stringify(messageObject);
}

async function placeMercuryOrder(topicNameOrID: string, messsage: string): Promise<void> {
  const pubsubClient = new PubSub({projectId: MERCURY_PUBSUB_PROJECT_ID});
  const dataBuffer = Buffer.from(messsage);
  console.log(`Topic name or id: ${topicNameOrID}`);

  try {
    const messageID = await pubsubClient
    .topic(topicNameOrID)
    .publishMessage({ data: dataBuffer });
    console.log(`Message ${messageID} was published`);
  } catch (error) {
    console.log(`Received error while publishing: ${(error as Error).message}`);
    process.exitCode = 1;
  }
}
