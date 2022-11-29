import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Input from 'lib/widget/Input';
import Radiobutton from 'lib/widget/radiobutton';

export enum DESCRIBE_SELF {
  HaveBeenDiagnosedWithAngiosarcoma = 'I have been diagnosed with angiosarcoma',
  HaveNotBeenDiagnosedWithAngiosarcoma = "I haven't been diagnosed with angiosarcoma",
  HaveLovedOneDiagnosedWithAngiosarcoma = 'I have a loved one that has passed away from angiosarcoma'
}

export default class CountMeInPage extends AngioPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ visible: true });
    await expect(this.pageTitle).toHaveText('Join the movement: tell us about yourself');
    await waitForNoSpinner(this.page);
  }

  /**
   * <br> Contact Info:
   * <br> Question: First Name
   * <br> Type: Input
   */
  firstName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PREQUAL_FIRST_NAME' });
  }

  /**
   * <br> Contact Info:
   * <br> Question: Last Name
   * <br> Type: Input
   */
  lastName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PREQUAL_LAST_NAME' });
  }

  /**
   * <br> Self Describe
   * <br> Type: Radiobutton picklist
   */
  diagnosedWithAngiosarcoma(label: DESCRIBE_SELF): Radiobutton {
    return new Radiobutton(this.page, { label });
  }
}
