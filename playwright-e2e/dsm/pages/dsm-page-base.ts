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
    await this.page.reload();
    await waitForNoSpinner(this.page);
  }
}
