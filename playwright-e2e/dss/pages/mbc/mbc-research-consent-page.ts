import {MBCPageBase} from './mbc-page-base';
import {expect, Locator, Page} from '@playwright/test';
import Question from 'dss/component/Question';

type yesNo = 'Yes' | 'No';

export class MBCResearchConsentPage extends MBCPageBase {
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Research Consent Form');
    await super.waitForReady();
  }

  /**
   * <br> Question: You can work with me to arrange a sample of blood to be drawn at my physician’s office, local clinic, or nearby lab facility.
   */
  public async consentBlood(answer: yesNo = 'Yes'): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.boolean-answer-CONSENT_BLOOD'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  /**
   * <br> Question: You can request my stored tissue samples from my physicians and the hospitals and other places where I received my care, perform (or collaborate with others to perform) gene tests on the samples, and store the samples until this research study is complete.
   */
  public async consentTissue(answer: yesNo = 'Yes'): Promise<void> {
    await new Question(this.page, {cssClassAttribute: '.boolean-answer-CONSENT_TISSUE'})
      .radioButton(answer, {exactMatch: true}).click();
  }

  public async fullName(answer: string): Promise<void> {
    await this.fillInFullName(answer);
  }

  public async dateOfBirth(month: string, day: string, year: string): Promise<void> {
    await this.fillInDateOfBirth(month, day, year);
  }
}
