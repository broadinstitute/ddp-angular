import { expect, Locator, Page } from '@playwright/test';

export default class ClinicalOrdersPage {
  protected PAGE_TITLE = 'Clinical Orders';
  private readonly DOWNLOAD_INFO = 'Download list includes additional fields "Order Message & Status Message"';

  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    const downloadListButton = this.getDownloadListButton();
    const reloadListButton = this.getReloadListButton();
    const downloadHelpText = this.getDownloadHelpText();
    const clinicalOrdersTable = await this.getClinicalOrdersTable();
    const amountOfClinicalOrders = clinicalOrdersTable.length;

    await expect(downloadListButton, 'Clinical Orders Page -> Download List button is not visible').toBeVisible();
    await expect(reloadListButton, 'Clinical Orders Page -> Reload List button is not visible').toBeVisible();
    await expect(downloadHelpText, `Clinical Orders Page -> help text: "${this.DOWNLOAD_INFO}" is not visible`).toBeVisible();
    expect.soft(amountOfClinicalOrders).toBeGreaterThanOrEqual(1); //Just in case there's times where there aren't clinical orders
  }

  public getClinicalOrderRow(opts: { sampleType: 'Normal' | 'Tumor', orderNumber: string }): Locator {
    const { sampleType, orderNumber } = opts;
    return this.page.locator(
      `//app-clinical-page//td[contains(text(), '${orderNumber}')]/preceding-sibling::td[contains(text(), '${sampleType}')]/parent::tr`
    );
  }

  /* Locators */
  private getDownloadListButton(): Locator {
    return this.page.getByRole('button', { name: 'Download list' });
  }

  private getReloadListButton(): Locator {
    return this.page.getByRole('button', { name: 'Reload list' });
  }

  private async getClinicalOrdersTable(): Promise<Locator[]> {
    return this.page.locator('//table//tbody//tr').all();
  }

  private getDownloadHelpText(): Locator {
    return this.page.getByText(this.DOWNLOAD_INFO);
  }
}
