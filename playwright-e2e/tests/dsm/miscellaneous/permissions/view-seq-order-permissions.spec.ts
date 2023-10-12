import { expect } from '@playwright/test';
import { MiscellaneousEnum } from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { UserPermission } from 'dsm/pages/miscellaneous-pages/enums/userPermission-enum';
import UserPermissionPage from 'dsm/pages/miscellaneous-pages/user-and-permissions-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { testLimitedPermissions as test } from 'fixtures/dsm-fixture';

test.describe('View Sequencing Order Permission Test', () => {
    const studies = [StudyEnum.OSTEO2, StudyEnum.LMS]; //Current clinical studies
    const testEmail = process.env.DSM_USER1_EMAIL as string;

    for (const study of studies) {
        test(`@${study}: Verify the view_seq_order permissions work as expected`, async ({ page, request }) => {
            const navigation = new Navigation(page, request);

            await test.step('Verify that the current DSM user has the permissions: pt_list_view and view_seq_order_status selected', async () => {
                //Select the study (either LMS or OS PE-CGS)
                await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

                //Verify that the User and Permissions Page can be seen; Miscellaneous -> Users and Permissions
                await navigation.selectFromMiscellaneous(MiscellaneousEnum.USERS_AND_PERMISSIONS);
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
            })

            await test.step('Verify that the current DSM user is able to view the Clinical Order Columns in Participant List', async () => {
                const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
                await participantListPage.assertPageTitle();
                await participantListPage.waitForReady();

                const customizeViewPanel = participantListPage.filters.customizeViewPanel;
                await customizeViewPanel.open();
            })

            await test.step('Verify that the current DSM user is able to view the Clinical Order page (via the Samples menu)', async () => {
                //Stuff here
            })

            await test.step('Verify that the current DSM user is able to view the Sequencing Order tab in Participant Page', async () => {
                //Stuff here
            })

            await test.step('Verify that the current DSM user is not able to submit sequencing orders for the chosen study participant', async () => {
                //Stuff here
            })

            await test.step('Verify that the current DSM user is able to input collection dates for samples that do not have them', async () => {
                //Stuff here
            })
        })
    }
})
