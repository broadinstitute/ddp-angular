import {expect, Locator, Page} from '@playwright/test';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { UserPermission } from './enums/userPermission-enum';

export default class UserPermissionPage {
  private readonly PAGE_TITLE: string = 'Users And Permissions';
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
      studyGroup = 'cmi';
    } else if (StudyEnum.OSTEO2 || StudyEnum.LMS) {
      //Study is a CMI clinical study
      studyGroup = 'pecgs';
    } else if (StudyEnum.RGP) {
      //Study is the RGP study
      studyGroup = 'malab';
    } else if (StudyEnum.PRION) {
      //Study is the Prion study
      studyGroup = 'prion';
    } else if (StudyEnum.AT) {
      //Study is the ATCP study
      studyGroup = 'atcp';
    } else if (StudyEnum.BRUGADA) {
      //Study is the Brugada study
      studyGroup = 'brugada';
    } else if (StudyEnum.DARWIN) {
      //Study is the Darwin study
      studyGroup = 'darwin'
    }
    return studyGroup;
  }

  private setStudyPermissions(study: StudyEnum): UserPermission[] {
    let permissions: UserPermission[];

  }
}
