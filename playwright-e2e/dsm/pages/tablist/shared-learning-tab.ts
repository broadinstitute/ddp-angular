import {expect, Locator, Page} from '@playwright/test';

export default class SharedLearningTab {
  constructor(private readonly page: Page) {}

  public getSelectPDFButton(): Locator {
    return this.page.getByRole('button', { name: 'Select a PDF' });
  }

  public getUploadButton(): Locator {
    return this.page.getByRole('button', { name: 'Upload' });
  }
}
