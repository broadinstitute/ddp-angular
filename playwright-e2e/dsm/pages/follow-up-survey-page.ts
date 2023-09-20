import { APIRequestContext, expect, Page } from '@playwright/test';
import { MiscellaneousEnum } from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import PreviousSurveysTable from 'dsm/component/tables/previous-surveys-table';
import { WelcomePage } from 'dsm/pages/welcome-page';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import Select from 'dss/component/select';
import { waitForNoSpinner } from 'utils/test-utils';

export default class FollowUpSurveyPage {
  private readonly _table: PreviousSurveysTable = new PreviousSurveysTable(this.page);

  static async goto(page: Page, study: string, request: APIRequestContext): Promise<FollowUpSurveyPage> {
    const welcomePage = new WelcomePage(page);
    await welcomePage.selectStudy(study);

    const navigation = new Navigation(page, request);
    await navigation.selectFromMiscellaneous(MiscellaneousEnum.FOLLOW_UP_SURVEY);
    const followUpPage = new FollowUpSurveyPage(page);
    await followUpPage.waitForReady();
    return followUpPage;
  }

  constructor(private readonly page: Page) {}

  public get previousSurveysTable(): PreviousSurveysTable {
    return this._table;
  }

  public async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1')).toHaveText(/^\s*Follow-Up Survey\s*$/);
    await expect(this.select().toLocator()).toBeVisible();
    await waitForNoSpinner(this.page);
  }

  public async selectSurvey(survey: string): Promise<void> {
    await this.select().selectOption(survey);
    await waitForNoSpinner(this.page);
  }

  public async participantId(id: string): Promise<void> {
    const input = new Input(this.page, { label: 'Participant ID' });
    await input.fill(id);
  }

  public async reasonForFollowUpSurvey(reason: string): Promise<void> {
    const input = new Input(this.page, { label: 'Reason for Follow-Up Survey' });
    await input.fill(reason);
  }

  public async createSurvey(): Promise<void> {
    const button = new Button(this.page, { label: 'Create Survey', root: 'app-survey' });
    await button.click();
    await waitForNoSpinner(this.page);
  }

  public select(): Select {
    return new Select(this.page, { label: 'Survey', root: 'app-survey' });
  }

  public async reloadTable(): Promise<void> {
    const button = new Button(this.page, { label: 'Reload', root: 'app-survey' });
    await button.click();
    await waitForNoSpinner(this.page);
  }
}
