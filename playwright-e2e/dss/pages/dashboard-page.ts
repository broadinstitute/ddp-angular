import { Locator, Page } from '@playwright/test';

export enum DashboardActivity {
  RESEARCH_CONSENT = 'Research Consent Form',
  ADDITIONAL_CONSENT_LEARNING_ABOUT_YOUR_TUMOR = 'Additional Consent: Learning About Your Tumor',
  MEDICAL_RELEASE = 'Medical Release Form',
  SURVEY_YOUR = 'Survey: Your',
  SURVEY_ABOUT_YOU = 'Survey: About you',
  SURVEY_FAMILY_HISTORY_OF_CANCER = 'Survey: Family History of Cancer'
}
export default class DashboardPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getActivity(activity: DashboardActivity): Locator {
    return this.page.locator(`//ddp-user-activities//button[contains(text(), '${activity}')]`);
  }
}
