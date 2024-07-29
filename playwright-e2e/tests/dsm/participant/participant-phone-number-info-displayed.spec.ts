import { StudyName } from 'dsm/navigation';
import { test } from 'fixtures/dsm-fixture';

test.describe(`Confirm that participant phone number information is displayed @dsm @functional`, () => {
  const studies = [StudyName.PANCAN, StudyName.OSTEO2, StudyName.AT];

  for (const study in studies) {
    test(`${study}: Confirm that participant phone number information is displayed`, async ({ page }) => {
      //Check for phone number info from column groups in Participant List

      //Check for phone number info in Participant Page
    })
  }
})
