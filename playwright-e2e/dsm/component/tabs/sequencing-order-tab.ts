import { Locator, Page, expect } from '@playwright/test';

export default class SequeuncingOrderTab {
  constructor(private readonly page: Page) {
  }

  /* Actions */

  public async waitForReady(): Promise<void> {
    const sequencingTab = this.page.locator(`//tab[@heading='Sequencing Order']`);
    await sequencingTab.scrollIntoViewIfNeeded();
    await expect(sequencingTab, 'The Sequencing Tab is not currently active').toHaveClass(/active/);
  }

  public async placeOrder(): Promise<void> {
    const placeOrderButton = this.page.getByRole('button', { name: 'Place order' });
    await placeOrderButton.scrollIntoViewIfNeeded();
    await placeOrderButton.click();
  }

  /* Locators */
  public async getRandomNormalSample(): Promise<Locator> {
    const samples = await this.getAllNormalSamples();
    const amountOfSamples = samples.length;
    expect(amountOfSamples, 'There are no available normal samples in the Sequencing Tab').toBeGreaterThanOrEqual(1);
    return samples[0];
  }

  public async getRandomTumorSample(): Promise<Locator> {
    const samples = await this.getAllTumorSamples();
    const amountOfSamples = samples.length;
    expect(amountOfSamples, 'There are no available tumor samples in the Sequencing Tab').toBeGreaterThanOrEqual(1);
    return samples[0];
  }

  public getPlaceOrderButton(): Locator {
    return this.page.getByRole('button', { name: 'Place order' });
  }

  private getCheckboxOfSample(sample: Locator): Locator {
    return sample.locator('//mat-checkbox');
  }

  private async getAllNormalSamples(): Promise<Locator[]> {
    const samples = await this.page.locator(`//app-sequencing-order//tr[contains(.,'Normal')]`).all();
    console.log(`Amount of normal samples: ${samples.length}`);
    return samples;
  }

  private async getAllTumorSamples(): Promise<Locator[]> {
    return this.page.locator(`//app-sequencing-order//tr[contains(.,'Tumor')]`).all();
  }
}
