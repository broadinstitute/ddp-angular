import { APIRequestContext, Download, expect, Locator, Page } from '@playwright/test';
import Modal from 'dsm/component/modal';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { FileFormatEnum, TextFormatEnum } from 'dsm/pages/participant-page/enums/download-format-enum';
import { WelcomePage } from 'dsm/pages/welcome-page';
import Checkbox from 'dss/component/checkbox';
import { shuffle, waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { Filters } from 'dsm/component/filters/filters';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import { SortOrder } from 'dss/component/table';
import QuickFilters from 'dsm/component/filters/quick-filters';
import { getDate, offsetDaysFromToday } from 'utils/date-utils';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { logInfo } from 'utils/log-utils';
import DsmPageBase from './dsm-page-base';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import * as user from 'data/fake-user.json';

export default class ParticipantListPage extends DsmPageBase {
  private readonly PAGE_TITLE: string = 'Participant List';
  private readonly _filters: Filters = new Filters(this.page);
  private readonly _quickFilters: QuickFilters = new QuickFilters(this.page);
  private readonly _table: ParticipantListTable = new ParticipantListTable(this.page);

  static async goto(page: Page, study: string, request: APIRequestContext): Promise<ParticipantListPage> {
    const welcomePage = new WelcomePage(page);
    await welcomePage.selectStudy(study);

    const navigation = new Navigation(page, request);
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantsTable = participantListPage.participantListTable;
    const rowsTotal = await participantsTable.rowLocator().count();
    expect(rowsTotal).toBeGreaterThanOrEqual(1); // Participant List table has loaded
    return participantListPage;
  }

  constructor(page: Page) {
    super(page);
  }

  public async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('h1')).toHaveText(this.PAGE_TITLE);
    await expect(this.page.locator(this.filters.searchPanel.openButtonXPath)).toBeVisible();
    await waitForNoSpinner(this.page);
  }

  public async selectAll(): Promise<void> {
    const checkbox = new Checkbox(this.page, { label: 'Select all', root: '//*'});
    await checkbox.check({ timeout: 30 * 1000 }); // long delay
  }

  public async addBulkCohortTags(): Promise<void> {
    await this.page.locator('//button[.//*[@tooltip="Bulk Cohort Tag"]]').click();
  }

  public get filters(): Filters {
    return this._filters;
  }

  public get quickFilters(): QuickFilters {
    return this._quickFilters;
  }

  public get participantListTable(): ParticipantListTable {
    return this._table;
  }

  public async participantsCount(): Promise<number> {
    return await this.tableRowsLocator.count();
  }

  /* assertions */

  public async assertParticipantsCountGreaterOrEqual(count: number): Promise<void> {
    expect(await this.participantsCount(),
      `Participant List page - Displayed participants count is not greater or equal to ${count}`)
      .toBeGreaterThanOrEqual(count);
  }

  public async assertParticipantsCount(count: number) {
    await expect(this.tableRowsLocator,
      `Participant List page - Displayed participants count is not  ${count}`)
      .toHaveCount(count);
  }

  public async reloadWithDefaultFilter(): Promise<void> {
    await this.page.locator('button').filter({ has: this.page.locator('[data-icon="sync-alt"]')}).click();
    await waitForNoSpinner(this.page);
  }

  public async saveCurrentView(viewName: string): Promise<void> {
    const saveButton = this.page.locator('button').filter({ has: this.page.locator('[data-icon="save"]')});
    await saveButton.click();

    const saveModal = new Modal(this.page);
    await expect(saveModal.toLocator()).toBeVisible();
    expect(await saveModal.getHeader()).toBe('Please enter a name for your filter');
    await saveModal.getInput({ label: 'Filter Name' }).fill(viewName);
    await Promise.all([
      waitForResponse(this.page, {uri: '/ui/saveFilter'}),
      saveModal.getButton({ label: /Save Filter/ }).click()
    ]);
    await waitForNoSpinner(this.page);
  }

  /**
   * Click Download button to download participant list.
   * @param {{fileFormat?: FileFormatEnum, textFormat?: TextFormatEnum, includeCompletionOfActivity?: boolean, timeout?: number}} opts
   * @returns {Promise<Download>}
   */
  public async downloadParticipant(opts: {
      fileFormat?: FileFormatEnum,
      textFormat?: TextFormatEnum,
      includeCompletionOfActivity?: boolean,
      timeout?: number
    } = {}): Promise<Download> {
    const {
      fileFormat = FileFormatEnum.XLSX,
      textFormat = TextFormatEnum.HUMAN_READABLE,
      includeCompletionOfActivity = true,
      timeout = 3 * 60 * 1000
    } = opts;

    const button = this.page.locator('button').filter({has: this.page.locator('[data-icon="file-download"]')});
    await button.click();

    const modal = new Modal(this.page);
    await expect(modal.headerLocator()).toHaveText('Configure export');

    const fileFormatRadio = modal.getRadiobutton(new RegExp('File format:'));
    await fileFormatRadio.check(fileFormat);

    const textFormatRadio = modal.getRadiobutton(new RegExp('Option text format:'));
    await textFormatRadio.check(textFormat);

    const booleanText = includeCompletionOfActivity ? 'Yes' : 'No';
    const includeAllCompletionOfActivityRadio = modal.getRadiobutton(new RegExp('Include all completions of an activity:'));
    await includeAllCompletionOfActivityRadio.check(booleanText);

    // exporting participant list may take several minutes
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout }),
      modal.getButton({ label: 'Download' }).click()
    ]);
    return download;
  }

  /**
   * Filters the participant list to search for a specific participant when given their guid
   * @param participantGUID the guid of the specific participant to search for
   */
  public async filterListByParticipantGUID(participantGUID: string): Promise<void> {
    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.text('Participant ID', {textValue: participantGUID });
    await searchPanel.search();
  }

  public async filterListByShortId(shortId: string, opts: { resultsCount?: number } = {}): Promise<void> {
    if (!shortId) {
      throw new Error('shortId cannot be null');
    }
    const { resultsCount = 1 } = opts;
    const participantsTable = this.participantListTable;
    await this.waitForReady();

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.text('Short ID', { textValue: shortId });
    await searchPanel.search();

    await expect(participantsTable.footerLocator().first()).toBeVisible();
    expect(await participantsTable.rowsCount).toBe(resultsCount);
  }

  /* Locators */
  private get tableRowsLocator(): Locator {
    return this.page.locator('[role="row"]:not([mat-header-row]):not(mat-header-row), tbody tr');
  }

  public get savedFilters() {
    const page = this.page;
    return new class {
      public async open(viewName: string): Promise<void> {
        await this.openPanel();
        await this.findPanel(viewName).locator('span.clickable').click();
        await waitForNoSpinner(page);
      }

      public async delete(viewName: string): Promise<void> {
        await this.openPanel();
        await this.findPanel(viewName).locator('[data-icon="trash-alt"]').click();
        await waitForNoSpinner(page);
        await expect(this.findPanel(viewName)).toHaveCount(0);
      }

      public async exists(viewName: string): Promise<boolean> {
        return await this.findPanel(viewName).count() === 1;
      }

      findPanel(viewName: string | RegExp, options?: {exact?: boolean | undefined} | undefined): Locator {
        return page.locator('#savedFiltersPanel tr').filter({ has: page.getByText(viewName, options) });
      }

      findFilterButton(): Locator {
        return page.locator('button').filter({ has: page.locator('[data-icon="filter"]')});
      }

      async _isFilterPanelOpen(): Promise<boolean> {
        return await page.locator('#savedFiltersPanel').count() === 1;
      }

      async openPanel(): Promise<void> {
        if (!await this._isFilterPanelOpen()) {
          await this.findFilterButton().click();
        }
      }
    }
  }

  async showParticipantWithdrawnButton(): Promise<void> {
    const button = this.page.locator('button').filter({has: this.page.locator('[data-icon="quidditch"]')});
    await button.click();
    await waitForNoSpinner(this.page);
  }

  /**
   * Find a participant with the requested tab
   * @param opts findPediatricParticipant - determines if an adult or child participant should be returned
   * @param opts tab - the tab to be searched for e.g. onc history tab
   * @param opts rgpProbandTab - determines if a rgp proband tab is being searched for
   * @param opts uriString - the uri string to use when initially filtering for participants. Defaults to '/ui/applyFilter'
   * @param opts prefix - the prefix or name of the test users to be used in the search e.g. E2E or KidFirst for playwright created participants. Defaults to 'E2E'
   * @returns A participant with the requested tab
   */
  async findParticipantWithTab(
    opts: { findPediatricParticipant: boolean, tab?: TabEnum, rgpProbandTab?: boolean, uriString?: string, prefix?: string }
    ): Promise<string> {
    const { findPediatricParticipant = false, tab, rgpProbandTab = false, uriString = '/ui/applyFilter', prefix } = opts;
    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    const applyFilterResponse = await searchPanel.search({ uri: uriString });

    let foundShortID = '';
    let unformattedFirstName = '';
    let firstName = '';
    let testParticipantFirstName = '';

    if (prefix) {
      //If the automated participants for a study use a different prefix or name set-up than E2E, search for them using this info
      testParticipantFirstName = prefix;
    } else {
      testParticipantFirstName = findPediatricParticipant ? user.child.firstName : user.adult.firstName; //Make sure to return automated test pts only
    }

    let responseJson = JSON.parse(await applyFilterResponse.text());
    const amountOfParticipantsDisplayed = responseJson.participants.length;

    //Find a participant who currently has the specified tab
    while (!foundShortID) {
      for (const [index, value] of [...responseJson.participants].entries()) {
        //The onc history tab will usually appear along with a medical record tab
        //Checking for the medical record tab allows catching those who do not yet have an onc history detail/row/data (but have the tab itself)
        if (tab === TabEnum.ONC_HISTORY) {
          const medicalRecord = value.medicalRecords[0];
          const hasConsentedToTissue = value.esData.dsm.hasConsentedToTissueSample;
          if (medicalRecord === undefined || hasConsentedToTissue === false) {
            continue; //Participant does not have a Medical Record tab for some reason or has not consented to tissue samples (so tab should be there but no history should be entered), skip them
          }
          unformattedFirstName = JSON.stringify(value.esData.profile.firstName);
          firstName = unformattedFirstName.replace(/['"]+/g, ''); //Replace double quotes from JSON.stringify
          const participantID = value.participant.participantId; //Make sure when searching for onc history that the participant has a participantId in ES
          if (medicalRecord && participantID && (firstName.includes(testParticipantFirstName))) {
            foundShortID = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
            logInfo(`Found the participant ${foundShortID} to have an onc history tab`);
            break;
          }
        }

        if (rgpProbandTab) {
          //If the participant has participantData, this seems to mean there's a proband tab in the account
          const participantData = value.participantData[0];
          if (participantData === undefined) {
            continue; //Participant does not have a proband tab for some reason, skip them
          }
          unformattedFirstName = JSON.stringify(value.esData.profile.firstName);
          logInfo(`Unformatted first name of RGP participant: ${unformattedFirstName}`);
          if (!unformattedFirstName) {
            continue;
          }
          firstName = unformattedFirstName.replace(/['"]+/g, ''); //Replace double quotes from JSON.stringify
          if (participantData && (firstName === testParticipantFirstName)) {
            foundShortID = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
            logInfo(`Found the RGP participant ${foundShortID} to have a proband tab`);
            break;
          }
        }

        //Go to the next page if none of the participants in the current page are relevant
        if (index === (amountOfParticipantsDisplayed - 1)) {
          const hasNextPage = await this._table.paginator.hasNext();
          if (hasNextPage) {
            const [nextPageResponse] = await Promise.all([
              waitForResponse(this.page, {uri: 'ui/filterList'}),
              this._table.nextPage()
            ]);
            responseJson = JSON.parse(await nextPageResponse.text());
          } else {
            if (tab) {
              throw new Error(`Could not find a participant with the ${tab} tab`);
            }
            if (rgpProbandTab) {
              throw new Error(`Could not find a participant with the RGP Proband tab`);
            }
          }
        }
      }
    }
    return foundShortID;
  }

  async findParticipantForKitUpload(opts: { allowNewYorkerOrCanadian: boolean, firstNameSubstring?: string }): Promise<number> {
    const { allowNewYorkerOrCanadian = false, firstNameSubstring } = opts;
    const normalCollaboratorSampleIDColumn = 'Normal Collaborator Sample ID';
    const registrationDateColumn = 'Registration Date';
    const validColumn = 'Valid';
    const countryColumn = 'Country';
    const stateOfResidence = 'State';

    // Match data in First Name, Valid , Location and Collaborator Sample ID columns. If no match, returns -1.
    const compareForMatch = async (index: number): Promise<number> => {
      const fname = await participantListTable.getTextAt(index, 'First Name');
      const normalCollaboratorSampleID = await participantListTable.getTextAt(index, normalCollaboratorSampleIDColumn);
      const [isAddressValid] = await participantListTable.getTextAt(index, validColumn);
      const [country] = await participantListTable.getTextAt(index, countryColumn);
      const [state] = await participantListTable.getTextAt(index, stateOfResidence);
      logInfo(`Allow NY or Canadians: ${allowNewYorkerOrCanadian}`);
      logInfo(`PT info - country: ${country}, state: ${state}, valid: ${isAddressValid}`);

      let matchFirstName = true;
      if (firstNameSubstring) {
        matchFirstName = fname.indexOf(firstNameSubstring) !== -1;
      }
      if (!allowNewYorkerOrCanadian && (country === 'CA' || (country === 'US' && state === 'NY'))) {
        return -1;
      }
      if (matchFirstName && normalCollaboratorSampleID.length <= 5 && isAddressValid.toLowerCase().trim() === 'true') {
        return index;
      }
      return -1;
    };

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
    await searchPanel.search();

    const participantListTable = this.participantListTable;
    await expect(participantListTable.rowLocator().first()).toBeVisible();

    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns('Participant Columns', [registrationDateColumn]);
    await customizeViewPanel.selectColumns('Sample Columns', [normalCollaboratorSampleIDColumn]);
    await customizeViewPanel.selectColumns('Contact Information Columns', [validColumn]);
    await customizeViewPanel.selectColumns('Contact Information Columns', [countryColumn, stateOfResidence]);
    await customizeViewPanel.close();

    expect(participantListTable.getHeaderIndex(registrationDateColumn)).not.toBe(-1);
    expect(participantListTable.getHeaderIndex(normalCollaboratorSampleIDColumn)).not.toBe(-1);
    expect(participantListTable.getHeaderIndex(validColumn)).not.toBe(-1);
    await expect(participantListTable.rowLocator().first()).toBeVisible();

    let participantsCount = await participantListTable.rowsCount;
    expect(participantsCount).toBeGreaterThanOrEqual(1);

    // Sort by Registration Date to pick newest participants
    await participantListTable.sort(registrationDateColumn, SortOrder.ASC);
    const endTime = Date.now() + 90 * 1000;
    while (participantsCount > 0 && Date.now() < endTime) {
      let rowIndex = -1;
      // Iterate rows in random order
      const array = shuffle([...Array(participantsCount).keys()]);
      for (const index of array) {
        rowIndex = await compareForMatch(index);
        if (rowIndex !== -1) {
          return rowIndex;
        }
      }
      const hasNextPage = await participantListTable.paginator.hasNext();
      if (hasNextPage) {
        await participantListTable.nextPage();
        participantsCount = await participantListTable.rowsCount;
      } else {
        participantsCount = 0;
      }
    }
    throw new Error(`Failed to find a suitable participant for Kit Upload within max waiting time 90 seconds.`);
  }

  async findParticipantFor(columnGroup: string, columnName: string, opts: {value?: string, nth?: number} = {}): Promise<number> {
    const { value, nth = 0 } = opts;

    const compareForMatch = async (index: number): Promise<number> => {
      console.log('\n\n');
      const columnText = await participantListTable.getTextAt(index, columnName);
      if (value) {
        return columnText.some(text => text.trim().length > 0 && new RegExp(value, 'i').test(text.trim())) ? index : -1;
      }
      return columnText.length === 1 && columnText[0].trim().length === 0 ? index : -1;
    };

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
    await searchPanel.search();

    const participantListTable = this.participantListTable;
    await expect(participantListTable.rowLocator().first()).toBeVisible();

    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(columnGroup, [columnName], {nth});
    await customizeViewPanel.close();

    let participantsCount = await participantListTable.rowsCount;
    expect(participantsCount).toBeGreaterThanOrEqual(1);

    const endTime = Date.now() + 90 * 1000;
    while (participantsCount > 0 && Date.now() < endTime) {
      let rowIndex = -1;
      // Iterate rows in random order
      const array = shuffle([...Array(participantsCount).keys()]);
      for (const index of array) {
        rowIndex = await compareForMatch(index);
        if (rowIndex !== -1) {
          return rowIndex;
        }
      }
      // Next page in table
      const hasNextPage = await participantListTable.paginator.hasNext();
      if (hasNextPage) {
        await participantListTable.nextPage();
        participantsCount = await participantListTable.rowsCount;
      } else {
        participantsCount = 0;
      }
    }
    throw new Error(`Failed to find a suitable participant for ${columnGroup}: ${columnName} = "${value}" within max waiting time 90 seconds.`);
  }


  /**
    * Returns the guid of the most recently created playwright participant
    * @param isRGPStudy mark as true or false if this is being ran in RGP - parameter is only needed if method is ran in RGP study
    * @returns the guid of the most recently registered playwright participant
  */
  public async getGuidOfMostRecentAutomatedParticipant(participantName: string, isRGPStudy?: boolean): Promise<string> {
    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();

    // Only RGP has a default filter with a different First Name field (in Participant Info Columns) - make sure to deselect it before continuing
    // otherwise there will be 2 different First Name fields in the search section (and in the Participant List)
    if (isRGPStudy) {
      await customizeViewPanel.deselectColumns('Participant Info Columns', ['First Name']);
      await expect(this.participantListTable.getHeaderByName('First Name')).not.toBeVisible();
    }
    // Add columns to be used to help find the most recent automated participant
    await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID', 'Registration Date', 'First Name']);
    await customizeViewPanel.close();

    //First filter the participant list to only show participants registered within the past two weeks
    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    const today = getDate(new Date());
    const previousWeek = offsetDaysFromToday(2 * 7);
    await searchPanel.dates('Registration Date', { from: previousWeek, to: today, additionalFilters: [AdditionalFilter.RANGE] });

    //Also make sure to conduct the search for participants with the given first name of the automated participant
    await searchPanel.text('First Name', { textValue: participantName });
    await searchPanel.search();

    //Get the first returned participant to use for testing - and verify at least one participant is returned
    const numberOfParticipants = await this.participantListTable.rowsCount;
    expect(numberOfParticipants, `No recent test participants were found with the given first name: ${participantName}`).toBeGreaterThanOrEqual(1);
    return this.participantListTable.getCellDataForColumn('Participant ID', 1);
  }
}
