import { Locator, Page, expect } from '@playwright/test';
import DsmPageBase from './dsm-page-base';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { createTextFileSync, deleteFileSync } from 'utils/file-utils';
import path from 'path';

export default class OncHistoryUploadPage extends DsmPageBase {
  downloadButton: Locator;

  constructor(page: Page) {
    super(page);
    this.downloadButton = this.page.getByRole('button', { name: 'Download' })
  }

  async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1')).toHaveText('Onc History Upload');
    await waitForNoSpinner(this.page);
    await expect(this.page.locator('.download-button'))
      .toHaveText(/Click here to download the Onc History upload template and data dictionary/);
    await expect(this.uploadBtn).toBeDisabled();
    await waitForNoSpinner(this.page);
  }

  public async uploadFile(study: string, data: string, testResultDir?: string) {
    const dir = testResultDir ? testResultDir : __dirname;
    const filePath = path.join(dir, `${study.trim().replace('\\s', '')}-OncHistory-${new Date().getTime()}.txt`);

    createTextFileSync(dir, filePath, data);
    await this.fileInput.setInputFiles(filePath);
    await this.uploadBtn.click();

    await waitForResponse(this.page, {uri: '/oncHistory', });
    await waitForNoSpinner(this.page);

    deleteFileSync(filePath);
  }

  private get fileInput(): Locator {
    return this.page.locator('//app-filepicker//input');
  }

  private get uploadBtn(): Locator {
    return this.page.locator('//button[.//span[text()[normalize-space()="Upload"]]]');
  }
}
