import { Locator, Page } from '@playwright/test';
import Table from 'dss/component/table';
import MedicalRecordsRequestPage from 'dsm/pages/tablist-pages/medical-records-request-page';

export default class MedicalRecordsTable extends Table {
  private readonly medicalRecordsRequestPage: MedicalRecordsRequestPage;

  constructor(page: Page, root: Locator) {
    super(page, { cssClassAttribute: '.table', root });
    this.medicalRecordsRequestPage = new MedicalRecordsRequestPage(this.page);
  }

  public async openRequestPageByRowIndex(index: number): Promise<MedicalRecordsRequestPage> {
    await this.cell(0, 0).click();
    // await this.rowLocator().nth(index).click();
    await this.medicalRecordsRequestPage.waitForReady();
    return this.medicalRecordsRequestPage;
  }
}
