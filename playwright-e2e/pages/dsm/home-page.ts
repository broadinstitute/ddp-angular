import { expect, Locator, Page } from '@playwright/test';
import { HomePageInterface } from 'pages/page-interface';
import { DSMPageBase } from './page-base';
import * as auth from 'authentication/auth-dsm';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import ParticipantListPage from 'pages/dsm/participantList-page';

enum Titles {
  WELCOME = 'Welcome to the DDP Study Management System',
  SELECTED_STUDY = 'You have selected the ',
  STUDY = ' study.'
}

export default class HomePage extends DSMPageBase implements HomePageInterface {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Log into DSM application
   * @param opts
   */
  async logIn(opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}) {
    await auth.login(this.page);
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
