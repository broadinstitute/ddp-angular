import { expect } from '@playwright/test';
import { Filter } from 'dsm/enums';
import { Miscellaneous, Navigation, Samples, Study, StudyName } from 'dsm/component/navigation';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import SequencingOrderTab from 'dsm/component/tabs/sequencing-order-tab';
import { UserPermission } from 'dsm/pages/miscellaneous-pages/enums/userPermission-enum';
import UserPermissionPage from 'dsm/pages/miscellaneous-pages/user-and-permissions-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import ClinicalOrdersPage from 'dsm/pages/samples/clinical-orders-page';
import Select from 'dss/component/select';
import { testLimitedPermissions as test } from 'fixtures/dsm-fixture';

test.describe('View Sequencing Order Permission Test', () => {
  const studies = [StudyName.OSTEO2, StudyName.LMS]; //Current clinical studies
  const testEmail = process.env.DSM_USER2_EMAIL as string;

  for (const study of studies) {
    test(`@${study}: Verify the view_seq_order permissions work as expected`, async ({ page, request }) => {
      const navigation = new Navigation(page, request);

      await test.step('Verify that the current DSM user has the permissions: pt_list_view and view_seq_order_status selected', async () => {
        //Select the study (either LMS or OS PE-CGS)
        await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

        //Verify that the User and Permissions Page can be seen; Miscellaneous -> Users and Permissions
        await navigation.selectFromMiscellaneous(Miscellaneous.USERS_AND_PERMISSIONS);
        const userPermissionsPage = new UserPermissionPage(page);

        //Verify expected webelements can be seen
        await userPermissionsPage.assertPageTitle();
        await userPermissionsPage.assertAddUserButtonDisplayed();

        //Verify the expected study admin can be seen
        await userPermissionsPage.assertStudyAdminInfo(testEmail, 'Mason Whiteclaw', '7666789876');
        const studyAdmin = userPermissionsPage.getStudyAdmin(testEmail);
        await studyAdmin.scrollIntoViewIfNeeded();
        await studyAdmin.click();
        userPermissionsPage.setStudyPermissions(study);
        await userPermissionsPage.assertAllPossibleStudyPermissionsAreVisible(study, testEmail);
        //Mailing List Permission is used so that the study admin can see the Misc. -> Users and Permissions page
        await userPermissionsPage.assertSelectedPermissions(studyAdmin,
        [
          UserPermission.MAILING_LIST_VIEW_AND_DOWNLOAD,
          UserPermission.PARTICIPANT_VIEW_LIST,
          UserPermission.SEQUENCING_ORDER_VIEW_STATUS
        ]);
      });

      await test.step('Verify that the current DSM user is able to view the Clinical Order page (via the Samples menu)', async () => {
        const clinicalOrdersPage = await navigation.selectFromSamples<ClinicalOrdersPage>(Samples.CLINICAL_ORDERS);
        await clinicalOrdersPage.waitForReady();
      });

      await test.step('Verify that the current DSM user is able to view the Clinical Order Columns in Participant List', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.isColumnVisible(['Clinical Orders Columns']);

        //Filter the list to display study participants with a Not-Empty Clinical Orders Columns -> Clinical Order ID column
        await customizeViewPanel.selectColumns('Clinical Orders Columns', ['Clinical Order Id']);

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.text('Clinical Order Id', { additionalFilters: [Filter.NOT_EMPTY]});
        await searchPanel.search();

        const participantListTable = participantListPage.participantListTable;

        //Check that at least 1 study participant already has a clinical order id
        const numberOfParticipants = await participantListTable.numOfParticipants();
        expect(numberOfParticipants).toBeGreaterThan(0);
        await participantListTable.openParticipantPageAt(0);

        const participantPage = new ParticipantPage(page);
        await participantPage.assertPageTitle();
        await participantPage.clickTab(TabEnum.SEQUENCING_ORDER);

        const sequencingOrderTab = new SequencingOrderTab(page);
        await sequencingOrderTab.waitForReady();
        //Verify that the current DSM user is not able to submit sequencing orders for the chosen study participant
        await sequencingOrderTab.assertSamplesInvisible();
        await sequencingOrderTab.assertPlaceOrderButtonInvisible();
        await sequencingOrderTab.fillAvailableCollectionDateFields({canPlaceClinicalOrder: false});
      });
    });
  }
})
