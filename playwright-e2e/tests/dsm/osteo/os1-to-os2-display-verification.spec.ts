import { Tab } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';

test.describe.serial(`${StudyName.OSTEO} -> ${StudyName.OSTEO2}: Verify expected display of participant information @dsm`, () => {
  //Use 1 participant throughout the test to check the display of information
  let shortID = '';
  let navigation;

  test(`${StudyName.OSTEO}: Find a participant who is re-consented into ${StudyName.OSTEO2}`, async ({ page, request }) => {
    //Find a re-consented participant by searching for those who have both `OS` and `OS PE-CGS` tags
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantListTable = participantListPage.participantListTable;
    await test.step(`Find a participant who has the 'OS' and 'OS PE-CGS' tags`, async () => {
      //Search for enrolled participants who have both the 'OS' and 'OS PE-CGS' tag
      shortID = await participantListPage.findParticipantWithTab({ tab: Tab.ONC_HISTORY, cohortTags: ['OS', 'OS PE-CGS'] });
    })
  })

  test.skip(`OS2: Verify the OS1 participant can be found in the OS2 Participant List`, async ({ page, request }) => {
    await test.step(`name`, async () => {
      //Check that the chosen participant can also be seen in OS2 Participant List
    })

    await test.step(`name`, async () => {
      //Check that the chosen participant also has the 'OS' and 'OS PE-CGS' cohort tags in OS2 Participant List

      //Check the amount of times the tags are added to the participants (duplicate tags are not allowed)
    })
  })

  test.skip(`OS1: Verify that the participant has the expected display`, async ({ page, request }) => {
    await test.step(`name`, async () => {
      //Check that the participant has the Prequalifier, Consent, and Medical Release activities
    })

    await test.step(`name`, async () => {
      //Check that OS2-specific activities are not present in Participant Page -> Survey Data tab
    })
  })

  test.skip(`OS1: Verify OS1 kits cannot be found in OS2`, async ({ page, request }) => {
    //stuff here
  })

  test.skip(`OS2: Verify a re-consented participant has the expected display`, async ({ page, request }) => {
    //
  })

  test.skip(`OS2: Verify OS2 kits cannot be found in OS1`, async ({ page, request }) => {
    //stuff here
  })
});
