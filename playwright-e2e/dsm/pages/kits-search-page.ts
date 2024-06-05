import { expect, Locator, Page } from '@playwright/test';
import DatePicker from 'dsm/component/date-picker';
import Select from 'dss/component/select';
import Table from 'dss/component/table';
import { studyShortName, waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import KitsPageBase from 'dsm/pages/kits-page-base';
import { KitType, Label } from 'dsm/enums';
import { StudyName } from 'dsm/navigation';
import { logInfo } from 'utils/log-utils';

export enum SearchByField {
  SHORT_ID = 'Short ID',
  TRACKING_NUMBER = 'Tracking Number (Blood kit return)',
  MANUFACTURE_BARCODE = 'Manufacturer Barcode'
}

export default class KitsSearchPage extends KitsPageBase {
  PAGE_TITLE = 'Kit Search';
  TABLE_HEADERS = [
    Label.DDP_REALM,
    Label.SHORT_ID,
    Label.COLLABORATOR_PARTICIPANT_ID,
    Label.COLLABORATOR_SAMPLE_ID,
    Label.SHIPPING_ID,
    Label.MF_CODE,
    Label.TYPE,
    Label.SENT,
    Label.RECEIVED,
    Label.COLLECTION_DATE
  ];

  constructor(page: Page) {
    super(page);
  }

  get toLocator(): Locator {
    return this.page.locator('app-shipping-search');
  }

  public async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.searchByFieldSelect.toLocator()).toBeVisible();
  }

  async searchByField(searchField: SearchByField, value: string): Promise<Table | void> {
    await this.searchByFieldSelect.selectOption(searchField);
    const locator = this.page.locator('//div[button[normalize-space()="Search Kit"]]');
    await locator.locator('//input').fill(value);
    await Promise.all([
      waitForResponse(this.page, {uri: '/ui/searchKit'}),
      locator.locator('//button').click()
    ]);
    await waitForNoSpinner(this.page);

    const numberOfKits = await this.getNumberOfKits();
    const table = new Table(this.page);
    if (numberOfKits === 0) {
      const noKitsFoundMessage = this.page.locator(`//app-shipping-search//h3[normalize-space(text())='Kit was not found.']`);
      await expect(noKitsFoundMessage).toBeVisible(); //no table in the page, so return nothing
    } else {
      await table.waitForReady();
    }
    return table;
  }

  get searchByFieldSelect(): Select {
    return new Select(this.page, { label: 'Search by Field', root: 'app-shipping-search' });
  }

  async pickEndDate(opts: { yyyy?: number, month?: number, dayOfMonth?: number } = {}): Promise<string> {
    const { yyyy, month, dayOfMonth } = opts;
    return new DatePicker(this.page, { nth: 1 }).pickDate({ yyyy, month, dayOfMonth });
  }

  async getKitCollectionDate(opts: {rowIndex?: number}): Promise<string> {
    const { rowIndex = 1 } = opts;
    const collectionDateField = this.page.locator(`//app-field-datepicker//input[${rowIndex}]`);
    return (await collectionDateField.inputValue()).trim();
  }

  async setKitCollectionDate(opts: { dateField: Locator, collectionDate?: string, useTodayDate?: boolean }): Promise<void> {
    const { dateField, collectionDate = '', useTodayDate = true} = opts;
    //Input the date
    if (useTodayDate) {
      const todayButton = dateField.locator(`//ancestor::app-field-datepicker//button[normalize-space()='Today']`);
      await expect(todayButton).toBeVisible();
      await todayButton.click();
    } else {
      await dateField.pressSequentially(collectionDate);
    }
    //Save the date
    const saveDateButton = dateField.locator(`//ancestor::app-field-datepicker//button[normalize-space()='Save Date']`);
    await expect(saveDateButton).toBeVisible();
    await saveDateButton.click();
  }

  public async estimateNextKitCollaboratorSampleID(opts: { participantShortID: string, kitType: KitType, studyName: StudyName }): Promise<string> {
    const { participantShortID, kitType, studyName } = opts;
    const studyInfo = studyShortName(studyName);
    const sampleIDPrefix = studyInfo.collaboratorPrefix;
    //e.g. Project_ABCDEF_SALIVA - is an example of a base collaborator sample id
    let nextCollaboratorSampleID = `${sampleIDPrefix}_${participantShortID}_${kitType}`;

    await this.searchByField(SearchByField.SHORT_ID, participantShortID);
    const numberOfKits = await this.getNumberOfKits();
    logInfo(`Kits Search Page - Spotted number of kits for ${participantShortID}: ${numberOfKits}`);
    let currentNumberOfSpecifiedKitType = 0;
    const typeHeaderIndex = this.TABLE_HEADERS.indexOf(Label.TYPE) + 1;

    for (let index = 1; index <= numberOfKits; index++) {
      const currentKit = this.page.locator(`(//app-shipping-search//table//tbody//tr//td[${typeHeaderIndex}])[${index}]`);
      const currentKitType = await currentKit.innerText();
      if (currentKitType === kitType) {
        currentNumberOfSpecifiedKitType++;
      }
    }

    if (currentNumberOfSpecifiedKitType >= 1) {
      //e.g. Project_ABCDEF_SALIVA_2 if the participant currently has just 1 saliva kit
      nextCollaboratorSampleID = `${sampleIDPrefix}_${participantShortID}_${kitType}_${currentNumberOfSpecifiedKitType + 1}`;
    }

    return nextCollaboratorSampleID;
  }

  public async getKitInformationFrom(opts: { column: Label }): Promise<string[]> {
    const { column } = opts;
    const columnInformation: string[] = [];
    //Check that the given label is one of the known table headers
    if (!this.TABLE_HEADERS.includes(column)) {
      throw new Error(`Column ${column} is not present in the Kit Search page`);
    }

    //Check if there are actually kits to retreive information from
    const numberOfKits = await this.getNumberOfKits();
    if (numberOfKits === 0) {
      console.log('Participant does not have any kits');
      //Verify notification message "Kit was not found." is displayed
      const noKitsFoundMessage = this.page.locator(`//app-shipping-search//h3[normalize-space(text())='Kit was not found.']`);
      await expect(noKitsFoundMessage).toBeVisible();
    } else {
      const columnIndex = this.TABLE_HEADERS.indexOf(column) + 1;
      for (let rowIndex = 1; rowIndex <= numberOfKits; rowIndex++) {
        const tableCell = this.page.locator(`(//app-shipping-search//tbody//td[${columnIndex}])[${rowIndex}]`);
        const cellText = await tableCell.innerText();
        columnInformation.push(cellText);
      }
    }
    return columnInformation;
  }

  public async checkForAbsenceOfKitInformationInColumn(opts: { column: Label, kitInformation: string[] }): Promise<void> {
    const { column, kitInformation } = opts;

    //Check that the given label is one of the known table headers
    if (!this.TABLE_HEADERS.includes(column)) {
      throw new Error(`Column ${column} is not present in the Kit Search page`);
    }
    const columnIndex = this.TABLE_HEADERS.indexOf(column) + 1;
    for (let index = 0; index < kitInformation.length; index++) {
      const information = kitInformation[index];
      logInfo(`Checking to see if column ${column} contains: ${information}`);
      const tableCell = this.page.locator(`//app-shipping-search//tbody//td[normalize-space(text())='${information}']`);
      await expect(tableCell).toHaveCount(0);
    }
  }

  private async getNumberOfKits(): Promise<number> {
    return this.page.locator(`//app-shipping-search//table//tbody//tr`).count();
  }
}
