import { expect, Locator, Page } from "@playwright/test";
import Question from "lib/component/Question";
import { PancanPage } from 'pages/pancan/pancan-page';

export default class SurveyCervicalCancerPage extends PancanPage {

  constructor(page: Page) {
    super(page);
  }
  async waitForReady(): Promise<void> {
    await this.cervicalCancerDiagnosedMonth().waitFor({ state: 'visible' });
    await this.cervicalCancerDiagnosedYear().waitFor({ state: 'visible' });
  }
  /**
     * <br> Question: When were you first diagnosed with Cervical cancer?
     * <br> Type: Locator
     */
  cervicalCancerDiagnosedMonth(): Locator {
    return new Question(this.page, { prompt: 'When were you first diagnosed with Cervical cancer?' }).select('Choose month...');


  }
  /**
   * <br> Question: When were you first diagnosed with Cervical cancer?
   * <br> Type: Locator
   */

  cervicalCancerDiagnosedYear(): Locator {
    return new Question(this.page, { prompt: 'When were you first diagnosed with Cervical cancer?' }).select('Choose year...');

  }
  /**
   * <br> Question: Please select the places in the body where you had cancer when you was first diagnosed.
   * <br> Type: Input
   */

  cancerBodyPlaces(): Locator {
    return this.page.locator('.picklist-answer-INITIAL_BODY_LOC').locator('input');

  }
  /**
     * <br> Question: Are you currently cancer-free (e.g. in remission, no evidence of disease (NED), no evidence of active disease (NEAD))?
     * <br> Type: Radio-button
     */
  cancerFree(): Question {
    return new Question(this.page, { prompt: 'Are you currently cancer-free (e.g. in remission, no evidence of disease (NED), no evidence of active disease (NEAD))?' });

  }
  /**
     * <br> Question: Please select all the places in the body where you have ever had cancer to the best of your knowledge.
     * <br> Type: Input
     */
  bodyPlacesEverHadCancer() {
    return this.page.locator('.picklist-answer-EVER_BODY_LOC').locator('input');
  }
  /**
     * <br> Question: Have you received any of the following treatments or procedures for your cancer?
     * <br> Type: checkbox
     */
  treatmentsReceived(label: string): Locator {
    return this.page.locator('.picklist-answer-TREATMENTS').locator('mat-checkbox').filter({ hasText: label });

  }
  /**
     * <br> Question: Please list all medications/chemotherapies that you have previously received and are currently receiving for the treatment of your cancer
     * <br> Type: Input
     */
  medicationsList(): Locator {
    return this.page.locator('.activity-text-input-THERAPY_NAME').locator('input');

  }
  async cervicalCancerDiagnosedDate(month: string, year: string) {
    await this.cervicalCancerDiagnosedMonth().selectOption({ label: month });
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