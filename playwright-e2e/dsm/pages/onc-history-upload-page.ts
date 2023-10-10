import { Locator, Page, expect } from '@playwright/test';
import DsmPageBase from './dsm-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import { OsteoOncHistoryUpload } from 'dsm/component/tabs/interfaces/onc-history-inputs-types';

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
      .toHaveText('Click here to download the Onc History upload template and data dictionary');
    await expect(this.uploadBtn).toBeDisabled();
    await waitForNoSpinner(this.page);
  }

  createUploadBody(oncHistories: OsteoOncHistoryUpload[]): string {
    return oncHistories.map((oncHistory: OsteoOncHistoryUpload) => {
      const {shortId, firstName, lastName, address} = oncHistory;
      // eslint-disable-next-line max-len
      return `\n${shortId}\t${firstName}\t${lastName}\t${address.street1}\t${address.street2}\t${address.city}\t${address.postalCode}\t${address.state}\t${address.country}`;
    }).join();
  }

  private get fileInput(): Locator {
    return this.page.locator('//app-filepicker//input');
  }

  private get uploadBtn(): Locator {
    return this.page.locator('//button[.//span[text()[normalize-space()="Upload"]]]');
  }
}
