import { Page } from '@playwright/test';
import Table from 'dss/component/table';
import MedicalRecordsRequestPage from './medical-records-request-page';

export default class MedicalRecordsTable extends Table {
  private readonly medicalRecordsRequestPage: MedicalRecordsRequestPage;

  constructor(protected readonly page: Page) {
    super(page, { cssClassAttribute: '.table', root: 'tab[heading="Medical Records"]' });
    this.medicalRecordsRequestPage = new MedicalRecordsRequestPage(this.page);
  }

  public async openRequestPageByRowIndex(index: number): Promise<MedicalRecordsRequestPage> {
    await this.rowLocator().nth(index).click();
    await this.medicalRecordsRequestPage.waitForReady();
    return this.medicalRecordsRequestPage;
  }
}
