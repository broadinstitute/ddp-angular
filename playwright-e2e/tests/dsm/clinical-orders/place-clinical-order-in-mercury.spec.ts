import { expect } from '@playwright/test';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import { CustomizeView, DataFilter, Label } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';

const pecgsStudies = [StudyName.OSTEO2]; //Checking OS2 first
test.describe.serial('Verify that clinical orders can be placed in mercury @dsm @functional', () => {
  let navigation;
  let customizeViewPanel;
  let searchPanel;
  let shortID;
  let participantPage;
  let sequencingOrderID;

  for (const study of pecgsStudies) {
    test(`${study}: Verify a clinical order can be placed for a participant with Enrolled status`, async ({ page, request }) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(study);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const participantListTable = participantListPage.participantListTable;

      await test.step(`Put Clinical Order ID and Clinical Order Date columns onto the Participant List`, async () => {
        customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomizeView.CLINICAL_ORDERS, [Label.CLINICAL_ORDER_DATE, Label.CLINICAL_ORDER_ID]);
        await customizeViewPanel.close();
      })

      await test.step(`Look for a participant that is enrolled that already has had an order placed at some point`, async () => {
        searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
        await searchPanel.dates(Label.CLINICAL_ORDER_DATE, { additionalFilters: [DataFilter.NOT_EMPTY] });
        await searchPanel.text(Label.CLINICAL_ORDER_ID, { additionalFilters: [DataFilter.NOT_EMPTY] });
        await searchPanel.search({ uri: 'filterList' });

        const numberOfReturnedParticipants = await participantListTable.getRowsCount();
        expect(numberOfReturnedParticipants).toBeGreaterThanOrEqual(1);

        shortID = await participantListTable.getCellDataForColumn(Label.SHORT_ID, 1);
        console.log(`shortID: ${shortID}`);
        expect(shortID).toBeTruthy();

        await participantListPage.filterListByShortId(shortID);
        participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
        await participantPage.waitForReady();
      })

      await test.step(`Place the order in mercury via Participant Page -> Sequencing Order tab`, async () => {
        //Stuff here
      })
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
  participantListPage: ParticipantListPage,
  participantListTable: ParticipantListTable
  residenceInUSTerritory?: boolean
}): Promise<string> {
  const { enrollmentStatus, participantListPage, participantListTable, residenceInUSTerritory = false } = opts;

  const customizeViewPanel = participantListPage.filters.customizeViewPanel;
  await customizeViewPanel.open();
  await customizeViewPanel.selectColumns(CustomizeView.CONTACT_INFORMATION, [Label.CITY, Label.COUNTRY]);
  await customizeViewPanel.close();

  const searchPanel = participantListPage.filters.searchPanel;
  await searchPanel.open();
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

  const numberOfReturnedParticipants = await participantListTable.getRowsCount();
  expect(numberOfReturnedParticipants).toBeGreaterThanOrEqual(1);
}

