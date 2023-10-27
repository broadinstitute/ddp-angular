import { Locator, Page, expect } from '@playwright/test';
import { getDate } from 'utils/date-utils';

export default class SequeuncingOrderTab {
  private readonly SAMPLE_ROW = '//app-sequencing-order//tr';

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

  public async assertSamplesInvisible(): Promise<void> {
    const allAvailableSamples = await this.getAllPossibleSamples();
    for (const sample of allAvailableSamples) {
      const sampleCheckbox = this.getCheckboxOfSample(sample);
      await expect(sampleCheckbox).not.toBeVisible();
    }
  }

  public async assertPlaceOrderButtonInvisible(): Promise<void> {
    const placeOrderButton = this.getPlaceOrderButton();
    await expect(placeOrderButton).not.toBeVisible();
  }

  public async fillAvailableCollectionDateFields(opts: {canPlaceClinicalOrder?: boolean}): Promise<void> {
    const { canPlaceClinicalOrder = true } = opts;
    const collectionDateIndex = canPlaceClinicalOrder ? 5 : 4; //Index depending on whether test user has permission to place clinical order
    const allAvailableSamples = await this.getAllPossibleSamples();
    for (const sample of allAvailableSamples) {
      const collectionDateSection = sample.locator(`//td[${collectionDateIndex}]`); //Get Collection Date section
      if (await this.isInteractiveDateField(collectionDateSection)) {
        const collectionDateField = collectionDateSection.locator(`//input[@data-placeholder='mm/dd/yyyy']`); //Get date field
        const today = getDate();
        await collectionDateField.fill(today);
      }
    }
  }

  private async isInteractiveDateField(dateField: Locator): Promise<boolean> {
    const fieldInput = await dateField.innerText();
    if (fieldInput === `mm/dd/yyyy\n  Today`) {
      return true;
    }
    return false;
  }

  /* Locators */
  public async getAllPossibleSamples(): Promise<Locator[]> {
    return this.page.locator(`//app-sequencing-order//tr[contains(.,'Normal') or contains(.,'Tumor')]`).all();
  }

  /**
   * Gets the first available normal sample
   * @returns the first available sample - uses 0-based array
   */
  public async getFirstAvailableNormalSample(): Promise<Locator> {
    const samples = await this.getAllNormalSamples();
    const amountOfSamples = samples.length;
    expect(amountOfSamples, 'There are no available normal samples in the Sequencing Tab').toBeGreaterThanOrEqual(1);
    return samples[0];
  }

  /**
   * Gets the first available tumor sample
   * @returns the first available sample - uses 0-based array
   */
  public async getFirstAvailableTumorSample(): Promise<Locator> {
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
    const normalSampleXPath = this.SAMPLE_ROW.concat(`[contains(.,'Normal')]`);
    const samples = await this.page.locator(normalSampleXPath).all();
    const amountOfSamples = samples.length;
    expect(amountOfSamples, 'No normal samples were available in the Sequencing Tab').toBeGreaterThanOrEqual(1);
    return samples;
  }

  private async getAllTumorSamples(): Promise<Locator[]> {
    const tumorSampleXPath = this.SAMPLE_ROW.concat(`[contains(.,'Tumor')]`);
    const samples = await this.page.locator(tumorSampleXPath).all();
    const amountOfSamples = samples.length;
    expect(amountOfSamples, 'No tumor samples were available in the Sequencing tab').toBeGreaterThanOrEqual(1);
    return samples;
  }
}
