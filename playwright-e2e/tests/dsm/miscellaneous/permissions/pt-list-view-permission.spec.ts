import { test, expect } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import Dropdown from 'dsm/component/dropdown';
import { MainMenuEnum } from 'dsm/component/navigation/enums/mainMenu-enum';
import { MiscellaneousEnum } from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { Label, Tab, UserPermission } from 'dsm/enums';
import Tabs from 'dsm/pages/tabs';
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
  const studies = [StudyEnum.RGP];

  for (const [i, study] of studies.entries()) {
    test(`@${study}: Login as Hunter to verify test user has the right permissions selected`, async ({ page, request }) => {
      await login(page, { email: DSM_USER1_EMAIL, password: DSM_USER1_PASSWORD });
      await new Select(page, { label: 'Select study' }).selectOption(study);
      await new Navigation(page, request).selectMiscellaneous(MiscellaneousEnum.USERS_AND_PERMISSIONS);

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
        const expectedNavigationMenus = [MainMenuEnum.SELECTED_STUDY, MainMenuEnum.STUDY];
        const visibleNavigationMenus = await navigation.getDisplayedMainMenu();
        expect(visibleNavigationMenus).toMatchObject(expectedNavigationMenus);

        // Visible studies user allowed to see
        const expectedStudies = [
          StudyEnum.RGP,
        ];
        const selectedStudyMenu = new Dropdown(page, MainMenuEnum.SELECTED_STUDY);
        const visibleStudies = await selectedStudyMenu.getDisplayedOptions<StudyEnum>();
        expect(visibleStudies).toEqual(expect.arrayContaining(expectedStudies));

        // Visible Study menu options user allowed to see
        const expectedStudyMenuOptions = [
          StudyNavEnum.DASHBOARD,
          StudyNavEnum.PARTICIPANT_LIST,
        ];
        const studyMenu = new Dropdown(page, MainMenuEnum.STUDY);
        const visibleMenuOptions = await studyMenu.getDisplayedOptions<StudyNavEnum>();
        expect(visibleMenuOptions).toMatchObject(expectedStudyMenuOptions);
      });

      await test.step('Verify user see only "Survey Data" and dynamic tabs in Participant page', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        // Find any participant
        const participantListTable = participantListPage.participantListTable;
        const rowIndex = (await participantListTable.randomizeRows())[0];
        const subjectId = await participantListTable.getParticipantDataAt(rowIndex, Label.SUBJECT_ID);
        logInfo(`${study} Participant Subject ID: ${subjectId}`);

        // Open Participant page to verify visible tabs
        await participantListTable.openParticipantPageAt(rowIndex);

        const visibleTabs = page.locator('tabset a[role="tab"]');
        const tabNames: string[] = await visibleTabs.allInnerTexts();

        const expectedTabs = [Tab.SURVEY_DATA];
        expect(tabNames).toStrictEqual(expect.arrayContaining(expectedTabs));
        for (let i = 1; i < tabNames.length; i++) { // array index starts at 1
          expect(tabNames[i]).toContain('RGP_');
        }

        // All tabs are enabled
        for (const tabName of tabNames) {
          const tab = new Tabs(page, tabName);
          await tab.click();
        }
      })
    });
  }
})
