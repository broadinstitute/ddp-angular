import { APIRequestContext, Download, expect, Locator, Page } from '@playwright/test';
import Modal from 'dsm/component/modal';
import { Navigation, Study } from 'dsm/navigation';
import { Label, FileFormat, TextFormat, Tab, DataFilter, CustomizeView, CustomizeViewID as ID, EnrollmentStatus} from 'dsm/enums';
import { WelcomePage } from 'dsm/pages/welcome-page';
import Checkbox from 'dss/component/checkbox';
import { isSubset, shuffle, waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { Filters } from 'dsm/component/filters/filters';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import { SortOrder } from 'dss/component/table';
import QuickFilters from 'dsm/component/filters/quick-filters';
import { getDate, offsetDaysFromToday } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';
import DsmPageBase from './dsm-page-base';
import * as user from 'data/fake-user.json';

export default class ParticipantListPage extends DsmPageBase {
  PAGE_TITLE = 'Participant List';
  private readonly _filters: Filters = new Filters(this.page);
  private readonly _quickFilters: QuickFilters = new QuickFilters(this.page);
  private readonly _table: ParticipantListTable = new ParticipantListTable(this.page);

  static async goto(page: Page, study: string, request: APIRequestContext): Promise<ParticipantListPage> {
    const welcomePage = new WelcomePage(page);
    await welcomePage.selectStudy(study);

    const navigation = new Navigation(page, request);
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantsTable = participantListPage.participantListTable;
    const rowsTotal = await participantsTable.rowLocator().count();
    expect(rowsTotal).toBeGreaterThanOrEqual(1); // Participant List table has loaded
    return participantListPage;
  }

  constructor(page: Page) {
    super(page);
  }

  get toLocator(): Locator {
    return this.page.locator('app-participant-list');
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

  public async assertBulkCohortTagDisplayed(): Promise<void> {
    const button = this.page.locator('//button[.//*[@tooltip="Bulk Cohort Tag"]]');
    await expect(button).toBeVisible();
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

    const saveModal = new Modal(this.page, this.toLocator);
    await expect(saveModal.toLocator).toBeVisible();
    expect(await saveModal.getHeader()).toBe('Please enter a name for your filter');
    await saveModal.getInput({ label: 'Filter Name' }).fill(viewName);
    await Promise.all([
      waitForResponse(this.page, {uri: '/ui/saveFilter'}),
      saveModal.getButton({ label: /Save Filter/ }).click()
    ]);
    await waitForNoSpinner(this.page);
  }

  public async assertDownloadListDisplayed(): Promise<void> {
    const button = this.page.locator('button').filter({has: this.page.locator('[data-icon="file-download"]')});
    await expect(button).toBeVisible();
  }

  /**
   * Click Download button to download participant list.
   * @param {{fileFormat?: FileFormat, textFormat?: TextFormat, includeCompletionOfActivity?: boolean, timeout?: number}} opts
   * @returns {Promise<Download>}
   */
  public async downloadParticipant(opts: {
      fileFormat?: FileFormat,
      textFormat?: TextFormat,
      includeCompletionOfActivity?: boolean,
      timeout?: number
    } = {}): Promise<Download> {
    const {
      fileFormat = FileFormat.XLSX,
      textFormat = TextFormat.HUMAN_READABLE,
      includeCompletionOfActivity = true,
      timeout = 3 * 60 * 1000
    } = opts;

    const button = this.page.locator('button').filter({has: this.page.locator('[data-icon="file-download"]')});
    await button.click();

    const modal = new Modal(this.page, this.toLocator);
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
    await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.PARTICIPANT_ID]);

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.text(Label.PARTICIPANT_ID, {textValue: participantGUID });
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
    await searchPanel.text(Label.SHORT_ID, { textValue: shortId });
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
        const filter = this.findPanel(viewName).locator('[data-icon="filter"]');
        await expect(filter).toBeEnabled();
        await filter.scrollIntoViewIfNeeded();
        await filter.click();
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
   * @param opts rgpMinimumFamilySize - the minimum number of family members the RGP study participant should have
   * @param opts uriString - the uri string to use when initially filtering for participants. Defaults to '/ui/applyFilter'
   * @param opts prefix - the prefix or name of the test users to be used in the search e.g. E2E or KidFirst for playwright created participants. Defaults to 'E2E'
   * @param opts shouldHaveOncHistory - the returned participant should have onc history
   * @param opts shouldHave Kits - the returned participant should have kits (including any that are just in 'Waiting on GP' status (i.e. they're in Kits w/o Label))
   * @param opts cohortTags - a list of the the cohort tags the participant is expected to have
   * @returns A participant with the requested tab
   */
  async findParticipantWithTab(
    opts: {
      isPediatric?: boolean,
      tab?: Tab,
      shouldHaveOncHistory?: boolean,
      shouldHaveKits?: boolean,
      rgpProbandTab?: boolean,
      rgpMinimumFamilySize?: number,
      uri?: string,
      prefix?: string,
      cohortTags?: string[],
      enrollmentStatus?: EnrollmentStatus,
    }): Promise<string> {
    const {
      isPediatric = false,
      tab,
      shouldHaveOncHistory = false,
      shouldHaveKits = false,
      rgpProbandTab = false,
      rgpMinimumFamilySize = 1,
      uri = '/ui/applyFilter',
      prefix,
      cohortTags = [],
      enrollmentStatus = EnrollmentStatus.ENROLLED,
    } = opts;
    const expectedTabs: Tab[] = [
      Tab.ONC_HISTORY,
      Tab.MEDICAL_RECORD,
      Tab.SAMPLE_INFORMATION,
      Tab.SHARED_LEARNINGS,
    ];

    if (!expectedTabs.includes(tab as Tab) && !rgpProbandTab) {
      throw new Error(`Undefined actions for tab: "${tab}" and rgpProbandTab: "${rgpProbandTab}"`);
    }

    let testParticipantFirstName: string;
    if (prefix) {
      //If the automated participants for a study use a different prefix or name set-up than E2E, search for them using this info
      testParticipantFirstName = prefix;
    } else {
      testParticipantFirstName = isPediatric ? user.child.firstName : user.adult.firstName; //Make sure to return automated test pts only
    }

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    const filterResponse = await searchPanel.search({ uri });
    let responseJson = JSON.parse(await filterResponse.text());

    const endTime = Date.now() + 50 * 1000;
    let counter = 0; // num of participants being looked at
    while (counter <= 200) {
      for (const [index, value] of [...responseJson.participants].entries()) {
        counter++;
        let shortID = '';
        let firstName = value.esData.profile?.firstName;
        if (!firstName) {
          // must have a value for First Name
          continue;
        }
        firstName = JSON.stringify(firstName).replace(/['"]+/g, '');
        if (!firstName.includes(testParticipantFirstName)) {
          // must be PW test user
          continue;
        }

        const participantEnrollmentStatus = value.esData.status;
        if (participantEnrollmentStatus !== enrollmentStatus) {
          continue;
        }

        // The onc history tab will usually appear along with a medical record tab
        // Checking for the medical record tab allows catching those who do not yet have an onc history detail/row/data (but have the tab itself)
        if (tab === Tab.ONC_HISTORY || tab === Tab.MEDICAL_RECORD) {
          const medicalRecord = value.medicalRecords[0];
          const hasConsentedToTissue = value.esData.dsm.hasConsentedToTissueSample;
          if (!medicalRecord || !hasConsentedToTissue) {
            // Does not have a Medical Records tab or has not consented to tissue samples,
            continue;
          }

          const participantID = value.participant.participantId; //Make sure when searching for onc history that the participant has a participantId in ES
          if (medicalRecord && participantID) {
            if (cohortTags.length >= 1 || shouldHaveOncHistory || shouldHaveKits) {
              //Search for participants with specific cohort tags
              const tagArray = value.esData.dsm.cohortTag;
              if (!tagArray) {
                //If for some reason, the participant does not have any cohort tags, keep searching
                continue;
              }
              const currentParticipantTags: string[] = [];
              for (const [index, value] of [...tagArray].entries()) {
                currentParticipantTags.push(value.cohortTagName);
              }

              if (shouldHaveOncHistory) {
                const oncHistoryDetail = value.oncHistoryDetails;
                if (!oncHistoryDetail) {
                  continue; //skip to check if another participant has inputted onc history data instead
                }
              }

              if (shouldHaveKits) {
                const kitInformation = value.kits;
                if (!kitInformation || kitInformation[0] === undefined) {
                  continue; //skip to check if another participant has kits instead
                }
              }

              if (cohortTags && isSubset({ cohortTagGroup: currentParticipantTags, targetCohortTags: cohortTags })) {
                shortID = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
                console.log(`Participant ${shortID} has the tags [ ${cohortTags.join(', ')} ]`);
              }
            } else {
              shortID = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
            }
            return shortID;
          }
        }

        if (tab === Tab.SAMPLE_INFORMATION) {
          const kits = value.kits;
          if (!kits || kits[0] === undefined) {
            // Does not have kits and so will not have a Sample Information tab
            continue;
          }

          if (kits) {
            shortID = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
            logInfo(`Found participant with Short ID: ${shortID} to have tab: ${tab}`);
            return shortID;
          }
        }

        if (tab === Tab.SHARED_LEARNINGS) {
          const sharedLearnings = value.somaticResultUpload;
          const id = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
          console.log(`currently looking at ptp: ${id}`);
          if (!sharedLearnings || sharedLearnings[0] === undefined) {
            //Does not have a Return of Results uploaded or has them uploaded but does not have the Shared Learnings tab (due to testing)
            continue;
          }

          if (sharedLearnings) {
            shortID = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
            logInfo(`Found participant with Short ID: ${shortID} to have tab: ${tab}`);
            return shortID;
          }
        }

        if (rgpProbandTab) {
          // Data in participantData seems to mean there's a proband tab
          const participantData = value.participantData;
          if (!participantData || participantData[0] === undefined) {
            continue;
          }
          const familyMemberInfo = value.participantData;
          const numberOfFamilyMembers = familyMemberInfo.length;
          if (rgpMinimumFamilySize > 1 && numberOfFamilyMembers === 1) {
            continue; //Looking for a family that has more than 1 person in the study
          } else if (rgpMinimumFamilySize > 1 && numberOfFamilyMembers > 1) {
            //Use the family member added to the account after the proband
            shortID = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
            logInfo(`Found RGP participant with Short ID: ${shortID} to have proband tabs - has ${numberOfFamilyMembers} study participants`);
          } else if (rgpMinimumFamilySize === 1 && numberOfFamilyMembers === 1) {
            shortID = JSON.stringify(value.esData.profile.hruid).replace(/['"]+/g, '');
            logInfo(`Found RGP participant with Short ID: ${shortID} to have proband tabs - has 1 study participant`);
          }

          if (shortID) {
            //If shortID is truthy
            return shortID;
          }
        }
      } // end of for ...entries()

      // Get new /filterList response by go to the next page
      const hasNext = await this._table.paginator.hasNext();
      if (!hasNext || Date.now() > endTime) {
        break; // no more participants or exceeded max timeout
      }

      // continue with finding
      console.log(`Looking for: ${tab}`);
      const nextPageResponse = await this._table.nextPage();
      responseJson = JSON.parse(await nextPageResponse.text());
    } // end of while

    throw new Error(`Cannot find a participant with RGP Proband tab or ${tab} tab. (checked num of participants: ${counter})`);
  }

  //generalize this later
  async findParticipantWithSingleCohortTag(opts: { tagName: string }): Promise<string> {
    const { tagName } = opts;
    //Check that cohort tag column is already added to participant list - if it is not, add it
    const cohortTagColumnHeader = this.page.locator(`//th[normalize-space(text())='${Label.COHORT_TAG_NAME}']`);
    if (!await cohortTagColumnHeader.isVisible()) {
      const customizeViewPanel = this.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
      await expect(cohortTagColumnHeader).toBeVisible();
      await customizeViewPanel.close();
    }

    //Search for a participant that only has an 'OS PE-CGS' cohort tag (shows they registered + enrolled in OS2 only)
    const participantListTable = this.participantListTable;
    let amountOfParticipantsDisplayed = await participantListTable.rowsCount;

    let shortId = '';
    const endTime = Date.now() + 50 * 1000;

    while (shortId === '' && amountOfParticipantsDisplayed > 0) {
      for (let index = 0; index < amountOfParticipantsDisplayed; index++) {
        const info = await participantListTable.getParticipantDataAt(index, Label.COHORT_TAG_NAME);
        const infoArray = info.split(`\n\n`); //multiple cohort tags are split using this
        if (infoArray.length === 1 && infoArray[0] === tagName) {
          shortId = await participantListTable.getParticipantDataAt(index, Label.SHORT_ID);
          console.log(`Short id ${shortId} was found to only contain the cohort tag ${tagName}`);
          break;
        }
      }

      if (shortId === '') {
        // Get new /filterList response by go to the next page
        const hasNext = await this._table.paginator.hasNext();
        if (!hasNext || Date.now() > endTime) {
          throw new Error(`No participants with only the cohort tag ${tagName} were found`);
        }
        await participantListTable.nextPage();
        amountOfParticipantsDisplayed = await participantListTable.rowsCount;
        }
    }

    //Return participant
    return shortId;
  }

  async findParticipantForKitUpload(
    opts: {
      allowNewYorkerOrCanadian: boolean,
      firstNameSubstring?: string,
      hasContactInfomationColumn?: boolean
    }): Promise<number> {
    const { allowNewYorkerOrCanadian = false, firstNameSubstring, hasContactInfomationColumn = false } = opts;

    // Match data in First Name, Valid , Location and Collaborator Sample ID columns. If no match, returns -1.
    const compareForMatch = async (index: number): Promise<number> => {
      const fname = await participantListTable.getTextAt(index, Label.FIRST_NAME);
      const normalCollaboratorSampleID = await participantListTable.getTextAt(index, Label.NORMAL_COLLABORATOR_SAMPLE_ID);

      let isAddressValid = '';
      let country = '';
      let state = '';

      let matchFirstName = true;
      if (firstNameSubstring) {
        matchFirstName = fname.indexOf(firstNameSubstring) !== -1;
      }

      if (hasContactInfomationColumn) {
        //Clinical studies (and some research studies) have the Contact Information Tab column group where the below info is retreived from
        [isAddressValid] = await participantListTable.getTextAt(index, Label.VALID);
        [country] = await participantListTable.getTextAt(index, Label.COUNTRY);
        [state] = await participantListTable.getTextAt(index, Label.STATE);
        logInfo(`Allow NY or Canadians: ${allowNewYorkerOrCanadian}`);
        logInfo(`PT info - country: ${country}, state: ${state}, valid: ${isAddressValid}`);

        if (matchFirstName && normalCollaboratorSampleID.length <= 5 && isAddressValid.toLowerCase().trim() === 'true') {
          return index;
        }
      } else {
        //Not all CMI research studies have a Contact Information column group - will use Medical Release form to retreive address instead
        //TODO use methods from PR#2368 to check the medical release form information in order to later add MPC/Prostate checking (Pancan is added)
      }
      if (!allowNewYorkerOrCanadian && (country === 'CA' || (country === 'US' && state === 'NY'))) {
        return -1;
      }

      return -1;
    };

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
    await searchPanel.search();

    const participantListTable = this.participantListTable;
    await expect(participantListTable.rowLocator().first()).toBeVisible();

    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.REGISTRATION_DATE]);
    await customizeViewPanel.selectColumns(CustomizeView.SAMPLE, [Label.NORMAL_COLLABORATOR_SAMPLE_ID]);

    if (hasContactInfomationColumn) {
      await customizeViewPanel.selectColumns(CustomizeView.CONTACT_INFORMATION, [Label.VALID]);
      await customizeViewPanel.selectColumns(CustomizeView.CONTACT_INFORMATION, [Label.COUNTRY, Label.STATE]);
    } else {
      await customizeViewPanel.selectColumnsByID(
        CustomizeView.MEDICAL_RELEASE_FORM,
        [Label.YOUR_CONTACT_INFORMATION_MEDICAL_RELEASE],
        ID.MEDICAL_RELEASE_FORM_GENERAL
      );
    }
    await customizeViewPanel.close();

    expect(participantListTable.getHeaderIndex(Label.REGISTRATION_DATE)).not.toBe(-1);
    expect(participantListTable.getHeaderIndex(Label.NORMAL_COLLABORATOR_SAMPLE_ID)).not.toBe(-1);

    if (hasContactInfomationColumn) {
      expect(participantListTable.getHeaderIndex(Label.VALID)).not.toBe(-1);
    } else {
      expect(participantListTable.getHeaderIndex(Label.YOUR_CONTACT_INFORMATION)).not.toBe(-1);
    }

    await expect(participantListTable.rowLocator().first()).toBeVisible();

    let participantsCount = await participantListTable.rowsCount;
    expect(participantsCount).toBeGreaterThanOrEqual(1);

    // Sort by Registration Date to pick newest participants
    await participantListTable.sort(Label.REGISTRATION_DATE, SortOrder.ASC);
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

  //TODO Generalize this later
  async useSearchToFindConsentParticipantFor(opts: { columnGroup: CustomizeView, columnName: Label, value: string }): Promise<string> {
    const { columnGroup, columnName, value } = opts;

    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(columnGroup, [columnName], { nth: 0 });
    await customizeViewPanel.close();

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
    await searchPanel.checkboxes(columnName, { checkboxValues: [value] });
    await searchPanel.search();

    const participantListTable = this.participantListTable;
    const amountOfReturnedParticipants = await participantListTable.rowsCount;
    expect(amountOfReturnedParticipants, `No enrolled participants found who selected: ${columnName} -> ${value}`).toBeGreaterThanOrEqual(1);

    const [shortID] = await participantListTable.getTextAt(0, Label.SHORT_ID);
    expect(shortID).toBeTruthy();
    return shortID;
  }

  async findParticipantFor(columnGroup: string, columnName: Label, opts: {value?: string, nth?: number} = {}): Promise<number> {
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
    await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
    await searchPanel.search();

    const participantListTable = this.participantListTable;
    await expect(participantListTable.rowLocator().first()).toBeVisible();

    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(columnGroup, [columnName], {nth});
    await customizeViewPanel.close();

    let participantsCount = await participantListTable.rowsCount;
    expect(participantsCount).toBeGreaterThanOrEqual(1);

    const endTime = Date.now() + 50 * 1000;
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
      await customizeViewPanel.deselectColumns(CustomizeView.PARTICIPANT_INFO, [Label.FIRST_NAME]);
      await expect(this.participantListTable.getHeaderByName(Label.FIRST_NAME)).not.toBeVisible();
    }
    // Add columns to be used to help find the most recent automated participant
    await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.PARTICIPANT_ID, Label.REGISTRATION_DATE, Label.FIRST_NAME]);
    await customizeViewPanel.close();

    //First filter the participant list to only show participants registered within the past two weeks
    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    const today = getDate(new Date());
    const previousWeek = offsetDaysFromToday(2 * 7);
    await searchPanel.dates(Label.REGISTRATION_DATE, { from: previousWeek, to: today, additionalFilters: [DataFilter.RANGE] });

    //Also make sure to conduct the search for participants with the given first name of the automated participant
    await searchPanel.text(Label.FIRST_NAME, { textValue: participantName });
    await searchPanel.search();

    //Get the first returned participant to use for testing - and verify at least one participant is returned
    const numberOfParticipants = await this.participantListTable.rowsCount;
    expect(numberOfParticipants, `No recent test participants were found with the given first name: ${participantName}`).toBeGreaterThanOrEqual(1);
    return this.participantListTable.getCellDataForColumn(Label.PARTICIPANT_ID, 1);
  }
}
