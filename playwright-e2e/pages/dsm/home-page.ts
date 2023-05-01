import { expect, Locator, Page } from '@playwright/test';

enum Titles {
  WELCOME = 'Welcome to the DDP Study Management System',
  SELECTED_STUDY = 'You have selected the ',
  STUDY = ' study.'
}

export default class HomePage {
  constructor(private readonly page: Page) {}

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
