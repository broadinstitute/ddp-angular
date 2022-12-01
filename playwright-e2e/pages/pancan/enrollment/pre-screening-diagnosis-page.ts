import { Page } from "@playwright/test";
import Question from "lib/component/Question";
import { PancanPage } from "../pancan-page";

export default class PreScreeningDiagnosisPage extends PancanPage {

  constructor(page: Page){
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
    return new Question(this.page, { prompt: 'What primary cancer(s) have you been diagnosed with?' });
  }


}