import {expect, Locator, Page} from '@playwright/test';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { UserPermission } from './enums/userPermission-enum';

export default class UserPermissionPage {
  private readonly PAGE_TITLE: string = 'Users And Permissions';
  private CMI_STUDY_GROUP = 'cmi';
  private PECGS_STUDY_GROUP = 'pecgs';
  private RGP_STUDY_GROUP = 'malab';
  private ATCP_STUDY_GROUP = 'atcp';
  private PRION_STUDY_GROUP = 'prion';
  private BRUGADA_STUDY_GROUP = 'brugada';
  private DARWIN_ARK_STUDY_GROUP = 'darwin';
  private currentStudyPermissions: UserPermission[];

  constructor(protected readonly page: Page, study: StudyEnum) {
    this.currentStudyPermissions = this.setStudyPermissions(study);
  }

  /* Locators */
  public getAddUserButton(): Locator {
    return this.page.locator(`//button[contains(@class, 'addUserButton')]`);
  }

  public getStudyAdmin(email: string): Locator {
    //return this.page.locator(`//mat-expansion-panel//mat-panel-title[contains(text(), '${email}')]`);
    return this.page.getByText(`${email}`);
  }

  public getComparePermissionsButton(studyAdmin: Locator): Locator {
    return studyAdmin.locator(`/following-sibling::mat-panel-description//button[@mattooltip='Compare Permissions']`);
  }

  public getEditUserButton(studyAdmin: Locator): Locator {
    return studyAdmin.locator(`/following-sibling::mat-panel-description//button[@mattooltip='Edit User']`);
  }

  public getDeleteUserButton(studyAdmin: Locator): Locator {
    return studyAdmin.locator(`/following-sibling::mat-panel-description//button[@mattooltip='Delete User']`);
  }

  public async getPermissionsSection(studyAdmin: Locator): Promise<Array<Locator>> {
    return studyAdmin.locator(`//ancestor::mat-expansion-panel//section[contains(@class, 'permissions')]//app-permission-checkbox`).all();
  }

  public getSaveButton(studyAdmin: Locator): Locator {
    return studyAdmin.locator(`//ancestor::mat-expansion-panel//button[contains(., 'Save')]`);
  }

  public getDiscardChangesButton(studyAdmin: Locator) {
    return studyAdmin.locator(`//ancestor::mat-expansion-panel//button[contains(., 'Discard changes')]`);
  }

