import { test, expect } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import Dropdown from 'dsm/component/dropdown';
import { Menu, Miscellaneous, Navigation, Study, StudyName } from 'dsm/navigation';
import { Label, Tab, UserPermission } from 'dsm/enums';
import Tablist from 'dsm/component/tablist';
import UserPermissionPage from 'dsm/pages/user-and-permissions-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { logInfo } from 'utils/log-utils';

const {
  DSM_USER1_EMAIL,
  DSM_USER1_PASSWORD,
  DSM_USER7_EMAIL, // User see only RGP
  DSM_USER7_PASSWORD,
} = process.env;

test.describe.serial('DSS View Only Permission', () => {
  const studies = [StudyName.RGP];

  for (const [i, study] of studies.entries()) {
    test(`@${study}: Login as Hunter to verify test user has the right permissions selected`, async ({ page, request }) => {
      await login(page, { email: DSM_USER1_EMAIL, password: DSM_USER1_PASSWORD });
      await new Select(page, { label: 'Select study' }).selectOption(study);
      await new Navigation(page, request).selectFromMiscellaneous(Miscellaneous.USERS_AND_PERMISSIONS);

      const testUser = DSM_USER7_EMAIL as string;

      const userPermissionsPage = new UserPermissionPage(page);
      await userPermissionsPage.expandPanel(testUser);
      const studyAdmin = userPermissionsPage.getStudyAdmin(testUser);
      await userPermissionsPage.assertSelectedPermissions(studyAdmin,
      [
        UserPermission.PARTICIPANT_VIEW_LIST,
      ]);
    });
  }

  for (const [i, study] of studies.entries()) {
    test(`@${study}: Login as test user to verify UI displays as expected`, async ({ page, request }) => {
      await login(page, { email: DSM_USER7_EMAIL, password: DSM_USER7_PASSWORD });
      await new Select(page, { label: 'Select study' }).selectOption(study);

      const navigation = new Navigation(page, request);

      await test.step('Verify user see only "Selected Study" and "Study" menus', async () => {
        // Visible Navigation menus user allowed to see
        const expectedNavigationMenus = [Menu.SELECTED_STUDY, Menu.STUDY];
        const visibleNavigationMenus = await navigation.getDisplayedMainMenu();
        expect(visibleNavigationMenus).toMatchObject(expectedNavigationMenus);

        // Visible studies user allowed to see
        const expectedStudies = [
          StudyName.RGP,
        ];
        const selectedStudyMenu = new Dropdown(page, Menu.SELECTED_STUDY);
        const visibleStudies = await selectedStudyMenu.getDisplayedOptions<Study>();
        expect(visibleStudies).toEqual(expect.arrayContaining(expectedStudies));

        // Visible Study menu options user allowed to see
        const expectedStudyMenuOptions = [
          Study.DASHBOARD,
          Study.PARTICIPANT_LIST,
        ];
        const studyMenu = new Dropdown(page, Menu.STUDY);
        const visibleMenuOptions = await studyMenu.getDisplayedOptions<Study>();
        expect(visibleMenuOptions).toMatchObject(expectedStudyMenuOptions);
      });

      await test.step('Verify user see only "Survey Data" and dynamic tabs in Participant page', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        // Find any participant
        const participantListTable = participantListPage.participantListTable;
        const rowIndex = (await participantListTable.randomizeRows())[0];
        const subjectId = await participantListTable.getParticipantDataAt(rowIndex, Label.SUBJECT_ID);
        logInfo(`${study} Participant Subject ID: ${subjectId}`);

        // Open Participant page to verify visible tabs
        await participantListTable.openParticipantPageAt({ position: rowIndex, isCMIStudy: false });

        const visibleTabs = page.locator('tabset a[role="tab"]');
        const tabNames: string[] = await visibleTabs.allInnerTexts();

        const expectedTabs = [Tab.SURVEY_DATA];
        expect(tabNames).toStrictEqual(expect.arrayContaining(expectedTabs));
        for (let i = 1; i < tabNames.length; i++) { // array index starts at 1
          expect(tabNames[i]).toContain('RGP_');
        }

        // All tabs are enabled
        for (const tabName of tabNames) {
          const tab = new Tablist(page, tabName);
          await tab.click();
        }
      })
    });
  }
})
