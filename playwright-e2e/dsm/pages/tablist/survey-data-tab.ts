import { Locator, Page, expect } from '@playwright/test';
import { SurveyDataPanelEnum as SurveyName, ActivityVersionEnum as ActivityVersion } from 'dsm/component/tabs/enums/survey-data-enum';
import { CustomizeView, Label } from 'dsm/enums';

//TODO add method to check Created, Completed, Last Updated information
export default class SurveyDataTab {
  constructor(private readonly page: Page) {
  }

  /**
   * To be used to retreive the locator for the activity or panel in Survey Data tab
   * @param opts actvityName - Could be the name of the activity or just the name of an expandable panel
   * @param opts actvitityVersion - Usually located on the far-right of the expandable panel e.g. (sans quotes) 'Survey Version: v1'
   * @param opts checkForVisibility - defaults to true; change to false if you want to handle checking that the locator is visible
   * @returns the activity or panel's locator
   */
  public async getActivity(opts: { activityName: SurveyName, activityVersion: ActivityVersion, checkForVisibility?: boolean }): Promise<Locator> {
    const { activityName, activityVersion, checkForVisibility = true } = opts;
    const activity = this.getActivityDataPanel(activityName, activityVersion);
    if (checkForVisibility) {
      await activity.waitFor({ state: 'visible' });
    }
    return activity;
  }

  public async getActivityQuestion(opts: { activity: Locator, questionShortID: Label }): Promise<Locator> {
    const { activity, questionShortID } = opts;
    const expandedPanelRegion = activity.locator(`//parent::mat-expansion-panel//*[@role='region']`);
    const isVisible = await expandedPanelRegion.isVisible();
    if (!isVisible) {
      await activity.click();
      await expect(expandedPanelRegion).toBeVisible();
    }
    //Questions in DSM all usually are grey with the question short id attached
    const activityQuestion = expandedPanelRegion.locator(`//h5[contains(@class, 'grey-color') and contains(., '${questionShortID}')]`);
    return activityQuestion;
  }

  //TODO modify to better handle whitepsaces + line breaks + answers with more than one line of input e.g. from Medical Release Form
  public async getActivityAnswer(activityQuestion: Locator): Promise<string> {
    const answerLocator = activityQuestion.locator(`//following-sibling::div//b`);
    const answer = (await answerLocator.innerText()).trim();
    return answer;
  }

  public async assertActivityQuestionDisplayed(activityQuestion: Locator): Promise<void> {
    await activityQuestion.scrollIntoViewIfNeeded(); //adding so that in case of error, the video can be more easily followed
    await expect(activityQuestion).toBeVisible();
  }

  private getActivityDataPanel(name: string, version: string): Locator {
    //Note: It's possible for a participant to have more than one version of an activity e.g. Research Consent in the case of a re-consented participant
    return this.page.locator(`//app-activity-data//mat-expansion-panel-header[contains(., "${name}") and contains(., '${version}')]`);
  }

  private getPanel(panelName: SurveyName): Locator {
    return this.page.locator(`tab.active[role="tabpanel"] app-activity-data #${panelName})`);
  }
}
