import { expect, Page } from '@playwright/test';
import Modal from 'dsm/component/modal';
import { test } from 'fixtures/dsm-fixture';
import FollowUpSurveyPage from 'dsm/pages/follow-up-survey-page';
import { getDate } from 'utils/date-utils';
import { generateAlphaNumeric, generateRandomNum } from 'utils/faker-utils';
import { waitForResponse } from 'utils/test-utils';
import { CustomizeView as CV, CustomizeViewID as ID, DataFilter, Label } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import Select from 'dss/component/select';
import ParticipantListPage from 'dsm/pages/participant-list-page';

test.describe('Create Follow-Up Survey', () => {
  const studies = [StudyName.PANCAN];
  let followupSurveyPage: FollowUpSurveyPage;

  for (const study of studies) {
    const survey = surveysForStudy(study);
    test(`${survey} in @${study} @dsm @functional`, async ({ page, request }) => {
      const navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);
      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Find a partiicpant without a Blood Consent who can be used to trigger both Blood Consent and Diet/Lifestyle Survey
      const shortID = findParticipantWithoutBloodConsent(page, participantListPage);
      /*followupSurveyPage = await FollowUpSurveyPage.goto(page, study, request);
      await followupSurveyPage.waitForReady();

      await followupSurveyPage.selectSurvey(survey);
      const previousSurveysTable = followupSurveyPage.previousSurveysTable;
      const rowsCount = await previousSurveysTable.rowLocator().count();
      expect(rowsCount).toBeGreaterThanOrEqual(1);

      // Find any participant ID to create new survey (repeating)
      //const randRowIndex = generateRandomNum(0, rowsCount);
      //const participantId = await previousSurveysTable.getRowText(randRowIndex, Label.PARTICIPANT_ID);
      //expect(participantId).not.toBeNull();

      // Create new survey by fill out participant ID and reason
      const reason = `playwright testing ${generateAlphaNumeric()}`;
      await followupSurveyPage.participantId(participantId!);
      await followupSurveyPage.reasonForFollowUpSurvey(reason);
      await followupSurveyPage.createSurvey();

      // Verify new survey created
      const responsePromise = waitForResponse(page, { uri: 'surveyName=' });
      await followupSurveyPage.reloadTable();
      const response = await responsePromise;

      const json = JSON.parse(await response.text());
      const filterResult = json.filter((item: { surveyInfo: { participantId: string | null; }; reason: string; }) => {
          return item.surveyInfo.participantId === participantId && item.reason === reason
        });
      expect(filterResult.length).toBe(1);
      */
    });
  }

  function surveysForStudy(study: string): string {
    let survey: string;
    switch (study) {
      case StudyName.PANCAN:
        survey = 'BLOOD_CONSENT (REPEATING)';
        break;
      case StudyName.PROSTATE:
        survey = 'FOLLOWUP (REPEATING)';
        break;
      case StudyName.ESC:
        survey = 'FOLLOWUPCONSENT (REPEATING)';
        break;
      default:
        throw new Error(`Survey study "${study}" is undefined`);
    }
    return survey;
  }

  async function findParticipantWithoutBloodConsent(page: Page, participantListPage: ParticipantListPage): Promise<string> {
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.openColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM_BLOOD_DRAW, stableID: ID.BLOOD_CONSENT });
    await customizeViewPanel.selectColumns('Research Consent Form (Blood Draw) Columns', [Label.BLOOD_CONSENT_SURVEY_CREATED]);
    await customizeViewPanel.close();

    const searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();
    //Find enrolled participant without a blood consent
    await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });

  }
});
