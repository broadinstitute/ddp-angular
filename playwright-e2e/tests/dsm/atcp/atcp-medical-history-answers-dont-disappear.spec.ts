import { expect } from '@playwright/test';
import ColumnGroup from 'dsm/component/customize-view-column';
import { CustomizeViewID as ID, CustomizeView as CV, Label, DataFilter} from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { test } from 'fixtures/dsm-fixture';

test.describe(`AT: Verify that data does not disappear in Participant List`, () => {
  test(`AT: Verify that Medical history data does not disappear in Participant List @dsm @AT @functional`, async ({ page, request }) => {
    const navigation = new Navigation(page, request);
    const welcomePage = new WelcomePage(page);
    await welcomePage.selectStudy(StudyName.AT);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    const participantListTable = participantListPage.participantListTable;
    const searchPanel = participantListPage.filters.searchPanel;
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    
    await customizeViewPanel.open();
    await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_HISTORY, stableID: ID.MEDICAL_HISTORY });
    await customizeViewPanel.selectColumns(Label.MEDICAL_HISTORY, [`$ddp.participantFirstName()'s Siblings`]);
    await customizeViewPanel.close();

    await searchPanel.open();
    await searchPanel.checkboxes(`$ddp.participantFirstName()'s Siblings`, { additionalFilters: [DataFilter.NOT_EMPTY]})
    await searchPanel.search({ uri: 'filterList' });

    const numberOfReturnedParticipants = await participantListTable.rowsCount;
    expect(numberOfReturnedParticipants).toBeGreaterThanOrEqual(1);
    const shortID = await participantListTable.getParticipantDataAt(0, Label.SHORT_ID);
    await participantListPage.filterListByShortId(shortID);

    //Check that `$ddp.participantFirstName()'s Siblings` column and its data can still be seen
    const siblingColumn = participantListTable.getHeaderByName(`$ddp.participantFirstName()'s Siblings`, { exactMatch: true });
    await expect(siblingColumn).toBeVisible();
    const siblingInfo = await participantListTable.getParticipantDataAt(0, `$ddp.participantFirstName()'s Siblings`);
    expect(siblingInfo).toBeTruthy();

    const participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
    await participantPage.waitForReady();
    await participantPage.backToList();

    await participantListPage.filterListByShortId(shortID);
    await participantListPage.waitForReady();
    await expect(siblingColumn).toBeVisible();
    expect(siblingInfo).toBeTruthy();
  });
});
