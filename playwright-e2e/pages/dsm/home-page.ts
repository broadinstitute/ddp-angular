import { expect, Page } from '@playwright/test';

enum Titles {
  WELCOME = 'Welcome to the DDP Study Management System',
  SELECTED_STUDY = 'You have selected the ',
  STUDY = ' study.'
}

export default class HomePage {
  constructor(private readonly page: Page) {}

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
