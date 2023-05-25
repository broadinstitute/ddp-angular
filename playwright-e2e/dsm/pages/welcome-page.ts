import { Page } from '@playwright/test';
import Select from 'dss/component/select';

export class WelcomePage {
  private readonly selectWidget: Select = new Select(this.page, { label: 'Select study' });

  constructor(private readonly page: Page) {}

  public async selectStudy(studyName: string): Promise<void> {
    await this.selectWidget.selectOption(studyName);
  }
}
