import { test, expect } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import Dropdown from 'dsm/component/dropdown';
import { CustomizeView, Label, Tab, UserPermission } from 'dsm/enums';
import { MainMenuEnum } from 'dsm/component/navigation/enums/mainMenu-enum';
import { MiscellaneousEnum } from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import Tabs from 'dsm/pages/tabs';
import UserPermissionPage from 'dsm/pages/user-and-permissions-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { logInfo } from 'utils/log-utils';

const {
  OSTEO_USER_EMAIL,
  LMS_USER_EMAIL,
  DSM_USER1_EMAIL,
  DSM_USER1_PASSWORD,
  DSM_USER6_EMAIL,
  DSM_USER6_PASSWORD,
} = process.env;

test.describe.serial('DSS View Only Permission', () => {
  const studies = [StudyEnum.OSTEO2, StudyEnum.LMS];
  const emails = [OSTEO_USER_EMAIL as string, LMS_USER_EMAIL as string];

  for (const [i, study] of studies.entries()) {
    test(`@${study}: Login as Hunter to verify test user has the right permissions selected`, async ({ page, request }) => {
      await login(page, { email: DSM_USER1_EMAIL, password: DSM_USER1_PASSWORD });
      await new Select(page, { label: 'Select study' }).selectOption(study);
      await new Navigation(page, request).selectMiscellaneous(MiscellaneousEnum.USERS_AND_PERMISSIONS);

      const testUser = DSM_USER6_EMAIL as string;

      const userPermissionsPage = new UserPermissionPage(page);
      await userPermissionsPage.expandPanel(testUser);
      const studyAdmin = userPermissionsPage.getStudyAdmin(testUser);
      await userPermissionsPage.assertSelectedPermissions(studyAdmin,
      [
        UserPermission.VIEW_SURVEY_DATA_ONLY,
        UserPermission.PARTICIPANT_VIEW_LIST,
      ]);
    });
  }

  for (const [i, study] of studies.entries()) {
    test(`@${study}: Login as test user to verify UI displays as expected`, async ({ page, request }) => {
      await login(page, { email: DSM_USER6_EMAIL, password: DSM_USER6_PASSWORD });
      await new Select(page, { label: 'Select study' }).selectOption(study);

      const navigation = new Navigation(page, request);

      await test.step('Verify user see only "Selected Study" and "Study" menus', async () => {
        // Visible Navigation menus user allowed to see
        const expectedNavigationMenus = [MainMenuEnum.SELECTED_STUDY, MainMenuEnum.STUDY];
        const visibleNavigationMenus = await navigation.getDisplayedMainMenu();
        expect(visibleNavigationMenus).toMatchObject(expectedNavigationMenus);

        // Visible studies user allowed to see
        const expectedStudies = [
          StudyEnum.ANGIO,
          StudyEnum.BRAIN,
          StudyEnum.OSTEO,
          StudyEnum.MBC,
          StudyEnum.PROSTATE,
          StudyEnum.ESC,
          StudyEnum.PANCAN,
          StudyEnum.LMS,
          StudyEnum.OSTEO2,
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

      await test.step('Verify user see only medical records tabs in Participant page', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        // User cannot see customize columns which are not related to the visible tabs
        const expectedTabs = [Tab.SURVEY_DATA, Tab.SAMPLE_INFORMATION, Tab.CONTACT_INFORMATION];

        const notVisibleColumns = [
          CustomizeView.MEDICAL_RECORD,
          CustomizeView.ONC_HISTORY,
          CustomizeView.TISSUE,
        ];

        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        expect(await customizeViewPanel.isColumnVisible(notVisibleColumns)).toBe(false);

        // Find a participant created by Playwright DSS test
        const rowIndex = await participantListPage.findParticipantFor(CustomizeView.PARTICIPANT, Label.EMAIL, {value: emails[i].split('@')[0] });
        const participantListTable = participantListPage.participantListTable;
        const shortId = await participantListTable.getParticipantDataAt(rowIndex, Label.SHORT_ID);
        logInfo(`${study} Participant Short ID: ${shortId}`);

        // Open Participant page to verify visible tabs
        let tabNames: string[];
        await expect(async () => {
          await participantListPage.reload();
          await participantListPage.filterListByShortId(shortId);
          await participantListTable.openParticipantPageAt(0);
          const visibleTabs = page.locator('tabset a[role="tab"]');
          tabNames = await visibleTabs.allInnerTexts();
          expect(tabNames).toStrictEqual(expectedTabs);
        }).toPass({ timeout: 60 * 1000 });

        // All tabs are enabled
        for (const tabName of tabNames!) {
          const tab = new Tabs(page, tabName);
          await tab.click();
        }
      })
    });
  }
})
