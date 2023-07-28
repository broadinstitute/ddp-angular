import { expect } from '@playwright/test';
import Modal from 'dsm/component/modal';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import FollowUpSurveyPage from 'dsm/pages/follow-up-survey-page';
import { getDate } from 'utils/date-utils';
import { generateRandomNum } from 'utils/faker-utils';


test.describe('Create Follow-Up Survey', () => {
  const studies = [StudyEnum.PANCAN, StudyEnum.ANGIO, StudyEnum.PROSTATE, StudyEnum.ESC];
  let followupSurveyPage: FollowUpSurveyPage;

  test(`FAMILY_HISTORY (NONREPEATING) in @pancan @dsm @functional`, async ({ page, request }) => {
    followupSurveyPage = await FollowUpSurveyPage.goto(page, StudyEnum.PANCAN, request);
    await followupSurveyPage.waitForReady();

    await followupSurveyPage.selectSurvey('FAMILY_HISTORY  (NONREPEATING)');
    const previousSurveysTable = followupSurveyPage.previousSurveysTable;
    await previousSurveysTable.waitForReady(60 * 1000);

    const participantId = await previousSurveysTable.getRowText(0, 'Participant ID');
    expect(participantId).not.toBeNull();

    // Fill out fields
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
      const randRowIndx = generateRandomNum(0, rowsCount);
      const participantId = await previousSurveysTable.getRowText(randRowIndx, 'Participant ID');
      expect(participantId).not.toBeNull();

      await previousSurveysTable.searchByColumn('Participant ID', participantId!);
      const oldRowsCount = await previousSurveysTable.rowLocator().count();

      await followupSurveyPage.participantId(participantId!);
      await followupSurveyPage.reasonForFollowUpSurvey(`playwright testing ${getDate()}`);
      await followupSurveyPage.createSurvey();

      await followupSurveyPage.reloadTable();
      await previousSurveysTable.searchByColumn('Participant ID', participantId!);
      const newRowsCount = await previousSurveysTable.rowLocator().count();
      expect(newRowsCount).toEqual(oldRowsCount + 1);
    });
  }

  function surveysForStudy(study: string): string {
    let survey: string;
    switch (study) {
      case StudyEnum.PANCAN:
        survey = 'BLOOD_CONSENT (REPEATING)';
        break;
      case StudyEnum.ANGIO:
        survey = 'followupconsent (REPEATING)';
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
})
