import { Page, Request } from '@playwright/test';
import Input from 'dss/component/input';
import TextArea from 'dss/component/textarea';
import { logInfo } from 'utils/log-utils';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';

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
    }

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

  protected async fillAndBlur(input: TextArea | Input, value?: string): Promise<void> {
    const currValue = await input.currentValue();
    if (currValue?.length > 0) {
      // Clear value, not checking for equals to new value.
      const resPromise = waitForResponse(this.page, {uri: '/patch'});
      await input.clear();
      await input.blur();
      await resPromise;
      await this.page.waitForTimeout(200);
    }
    if (value) {
      const resPromise = waitForResponse(this.page, {uri: '/patch'});
      await input.fillSimple(value);
      await resPromise;
    }
  }
}
