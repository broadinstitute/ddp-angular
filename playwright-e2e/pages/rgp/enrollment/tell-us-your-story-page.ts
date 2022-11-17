import { expect, Locator, Page } from '@playwright/test';
import { RgpPageBase } from 'pages/rgp/rgp-page-base';
import Question from 'lib/component/question';
import { waitForNoSpinner } from 'utils/test-utils';

export enum WHO {
  UnderstandEnglishOrSpanish = 'Understands English or Spanish',
  LivesInUS = 'Lives in the United States',
  HasRareGeneticallyUndiagnosedCondition = 'Has a rare and genetically undiagnosed condition',
  // eslint-disable-next-line max-len
  IsUnderCare = "Is currently under the care of a doctor that is helping to understand the cause of the patient's condition"
}

export default class TellUsYourStoryPage extends RgpPageBase {
  private title: Locator;

  constructor(page: Page) {
    super(page);
    this.title = this.page.locator('h2.Title');
  }

  async waitForReady(): Promise<void> {
    await expect(this.title).toBeVisible({ visible: true });
    await expect(this.title).toHaveText('Thank you for your interest in joining the Rare Genomes Project!');
    await waitForNoSpinner(this.page);
  }

  who(): Question {
    return new Question(this.page, { prompt: 'I am, or am applying on behalf of, a patient who:' });
  }
}
