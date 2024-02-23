import { test, expect } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import Dropdown from 'dsm/component/dropdown';
import { Column, Tab, UserPermission } from 'dsm/enums';
import { Menu, Miscellaneous, Navigation, Study, StudyName } from 'dsm/component/navigation';
import Tabs from 'dsm/component/tabs/tabs';
import UserPermissionPage from 'dsm/pages/user-and-permissions-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { logInfo } from 'utils/log-utils';

const {
  OSTEO_USER_EMAIL,
  PANCAN_USER_EMAIL,
  DSM_USER1_EMAIL,
  DSM_USER1_PASSWORD,
  DSM_USER5_EMAIL,
  DSM_USER5_PASSWORD,
} = process.env;

test.describe.serial('Medical Records View Permission', () => {
  const studies = [StudyName.OSTEO2, StudyName.PANCAN];
  const emails = [OSTEO_USER_EMAIL as string, PANCAN_USER_EMAIL as string];

  for (const [i, study] of studies.entries()) {
    test(`@${study}: Login as Hunter to verify test user has the right permissions selected`, async ({ page, request }) => {
      await login(page, { email: DSM_USER1_EMAIL, password: DSM_USER1_PASSWORD });
      await new Select(page, { label: 'Select study' }).selectOption(study);
      await new Navigation(page, request).selectFromMiscellaneous(Miscellaneous.USERS_AND_PERMISSIONS);

      const testUser = DSM_USER5_EMAIL as string;

      const userPermissionsPage = new UserPermissionPage(page);
      await userPermissionsPage.expandPanel(testUser);
      const studyAdmin = userPermissionsPage.getStudyAdmin(testUser);
      await userPermissionsPage.assertSelectedPermissions(studyAdmin,
      [
        UserPermission.MEDICAL_RECORDS_VIEW_AND_REQUEST_RECORDS_AND_TISSUE,
        UserPermission.PARTICIPANT_VIEW_LIST,
      ]);
    });
  }

  for (const [i, study] of studies.entries()) {
    test(`@${study}: Login as test user to verify UI displays as expected`, async ({ page, request }) => {
      await login(page, { email: DSM_USER5_EMAIL, password: DSM_USER5_PASSWORD });
      await new Select(page, { label: 'Select study' }).selectOption(study);

      const navigation = new Navigation(page, request);

      await test.step('Verify user see only Selected Study and Study menus', async () => {
        // Visible Navigation menus user allowed to see
        const expectedNavigationMenus = [Menu.SELECTED_STUDY, Menu.STUDY];
        const visibleNavigationMenus = await navigation.getDisplayedMainMenu();
        expect(visibleNavigationMenus).toMatchObject(expectedNavigationMenus);

        // Visible Study menu options user allowed to see
        const expectedStudyMenuOptions = [
          Study.DASHBOARD,
          Study.PARTICIPANT_LIST,
          Study.TISSUE_LIST,
        ];
        const studyMenu = new Dropdown(page, Menu.STUDY);
        const visibleMenuOptions = await studyMenu.getDisplayedOptions<Study>();
        expect(visibleMenuOptions).toMatchObject(expectedStudyMenuOptions);
      });

      await test.step('Verify user see only avialable medical records tabs in Participant page', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        // Find participant created by Playwright DSS test
        const rowIndex = await participantListPage.findParticipantFor(Column.PARTICIPANT, 'Email', {value: emails[i].split('@')[0] });
        const participantListTable = participantListPage.participantListTable;
        const shortId = await participantListTable.getParticipantDataAt(rowIndex, Column.SHORT_ID);
        logInfo(`${study} Participant Short ID: ${shortId}`);

        // Open Participant page, user is able to see all tabs
        await participantListTable.openParticipantPageAt(rowIndex);
        const expectedTabs = [
          Tab.SURVEY_DATA,
          Tab.SAMPLE_INFORMATION,
          Tab.CONTACT_INFORMATION,
          Tab.MEDICAL_RECORD,
          Tab.ONC_HISTORY,
        ];
        const visibleTabs = page.locator('tabset a[role="tab"]');
        const tabNames = await visibleTabs.allInnerTexts();
        expect(tabNames).toStrictEqual(study === StudyName.OSTEO2 ? expectedTabs.concat([Tab.INVITAE]) : expectedTabs);
        // All tabs are enabled
        for (const tabName of tabNames) {
          const tab = new Tabs(page);
          await tab.open(tabName as Tab);
        }
      })
    });
  }
});
