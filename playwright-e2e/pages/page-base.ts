import { Locator, Page, Response } from '@playwright/test';
import { PageInterface } from './page-interface';

export default abstract class PageBase implements PageInterface {
  page: Page;
  private readonly baseUrl: string;

  protected constructor(page: Page, baseURL: string) {
    this.page = page;
    this.baseUrl = baseURL;
  }

  abstract waitForReady(): Promise<void>;

  async gotoURL(url: string): Promise<Response | null> {
    return this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async gotoURLPath(urlPath = ''): Promise<Response | null> {
    if (urlPath.startsWith('https')) {
      throw Error('Parameter urlPath is not valid.');
    }
    return this.page.goto(`${this.baseUrl}${urlPath}`, { waitUntil: 'domcontentloaded' });
  }

  protected async clickAndWaitForNav(locator: Locator, opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = false } = opts;
    waitForNav ? await this.waitForNavAfter(() => locator.click()) : await locator.click();
  }

  protected async waitForNavAfter(fn: () => Promise<void>): Promise<void> {
    await Promise.all([this.page.waitForNavigation(), fn()]);
  }
}
