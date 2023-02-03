import { Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Input from 'lib/widget/input';
import Checkbox from 'lib/widget/checkbox';

export default class AssentFormPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.fullName().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * <br> Question: Type child/adolescent's full name to sign
   * <br> Type: Input
   */
  fullName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_ASSENT_FULL_NAME' });
  }

  /**
   * Checkbox: I have explained the study to the extent compatible with the subject’s capability, and the subject has agreed to be in the study.
   *
   */
  subjectHasAgreedToBeInStudy(): Checkbox {
    return new Checkbox(this.page, { label: 'subject has agreed to be in the study' });
  }

  /**
   * Checkbox: The subject is not able to assent because the capability of the subject is so limited that the subject cannot reasonably be consulted.
   *
   */
  subjectIsNotAbleToAssent(): Checkbox {
    return new Checkbox(this.page, { label: 'The subject is not able to assent' });
  }

  /**
   * <br> Question: Parent/Guardian Confirmation of Assent
   * <br> Type: Input
   */
  sign(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CONSENT_ASSENT_GUARDIAN_ASSENT_SIGNATURE' });
  }
}
