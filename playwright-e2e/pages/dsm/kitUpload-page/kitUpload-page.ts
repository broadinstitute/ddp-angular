import {expect, Locator, Page} from "@playwright/test";
import {KitType} from "lib/component/dsm/kitType/kitType";
import {KitTypeEnum} from "lib/component/dsm/kitType/enums/kitType-enum";
import {waitForNoSpinner, waitForResponse} from "utils/test-utils";
import {crateTextFileSync, deleteFileSync} from "utils/file-utils";
import {KitInfo} from "models/dsm/kitUpload-model";
import {StudyEnum} from "lib/component/dsm/navigation/enums/selectStudyNav-enum";

interface KitUploadResponse {
  invalidKitAddressList: any[];
  duplicateKitList: any[];
  specialKitList: any[];
  specialMessage: string;
}

export default class KitUploadPage {
  private readonly PAGE_TITLE = 'Kit Upload';
  private readonly kitType = new KitType(this.page);

  constructor(private readonly page: Page) {
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await this.waitForReady();
    await this.kitType.selectKitType(kitType);
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  public async uploadFile(kitType: KitTypeEnum, kitInfo: KitInfo, study: StudyEnum) {
    const thead = 'shortId\tfirstName\tlastName\tstreet1\tstreet2\tcity\tpostalCode\tstate\tcountry';
    const {shortId, firstName, lastName, street1, street2, city, postalCode, state, country} = kitInfo;
    const tbody = `\n${shortId}\t${firstName}\t${lastName}\t${street1}\t${street2}\t${city}\t${postalCode}\t${state}\t${country}`;
    const path = `${__dirname}/${kitType}_${study}-${new Date().getTime()}.txt`;
    crateTextFileSync(path, thead + tbody);

    await this.fileInput.setInputFiles(path);
    await expect(this.uploadKitsBtn, 'Upload Kits button is disabled').not.toBeDisabled();
    await this.uploadKitsBtn.click();

    const response = await waitForResponse(this.page, {uri: '/kitUpload'});
    const responseBody: KitUploadResponse = JSON.parse(await response.text());
    for(let [key, value] of Object.entries(responseBody)) {
      value instanceof Array &&
      await expect(value.length, `Couldn't upload kits - ${key} is not empty`).toEqual(0);
    }

    await this.waitForReady();
    await expect(await this.page.locator('h3')
      .textContent(), "Couldn't upload kits - something went wrong")
      .toEqual('All participants were uploaded.');

    deleteFileSync(path);
  }

  /* Locators */
  private get fileInput(): Locator {
    return this.page.locator('//app-filepicker//input');
  }

  private get uploadKitsBtn(): Locator {
    return this.page.locator('//button[.//span[text()[normalize-space()=\'Upload Kits\']]]');
  }

  /* Assertions */
  public async assertTitle() {
    await expect(this.page.locator('h1')).toHaveText(this.PAGE_TITLE);
  }

  public async assertInstructionSnapshot() {
    await expect(await this.page.locator(this.uploadInstructionsXPath).screenshot(),
      "Kit upload instructions screenshot doesn't match the provided one")
      .toMatchSnapshot(`upload_instructions.png`);
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForResponse(this.page, {uri: '/kitTypes'});
    await this.waitForReady();
    await this.kitType.verifyDisplayedKitTypes(kitTypes);
  }

  public async assertBrowseBtn(): Promise<void> {
    await expect(this.page.locator('//label[text()[normalize-space()=\'Browse...\']][@class=\'label-button\']'),
      'Browse button is not visible')
      .toBeVisible();
  }

  public async assertUploadKitsBtn(): Promise<void> {
    await expect(this.page.getByText('Upload Kits'), 'Kit Uploads button is not visible')
      .toBeVisible();
  }

  /* XPaths */
  private get uploadInstructionsXPath(): string {
    return '//div[./b[text()[normalize-space()=\'Upload instructions:\']]]';
  }
}
