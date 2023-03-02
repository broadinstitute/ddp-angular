import { expect, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import { PancanPageBase } from 'pages/pancan/pancan-page-base';
import { PatientsData, TypePatient } from 'pages/patient-type';

export default class PreScreeningDiagnosisPage extends PancanPageBase {
  typePerson;
  constructor(page: Page, typePerson: TypePatient = 'adult') {
    super(page);
    this.typePerson = typePerson;
  }

  async waitForReady(): Promise<void> {
    await this.cancerDiagnosed().toLocator().waitFor({ state: 'visible' });
    await expect(this.getNextButton()).toBeEnabled();
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
