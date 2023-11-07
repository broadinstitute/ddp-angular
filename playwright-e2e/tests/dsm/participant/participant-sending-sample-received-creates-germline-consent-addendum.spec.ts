import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { logInfo } from 'utils/log-utils';

test.describe.serial('Sending SAMPLE_RECEIVED event to DSS', () => {
  const studies = [StudyEnum.OSTEO2, StudyEnum.LMS]; //Only clinical (pecgs) studies get this event
  let navigation;
  let participantListPage;
  let customizeViewPanel;

  for (const study of studies) {
    /**
     * TODO Use an adult study participant after PEPPER-1210 is fixed
     * Find an E2E playwright participant who meets the following criteria:
     * Answered 'Yes' in consent
     * Answered 'Yes' in consent addendum
     * Submitted medical release with at least one physician or institution
     * Does not already have a germline consent addendum
     * Does not already have a normal kit (i.e. a blood or saliva kit) sent out (for ease of testing)
     */
    test.beforeEach(async ({ page, request }) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.assertPageTitle();
      await participantListPage.waitForReady();

      customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Research Consent & Assent Form Columns', ['CONSENT_ASSENT_BLOOD', 'CONSENT_ASSENT_TISSUE']);
      await customizeViewPanel.selectColumns('Medical Release Form Columns', ['PHYSICIAN']);
      await customizeViewPanel.selectColumns('Sample Columns', ['Sample Type', 'Status']);
      await customizeViewPanel.selectColumns(
        `Additional Consent & Assent: Learning About Your Child’s Tumor Columns`,
        ['SOMATIC_CONSENT_TUMOR_PEDIATRIC', 'SOMATIC_ASSENT_ADDENDUM']
      );
      await customizeViewPanel.selectColumns(
        `Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`,
        ['GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created']
      );

      const searchPanel = participantListPage.filters.searchPanel;
    });

    test(`${study} - Scenario 1: SALIVA kit received first, TUMOR sample received second`, ({ page, request }) => {
      //stuff here
      logInfo('stuff');
    });

    test(`${study} - Scenario 2: BLOOD kit received first, TUMOR sample received second`, ({ page, request }) => {
      //stuff here
      logInfo('stuff');
    });

    test(`${study} - Scenario 3: TUMOR sample received first, SALIVA kit received second`, ({ page, request }) => {
      //Stuff here
      logInfo('stuff');
    });

    test(`${study} - Scenario 4: TUMOR sample received first, BLOOD kit received second`, ({ page, request }) => {
      //Stuff here
      logInfo('stuff');
    });
  }
});
