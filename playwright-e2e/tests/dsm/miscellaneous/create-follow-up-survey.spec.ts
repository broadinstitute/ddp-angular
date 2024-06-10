import { expect } from '@playwright/test';
import Modal from 'dsm/component/modal';
import { test } from 'fixtures/dsm-fixture';
import FollowUpSurveyPage from 'dsm/pages/follow-up-survey-page';
import { getDate } from 'utils/date-utils';
import { generateAlphaNumeric, generateRandomNum } from 'utils/faker-utils';
import { waitForResponse } from 'utils/test-utils';
import { Label } from 'dsm/enums';
import { StudyName } from 'dsm/navigation';


test.describe('Create Follow-Up Survey', () => {
  const studies = [StudyName.PROSTATE, StudyName.ESC];
  let followupSurveyPage: FollowUpSurveyPage;

  for (const study of studies) {
    const survey = surveysForStudy(study);
    test(`${survey} in @${study} @dsm @functional`, async ({ page, request }) => {
      followupSurveyPage = await FollowUpSurveyPage.goto(page, study, request);
      await followupSurveyPage.waitForReady();

      await followupSurveyPage.selectSurvey(survey);
      const previousSurveysTable = followupSurveyPage.previousSurveysTable;
      const rowsCount = await previousSurveysTable.rowLocator().count();
      expect(rowsCount).toBeGreaterThanOrEqual(1);

      // Find any participant ID to create new survey (repeating)
      const randRowIndex = generateRandomNum(0, rowsCount);
      const participantId = await previousSurveysTable.getRowText(randRowIndex, Label.PARTICIPANT_ID);
      expect(participantId).not.toBeNull();

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
});
