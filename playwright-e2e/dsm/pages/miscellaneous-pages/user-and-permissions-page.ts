import {expect, Locator, Page} from '@playwright/test';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';

export default class UserPermissionPage {
  private readonly PAGE_TITLE: string = 'Users And Permissions';
  constructor(protected readonly page: Page) {}
  /* Locators */
  public getAddUserButton(): Locator {
    return this.page.locator(`//button[contains(@class, 'addUserButton')]`);
  }

  public getStudyAdmin(email: string): Locator {
    return this.page.locator(`//mat-panel-title[contains(text(), '${email}')]`);
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
    const studyAdminName = await this.getStudyAdminName(studyAdmin);
    expect(studyAdminName).toBe(name);
    if (phone) {
      //If phone information is provided, verify that it is shown in the page as expected
      const studyAdminPhoneNumber = await this.getStudyAdminPhoneNumber(studyAdmin);
      expect(studyAdminPhoneNumber).toBe(phone);
    }
  }

  public async assertAllPossibleStudyPermissionsAreVisible(study: StudyEnum, email: string): Promise<void> {
    //Verify that all possible permissions for the study are available for the study admin to select
    const studyAdmin = this.getStudyAdmin(email);
    const allPossiblePermissions = this.getPermissionsSection(studyAdmin);
  }

  /* Utility methods */
  public async getStudyAdminName(studyAdmin: Locator): Promise<string> {
    const name = studyAdmin.locator(`/following-sibling::mat-panel-description//span[contains(@class,'header-text-inputs-name')]`);
    return await name.innerText();
  }

  public async getStudyAdminPhoneNumber(studyAdmin: Locator): Promise<string> {
    const phone = studyAdmin.locator(`/following-sibling::mat-panel-description//span[contains(@class,'header-text-inputs-phone')]`);
    return await phone.innerText();
  }
}
