import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import FollowUpSurveyPage from 'dsm/pages/follow-up-survey-page';
import { Label } from 'dsm/enums';
import { StudyName } from 'dsm/navigation';


test.describe('Follow-Up Surveys', () => {
  let followupSurveyPage: FollowUpSurveyPage;

  const studies = [StudyName.ANGIO, StudyName.OSTEO, StudyName.LMS, StudyName.OSTEO2, StudyName.PROSTATE, StudyName.ESC];

  for (const study of studies) {
    test(`Shows list of follow-up surveys configured in @${study} @dsm @functional`, async ({ page, request }) => {
      followupSurveyPage = await FollowUpSurveyPage.goto(page, study, request);
      await followupSurveyPage.waitForReady();

      const configuredSurveys = surveysForStudy(followupSurveyPage, study);
      const actualSurveyOptions = await followupSurveyPage.select().getAllOptions();
      expect(actualSurveyOptions).toEqual(expect.arrayContaining(configuredSurveys));
    });

    test(`Shows previous triggered surveys in @${study} @dsm @functional`, async ({ page, request }) => {
      followupSurveyPage = await FollowUpSurveyPage.goto(page, study, request);
      await followupSurveyPage.waitForReady();
      await expect(page.locator('app-survey ul')).toHaveScreenshot(`${study}-instructions.png`);

      // Shows list of previous triggered surveys
      await selectSurveyForStudy(followupSurveyPage, study);
      const previousSurveysTable = followupSurveyPage.previousSurveysTable;
      await previousSurveysTable.waitForReady(60 * 1000);

      // Save rows count
      const rowsCount = await previousSurveysTable.rowLocator().count();

      // Check search by column should be working
      const row1ParticipantId = await previousSurveysTable.getRowText(0, Label.PARTICIPANT_ID);
      const row1ShortId = await previousSurveysTable.getRowText(0, Label.SHORT_ID);

      expect(row1ParticipantId).not.toBeNull();
      expect(row1ShortId).not.toBeNull();

      // Depending on REPEATING OR NONREPEATING surveys, rows count from search could be 1 or greater.
      // Search Participant ID found in first row
      await previousSurveysTable.searchByColumn(Label.PARTICIPANT_ID, row1ParticipantId!);
      expect(await previousSurveysTable.getRowText(0, Label.SHORT_ID)).toBe(row1ShortId);

      // Clear search
      await previousSurveysTable.searchByColumn(Label.PARTICIPANT_ID, '');
      await expect(previousSurveysTable.rowLocator()).toHaveCount(rowsCount);

      // If there are more than 1 rows, fetch values in second row
      if (rowsCount > 1) {
        const row2ParticipantId = await previousSurveysTable.getRowText(1, Label.PARTICIPANT_ID);
        const row2ShortId = await previousSurveysTable.getRowText(1, Label.SHORT_ID);

        expect(row2ParticipantId).not.toBeNull();
        expect(row2ShortId).not.toBeNull();

        // Search Participant ID found in second row
        await previousSurveysTable.searchByColumn(Label.PARTICIPANT_ID, row2ParticipantId!);
        expect(await previousSurveysTable.getRowText(0, Label.SHORT_ID)).toBe(row2ShortId);
      }
    });
  }

  // Different surveys for different studies
  async function selectSurveyForStudy(followupSurveyPage: FollowUpSurveyPage, study: string): Promise<void> {
    let survey: string;
    switch (study) {
      case StudyName.PANCAN:
        survey = 'FAMILY_HISTORY  (NONREPEATING)';
        break;
      case StudyName.ANGIO:
        survey = 'followupconsent  (REPEATING)';
        break;
      case StudyName.OSTEO:
      case StudyName.LMS:
      case StudyName.OSTEO2:
        survey = 'SOMATIC_RESULTS  (REPEATING)';
        break;
      case StudyName.PROSTATE:
        survey = 'FOLLOWUP  (REPEATING)';
        break;
      case StudyName.ESC:
        survey = 'FOLLOWUPCONSENT  (REPEATING)';
        break;
      default:
        throw new Error(`Study ${study} is undefined`);
    }
    await followupSurveyPage.selectSurvey(survey);
  }

  function surveysForStudy(followupSurveyPage: FollowUpSurveyPage, study: string): string[] {
    let configuredSurveys: string[];
    switch (study) {
      case StudyName.PANCAN:
        configuredSurveys = ['BLOOD_CONSENT (REPEATING)', 'FAMILY_HISTORY (NONREPEATING)', 'DIET_LIFESTYLE (NONREPEATING)'];
        break;
      case StudyName.ANGIO:
        configuredSurveys = ['followupconsent (REPEATING)'];
        break;
      case StudyName.OSTEO:
      case StudyName.LMS:
      case StudyName.OSTEO2:
        configuredSurveys = ['SOMATIC_RESULTS (REPEATING)'];
        break;
      case StudyName.PROSTATE:
        configuredSurveys = ['FOLLOWUP (REPEATING)'];
        break;
      case StudyName.ESC:
        configuredSurveys = ['FOLLOWUPCONSENT (REPEATING)'];
        break;
      default:
        throw new Error(`Survey study "${study}" is undefined`);
    }
    return configuredSurveys;
  }
})
