import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import { PancanPage } from 'pages/pancan/pancan-page';
import { typePatient, PatientsData } from './utils/PatientType';

export default class PreScreeningDiagnosisPage extends PancanPage {
  constructor(page: Page, private typePerson: TypePatient = 'adult') {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.cancerDiagnosed().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * <br> Question: What primary cancer(s) have you been diagnosed with?
   * <br> Select Diagnosis
   * <br> Type: Select
   */
  cancerDiagnosed(): Question {
    return new Question(this.page, { prompt: PatientsData[this.typePerson].cancerDiagnosed.prompt });
  }
}
