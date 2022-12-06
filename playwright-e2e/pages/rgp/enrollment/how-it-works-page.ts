import { expect, Locator, Page } from '@playwright/test';
import { RgpPageBase } from 'pages/rgp/rgp-page-base';

export default class HowItWorksPage extends RgpPageBase {
  private readonly startApplicationButton: Locator;

  constructor(page: Page) {
    super(page);
    this.startApplicationButton = this.page.locator('a', { hasText: 'Start an Application' });
  }

  async waitForReady(): Promise<void> {
    await expect(this.startApplicationButton).toBeVisible({ visible: true });
  }

  async startApplication(): Promise<void> {
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'load' }), this.startApplicationButton.click()]);
  }
}
