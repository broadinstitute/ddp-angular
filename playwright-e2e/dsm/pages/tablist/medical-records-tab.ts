import { Page } from '@playwright/test';
import MedicalRecordsTable from 'dsm/component/tables/medical-records-table';
import { Tab } from 'dsm/enums';
import TabBase from 'dsm/pages/tablist/tab-base';

export default class MedicalRecordsTab extends TabBase {
  private readonly medicalRecordsTable: MedicalRecordsTable;

  constructor(page: Page) {
    super(page, Tab.MEDICAL_RECORD);
    this.medicalRecordsTable = new MedicalRecordsTable(this.page, this.rootLocator);
  }

  public get table(): MedicalRecordsTable {
    return this.medicalRecordsTable;
  }
}
