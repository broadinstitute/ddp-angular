import {expect, Locator, Page, Response} from '@playwright/test';
import {KitType} from 'dsm/component/kitType/kitType';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {createTextFileSync, deleteFileSync} from 'utils/file-utils';
import {KitUploadInfo} from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import path from 'path';

export default class KitUploadPage {
  private readonly PAGE_TITLE = 'Kit Upload';
  private readonly T_HEAD = 'shortId\tfirstName\tlastName\tstreet1\tstreet2\tcity\tpostalCode\tstate\tcountry';
  private readonly kitType = new KitType(this.page);
  private readonly expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];

  constructor(private readonly page: Page) {
  }

  public async waitForReady(kitTypes?: KitTypeEnum[]): Promise<void> {
    const knownKitTypes = kitTypes ?? this.expectedKitTypes; //Use the param kit types if provided, if they are not, then use the general expected kit types
    await Promise.all([
      this.page.waitForLoadState(),
      this.assertPageTitle()
    ]);
    await expect(this.skipAddressValidationCheckbox).toBeVisible();
    await waitForNoSpinner(this.page);
    await this.assertDisplayedKitTypes(knownKitTypes);
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await waitForNoSpinner(this.page);
    await this.kitType.selectKitType(kitType);
  }

  public async uploadFile(kitType: KitTypeEnum, kitInfo: KitUploadInfo[], study: StudyEnum, testResultDir?: string) {
    await expect(this.uploadKitsBtn, 'Kit Upload page - Upload Kits button should be disabled.').not.toBeEnabled();

    // Prepare upload file
    const dir = testResultDir ? testResultDir : __dirname;
    const filePath = path.join(dir, `${kitType}_${study}-${new Date().getTime()}.txt`);
    createTextFileSync(dir, filePath, this.T_HEAD + this.createKitUploadBody(kitInfo));
    await this.fileInput.setInputFiles(filePath);

    // Wait for upload to finish
    const respPromise = this.page.waitForResponse((resp: Response) => resp.url().includes('kitUpload'), { timeout: 50 * 1000});
    await this.uploadKitsBtn.click();
    const response = await respPromise;
    await response.finished();
    await waitForNoSpinner(this.page);

    // Handle edge cases
    try {
      await expect(this.page.locator('h3')).toHaveText(/All participants were uploaded/, { timeout: 1000 });
    } catch (e) {
      await this.handleDuplicatedOrSpecialKits();
    }

    deleteFileSync(filePath);
    await expect(this.uploadKitsBtn, 'Kit Upload page - "Upload Kits" button should be disabled.').not.toBeEnabled();
  }

  /* Helper functions */
  private createKitUploadBody(kitInfo: KitUploadInfo[]): string {
    return kitInfo.map((kitInfo: KitUploadInfo) => {
      const {shortId, firstName, lastName, address} = kitInfo;
      // eslint-disable-next-line max-len
      return `\n${shortId}\t${firstName}\t${lastName}\t${address.street1}\t${address.street2}\t${address.city}\t${address.postalCode}\t${address.state}\t${address.country}`;
    }).join();
  }

  private async handleDuplicatedOrSpecialKits(): Promise<void> {
    await expect(this.page.locator(this.modalContentXPath),
      'Kit Upload page - Duplicated kits modal is not visible')
      .toBeVisible();
    await expect(this.page.locator(this.modalUploadKitBtnXPath),
      'Kit Upload page - Upload Kit button is enabled')
      .toBeDisabled();

    const duplicatedKitsCount: number = await this.page.locator(this.modalBodyContentCheckboxesXPath).count();
    for (let dupKit = 0; dupKit < duplicatedKitsCount; dupKit++) {
      await this.page.locator(this.modalBodyContentCheckboxesXPath).nth(dupKit).click();
    }
    const uploadKitButton = this.page.locator(this.modalUploadKitBtnXPath);

    await expect(uploadKitButton, 'Kit Upload page - Upload Kit button is disabled').toBeEnabled();

    await Promise.all([
      waitForResponse(this.page, {uri: '/kitUpload'}),
      uploadKitButton.click()
    ]);
    await waitForNoSpinner(this.page);
  }

  /* Locators */
  private get fileInput(): Locator {
    return this.page.locator('//app-filepicker//input');
  }

  private get uploadKitsBtn(): Locator {
    return this.page.locator('//button[.//span[text()[normalize-space()="Upload Kits"]]]');
  }

  /* Assertions */
  public async assertPageTitle() {
    await expect(this.page.locator('h1'),
      "Kit Upload page - page title doesn't match the expected one")
      .toHaveText(this.PAGE_TITLE);
  }

  public async assertInstructionSnapshot() {
    await expect(this.page.locator(this.uploadInstructionsXPath),
      "Kit Upload page - Kit upload instructions screenshot doesn't match the provided one")
      .toHaveScreenshot('upload_instructions.png');
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForNoSpinner(this.page);
    for (const kitType of kitTypes) {
      await expect(this.kitType.displayedKitType(kitType),
        'Kit Upload page - Displayed kit types checkboxes are wrong').toBeVisible()
    }
  }

  public async assertBrowseBtn(): Promise<void> {
    await expect(this.page.locator('//label[text()[normalize-space()="Browse..."]][@class="label-button"]'),
      'Kit Upload page - Browse... button should be visible.')
      .toBeVisible();
  }

  public async assertUploadKitsBtn(): Promise<void> {
    await expect(this.page.getByText('Upload Kits'),
      'Kit Upload page - Kit Uploads button should be visible.')
      .toBeVisible();
  }

  public async skipAddressValidation(value = false): Promise<void> {
    value && await this.skipAddressValidationCheckbox.click();
  }

  public get skipAddressValidationCheckbox(): Locator {
    return this.page.locator('//mat-checkbox[.//*[@class="mat-checkbox-label" and text()="Skip address validation on upload"]]');
  }

  /* XPaths */
  private get uploadInstructionsXPath(): string {
    return '//div[./b[text()[normalize-space()="Upload instructions:"]]]';
  }

  private get modalContentXPath(): string {
    return '//div[@class="modal fade in"]//div[@class="modal-content"]';
  }

  private get modalFooterXPath(): string {
    return `${this.modalContentXPath}//div[@class="modal-footer"]`;
  }

  private get modalUploadKitBtnXPath(): string {
    return `${this.modalFooterXPath}//button[text()[normalize-space()="Upload Kit"]]`;
  }

  private get modalBodyContentCheckboxesXPath(): string {
    return `${this.modalContentXPath}/div[@class="modal-body"]/div[@class="app-modal-body"]/div/mat-checkbox`;
  }
}
