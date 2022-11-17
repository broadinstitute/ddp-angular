import { expect, Locator, Page } from '@playwright/test';
import DdpAddress from 'lib/component/ddp-address';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class MedicalReleaseForm extends AngioPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ visible: true });
    await expect(this.pageTitle).toHaveText('About you');
    await waitForNoSpinner(this.page);
  }

  /**
   * <br> Questions: Your contact information
   * <br> Type: Address
   */
  yourContactInformation(): DdpAddress {
    return new DdpAddress(this.page, { label: 'Your contact information' });
  }
}
