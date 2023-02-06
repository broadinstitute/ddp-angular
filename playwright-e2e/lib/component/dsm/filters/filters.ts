import { Locator, Page } from '@playwright/test';
import { CustomizeView } from './sections/customize-view';
import { Search } from './sections/search/search';

export class Filters {
  private readonly CustomizeView: CustomizeView = new CustomizeView(this.page);
  private readonly Search: Search = new Search(this.page);

  constructor(private readonly page: Page) {}

  public get customizeViewPanel(): CustomizeView {
    return this.CustomizeView;
  }

  public get searchPanel(): Search {
    return this.Search;
  }

  public async reloadWithDefaultFilters(): Promise<void> {
    await this.locator(this.reloadWithDefaultFiltersXPath).click();
  }

  private locator(XPath: string): Locator {
    return this.page.locator(XPath);
  }

  /* XPaths */

  private get reloadWithDefaultFiltersXPath(): string {
    return (
      "//div[text()[normalize-space()='Reload With Default Filter'] " +
      "and button[.//*[local-name()='svg' and @data-icon='sync-alt']/*[local-name()='path']]]/button"
    );
  }
}
