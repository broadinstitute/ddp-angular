import { Locator, Page, expect } from '@playwright/test';
import { StudyName } from 'dsm/navigation';
import Checkbox from 'dss/component/checkbox';
import { CustomizeView as ColumnGroup, Label } from 'dsm/enums';
import { COLUMN } from 'dsm/pages/mailing-list-page';

export class CustomizeView {
  private activeColumnsGroup = '';
  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    const isOpen = await this.isPanelOpen();
    if (!isOpen) {
      await this.page.locator(this.openButtonXPath).click();
    }
  }

  public async close(): Promise<void> {
    const isOpen = await this.isPanelOpen();
    if (isOpen) {
      await this.page.locator(this.openButtonXPath).click();
    }
  }

  public async selectColumns(columnsGroupName: string, columns: string[], opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup({nth});
    await this.select(columns);
    await this.closeColumnsGroup();
  }

  public async selectColumnsByID(columnsGroupName: string, columns: string[], id: string, opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup({nth});
    for (const column of columns) {
      const columnOption = this.page.locator(`//ul[@id='${id}']//mat-checkbox[contains(.,'${column}')]`);
      await columnOption.scrollIntoViewIfNeeded();
      await columnOption.click({ force: true });
    }
    await this.closeColumnsGroup();
  }

  public async deselectColumns(columnsGroupName: string, columns: string[], opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup({nth});
    await this.select(columns, true);
    await this.closeColumnsGroup();
  }

  private async select(columns: string[], deselect = false): Promise<void> {
    for (const column of columns) { await this.selectOrDeselect(column, deselect); }
  }

  private async selectOrDeselect(columnName: string, deselect = false): Promise<void> {
    const checkbox = this.columnCheckbox(columnName);
    deselect ? await checkbox.uncheck() : await checkbox.check();
  }

  private async openColumnsGroup(opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    const columnsGroupButton = this.columnsGroupButton({nth});
    const expanded = await this.isExpanded(columnsGroupButton);
    if (!expanded) {
      await columnsGroupButton.focus();
      await columnsGroupButton.click();
    }
  }

  private async closeColumnsGroup(opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    const columnsGroupButton = this.columnsGroupButton({nth});
    const expanded = await this.isExpanded(columnsGroupButton);
    if (expanded) {
      await columnsGroupButton.focus();
      await columnsGroupButton.click();
    }
  }

  public async isColumnVisible(columns: string[] | ColumnGroup[]): Promise<boolean> {
    for (const column of columns) {
      console.log(`Checking for column group: ${column}`);
      const customizeViewColumn = this.page.getByRole('button', { name: column});
      try {
        await expect(customizeViewColumn.first()).toBeVisible({timeout: 5000});
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public async assertAllCustomizeViewColumnsDisplayedFor(opts: { studyName: StudyName }): Promise<void> {
    const { studyName } = opts;
    const studyColumnGroups: ColumnGroup[] = [];

    //Put in columns that most studies have
    if (this.isCMIStudy(studyName)) {
      //CMI studies usually have all the below columns
      studyColumnGroups.push(ColumnGroup.PARTICIPANT);
      studyColumnGroups.push(ColumnGroup.PARTICIPANT_DSM);
      studyColumnGroups.push(ColumnGroup.MEDICAL_RECORD);
      studyColumnGroups.push(ColumnGroup.ONC_HISTORY);
      studyColumnGroups.push(ColumnGroup.TISSUE);
      studyColumnGroups.push(ColumnGroup.SAMPLE);
      studyColumnGroups.push(ColumnGroup.COHORT_TAGS);
    } else {
      //These columns appear to be in all studies (that have a participant list) in DSM
      studyColumnGroups.push(ColumnGroup.PARTICIPANT);
      studyColumnGroups.push(ColumnGroup.PARTICIPANT_DSM);
      studyColumnGroups.push(ColumnGroup.COHORT_TAGS);
    }

    //Get all of the column groups set for a study - need to make sure parental consent stuff is considered
    switch (studyName) {
      case StudyName.OSTEO2:
        studyColumnGroups.push(ColumnGroup.CLINICAL_ORDERS);
        studyColumnGroups.push(ColumnGroup.SURVEY_YOUR_CHILDS_OSTEOSARCOMA);
        studyColumnGroups.push(ColumnGroup.ADDITIONAL_ASSENT_LEARNING_CHILD_DNA_WITH_INVITAE);
        studyColumnGroups.push(ColumnGroup.BIOLOGICAL_PARENT_FEMALE);
        studyColumnGroups.push(ColumnGroup.RESEARCH_CONSENT_FORM);
        studyColumnGroups.push(ColumnGroup.LOVED_ONE_SURVEY);
        studyColumnGroups.push(ColumnGroup.RESEARCH_CONSENT_ASSENT_FORM);
        studyColumnGroups.push(ColumnGroup.BIOLOGICAL_PARENT_MALE);
        studyColumnGroups.push(ColumnGroup.WHAT_WE_LEARNED_FROM_SOMATIC_DNA);
        studyColumnGroups.push(ColumnGroup.HALF_SIBLING);
        studyColumnGroups.push(ColumnGroup.ADDITIONAL_CONSENT_LEARNING_DNA_WITH_INVITAE);
        studyColumnGroups.push(ColumnGroup.PROVIDE_CONTACT_INFORMATION);
        studyColumnGroups.push(ColumnGroup.CHILD);
        studyColumnGroups.push(ColumnGroup.MEDICAL_RELEASE_FORM);
        studyColumnGroups.push(ColumnGroup.ADD_CHILD_PARTICIPANT);
        studyColumnGroups.push(ColumnGroup.SURVEY_FAMILY_HISTORY_OF_CANCER);
        studyColumnGroups.push(ColumnGroup.PREQUALIFIER_SURVEY);
        studyColumnGroups.push(ColumnGroup.SURVEY_YOUR_CHILDS_OR_YOUR_OSTEOSARCOMA);
        studyColumnGroups.push(ColumnGroup.GRANDPARENT);
        studyColumnGroups.push(ColumnGroup.ADDITIONAL_CONSENT_ASSENT_LEARNING_ABOUT_CHILD_TUMOR);
        studyColumnGroups.push(ColumnGroup.SIBLING);
        studyColumnGroups.push(ColumnGroup.PARENT_SIBLING);
        studyColumnGroups.push(ColumnGroup.ADDITIONAL_CONSENT_LEARNING_ABOUT_TUMOR);
        studyColumnGroups.push(ColumnGroup.SURVEY_ABOUT_YOU_OR_YOUR_CHILD);
        studyColumnGroups.push(ColumnGroup.INVITAE);
        studyColumnGroups.push(ColumnGroup.PROXY);
        studyColumnGroups.push(ColumnGroup.INVITATION);
        studyColumnGroups.push(ColumnGroup.CONTACT_INFORMATION);
        break;
      default:
        throw new Error(`Expected column group names for ${studyName} are not setup/known`);
        break;
    }

    //Check each column group to make sure all column options are present
    for (const columnGroup of studyColumnGroups) {
      await this.assertColumnGroupAndAllColumnOptionsAreAvailable(columnGroup, studyName);
    }
  }

  public async assertColumnGroupAndAllColumnOptionsAreAvailable(group: ColumnGroup, study: StudyName): Promise<void> {
    const columnGroupButton = this.page.getByRole('button', { name: group}).first();
    await columnGroupButton.click(); //opening group
    const columnOptions = this.getColumnsInColumnGroup({ columnGroup: group, studyName: study});
    for (const option of columnOptions) {
      console.log(`Checking: ${group} \t->\t ${option}`);
      const participantColumnOption = this.page.locator(
        `//button[.//text()[normalize-space()='${group}']]/following-sibling::ul//mat-checkbox[.//text()[normalize-space()='${option}']]`
      );
      await expect(participantColumnOption, `Option ${option} is not visible in column group ${group}`).toBeVisible();
    }
    await columnGroupButton.click() //closing group
  }

  private isCMIStudy(studyName: StudyName): boolean {
    let isCMI;
    switch (studyName) {
      case StudyName.ANGIO:
      case StudyName.BRAIN:
      case StudyName.ESC:
      case StudyName.LMS:
      case StudyName.MBC:
      case StudyName.OSTEO:
      case StudyName.OSTEO2:
      case StudyName.PANCAN:
      case StudyName.PROSTATE:
        isCMI = true;
        break;
      default:
        isCMI = false;
        break;
    }
    return isCMI;
  }

  private async isChecked(locator: Locator | undefined): Promise<boolean> {
    const isChecked = (await locator?.getAttribute('class'))?.includes('mat-checkbox-checked');
    return isChecked || false;
  }

  private async isExpanded(locator: Locator | undefined): Promise<boolean> {
    const isExpanded = await locator?.getAttribute('aria-expanded');
    return isExpanded === 'true' || false;
  }

  //Later check for expected differences between permissions for viewing column options / column groups - currently assumes able to view all columns
  private getColumnsInColumnGroup(opts: { columnGroup: ColumnGroup, studyName: StudyName }): Label[] {
    const { columnGroup, studyName } = opts;
    const columnOptions: Label[] = [];

    switch (columnGroup) {
      case ColumnGroup.PARTICIPANT:
        columnOptions.push(Label.COUNTRY);
        columnOptions.push(Label.DATE_OF_BIRTH);
        columnOptions.push(Label.DDP);
        columnOptions.push(Label.DO_NOT_CONTACT);
        columnOptions.push(Label.EMAIL);
        columnOptions.push(Label.FILE_UPLOAD_TIME);
        columnOptions.push(Label.FIRST_NAME);
        columnOptions.push(Label.LAST_NAME);
        columnOptions.push(Label.PARTICIPANT_ID);
        columnOptions.push(Label.REGISTRATION_DATE);
        columnOptions.push(Label.SHORT_ID);
        columnOptions.push(Label.UPLOADED_FILE_NAME);
        columnOptions.push(Label.STATUS);

        if (this.isPediatricStudy(studyName)) {
          columnOptions.push(Label.DATE_OF_MAJORITY);
        }

        if (this.hasLegacyParticipantID(studyName)) {
          columnOptions.push(Label.LEGACY_PARTICIPANT_ID);
          columnOptions.push(Label.LEGACY_SHORT_ID);
        }
        break;
      case ColumnGroup.PARTICIPANT_DSM:
        //stuff here
        break;
      case ColumnGroup.MEDICAL_RECORD:
        //stuff here
        break;
      default:
        throw new Error(`Expected column options for the ${columnGroup} are not known / setup in this method`);
        break;
    }
    return columnOptions;
  }

  private isPediatricStudy(studyName: StudyName): boolean {
    let isPediatric;
    switch (studyName) {
      case StudyName.BRAIN:
      case StudyName.LMS:
      case StudyName.OSTEO2:
      case StudyName.PANCAN:
        isPediatric = true;
        break;
      default:
        isPediatric = false;
        break;
    }
    return isPediatric;
  }

  private hasLegacyParticipantID(studyName: StudyName): boolean {
    let hasLegacy;
    switch (studyName) {
      case StudyName.ANGIO:
      case StudyName.AT:
      case StudyName.BRAIN:
      case StudyName.OSTEO:
      case StudyName.MBC:
      case StudyName.ESC:
      case StudyName.RGP:
      case StudyName.PROSTATE:
        hasLegacy = true;
        break
      default:
        hasLegacy = false;
        break;
    }
    return hasLegacy;
  }

  /* Locators */

  private columnsGroupButton(opts: { nth?: number } = {}): Locator {
    const { nth = 0 } = opts;
    return this.page.locator(`${this.columnsGroupXPath}/button`).nth(nth);
  }

  /* XPaths */
  private get openButtonXPath(): string {
    return `xpath=//*[text()[normalize-space()="Customize View"]]/button`;
  }

  private async isPanelOpen(): Promise<boolean> {
    return await this.page.locator('.btn-group').count() >= 1;
  }

  private get columnsGroupXPath(): string {
    return `xpath=//div[button[@data-toggle="dropdown" and normalize-space()="${this.activeColumnsGroup}"]]`
  }

  private columnCheckbox(columnName: string): Checkbox {
    return new Checkbox(this.page, { root: this.columnsGroupXPath, label: columnName, exactMatch: true });
  }
}
