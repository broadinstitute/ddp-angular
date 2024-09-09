import { Locator, Page, expect } from '@playwright/test';
import { getDate, getDateinISOFormat, getToday } from 'utils/date-utils';
import TabBase from './tab-base';
import { SequencingOrderColumn, Tab } from 'dsm/enums';

export default class SequeuncingOrderTab extends TabBase {
  private readonly SAMPLE_ROW_XPATH = '//app-sequencing-order//tr';
  private readonly DATE_FIELD_XPATH = `//input[@data-placeholder='mm/dd/yyyy']`;
  private readonly NOT_ELIGIBLE_DUE_TO_RESIDENCE = `Error: Participant lives in New York or Canada and is not eligible for clinical sequencing`;
  private readonly PLACE_CLINICAL_ORDER_MODAL_TEXT = `Are you sure you want to place a clinical sequencing order for the following samples:`;

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

  public async assertPlaceOrderButtonDisplayed(): Promise<void> {
    const placeOrderButton = this.getPlaceOrderButton();
    await placeOrderButton.scrollIntoViewIfNeeded();
    await expect(placeOrderButton, 'The Place Order button is not visible to the current DSM user').toBeVisible();
  }

  public async assertParticipantNotEligibleForClinicalSequencing(): Promise<void> {
    const validationMessage = this.page.getByText(this.NOT_ELIGIBLE_DUE_TO_RESIDENCE);
    await expect(validationMessage).toBeVisible();
  }

  public async assertClinicalOrderModalDisplayed(): Promise<void> {
    const placeOrderModal = this.page.locator(`//div[contains(text(), '${this.PLACE_CLINICAL_ORDER_MODAL_TEXT}')]`);
    await placeOrderModal.scrollIntoViewIfNeeded();
    await expect(placeOrderModal, 'Place Order modal is not visible - clinical order cannot be placed').toBeVisible();
  }

  public async closeClinicalOrderModal(): Promise<void> {
    const button = this.page.locator(`//div[@class='modal-content']/div[@class='modal-footer']//button[normalize-space(text())='Close']`);
    await expect(button, 'Clinical Order modal -> [Close] button is not visible').toBeVisible();
    await button.click();
  }

  public async submitClinicalOrder(): Promise<void> {
    const button = this.page.locator(`//div[@class='modal-content']/div[@class='modal-footer']//button[normalize-space(text())='Submit']`);
    await expect(button, 'Clinical Order modal -> [Submit] button is not visible').toBeVisible();
    await button.click();
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

  public async selectSampleCheckbox(sample: Locator): Promise<void> {
    const checkbox = sample.locator('//mat-checkbox');
    await checkbox.click();
  }

  public async getColumnDataForSample(sample: Locator, columnName: SequencingOrderColumn): Promise<string> {
    const columnIndex = await this.getColumnHeaderIndex(columnName);
    const cellContent = await sample.locator(`//td[${columnIndex}]`).textContent() as string;
    console.log(`Sequencing order tab - sample data under ${columnName} column: ${cellContent}`);
    return cellContent;
  }

  public async fillCollectionDateIfNeeded(normalSample: Locator): Promise<void> {
    const collectionDateColumnIndex = await this.getColumnHeaderIndex(SequencingOrderColumn.COLLECTION_DATE);
    const unfilledCollectionDateColumn = normalSample.locator(`//td[${collectionDateColumnIndex}]/app-field-datepicker//input`);
    if (await unfilledCollectionDateColumn.isVisible()) {
      await normalSample.locator(`//td[${collectionDateColumnIndex}]//button[normalize-space(text())='Today']`).click();

      //Assert that the correct date was inputted
      const today = getToday();
      const collectionDateInISOFormat = getDateinISOFormat(today);
      const collectionDateColumn = normalSample.locator(`//td[${collectionDateColumnIndex}]`);
      await expect(collectionDateColumn).toHaveText(collectionDateInISOFormat);
    }
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

  private async getColumnHeaderIndex(columnName: SequencingOrderColumn): Promise<number> {
    const precedingColumns = this.page.locator(`//th[normalize-space(text())='${columnName}']/preceding-sibling::th`);
    const columnIndex = await precedingColumns.count() + 1;
    console.log(`${columnName} is the ${columnIndex}th column`);
    return columnIndex;
  }
}
