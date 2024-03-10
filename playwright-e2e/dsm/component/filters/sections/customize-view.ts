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
    const duplicateColumnGroups: ColumnGroup[] = [];
    let columnGroupInstance = 0;

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

    //Get all of the column groups set for a study - need to make sure parental consent stuff is considered (its column group shares a name with adult consent)
    switch (studyName) {
      case StudyName.OSTEO2:
        studyColumnGroups.push(ColumnGroup.CLINICAL_ORDERS);
        studyColumnGroups.push(ColumnGroup.SURVEY_YOUR_CHILDS_OSTEOSARCOMA);
        studyColumnGroups.push(ColumnGroup.ADDITIONAL_ASSENT_LEARNING_CHILD_DNA_WITH_INVITAE);
        studyColumnGroups.push(ColumnGroup.BIOLOGICAL_PARENT_FEMALE);
        studyColumnGroups.push(ColumnGroup.RESEARCH_CONSENT_FORM);
        studyColumnGroups.push(ColumnGroup.RESEARCH_CONSENT_FORM); //Add twice in the case of a study with parental consent column group that has same name as adult consent column group
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
      if (duplicateColumnGroups.includes(columnGroup)) {
        //Try to determine how many times the given column group name has been seen for a study
        const result = duplicateColumnGroups.filter((columnGroupName) => columnGroupName === columnGroup);
        columnGroupInstance = result.length;
        console.log(`Column group ${columnGroup} hasbeen seen ${columnGroupInstance} times`);
      } else {
        columnGroupInstance = 0;
      }

      await this.assertColumnGroupAndAllColumnOptionsAreAvailable(columnGroup, studyName, columnGroupInstance);

      if (this.isKnownDuplicateColumnGroup(columnGroup)) {
        duplicateColumnGroups.push(columnGroup);
      }
    }
  }

  public async assertColumnGroupAndAllColumnOptionsAreAvailable(group: ColumnGroup, study: StudyName, instanceNumber: number): Promise<void> {
    const columnGroupButton = this.page.getByRole('button', { name: group}).nth(instanceNumber);
    await columnGroupButton.click(); //opening group
    const columnOptions = this.getColumnsInColumnGroup({ columnGroup: group, studyName: study});

    for (const option of columnOptions) {
      console.log(`Checking: ${group} \t->\t ${option}`);
      const participantColumnOption = this.page.locator(
        `//button[.//text()[normalize-space()='${group}']]/following-sibling::ul//mat-checkbox[.//text()[normalize-space()='${option}']]`
      );

      await expect(participantColumnOption, `Column ${option} is not available in column group ${group} in the ${study} study`).toBeVisible();
    }

    await columnGroupButton.click() //closing group
  }

  /**
   * Some column groups e.g Research Consent Form Columns appear twice in some studies Customize View
   * because they are used for more than one thing e.g. adult consent vs parental consent
   * @param group Column group name to check e.g. Research Consent Form Columns
   * @returns true || false if the column group name is known to be a duplciate in at least one instance
   */
  private isKnownDuplicateColumnGroup(group: ColumnGroup): boolean {
    let isKnownDuplicate;

    switch (group) {
      case ColumnGroup.RESEARCH_CONSENT_FORM:
        isKnownDuplicate = true;
        break;
      default:
        isKnownDuplicate = false;
        break;
    }
    return isKnownDuplicate
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
        if (this.isCMIStudy(studyName)) {
          columnOptions.push(Label.DATE_WITHDRAWN);
          columnOptions.push(Label.INCOMPLETE_OR_MINIMAL_MEDICAL_RECORDS);
          columnOptions.push(Label.MR_ASSIGNEE);
          columnOptions.push(Label.ONC_HISTORY_CREATED);
          columnOptions.push(Label.ONC_HISTORY_REVIEWED);
          columnOptions.push(Label.PAPER_CR_RECEIVED);
          columnOptions.push(Label.PAPER_CR_SENT);
          columnOptions.push(Label.PARTICIPANT_NOTES);
          columnOptions.push(Label.READY_FOR_ABSTRACTION);
          columnOptions.push(Label.TISSUE_ASSIGNEE);
        }

        if (studyName === StudyName.AT) {
          columnOptions.push(Label.DATE_WITHDRAWN);
        }

        if (studyName === StudyName.RGP) {
          columnOptions.push(Label.DATE_WITHDRAWN);
          columnOptions.push(Label.EXPECTED_NUMBER_TO_SEQUENCE);
          columnOptions.push(Label.FAMILY_NOTES);
          columnOptions.push(Label.SEQR_PROJECT);
          columnOptions.push(Label.SPECIALITY_PROJECT_CAGI_2022);
          columnOptions.push(Label.SPECIALITY_PROJECT_CAGI_2023);
          columnOptions.push(Label.SPECIALITY_PROJECT_CZI);
          columnOptions.push(Label.SPECIALITY_PROJECT_R21);
        }
        break;
      case ColumnGroup.MEDICAL_RECORD:
        if (this.isCMIStudy(studyName)) {
          columnOptions.push(Label.DUPLICATE);
          columnOptions.push(Label.FOLLOW_UP_REQUIRED);
          columnOptions.push(Label.FOLLOW_UP_REQUIRED_TEXT);
          columnOptions.push(Label.INITIAL_MR_RECEIVED);
          columnOptions.push(Label.INITIAL_MR_REQUEST);
          columnOptions.push(Label.INITIAL_MR_REQUEST_TWO);
          columnOptions.push(Label.INITIAL_MR_REQUEST_THREE);
          columnOptions.push(Label.INSTITUTION_CONTACT_PERSON);
          columnOptions.push(Label.INSTITUTION_FAX);
          columnOptions.push(Label.INSTITUTION_NAME);
          columnOptions.push(Label.INSTITUTION_PHONE);
          columnOptions.push(Label.INTERNATIONAL);
          columnOptions.push(Label.MR_DOCUMENT);
          columnOptions.push(Label.MR_DOCUMENT_FILE_NAMES);
          columnOptions.push(Label.MR_NOTES);
          columnOptions.push(Label.MR_PROBLEM);
          columnOptions.push(Label.MR_PROBLEM_TEXT);
          columnOptions.push(Label.MR_REVIEW);
          columnOptions.push(Label.MR_UNABLE_TO_OBTAIN);
          columnOptions.push(Label.NO_ACTION_NEEDED);
          columnOptions.push(Label.PAPER_CR_REQUIRED);
          columnOptions.push(Label.TYPE);
        } else {
          throw new Error(`The ${studyName} study is not expected to have ${ColumnGroup.MEDICAL_RECORD}`);
        }
        break;
      case ColumnGroup.ONC_HISTORY:
        if (this.isCMIStudy(studyName)) {
          columnOptions.push(Label.ACCESSION_NUMBER);
          columnOptions.push(Label.DATE_OF_PX);
          columnOptions.push(Label.DESTRUCTION_POLICY);
          columnOptions.push(Label.FACILITY);
          columnOptions.push(Label.FACILITY_FAX);
          columnOptions.push(Label.FACILITY_PHONE);
          columnOptions.push(Label.GENDER);
          columnOptions.push(Label.HISTOLOGY);
          columnOptions.push(Label.LOCATION_OF_PX);
          columnOptions.push(Label.ONC_HISTORY_NOTES);
          columnOptions.push(Label.PROBLEM_WITH_TISSUE);
          columnOptions.push(Label.REQUEST_STATUS);
          columnOptions.push(Label.TISSUE_RECEIVED);
          columnOptions.push(Label.TISSUE_REQUEST_DATE);
          columnOptions.push(Label.TISSUE_REQUEST_DATE_TWO);
          columnOptions.push(Label.TISSUE_REQUEST_DATE_THREE);
          columnOptions.push(Label.TYPE_OF_PX);
          columnOptions.push(Label.UNABLE_TO_OBTAIN);
        } else {
          throw new Error(`The ${studyName} study is not expected to have ${ColumnGroup.ONC_HISTORY}`);
        }

        //OS2, LMS have some additional expected columns in Onc History
        if (studyName === StudyName.OSTEO2) {
          columnOptions.push(Label.NECROSIS);
          columnOptions.push(Label.VIABLE_TUMOR);
          columnOptions.push(Label.BLOCK_TO_REQUEST_CAPITALIZED);
          columnOptions.push(Label.BLOCKS_WITH_TUMOR);
          columnOptions.push(Label.SAMPLE_FFPE);
          columnOptions.push(Label.LOCAL_CONTROL);
          columnOptions.push(Label.METHOD_OF_DECALCIFICATION);
          columnOptions.push(Label.TUMOR_SIZE);
        }

        if (studyName === StudyName.LMS) {
          columnOptions.push(Label.BLOCK_TO_REQUEST);
          columnOptions.push(Label.EXTENSIVE_TREATMENT_EFFECT);
          columnOptions.push(Label.FACILITY_WHERE_SAMPLE_WAS_REVIEWED);
          columnOptions.push(Label.SLIDES_TO_REQUEST);
          columnOptions.push(Label.TOTAL_NUMBER_SLIDES_MENTIONED);
          columnOptions.push(Label.TUMOR_SIZE);
        }
        break;
        case ColumnGroup.TISSUE:
          //stuff here
          break;
        case ColumnGroup.SAMPLE:
          //Only CMI studies and Brugada should have the Sample Columns - but only CMI studies should have the Sequencing Restriction option
          if (this.isCMIStudy(studyName) || studyName === StudyName.BRUGADA) {
            columnOptions.push(Label.COLLABORATOR_PARTICIPANT_ID);
            columnOptions.push(Label.COLLECTION_DATE);
            columnOptions.push(Label.MF_CODE);
            columnOptions.push(Label.NORMAL_COLLABORATOR_SAMPLE_ID);
            columnOptions.push(Label.SAMPLE_DEACTIVATION);
            columnOptions.push(Label.SAMPLE_NOTES);
            columnOptions.push(Label.SAMPLE_RECEIVED);
            columnOptions.push(Label.SAMPLE_SENT);
            columnOptions.push(Label.SAMPLE_TYPE);
            columnOptions.push(Label.STATUS);
          } else {
            throw new Error(`The ${studyName} study is not expected to have ${ColumnGroup.SAMPLE}`);
          }

          if (this.isClinicalStudy(studyName)) {
            columnOptions.push(Label.SEQUENCING_RESTRICTIONS);
          }
          break;
        case ColumnGroup.COHORT_TAGS:
          columnOptions.push(Label.COHORT_TAG_NAME);
          break;
        case ColumnGroup.RESEARCH_CONSENT_FORM:
          //stuff here - note both adult and kids Consent column group share the same name
          break;
        case ColumnGroup.MEDICAL_RELEASE_FORM:
          //stuff here - note both adults and kids MR column group share the same name - but order of display may differ depending on study
          break;
        case ColumnGroup.ADDITIONAL_CONSENT_ASSENT_LEARNING_ABOUT_CHILD_TUMOR:
          columnOptions.push(Label.CONSENT_ADDENDUM_SURVEY_PEDIATRIC_COMPLETED);
          columnOptions.push(Label.CONSENT_ADDENDUM_SURVEY_PEDIATRIC_CREATED);
          columnOptions.push(Label.CONSENT_ADDENDUM_SURVEY_PEDIATRIC_LAST_UPDATED);
          columnOptions.push(Label.CONSENT_ADDENDUM_SURVEY_PEDIATRIC_STATUS);
          columnOptions.push(Label.SIGNATURE_WITHOUT_COLON);
          columnOptions.push(Label.SIGNATURE);
          columnOptions.push(Label.SOMATIC_ASSENT_ADDENDUM);
          columnOptions.push(Label.SOMATIC_CONSENT_TUMOR_PREDIATRIC);
          break;
        case ColumnGroup.HALF_SIBLING:
          columnOptions.push(Label.FAMILY_HISTORY_SELF_HALF_SIBLING_SURVEY_COMPLETED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_HALF_SIBLING_SURVEY_CREATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_HALF_SIBLING_SURVEY_LAST_UPDATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_HALF_SIBLING_SURVEY_STATUS);
          columnOptions.push(Label.FH_HALF_SIBLING_AGE_RANGE);
          columnOptions.push(Label.FH_HALF_SIBLING_CANCERS_LIST);
          columnOptions.push(Label.FH_HALF_SIBLING_HAD_CANCER);
          columnOptions.push(Label.IS_THIS_PERSON_CURRENTLY_LIVING);
          columnOptions.push(Label.NAME_OR_NICKNAME);
          columnOptions.push(Label.WHAT_IS_THIS_PERSONS_SEX_ASSIGNED_AT_BIRTH);
          columnOptions.push(Label.WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON);
          break;
        case ColumnGroup.CHILD:
          columnOptions.push(Label.FAMILY_HISTORY_SELF_CHILD_SURVEY_COMPLETED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_CHILD_SURVEY_CREATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_CHILD_SURVEY_LAST_UPDATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_CHILD_SURVEY_STATUS);
          columnOptions.push(Label.FH_CHILD_AGE_RANGE);
          columnOptions.push(Label.FH_CHILD_CANCERS_LIST);
          columnOptions.push(Label.FH_CHILD_HAD_CANCER);
          columnOptions.push(Label.IS_THIS_PERSON_CURRENTLY_LIVING);
          columnOptions.push(Label.NAME_OR_NICKNAME);
          columnOptions.push(Label.WHAT_IS_THIS_PERSONS_SEX_ASSIGNED_AT_BIRTH);
          columnOptions.push(Label.WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON);
          break;
        case ColumnGroup.GRANDPARENT:
          columnOptions.push(Label.FAMILY_HISTORY_SELF_GRANDPARENT_SURVEY_COMPLETED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_GRANDPARENT_SURVEY_CREATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_GRANDPARENT_SURVEY_LAST_UPDATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_GRANDPARENT_SURVEY_STATUS);
          columnOptions.push(Label.FH_GRANDPARENT_AGE_RANGE);
          columnOptions.push(Label.FH_GRANDPARENT_CANCERS_LIST);
          columnOptions.push(Label.FH_GRANDPARENT_HAD_CANCER);
          columnOptions.push(Label.IS_THIS_PERSON_CURRENTLY_LIVING);
          columnOptions.push(Label.NAME_OR_NICKNAME);
          columnOptions.push(Label.WHAT_IS_THIS_PERSONS_SEX_ASSIGNED_AT_BIRTH);
          columnOptions.push(Label.WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON);
          break;
        case ColumnGroup.SIBLING:
          columnOptions.push(Label.FAMILY_HISTORY_SELF_SIBLING_SURVEY_COMPLETED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_SIBLING_SURVEY_CREATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_SIBLING_SURVEY_LAST_UPDATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_SIBLING_SURVEY_STATUS);
          columnOptions.push(Label.FH_SIBLING_AGE_RANGE);
          columnOptions.push(Label.FH_SIBLING_CANCERS_LIST);
          columnOptions.push(Label.FH_SIBLING_HAD_CANCER);
          columnOptions.push(Label.IS_THIS_PERSON_CURRENTLY_LIVING);
          columnOptions.push(Label.NAME_OR_NICKNAME);
          columnOptions.push(Label.WHAT_IS_THIS_PERSONS_SEX_ASSIGNED_AT_BIRTH);
          columnOptions.push(Label.WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON);
          break;
        case ColumnGroup.PARENT_SIBLING:
          columnOptions.push(Label.FAMILY_HISTORY_SELF_PARENT_SIBLING_SURVEY_COMPLETED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_PARENT_SIBLING_SURVEY_CREATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_PARENT_SIBLING_SURVEY_LAST_UPDATED);
          columnOptions.push(Label.FAMILY_HISTORY_SELF_PARENT_SIBLING_SURVEY_STATUS);
          columnOptions.push(Label.FH_PARENT_SIBLING_AGE_RANGE);
          columnOptions.push(Label.FH_PARENT_SIBLING_CANCERS_LIST);
          columnOptions.push(Label.FH_PARENT_SIBLING_HAD_CANCER);
          columnOptions.push(Label.IS_THIS_PERSON_CURRENTLY_LIVING);
          columnOptions.push(Label.NAME_OR_NICKNAME);
          columnOptions.push(Label.WHAT_IS_THIS_PERSONS_SEX_ASSIGNED_AT_BIRTH);
          columnOptions.push(Label.WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON);
          break;
        case ColumnGroup.ADDITIONAL_CONSENT_LEARNING_ABOUT_TUMOR:
          columnOptions.push(Label.CONSENT_ADDENDUM_SURVEY_COMPLETED);
          columnOptions.push(Label.CONSENT_ADDENDUM_SURVEY_CREATED);
          columnOptions.push(Label.CONSENT_ADDENDUM_SURVEY_LAST_UPDATED);
          columnOptions.push(Label.CONSENT_ADDENDUM_SURVEY_STATUS);
          columnOptions.push(Label.SIGNATURE);
          columnOptions.push(Label.SOMATIC_CONSENT_TUMOR);
          break;
        case ColumnGroup.SURVEY_ABOUT_YOU_OR_YOUR_CHILD:
          columnOptions.push(Label.ABOUT_YOU_ACTIVITY_SURVEY_COMPLETED);
          columnOptions.push(Label.ABOUT_YOU_ACTIVITY_SURVEY_CREATED);
          columnOptions.push(Label.ABOUT_YOU_ACTIVITY_SURVEY_LAST_UPDATED);
          columnOptions.push(Label.ABOUT_YOU_ACTIVITY_SURVEY_STATUS);
          columnOptions.push(Label.AFRO_HISPANIC);
          columnOptions.push(Label.BIRTH_SEX_ASSIGN);
          columnOptions.push(Label.CONFIDENCE_LEVEL_ID);
          columnOptions.push(Label.GENDER_IDENTITY);
          columnOptions.push(Label.HIGHEST_LEVEL_SCHOOL_ID);
          columnOptions.push(Label.HOW_DID_YOU_HEAR_ABOUT_THE_PROJECT);
          columnOptions.push(Label.INDIGENOUS_NATIVE);
          columnOptions.push(Label.MIXED_RACE);
          columnOptions.push(Label.OTHER_COMMENTS);
          columnOptions.push(Label.PROBLEM_UNDERSTANDING_WRITTEN_ID);
          columnOptions.push(Label.RACE_QUESTION);
          columnOptions.push(Label.READ_HOSPITAL_MATERIALS_ID);
          columnOptions.push(Label.WHAT_LANGUAGE_DO_YOU_SPEAK_AT_HOME);
          break;
        case ColumnGroup.INVITAE:
          columnOptions.push(Label.BAM_FILE_RECEIVED_FROM_INVITAE);
          columnOptions.push(Label.DATE_BAM_FILE_RECEIVED_FROM_INVITAE);
          columnOptions.push(Label.DATE_REPORT_RECEIVED_FROM_INVITAE);
          columnOptions.push(Label.GERMLINE_RETURN_NOTES_FIELD);
          break;
        case ColumnGroup.PROXY:
          columnOptions.push(Label.EMAIL);
          columnOptions.push(Label.FIRST_NAME);
          columnOptions.push(Label.LAST_NAME);
          break;
        case ColumnGroup.INVITATION:
          columnOptions.push(Label.ACCEPTED);
          columnOptions.push(Label.CONTACT_EMAIL);
          columnOptions.push(Label.CREATED);
          columnOptions.push(Label.INVITATION_CODE);
          columnOptions.push(Label.NOTES);
          columnOptions.push(Label.TYPE);
          columnOptions.push(Label.VERIFIED);
          columnOptions.push(Label.VOIDED);
          break;
        case ColumnGroup.CONTACT_INFORMATION:
          columnOptions.push(Label.CITY);
          columnOptions.push(Label.COUNTRY);
          columnOptions.push(Label.MAIL_TO_NAME);
          columnOptions.push(Label.PHONE);
          columnOptions.push(Label.STATE);
          columnOptions.push(Label.STREET_ONE);
          columnOptions.push(Label.STREET_TWO);
          columnOptions.push(Label.VALID);
          columnOptions.push(Label.ZIP);
          break;
      default:
        throw new Error(`Expected column options for the ${columnGroup} are not known / setup in this method`);
        break;
    }
    return columnOptions;
  }

  private isClinicalStudy(studyName: StudyName): boolean {
    let isClinical;
    switch (studyName) {
      case StudyName.OSTEO2:
      case StudyName.LMS:
        isClinical = true;
        break;
      default:
        isClinical = false;
        break;
    }
    return isClinical;
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
