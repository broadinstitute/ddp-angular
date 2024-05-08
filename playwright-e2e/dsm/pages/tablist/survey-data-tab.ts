import { Locator, Page, expect } from '@playwright/test';
import { SurveyDataPanelEnum as SurveyName, ActivityVersionEnum as ActivityVersion } from 'dsm/component/tabs/enums/survey-data-enum';
import { Label } from 'dsm/enums';

export default class SurveyDataTab {
  constructor(private readonly page: Page) {
  }

  public async getActivity(opts: { activityName: SurveyName, activityVersion: ActivityVersion }): Promise<Locator> {
    const { activityName, activityVersion } = opts;
    const activityPanel = this.getActivityDataPanel(activityName, activityVersion);
    await activityPanel.waitFor({ state: 'visible' });
    return activityPanel;
  }

  public async getActivityQuestion(opts: { activityPanel: Locator, questionShortID: Label }): Promise<Locator> {
    const { activityPanel, questionShortID } = opts;
    const expandedPanelRegion = activityPanel.locator(`/parent::mat-expansion-panel//*[@role='region']`);
    const isVisible = await expandedPanelRegion.isVisible();
    if (!isVisible) {
      await activityPanel.click();
      await expect(expandedPanelRegion).toBeVisible();
    }
    //Questions in DSM all usually are grey with the question short id attached
    const activityQuestion = expandedPanelRegion.locator(`//h5[contains(@class, 'grey-color') and contains(., '${questionShortID}')]`);
    return activityQuestion;
  }

  public async getActivityAnswer(activityQuestion: Locator): Promise<string> {
    const answerLocator = activityQuestion.locator(`/following-sibling::div//b`);
    const answer = (await answerLocator.innerText()).trim();
    return answer;
  }
  /*public async getActivityData(activity: SurveyDataPanelEnum, label: string): Promise<string[]> {
    await this.activityDataPanel(activity).waitFor({state: 'visible' });
    const region = this.activityDataPanel(activity).locator('xpath=//*[@role="region"]');
    const isVisible = await region.isVisible();
    if (!isVisible) {
      await this.activityDataPanel(activity).click();
      await expect(region).toBeVisible();
    }

    const data = region.locator(
      `xpath=/*[contains(@class, "mat-expansion-panel-body")]/div[.//*[contains(@class, "grey-color")][normalize-space()="${label}"]]`);
    return (await data.innerText()).split('\n+');
  }*/

  private getActivityDataPanel(name: string, version: string): Locator {
    //Note: It's possible for a participant to have more than one version of an activity e.g. Research Consent in the case of a re-consented participant
    return this.page.locator(`//app-activity-data//mat-expansion-panel-header[contains(., '${name}') and contains(., '${version}')]`);
  }

  private getPanel(panelName: SurveyName): Locator {
    return this.page.locator(`tab.active[role="tabpanel"] app-activity-data #${panelName})`);
  }
}
