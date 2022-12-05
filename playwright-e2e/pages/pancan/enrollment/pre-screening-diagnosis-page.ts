import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import { PancanPage } from '../pancan-page';
import {TypePerson, TypePersonData} from './utils/PersonType';

export default class PreScreeningDiagnosisPage extends PancanPage {
  typePerson;
  constructor(page: Page, typePerson: TypePerson = 'adult') {
    super(page);
    this.typePerson = typePerson;
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
    return new Question(this.page, { prompt: TypePersonData[this.typePerson].cancerDiagnosed.prompt });
  }
}
