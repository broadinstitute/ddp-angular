import { expect, Locator, Page } from '@playwright/test';
import { HomePageInterface } from 'pages/page-interface';
import { DSMPageBase } from './page-base';
import * as auth from 'authentication/auth-dsm';
import Select from 'lib/widget/select';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { StudyNav } from 'lib/component/dsm/navigation/enums/studyNav.enum';
import ParticipantListPage from 'pages/dsm/participantList-page';
import ParticipantPage from 'pages/dsm/participant-page';

enum Titles {
  WELCOME = 'Welcome to the DDP Study Management System',
  SELECTED_STUDY = 'You have selected the ',
  STUDY = ' study.'
}

export default class HomePage extends DSMPageBase implements HomePageInterface {
  private readonly navigation: Navigation;
  private readonly participantList: ParticipantListPage;

  constructor(page: Page) {
    super(page);
    this.navigation = new Navigation(page);
    this.participantList = new ParticipantListPage(page);
  }

  /**
   * Log into DSM application
   * @param opts
   */
  async logIn(opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}) {
    await auth.login(this.page);
  }

  async selectStudy(study: string, page: Page) {
    const studySelector = await new Select(page, { label: 'Select study' });
    await studySelector.click();
    await studySelector.selectOption(study);
  }

  async selectStudyMenuOption(menuOption: string) {
    if (menuOption === 'Participant List') {
      //Select the Participant List from the available Study menu options
      await this.navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);
      await this.participantList.waitForReady();
      await this.participantList.assertPageTitle();
      await this.participantList.waitForReady();
    }
  }

  async selectCustomizeViewOption(columnGroup: string, columnName: string) {
    //Select column group e.g. Participant Columns
    await this.page.locator('text=Customize View >> button').click();
    await this.page.locator(`text='${columnGroup}' >> button`).click();
    await this.page.locator(`text='${columnName}' >> button`).click();
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForFunction(() => document.title === 'DDP Study Management');
  }

  public get welcomeTitle(): Locator {
    return this.page.locator('h1');
  }

  public get studySelectionTitle() {
    return this.page.locator('h2');
  }

  /* Assertions */
  async assertWelcomeTitle(): Promise<void> {
    await expect(this.welcomeTitle).toHaveText(Titles.WELCOME);
  }

  async assertSelectedStudyTitle(study: string): Promise<void> {
    await expect(this.studySelectionTitle).toHaveText(Titles.SELECTED_STUDY + study + Titles.STUDY);
  }
}
