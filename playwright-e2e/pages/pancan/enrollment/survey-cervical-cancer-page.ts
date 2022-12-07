import { expect, Locator, Page } from "@playwright/test";
import Question from "lib/component/Question";
import Checkbox from "lib/widget/checkbox";
import { PancanPage } from "../pancan-page";

export default class SurveyCervicalCancerPage extends PancanPage {

  constructor(page: Page) {
    super(page);
  }
  async waitForReady(): Promise<void> {
    await this.cervicalCancerDiagnosedMonth().waitFor({state:'visible'});
    await this.cervicalCancerDiagnosedYear().waitFor({state:'visible'});
  }
  //Question select
  cervicalCancerDiagnosedMonth(): Locator {
    return new Question(this.page, { prompt: 'When were you first diagnosed with Cervical cancer?' }).select('Choose month...');


  }
  //Question select
  cervicalCancerDiagnosedYear(): Locator {
    return new Question(this.page, { prompt: 'When were you first diagnosed with Cervical cancer?' }).select('Choose year...');

  }
  //Question selectInput
  cancerBodyPlaces(): Locator {
    return this.page.locator('.picklist-answer-INITIAL_BODY_LOC').locator('input');
    //return new Question(this.page,{parentSelector: this.page.locator('.picklist-answer-INITIAL_BODY_LOC')}).input();

  }
  //Question radio-button
  cancerFree(): Question {
    return new Question(this.page,{prompt: 'Are you currently cancer-free (e.g. in remission, no evidence of disease (NED), no evidence of active disease (NEAD))?'});

  }
  //Question radio-button
  bodyPlacesEverHadCancer() {
    return this.page.locator('.picklist-answer-EVER_BODY_LOC').locator('input');
  }
  //Question mat-checkbox
  treatmentsReceived(label: string) {
    return this.page.locator('.picklist-answer-TREATMENTS').locator('mat-checkbox').filter({hasText: label});

  }
  //Question input
  medicationsList() {
    return this.page.locator('.activity-text-input-THERAPY_NAME').locator('input');

  }
  async cervicalCancerDiagnosedDate(month: string,year: string){
    await this.cervicalCancerDiagnosedMonth().selectOption({label: month});
    await this.cervicalCancerDiagnosedYear().selectOption(year);
  }
  async fillCancerBodyPlaces(value: string) {
    await this.cancerBodyPlaces().fill(value);
    await this.cancerBodyPlaces().press('Tab');
  }
  async fillBodyPlacesEverHadCancer(value: string) {
    await this.bodyPlacesEverHadCancer().fill(value);
    await this.bodyPlacesEverHadCancer().press('Tab');
  }
  async checkTreatmentsReceived(option: string) {
    await this.treatmentsReceived(option).click();
    await expect(this.treatmentsReceived('Radiation')).toHaveClass(/checkbox-checked/);
  }


}