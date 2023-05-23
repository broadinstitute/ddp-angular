import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'pages/dsm/participant-list-page';
import { StudyEnum } from 'lib/component/dsm/navigation/enums/selectStudyNav-enum';

test.describe('Participants Search', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`Search by Short ID in ${study} @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;

      // Save DDP and Short ID found on first row
      const row = 0
      const guid = await participantsTable.getParticipantDataAt(row, 'DDP');
      const shortId = await participantsTable.getParticipantDataAt(row, 'Short ID');

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', { textValue: shortId });
      await searchPanel.search();

      expect(await participantsTable.rowLocator().count(),
        `Participant List page - Displayed participants count is not 1`)
        .toEqual(1);
      expect(guid).toEqual(getStudyDisplayName(study));
    });
  }

  function getStudyDisplayName(study: StudyEnum): string | null {
    let studyName: string | null;
    switch (study) {
      case StudyEnum.LMS:
        studyName = 'cmi-lms';
        break;
      case StudyEnum.OSTEO2:
        studyName = 'cmi-osteo';
        break;
      default:
        studyName = null;
        break;
    }
    return studyName;
  }
});