  /* Assertions */
  public async assertPageTitle(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: `${this.PAGE_TITLE}` }),
      `ERROR - ${this.PAGE_TITLE}'s page title is not displayed`).toBeVisible();
  }

  public async assertAddUserButtonDisplayed(): Promise<void> {
    const button = this.getAddUserButton();
    await expect(button).toBeVisible();
  }

  public async assertStudyAdminInfo(email: string, name: string, phone?: string): Promise<void> {
    //Get the relevant study admin's section
    const studyAdmin = this.getStudyAdmin(email);

    //Verify the email is as expected
    const studyAdminEmail = await studyAdmin.innerText();
    expect(studyAdminEmail).toBe(email);

    //Verify the name is as expected
    const studyAdminName = await this.getStudyAdminName(name);
    expect(studyAdminName).toBe(name);

    if (phone) {
      //If phone information is provided, verify that it is shown in the page as expected
      const studyAdminPhoneNumber = await this.getStudyAdminPhoneNumber(phone);
      expect(studyAdminPhoneNumber).toBe(phone);
    }
  }

  public async assertAllPossibleStudyPermissionsAreVisible(study: StudyEnum, email: string): Promise<void> {
    //Verify that all possible permissions for the study are available for the study admin to select
    const studyAdmin = this.getStudyAdmin(email);
    const allPossiblePermissions = this.getPermissionsSection(studyAdmin);

    //WIP
  }

  /* Utility methods */
  public async getStudyAdminName(name: string): Promise<string> {
    const studyAdminName = this.page.getByText(`${name}`);
    return studyAdminName.innerText();
  }

  public async getStudyAdminPhoneNumber(phoneNumber: string): Promise<string> {
    const studyAdminPhoneNumber = this.page.getByText(`${phoneNumber}`);
    return studyAdminPhoneNumber.innerText();
  }

  private determineStudyGroup(study: StudyEnum): string {
    let studyGroup = '';

    if (StudyEnum.ANGIO || StudyEnum.BRAIN || StudyEnum.ESC || StudyEnum.MBC || StudyEnum.OSTEO || StudyEnum.PANCAN || StudyEnum.PROSTATE) {
      //Study is a CMI research study
      studyGroup = this.CMI_STUDY_GROUP;
    } else if (StudyEnum.OSTEO2 || StudyEnum.LMS) {
      //Study is a CMI clinical study
      studyGroup = this.PECGS_STUDY_GROUP;
    } else if (StudyEnum.RGP) {
      //Study is the RGP study
      studyGroup = this.RGP_STUDY_GROUP;
    } else if (StudyEnum.PRION) {
      //Study is the Prion study
      studyGroup = this.PRION_STUDY_GROUP;
    } else if (StudyEnum.AT) {
      //Study is the ATCP study
      studyGroup = this.ATCP_STUDY_GROUP;
    } else if (StudyEnum.BRUGADA) {
      //Study is the Brugada study
      studyGroup = this.BRUGADA_STUDY_GROUP;
    } else if (StudyEnum.DARWIN) {
      //Study is the Darwin study
      studyGroup = this.DARWIN_ARK_STUDY_GROUP;
    }

    return studyGroup;
  }

  private setStudyPermissions(study: StudyEnum): UserPermission[] {
    const permissions: UserPermission[] = [];
    const studyGroup = this.determineStudyGroup(study);

    switch (studyGroup) {
      case this.CMI_STUDY_GROUP:
        permissions.push(
          UserPermission.KIT_DISCARD_SAMPLES,
          UserPermission.FIELD_SETTINGS_ADD_REMOVE_MODIFY,
          UserPermission.PARTICIPANT_FILES_VIEW_DOWNLOAD,
          UserPermission.KIT_VIEW_AND_DEACTIVATION_REACTIVATION,
          UserPermission.KIT_CREATE_OVERNIGHT_SHIPPING_LABELS,
          UserPermission.KIT_CLINICAL_ORDER,
          UserPermission.KIT_SHIPPING,
          UserPermission.KIT_VIEW_KIT_PAGES,
          UserPermission.KIT_UPLOAD,
          UserPermission.KIT_UPLOAD_INVALID_ADDRESS,
          UserPermission.MAILING_LIST_VIEW_AND_DOWNLOAD,
          UserPermission.MEDICAL_RECORDS_ADD_TO_ABSTRACTOR_ASSIGNEE_LIST,
          UserPermission.MEDICAL_RECORDS_ABSTRACTION,
          UserPermission.MEDICAL_RECORDS_CANNOT_REQUEST_TISSUE,
          UserPermission.MEDICAL_RECORDS_QUALITY_ASSURANCE,
          UserPermission.MEDICAL_RECORDS_ADD_TO_REQUESTER_ASSIGNEE_LIST,
          UserPermission.MEDICAL_RECORDS_VIEW_AND_REQUEST_RECORDS_AND_TISSUE,
          UserPermission.DEATH_INDEX_DOWNLOAD,
          UserPermission.PARTICIPANT_EDIT,
          UserPermission.PARTICIPANT_STOP_AUTOMATED_EMAILS,
          UserPermission.PARTICIPANT_WITHDRAWAL,
          UserPermission.DOWNLOAD_PDFS,
          UserPermission.PARTICIPANT_VIEW_LIST,
          UserPermission.FOLLOW_UP_SURVEYS,
          UserPermission.VIEW_SURVEY_DATA_ONLY
        );
        break;
      case this.PECGS_STUDY_GROUP:
        permissions.push(
          UserPermission.KIT_DISCARD_SAMPLES,
          UserPermission.FIELD_SETTINGS_ADD_REMOVE_MODIFY,
          UserPermission.PARTICIPANT_FILES_VIEW_DOWNLOAD,
          UserPermission.KIT_VIEW_AND_DEACTIVATION_REACTIVATION,
          UserPermission.KIT_CREATE_OVERNIGHT_SHIPPING_LABELS,
          UserPermission.KIT_CLINICAL_ORDER,
          UserPermission.KIT_SHIPPING,
          UserPermission.KIT_VIEW_KIT_PAGES,
          UserPermission.KIT_UPLOAD,
          UserPermission.KIT_UPLOAD_INVALID_ADDRESS,
          UserPermission.MAILING_LIST_VIEW_AND_DOWNLOAD,
          UserPermission.MEDICAL_RECORDS_ADD_TO_ABSTRACTOR_ASSIGNEE_LIST,
          UserPermission.MEDICAL_RECORDS_ABSTRACTION,
          UserPermission.MEDICAL_RECORDS_CANNOT_REQUEST_TISSUE,
          UserPermission.MEDICAL_RECORDS_QUALITY_ASSURANCE,
          UserPermission.MEDICAL_RECORDS_ADD_TO_REQUESTER_ASSIGNEE_LIST,
          UserPermission.MEDICAL_RECORDS_VIEW_AND_REQUEST_RECORDS_AND_TISSUE,
          UserPermission.DEATH_INDEX_DOWNLOAD,
          UserPermission.PARTICIPANT_EDIT,
          UserPermission.PARTICIPANT_STOP_AUTOMATED_EMAILS,
          UserPermission.PARTICIPANT_WITHDRAWAL,
          UserPermission.DOWNLOAD_PDFS,
          UserPermission.PARTICIPANT_VIEW_LIST,
          UserPermission.FOLLOW_UP_SURVEYS,
          UserPermission.ONC_HISTORY_UPLOAD,
          UserPermission.SHARED_LEARNINGS_UPLOAD_FILE,
          UserPermission.VIEW_SURVEY_DATA_ONLY,
          UserPermission.SEQUENCING_ORDER_VIEW_STATUS,
          UserPermission.SHARED_LEARNINGS_VIEW
        );
        break;
      case this.RGP_STUDY_GROUP:
        permissions.push(
          UserPermission.KIT_DISCARD_SAMPLES,
          UserPermission.KIT_VIEW_AND_DEACTIVATION_REACTIVATION,
          UserPermission.KIT_CREATE_OVERNIGHT_SHIPPING_LABELS,
          UserPermission.KIT_SHIPPING,
          UserPermission.KIT_VIEW_KIT_PAGES,
          UserPermission.KIT_UPLOAD,
          UserPermission.KIT_UPLOAD_INVALID_ADDRESS,
          UserPermission.MAILING_LIST_VIEW_AND_DOWNLOAD,
          UserPermission.MEDICAL_RECORDS_VIEW_AND_REQUEST_RECORDS_AND_TISSUE,
          UserPermission.PARTICIPANT_EDIT,
          UserPermission.PARTICIPANT_WITHDRAWAL,
          UserPermission.DOWNLOAD_PDFS,
          UserPermission.PARTICIPANT_VIEW_LIST
        );
        break;
      case this.PRION_STUDY_GROUP:
        permissions.push(
          UserPermission.PARTICIPANT_EDIT,
          UserPermission.PARTICIPANT_WITHDRAWAL,
          UserPermission.PARTICIPANT_VIEW_LIST,
          UserPermission.FOLLOW_UP_SURVEYS
        );
        break;
      case this.ATCP_STUDY_GROUP:
        permissions.push(
          UserPermission.KIT_SHIPPING,
          UserPermission.KIT_VIEW_KIT_PAGES,
          UserPermission.MAILING_LIST_VIEW_AND_DOWNLOAD,
          UserPermission.PARTICIPANT_EDIT,
          UserPermission.PARTICIPANT_VIEW_LIST
        );
        break;
      case this.BRUGADA_STUDY_GROUP:
        permissions.push(
          UserPermission.KIT_VIEW_AND_DEACTIVATION_REACTIVATION,
          UserPermission.KIT_SHIPPING,
          UserPermission.KIT_VIEW_KIT_PAGES,
          UserPermission.KIT_UPLOAD,
          UserPermission.KIT_UPLOAD_INVALID_ADDRESS,
          UserPermission.MAILING_LIST_VIEW_AND_DOWNLOAD,
          UserPermission.PARTICIPANT_WITHDRAWAL,
          UserPermission.DOWNLOAD_PDFS,
          UserPermission.PARTICIPANT_VIEW_LIST,
          UserPermission.FOLLOW_UP_SURVEYS
        );
        break;
      case this.DARWIN_ARK_STUDY_GROUP:
        permissions.push(
          UserPermission.KIT_VIEW_AND_DEACTIVATION_REACTIVATION,
          UserPermission.KIT_CREATE_OVERNIGHT_SHIPPING_LABELS,
          UserPermission.KIT_SHIPPING,
          UserPermission.KIT_VIEW_KIT_PAGES,
          UserPermission.KIT_UPLOAD
        );
        break;
      default:
        throw new Error(`setStudyPermissions() does not have the logic to handle ${study}'s permissions`);
        break;
    }

    return permissions;
  }
}
