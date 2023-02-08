import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import PageBase from 'pages/page-base';
import { BrainBasePage } from './brain-base-page';
import * as auth from 'authentication/auth-brain';
import {HomePageInterface} from "../page-interface";

export default class HomePage extends BrainBasePage implements HomePageInterface {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Help transform our understanding of brain tumors');
    await waitForNoSpinner(this.page);
  }

  async clickCountMeIn(): Promise<void> {
    await this.page.getByRole('banner').getByRole('link', { name: 'Count Me In' }).click();
  }

  async logIn(opts: { email?: string; password?: string } = {}): Promise<void> {
    await auth.login(this.page);
  }

  
}
