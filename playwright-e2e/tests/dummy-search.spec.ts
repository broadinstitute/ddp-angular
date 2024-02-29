import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { Label, Tab } from 'dsm/enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { logInfo } from 'utils/log-utils';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import OncHistoryTab from 'dsm/pages/tab-pages/onc-history-tab';


test.describe('Tumor', () => {
  // Some studies are excluded due to lack of the suitable paricipants
  const studies: StudyEnum[] = [StudyEnum.OSTEO2, StudyEnum.PANCAN];

  for (const study of studies) {
    test(`dummy tab test @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;

      // Open Participant page
      const [row] = await participantListTable.randomizeRows();
      const shortID = await participantListTable.getParticipantDataAt(row, Label.SHORT_ID);
      expect(shortID?.length).toStrictEqual(6);
      logInfo(`Participant Short ID: ${shortID}`);

      // Open Tab
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(row);

      expect(await participantPage.tab(Tab.ONC_HISTORY).isVisible()).toBeTruthy();

      const oncHistoryTab = await participantPage.tab(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      const rows = await oncHistoryTable.rowLocator().count(); // append new row
      console.log(`onc history rows: ${rows}`);
      await page.waitForTimeout(5000);

      expect(await participantPage.tab(Tab.INVITAE).isVisible()).toBeTruthy();
    });
  }
});
