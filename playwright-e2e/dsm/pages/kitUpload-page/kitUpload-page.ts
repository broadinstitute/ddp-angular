import {expect, Locator, Page, Response} from '@playwright/test';
import {Kit} from 'dsm/enums';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {createTextFileSync, deleteFileSync} from 'utils/file-utils';
import {KitUploadInfo} from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import path from 'path';
import Modal from 'dsm/component/modal';
import {logInfo} from 'utils/log-utils';
import KitsPageBase from 'dsm/pages/kits-page-base';
import { StudyName } from 'dsm/component/navigation';

export default class KitUploadPage extends KitsPageBase {
  TABLE_HEADERS = [];
  PAGE_TITLE = 'Kit Upload';
  private readonly T_HEAD = 'shortId\tfirstName\tlastName\tstreet1\tstreet2\tcity\tpostalCode\tstate\tcountry';

  constructor(page: Page) {
    super(page);
  }

  public async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.skipAddressValidationCheckbox).toBeVisible();
  }

  public async selectKitType(kitType: Kit): Promise<boolean> {
    return super.selectKitType(kitType, { waitForResp: 'undefined' });
  }

  public async uploadFile(kitType: Kit, kitInfo: KitUploadInfo[], study: StudyName, testResultDir?: string) {
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

    // Handle Upload modal window if it's displayed
    await this.handleDuplicatedOrSpecialKits();

    await expect(this.page.locator('h3')).toHaveText(/All participants were uploaded/, { timeout: 1000 });
    await expect(this.uploadKitsBtn, 'Kit Upload page - "Upload Kits" button should be disabled.').not.toBeEnabled();
    deleteFileSync(filePath);
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
    const clickKitUploadBtn = async (locator: Locator): Promise<void> => {
      await expect(locator).toBeEnabled();
      await Promise.all([
        waitForResponse(this.page, {uri: '/kitUpload'}),
        locator.click()
      ]);
      await waitForNoSpinner(this.page);
    }

    const modal = new Modal(this.page);
    try {
      await expect(modal.toLocator()).toBeVisible({timeout: 5000});
    } catch (err) {
      return;
    }
    const btnLocator = modal.getButton({label: 'Upload Kit'}).toLocator();
    const duplicatedKitsCount: number = await this.page.locator(this.modalBodyContentCheckboxesXPath).count();

    await expect(btnLocator).toBeDisabled();

    const bodyText = await modal.getBodyText();
    logInfo(`Kit Upload modal: ${bodyText}`);

    if (bodyText.indexOf('Participant already has a kit') > -1 || bodyText.indexOf('do you really want to upload a kit?') > -1) {
      for (let dupKit = 0; dupKit < duplicatedKitsCount; dupKit++) {
        await this.page.locator(this.modalBodyContentCheckboxesXPath).nth(dupKit).click();
      }
      await clickKitUploadBtn(btnLocator);
      return;
    }
    throw new Error(`Unexpected modal: ${bodyText}`);
  }

  /* Locators */
  private get fileInput(): Locator {
    return this.page.locator('//app-filepicker//input');
  }

  private get uploadKitsBtn(): Locator {
    return this.page.locator('//button[.//span[text()[normalize-space()="Upload Kits"]]]');
  }

  /* Assertions */

  public async assertInstructionSnapshot() {
    await expect(this.page.locator(this.uploadInstructionsXPath),
      "Kit Upload page - Kit upload instructions screenshot doesn't match the provided one")
      .toHaveScreenshot('upload_instructions.png');
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
    return `${this.modalContentXPath}/div[@class="modal-body"]//mat-checkbox`;
  }
}
