import { Locator, Page } from '@playwright/test';

export default class Input {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, opts: { label?: string; ddpTestID?: string; parent?: Locator } = {}) {
    const { label, ddpTestID, parent } = opts;
    this.page = page;
    const rootLocator = parent ? parent : this.page.locator('body');
    this.locator = ddpTestID
      ? this.page.locator(`input[data-ddp-test="${ddpTestID}"]`)
      : rootLocator.locator(`//input[@id=(//label[contains(normalize-space(.),"${label}")]/@for)]`);
  }

  toLocator(): Locator {
    return this.locator;
  }

  /**
   * Fill in text value. Waits for triggered request to finish successfully.
   * If no request from filling in input, set parameter "waitRequestAfter" to false. For example, fill('How old are you?', { waitRequestAfter: false });
   * @param value
   * @param waitOpts
   */
  async fill(
    value: string,
    waitOpts: { waitRequestAfter?: boolean; requestStatus?: number; requestURL?: string } = {}
  ): Promise<void> {
    // For majority of inputs, a "PATCH /answers" request is triggered when filled in text
    const { waitRequestAfter = true, requestStatus = 200, requestURL = '/answers' } = waitOpts;

    const responsePromise = waitRequestAfter
      ? this.page.waitForResponse(
          (response) => {
            const requestData: boolean | undefined = response.request().postData()?.includes(value);
            const includeValue = requestData ? requestData : false;
            return response.url().includes(requestURL) && response.status() === requestStatus && includeValue;
          },
          { timeout: 10 * 1000 } // More time for retries. UI will resend failed requests
        )
      : Promise.resolve();

    await this.toLocator().fill(value);
    await this.toLocator().press('Tab'); // A request is triggered when input loses focus
    await responsePromise;
  }

  errorMessage(): Locator {
    // '//ddp-activity-question[.//input[@data-ddp-test="answer:PREQUAL_AGE"]]//*[contains(@class,"ErrorMessage")]'
    return this.page.locator('ddp-activity-question').filter({ has: this.toLocator() }).locator('.ErrorMessage');
  }

  toQuestion(): Locator {
    return this.page.locator('ddp-activity-question').filter({ has: this.toLocator() });
  }
}
