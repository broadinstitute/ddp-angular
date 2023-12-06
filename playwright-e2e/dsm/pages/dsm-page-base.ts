import { Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';

export default abstract class DsmPageBase {
  protected readonly page: Page;
  protected readonly baseUrl: string | undefined;

  protected constructor(page: Page, baseURL?: string) {
    this.page = page;
    this.baseUrl = baseURL;
  }

  async reload(): Promise<void> {
    const networkIdlePromise = this.page.waitForLoadState('networkidle');
    await this.page.reload();
    await this.page.waitForLoadState();
    await waitForNoSpinner(this.page);
    await networkIdlePromise;
  }
}
