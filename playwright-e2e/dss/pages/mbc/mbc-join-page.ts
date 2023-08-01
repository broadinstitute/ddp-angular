import {MBCPageBase} from "./mbc-page-base";
import {Locator, Page} from "@playwright/test";
import Question from "../../component/Question";

export class MBCJoinPage extends MBCPageBase {
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1');
  }

  whoIsSigningUP(): Question {
    return new Question(this.page, {cssClassAttribute: '.picklist-answer-PREQUAL_SELF_DESCRIBE'});
  }
}
