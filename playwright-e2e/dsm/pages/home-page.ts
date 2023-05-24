import { expect, Locator, Page } from '@playwright/test';
import { HomePageInterface } from 'pages/page-interface';
import { DSMPageBase } from './page-base';
import * as auth from 'authentication/auth-dsm';

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

  /* Assertions */
  async assertWelcomeTitle(): Promise<void> {
    await expect(this.page.locator('h1'),
      "Home page - page title doesn't match the expected one")
      .toHaveText(Titles.WELCOME);
  }

  async assertSelectedStudyTitle(study: string): Promise<void> {
    await expect(this.page.locator('h2'),
      "Home page - displayed selected study doesn't match the expected one")
      .toHaveText(Titles.SELECTED_STUDY + study + Titles.STUDY);
  }
}
