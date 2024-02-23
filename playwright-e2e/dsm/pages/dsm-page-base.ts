import { Page, Request } from '@playwright/test';
import { logInfo } from 'utils/log-utils';
import { waitForNoSpinner } from 'utils/test-utils';

export default abstract class DsmPageBase {
  public readonly page: Page;
  protected readonly baseUrl: string | undefined;

  protected constructor(page: Page, baseURL?: string) {
    this.page = page;
    this.baseUrl = baseURL;
  }

  async reload(): Promise<void> {
    const logRequest = (interceptedRequest: Request) => {
      logInfo(`Failed request: ${interceptedRequest.url()}`);
    };

    this.page.on('requestfinished', logRequest);
    await this.page.reload({ waitUntil: 'load' });
    await waitForNoSpinner(this.page);
    this.page.removeListener('requestfinished', logRequest);
  }

  public async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('load');
    await waitForNoSpinner(this.page);
  }
}
