import {expect, Locator, Page} from '@playwright/test';
import { StudyName } from 'dsm/navigation';
import { UserPermission } from 'dsm/enums';
import { isCMIStudy, isPECGSStudy } from 'utils/test-utils';

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
  private readonly page: Page;
  private readonly root: Locator;

  constructor(page: Page) {
    this.page = page;
    this.currentStudyPermissions = [];
    this.root = this.page.locator('app-users-and-permissions');
  }

  /* Locators */
  public getAddUserButton(): Locator {
    return this.page.locator(`//button[contains(@class, 'addUserButton')]`);
  }

  public getStudyAdmin(email: string): Locator {
    return this.root.locator('app-list-users app-administration-user', { hasText: new RegExp(email, 'i') });
    // return this.page.getByText(`${email}`);
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

  public async expandPanel(email: string): Promise<void> {
    const user = this.getStudyAdmin(email);
    try {
      await user.scrollIntoViewIfNeeded();
    } catch (err) {
      // ignore
    }
    await user.click();
    await expect(user.locator('[role="region"]')).toBeVisible();
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

  /**
   * Checks that the values in the study admin's permission block match the given email, name, and phone number
   * @param email study admin's email
   * @param name study admin's name
   * @param phone study admin's phone number
   */
  public async assertStudyAdminInfo(email: string, name: string, phone?: string): Promise<void> {
    //Get the relevant study admin's section
    const studyAdmin = this.getStudyAdmin(email);

    //Verify the email is as expected
    const studyAdminEmail = await this.getStudyEmail(studyAdmin);
    expect(studyAdminEmail.toLowerCase()).toBe(email.toLowerCase());

    //Verify the name is as expected
    const studyAdminName = await this.getStudyAdminName(studyAdmin);
    expect(studyAdminName).toBe(name);

    if (phone) {
      //Verify the given phone number is displayed in the study admin's permission block as expected
      const studyAdminPhoneNumber = await this.getStudyAdminPhoneNumber(studyAdmin);
      expect(studyAdminPhoneNumber).toBe(phone);
    }
  }

  public async assertAllPossibleStudyPermissionsAreVisible(study: StudyName, email: string): Promise<void> {
    //Verify that all possible permissions for the study are available for the study admin to select
    const studyAdmin = this.getStudyAdmin(email);
    const allPossiblePermissions = await this.getPermissionsSection(studyAdmin);
    const amountOfPermissions = allPossiblePermissions.length;

    for (let index = 0; index < amountOfPermissions; index++) {
      const permissionCheckbox = allPossiblePermissions[index];
      const permission = permissionCheckbox.locator(`//span[@class='ng-star-inserted']`);
      const currentPermission = (await permission.innerText()).trim();
      const currentPermissionCastedAsEnum = currentPermission as UserPermission;
      const verifiedPermission = Object.values(this.currentStudyPermissions).indexOf(currentPermissionCastedAsEnum) >= 0;
      if (!verifiedPermission) {
        throw new Error(`The ${currentPermission} permission is not a valid permission for ${study}`);
      }
    }
  }

  public async assertSelectedPermissions(studyAdmin: Locator, permissions: UserPermission[]): Promise<void> {
    expect(permissions.length > 0).toBe(true);

    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i];
      const checkbox = this.getPermissionCheckbox(studyAdmin, permission);
      await expect(checkbox).toBeChecked({timeout: 2000});
    }
  }

  public getPermissionCheckbox(studyAdmin: Locator, permission: UserPermission, forSelection?: boolean): Locator {
    const permissionName = permission as string;
    if (forSelection) {
      return studyAdmin.locator(`//app-permission-checkbox[.//label[normalize-space()="${permissionName}"]]//div`)
    }
    return studyAdmin.locator(`//app-permission-checkbox[.//label[normalize-space()="${permissionName}"]]//input`);
  }

  public async getStudyEmail(studyAdmin: Locator): Promise<string> {
    const title = studyAdmin.locator('mat-panel-title');
    return (await title.innerText()).trim();
  }

  public async getStudyAdminName(studyAdmin: Locator): Promise<string> {
    const name = studyAdmin.locator('mat-panel-description .header-text-inputs-name');
    return (await name.innerText()).trim();
  }

  public async getStudyAdminPhoneNumber(studyAdmin: Locator): Promise<string> {
    const name = studyAdmin.locator('mat-panel-description .header-text-inputs-phone');
    return (await name.innerText()).trim();
  }

  /**
   * Takes the given study name and matches it to a study group so that the study's related permissions can be determined
   * @param study the study name e.g. OS PE-CGS
   * @returns the study group e.g. pecgs
   */
  private determineStudyGroup(study: StudyName): string {
    let studyGroup = '';

    if (isCMIStudy(study)) {
      studyGroup = this.CMI_STUDY_GROUP;
    } else if (isPECGSStudy(study)) {
      studyGroup = this.PECGS_STUDY_GROUP;
    } else if (study === StudyName.RGP) {
      studyGroup = this.RGP_STUDY_GROUP;
    } else if (study === StudyName.PRION) {
      studyGroup = this.PRION_STUDY_GROUP;
    } else if (study === StudyName.AT) {
      studyGroup = this.ATCP_STUDY_GROUP;
    } else if (study === StudyName.BRUGADA) {
      studyGroup = this.BRUGADA_STUDY_GROUP;
    } else if (study === StudyName.DARWIN) {
      studyGroup = this.DARWIN_ARK_STUDY_GROUP;
    }
    return studyGroup;
  }

  public setStudyPermissions(study: StudyName): void {
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
          UserPermission.KIT_VIEW_KIT_PAGES,
          UserPermission.MAILING_LIST_VIEW_AND_DOWNLOAD,
          UserPermission.PARTICIPANT_EDIT,
          UserPermission.PARTICIPANT_VIEW_LIST
        );
        break;
      case this.BRUGADA_STUDY_GROUP:
        permissions.push(
          UserPermission.KIT_VIEW_AND_DEACTIVATION_REACTIVATION,
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
          UserPermission.KIT_VIEW_KIT_PAGES,
          UserPermission.KIT_UPLOAD
        );
        break;
      default:
        throw new Error(`setStudyPermissions() does not have the logic to handle ${study}'s permissions`);
    }
    this.currentStudyPermissions = permissions;
  }
}
