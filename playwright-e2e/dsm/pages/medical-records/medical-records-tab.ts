import { Page } from '@playwright/test';
import MedicalRecordsTable from './medical-records-table';

export default class MedicalRecordsTab {
  private readonly medicalRecordsTable: MedicalRecordsTable;

  constructor(private readonly page: Page) {
    this.medicalRecordsTable = new MedicalRecordsTable(this.page);
  }

  public get table(): MedicalRecordsTable {
    return this.medicalRecordsTable;
  }
}
