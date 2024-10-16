import { expect, Locator, Page } from '@playwright/test';
import OncHistoryTable from 'dsm/component/tables/onc-history-table';
import { waitForResponse } from 'utils/test-utils';
import Select from 'dss/component/select';
import Button from 'dss/component/button';
import TabBase from 'dsm/pages/tablist/tab-base';
import { Tab } from 'dsm/enums';

export default class OncHistoryTab extends TabBase {
  private readonly oncHistoryTable: OncHistoryTable;
  protected readonly PARTICIPANT_DID_NOT_CONSENT = `This participant did not consent to sharing tissue`;

  constructor(page: Page) {
    super(page, Tab.ONC_HISTORY);
    this.oncHistoryTable = new OncHistoryTable(this.page, `${this.toLocator}//app-onc-history-detail`);
  }

  public get table(): OncHistoryTable {
    return this.oncHistoryTable;
  }

  public get didNotConsentMessage(): Locator {
    return this.page.getByText(this.PARTICIPANT_DID_NOT_CONSENT);
  }

  public async openFilesOrderModal(): Promise<void> {
    await this.page.getByText('Change order/files in Bundle').click();
  }

  public async selectFilesOrderAndDownload(nameOfDocument: string, order: number): Promise<void> {
    const modalContent = this.filesOrderModalBodyContent(nameOfDocument);

    await expect(modalContent, `Files order modal is not visible`).toBeVisible();

    const orderSelection = new Select(this.page, { root: modalContent });
    await orderSelection.selectOption(order.toString());
  }

  public async downloadPDFBundleAfterOrder(): Promise<void> {
    const downloadPDFBundleBtnLocator = this.filesOrderModalFooter;
    await expect(downloadPDFBundleBtnLocator, `Download PDF Bundle button is not visible`).toBeVisible();

    const downloadPDFBundleBtn = new Button(this.page, { root: downloadPDFBundleBtnLocator, label: 'Download PDF Bundle' });

    const respPromise = waitForResponse(this.page, { uri: 'downloadPDF' });
    await downloadPDFBundleBtn.click();
    const downloadFinishedText = this.page.getByText('Download finished.');
    await expect(downloadFinishedText, 'Downloading finished is not visible').toBeVisible();
    await respPromise;
  }

  public async downloadPDFBundle(): Promise<void> {
    await this.downloadPDFFlow(this.downloadPDFBundleButton);
  }

  public async downloadRequestDocuments(): Promise<void> {
    await this.downloadPDFFlow(this.downloadRequestDocumentsButton);
  }


  /* Helper Functions */

  /*
    @TODO: once the PDF file is fixed, this will be updated
   */
  private async downloadPDFFlow(downloadBtn: Locator): Promise<void> {
    await expect(downloadBtn, `Download PDF Bundle Button is not visible`).toBeVisible();
    await expect(downloadBtn, `Download PDF Bundle Button is not enabled`).toBeEnabled();

    const waitRespPromise = waitForResponse(this.page, { uri: 'downloadPDF' });
    await downloadBtn.click();
    await this.requestAnyway();
    const downloadingText = this.page.getByText('Downloading... This might take a while');
    await expect(downloadingText, 'Downloading text is not visible').toBeVisible();
    await waitRespPromise;

    const downloadFinishedText = this.page.getByText('Download finished.');
    await expect(downloadFinishedText).toBeVisible();
  }

  private async requestAnyway(): Promise<void> {
    const requestAnywayBtn = this.page.getByRole('button', { name: 'Request Anyway' });
    if (await requestAnywayBtn.isVisible()) {
      await requestAnywayBtn.click();
    }
  }

  private async downloadPDF(downloadBtn: Locator): Promise<string | null> {
    await downloadBtn.click();

    const [downloadedPDF] = await Promise.all([
      this.page.waitForEvent('download'),
      waitForResponse(this.page, { uri: 'downloadPDF' }),
      this.requestAnyway()
    ]);

    const fileName = downloadedPDF.suggestedFilename();
    const filePath = await downloadedPDF.path();
    await downloadedPDF.saveAs(fileName);

    return filePath;
  }

  /* Locators */
  private get downloadPDFBundleButton(): Locator {
    return this.toLocator.getByRole('button', { name: 'Download PDF Bundle' });
  }

  private get downloadRequestDocumentsButton(): Locator {
    return this.toLocator.getByRole('button', { name: 'Download Request Documents' });
  }

  private filesOrderModalBodyContent(name: string): Locator {
    return this.page.locator(`//app-participant-page/app-modal//div[@class='modal-body']` +
      `//table/tbody/tr[td[text()[normalize-space()='${name}']]]/td[1]`);
  }

  private get filesOrderModalFooter(): Locator {
    return this.page.locator(`//app-participant-page/app-modal//div[@class='modal-footer']`);
  }
}
