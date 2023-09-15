import { expect, Page } from '@playwright/test';
import Select from 'dss/component/select';
import { waitForNoSpinner } from 'utils/test-utils';
import HomePage from './home-page';

export class WelcomePage {
  private readonly selectWidget: Select = new Select(this.page, { label: 'Select study' });

  constructor(private readonly page: Page) {}

  public async selectStudy(studyName: string): Promise<HomePage> {
    await this.selectWidget.selectOption(studyName);
    await waitForNoSpinner(this.page);
    await expect(this.page.locator('h1')).toHaveText('Welcome to the DDP Study Management System');
    await expect(this.page.locator('h2')).toHaveText(`You have selected the ${studyName} study.`);
    const home = new HomePage(this.page);
    await home.assertWelcomeTitle();
    await home.assertSelectedStudyTitle(studyName);
    return home;
  }
}
