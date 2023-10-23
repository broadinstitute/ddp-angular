import { expect, Locator, Page } from '@playwright/test';

export default class ClinicalOrdersPage {
  private readonly PAGE_TITLE = 'Clinical Orders';

  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    const downloadListButton = this.getDownloadListButton();
    const reloadListButton = this.getReloadListButton();
    const clinicalOrdersTable = await this.getClinicalOrdersTable();
    const amountOfClinicalOrders = clinicalOrdersTable.length;

    await expect(downloadListButton, 'Clinical Orders Page -> Download List button is not visible').toBeVisible();
    await expect(reloadListButton, 'Clinical Orders Page -> Reload List button is not visible').toBeVisible();
    expect.soft(amountOfClinicalOrders).toBeGreaterThanOrEqual(1); //Just in case there's times where there aren't clinical orders
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
}
