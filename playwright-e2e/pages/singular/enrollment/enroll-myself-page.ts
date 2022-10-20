import { Locator, Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Question from 'lib/component/Question';

export default class EnrollMyselfPage extends SingularPage {
  readonly enrollMyself: Locator;

  constructor(page: Page) {
    super(page);
    this.enrollMyself = this.page.locator('button', { hasText: 'Enroll myself' });
  }

  async waitForReady() {
    // Add additional checks to wait for page is ready
    await this.whoHasVentricleHeartDefect().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * <br> Question: Who in your family has single ventricle heart defect?
   * <br> Type: Checkbox
   */
  whoHasVentricleHeartDefect(): Question {
    return new Question(this.page, {
      prompt: 'Who in your family has single ventricle heart defect?'
    });
  }
}
