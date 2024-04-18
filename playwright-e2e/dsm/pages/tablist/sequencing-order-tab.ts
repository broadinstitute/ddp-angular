import { Locator, Page, expect } from '@playwright/test';
import { getDate } from 'utils/date-utils';
import TabBase from './tab-base';
import { Tab } from 'dsm/enums';

export default class SequeuncingOrderTab extends TabBase {
  private readonly SAMPLE_ROW_XPATH = '//app-sequencing-order//tr';
  private readonly DATE_FIELD_XPATH = `//input[@data-placeholder='mm/dd/yyyy']`;
  private readonly NOT_ELIGIBLE_DUE_TO_RESIDENCE = `Error: Participant lives in New York or Canada and is not eligible for clinical sequencing`;

  constructor(page: Page) {
    super(page, Tab.SEQUENCING_ORDER);
  }

  /* Actions */

  public async waitForReady(): Promise<void> {
    await this.toLocator.scrollIntoViewIfNeeded();
    await expect(this.toLocator, 'The Sequencing Tab is not currently active').toHaveClass(/active/);
  }

  public async placeOrder(): Promise<void> {
    const placeOrderButton = this.toLocator.getByRole('button', { name: 'Place order' });
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

  public async assertParticipantNotEligibleForClinicalSequencing(): Promise<void> {
    const validationMessage = this.page.getByText(this.NOT_ELIGIBLE_DUE_TO_RESIDENCE);
    await expect(validationMessage).toBeVisible();
  }

  public async fillAvailableCollectionDateFields(opts: {canPlaceClinicalOrder?: boolean}): Promise<void> {
    const { canPlaceClinicalOrder = true } = opts;
    const collectionDateIndex = canPlaceClinicalOrder ? 5 : 4; //Index depending on whether test user has permission to place clinical order
    const allAvailableSamples = await this.getAllPossibleSamples();
    for (const sample of allAvailableSamples) {
      const collectionDateSection = sample.locator(`//td[${collectionDateIndex}]`); //Get Collection Date section
      if (await this.isInteractiveDateField(collectionDateSection)) {
        const collectionDateField = collectionDateSection.locator(this.DATE_FIELD_XPATH); //Get date field
        const today = getDate();
        await collectionDateField.fill(today);
        await collectionDateField.press('Enter');
      }
    }
  }

  private async isInteractiveDateField(dateField: Locator): Promise<boolean> {
    const field = dateField.locator(this.DATE_FIELD_XPATH);
    return await field.isVisible();
  }

  /* Locators */
  public async getAllPossibleSamples(): Promise<Locator[]> {
    const samplesXPath = this.SAMPLE_ROW_XPATH.concat(`[contains(.,'Normal') or contains(.,'Tumor')]`);
    return this.page.locator(samplesXPath).all();
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
    return this.toLocator.getByRole('button', { name: 'Place order' });
  }

  private getCheckboxOfSample(sample: Locator): Locator {
    return sample.locator('//mat-checkbox');
  }

  private async getAllNormalSamples(): Promise<Locator[]> {
    const normalSampleXPath = this.SAMPLE_ROW_XPATH.concat(`[contains(.,'Normal')]`);
    const samples = await this.page.locator(normalSampleXPath).all();
    const amountOfSamples = samples.length;
    expect(amountOfSamples, 'No normal samples were available in the Sequencing Tab').toBeGreaterThanOrEqual(1);
    return samples;
  }

  private async getAllTumorSamples(): Promise<Locator[]> {
    const tumorSampleXPath = this.SAMPLE_ROW_XPATH.concat(`[contains(.,'Tumor')]`);
    const samples = await this.page.locator(tumorSampleXPath).all();
    const amountOfSamples = samples.length;
    expect(amountOfSamples, 'No tumor samples were available in the Sequencing tab').toBeGreaterThanOrEqual(1);
    return samples;
  }
}
