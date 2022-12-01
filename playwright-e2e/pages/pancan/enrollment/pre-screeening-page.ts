import { Page } from '@playwright/test';
import { PancanPage } from '../pancan-page';
import Question from '../../../lib/component/Question';

export default class PreScreeningPage extends PancanPage {

    constructor(page: Page) {
        super(page);
    }
    async waitForReady(): Promise<void> {
        await this.whoIsSigningUp().toLocator().waitFor({ state: 'visible' });
      }

    /**
       * <br> Question: First, who is signing up for Count Me In? Check all that apply
       * <br> Type: Checkbox
       */
    whoIsSigningUp(): Question {
        return new Question(this.page, {
            prompt: 'First, who is signing up for Count Me In? Check all that apply'
        });
    }

}