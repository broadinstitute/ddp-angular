import { Locator, Page, Request, expect } from '@playwright/test';
import Input from 'dss/component/input';
import TextArea from 'dss/component/textarea';
import { logInfo } from 'utils/log-utils';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';

export default abstract class DsmPageBase {
  public readonly page: Page;
  protected readonly baseUrl: string | undefined;
  protected abstract readonly PAGE_TITLE: string;

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
    await this.page.waitForLoadState();
    await expect(this.rootLocator.locator('h1')).toHaveText(this.PAGE_TITLE);
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

  public async backToParticipant(): Promise<void> {
    await this.page.getByText(/back to (Participant|previous) page/i).click();
    await expect(this.page.locator('//app-participant-page/h1')).toHaveText('Participant Page');
    await waitForNoSpinner(this.page);
  }

  public async backToParticipantList(): Promise<void> {
    await this.page.getByText("back to (List|'Participant List')").click();
    await expect(this.page.locator('//app-participant-list/h1')).toHaveText('Participant List');
    await waitForNoSpinner(this.page);
  }

  protected abstract get rootLocator(): Locator;
}
