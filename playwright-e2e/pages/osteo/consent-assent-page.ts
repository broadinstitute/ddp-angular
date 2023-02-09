import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { OsteoPageBase } from './osteo-base-page';

export default class ConsentAssentPage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Research Consent & Assent Form');
    await waitForNoSpinner(this.page);
    await this.page.waitForLoadState('networkidle', {timeout: 2000});
  }

  async bloodAndTissue(agreeToBlood: boolean, agreeToTissue: boolean) : Promise<void> {
    const blood = agreeToBlood ? 'Yes' : 'No';
    const tissue = agreeToTissue? 'Yes' : 'No';
    await this.page.getByTestId('answer:CONSENT_ASSENT_BLOOD').getByText(blood).click();
    await this.page.getByTestId('answer:CONSENT_ASSENT_TISSUE').getByText(tissue).click();
  }

  async enterChildAssent(childName: string) : Promise<void> {
    await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_SIGNATURE').fill(childName);
    await this.page.waitForTimeout(1000);

  }

  async fillInParentAndMinor(minorFirstName: string,
    minorLastName: string,
    parentFirstName: string,
    parentLastName: string) : Promise<void> {
        await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_FIRSTNAME').fill(minorFirstName);
        await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_LASTNAME').fill(minorLastName);

        await this.page.getByTestId('answer:CONSENT_ASSENT_FIRSTNAME').fill(parentFirstName);
        await this.page.getByTestId('answer:CONSENT_ASSENT_LASTNAME').fill(parentLastName);
        
    }

}
