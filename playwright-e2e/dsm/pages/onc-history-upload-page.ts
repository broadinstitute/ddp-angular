import { Locator, Page, expect, Response } from '@playwright/test';
import DsmPageBase from './dsm-page-base';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { createTextFileSync, deleteFileSync } from 'utils/file-utils';
import path from 'path';

export default class OncHistoryUploadPage extends DsmPageBase {
  PAGE_TITLE = 'Onc History Upload';
  private downloadButton: Locator;

  constructor(page: Page) {
    super(page);
    this.downloadButton = this.page.getByRole('button', { name: 'Download' })
  }

  get toLocator(): Locator {
    return this.page.locator('app-onc-history-upload');
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('.download-button'))
      .toHaveText(/Click here to download the Onc History upload template and data dictionary/);
    await expect(this.uploadBtn).toBeDisabled();
    await waitForNoSpinner(this.page);
  }

  public async uploadFile(study: string, data: string, testResultDir?: string): Promise<Response> {
    const dir = testResultDir ? testResultDir : __dirname;
    const filePath = path.join(dir, `${study.trim().replace('\\s', '')}-OncHistory-${new Date().getTime()}.txt`);

    createTextFileSync(dir, filePath, data);
    await this.fileInput.setInputFiles(filePath);

    const [resp] = await Promise.all([
      waitForResponse(this.page, {uri: '/oncHistory', }),
      this.uploadBtn.click()
    ]);
    await waitForNoSpinner(this.page);
    deleteFileSync(filePath);
    return resp;
  }

  private get fileInput(): Locator {
    return this.page.locator('//app-filepicker//input');
  }

  private get uploadBtn(): Locator {
    return this.page.locator('//button[.//span[text()[normalize-space()="Upload"]]]');
  }
}
