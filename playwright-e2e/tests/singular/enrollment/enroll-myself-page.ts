import { Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import PageBase from 'lib/page-base';

export default class EnrollMyselfPage extends PageBase {
  readonly enrollMyself: Locator;

  constructor(page: Page) {
    super(page);
    this.enrollMyself = this.page.locator('button', { hasText: 'Enroll myself' });
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
