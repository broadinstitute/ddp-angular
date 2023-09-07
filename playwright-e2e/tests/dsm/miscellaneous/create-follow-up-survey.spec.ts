import { expect } from '@playwright/test';
import Modal from 'dsm/component/modal';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import FollowUpSurveyPage from 'dsm/pages/follow-up-survey-page';
import { getDate } from 'utils/date-utils';
import { generateAlphaNumeric, generateRandomNum } from 'utils/faker-utils';
import { waitForResponse } from 'utils/test-utils';


test.describe('Create Follow-Up Survey', () => {
  const studies = [StudyEnum.PANCAN, StudyEnum.PROSTATE, StudyEnum.ESC];
  let followupSurveyPage: FollowUpSurveyPage;

  test(`FAMILY_HISTORY (NONREPEATING) in @pancan @dsm @functional`, async ({ page, request }) => {
    followupSurveyPage = await FollowUpSurveyPage.goto(page, StudyEnum.PANCAN, request);
    await followupSurveyPage.waitForReady();

    await followupSurveyPage.selectSurvey('FAMILY_HISTORY  (NONREPEATING)');
    const previousSurveysTable = followupSurveyPage.previousSurveysTable;
    await previousSurveysTable.waitForReady(60 * 1000);

    const participantId = await previousSurveysTable.getRowText(0, 'Participant ID');
    expect(participantId).not.toBeNull();

    // Fill out participant ID and reason
    await followupSurveyPage.participantId(participantId!);
    await followupSurveyPage.reasonForFollowUpSurvey(`playwright testing ${getDate()}`);
    await followupSurveyPage.createSurvey();

    // Modal window informs user survey won't be triggered again
    const modal = new Modal(page);
    const description = await modal.getHeader();
    expect(description).toBe(
      "Survey was already triggered for following participants.\nSelected survey was of type 'NONREPEATING' therefore DSM won't trigger again.");
    const body = await modal.getBodyText();
    expect(body).toBe(participantId);
    await modal.close();

    await previousSurveysTable.searchByColumn('Participant ID', participantId!);
    await expect(previousSurveysTable.rowLocator()).toHaveCount(1);
  });

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
      const participantId = await previousSurveysTable.getRowText(randRowIndex, 'Participant ID');
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
      expect(filterResult.length).toEqual(1);
    });
  }

  function surveysForStudy(study: string): string {
    let survey: string;
    switch (study) {
      case StudyEnum.PANCAN:
        survey = 'BLOOD_CONSENT (REPEATING)';
        break;
      case StudyEnum.PROSTATE:
        survey = 'FOLLOWUP (REPEATING)';
        break;
      case StudyEnum.ESC:
        survey = 'FOLLOWUPCONSENT (REPEATING)';
        break;
      default:
        throw new Error(`Survey study "${study}" is undefined`);
    }
    return survey;
  }
});
