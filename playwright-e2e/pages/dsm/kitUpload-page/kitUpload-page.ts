import {expect, Locator, Page, Response} from '@playwright/test';
import {KitType} from 'lib/component/dsm/kitType/kitType';
import {KitTypeEnum} from 'lib/component/dsm/kitType/enums/kitType-enum';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {crateTextFileSync, deleteFileSync} from 'utils/file-utils';
import {KitUploadInfo} from 'pages/dsm/kitUpload-page/models/kitUpload-model';
import {StudyEnum} from 'lib/component/dsm/navigation/enums/selectStudyNav-enum';
import {KitUploadResponse} from "./interfaces/kitUpload";
import {kitUploadResponseEnum} from "./enums/kitUploadResponse-enum";

export default class KitUploadPage {
  private readonly PAGE_TITLE = 'Kit Upload';
  private readonly T_HEAD = 'shortId\tfirstName\tlastName\tstreet1\tstreet2\tcity\tpostalCode\tstate\tcountry';
  private readonly kitType = new KitType(this.page);

  constructor(private readonly page: Page) {
  }

  public async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await waitForNoSpinner(this.page);
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await waitForNoSpinner(this.page);
    await this.kitType.selectKitType(kitType);
  }

  public async uploadFile(kitType: KitTypeEnum, kitInfo: KitUploadInfo[], study: StudyEnum) {
    const path = `${__dirname}/${kitType}_${study}-${new Date().getTime()}.txt`;
    crateTextFileSync(path, this.T_HEAD + this.createKitUploadBody(kitInfo));
    await this.fileInput.setInputFiles(path);

    await expect(this.uploadKitsBtn, 'Kit Upload page - Upload Kits button is disabled').toBeEnabled();

    await this.uploadKitsBtn.click();
    await this.handleKitUploadResponse();
    await waitForNoSpinner(this.page);

    await expect(await this.page.locator('h3')
      .textContent(), "Kit Upload page - Couldn't upload kits - something went wrong")
      .toEqual('All participants were uploaded.');

    deleteFileSync(path);
  }

  /* Helper functions */
  private createKitUploadBody(kitInfo: KitUploadInfo[]): string {
    return kitInfo.map((kitInfo: KitUploadInfo) => {
      const {shortId, firstName, lastName, street1, street2, city, postalCode, state, country} = kitInfo;
      return `\n${shortId}\t${firstName}\t${lastName}\t${street1}\t${street2}\t${city}\t${postalCode}\t${state}\t${country}`;
    }).join();
  }

  private waitForKitUploadResponse(): Promise<Response> {
    return waitForResponse(this.page, {uri: '/kitUpload'});
  }

  private async handleKitUploadResponse(): Promise<void> {
    const response = await this.waitForKitUploadResponse();
    const responseBody: KitUploadResponse = JSON.parse(await response.text());

    for (const [key, value] of Object.entries(responseBody)) {
      if (value instanceof Array && value.length) {
        if (key === kitUploadResponseEnum.INVALID_KIT_ADDRESS_LIST) {
          throw new Error('Invalid kit addresses array is not empty');
        } else {
          await this.handleDuplicatedOrSpecialKits();
        }
      }
    }
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

    await uploadKitButton.click();
    await this.waitForKitUploadResponse();
    await waitForNoSpinner(this.page);
  }

  /* Locators */
  private get fileInput(): Locator {
    return this.page.locator('//app-filepicker//input');
  }

  private get uploadKitsBtn(): Locator {
    return this.page.locator('//button[.//span[text()[normalize-space()=\'Upload Kits\']]]');
  }

  /* Assertions */
  public async assertPageTitle() {
    await expect(this.page.locator('h1'),
      "Kit Upload page - page title doesn't match the expected one")
      .toHaveText(this.PAGE_TITLE);
  }

  public async assertInstructionSnapshot() {
    expect(await this.page.locator(this.uploadInstructionsXPath).screenshot(),
      "Kit Upload page - Kit upload instructions screenshot doesn't match the provided one")
      .toMatchSnapshot('upload_instructions.png');
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForResponse(this.page, {uri: '/kitTypes'});
    await waitForNoSpinner(this.page);
    for (const kitType of kitTypes) {
      await expect(this.kitType.displayedKitType(kitType),
        'Kit Upload page - Displayed kit types checkboxes are wrong').toBeVisible()
    }
  }

  public async assertBrowseBtn(): Promise<void> {
    await expect(this.page.locator('//label[text()[normalize-space()=\'Browse...\']][@class=\'label-button\']'),
      'Kit Upload page - Browse button is not visible')
      .toBeVisible();
  }

  public async assertUploadKitsBtn(): Promise<void> {
    await expect(this.page.getByText('Upload Kits'),
      'Kit Upload page - Kit Uploads button is not visible')
      .toBeVisible();
  }

  /* XPaths */
  private get uploadInstructionsXPath(): string {
    return "//div[./b[text()[normalize-space()='Upload instructions:']]]"
  }

  private get modalContentXPath(): string {
    return "//div[@class='modal fade in']//div[@class='modal-content']"
  }

  private get modalHeaderXPath(): string {
    return `${this.modalContentXPath}//div[@class='modal-header']`
  }

  private get modalFooterXPath(): string {
    return `${this.modalContentXPath}//div[@class='modal-footer']`
  }

  private get modalUploadKitBtnXPath(): string {
    return `${this.modalFooterXPath}//button[text()[normalize-space()='Upload Kit']]`
  }

  private get modalBodyContentCheckboxesXPath(): string {
    return `${this.modalContentXPath}/div[@class='modal-body']/div[@class='app-modal-body']/div/mat-checkbox`
  }
}
