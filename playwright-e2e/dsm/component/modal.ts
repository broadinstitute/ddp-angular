import { Locator, Page } from '@playwright/test';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import Radiobutton from 'dss/component/radiobutton';
import { waitForNoSpinner } from 'utils/test-utils';

export default class Modal {
  private readonly rootSelector: Locator;

  constructor(private readonly page: Page) {
    this.rootSelector = this.page.locator('.modal-dialog');
  }

  public toLocator(): Locator {
    return this.rootSelector;
  }

  public headerLocator(): Locator {
    return this.toLocator().locator('.modal-header');
  }

  public footerLocator(): Locator {
    return this.toLocator().locator('.modal-footer');
  }

  public bodyLocator(): Locator {
    return this.toLocator().locator('.modal-body');
  }

  async getHeader(): Promise<string> {
    return this.headerLocator().innerText();
  }

  async getBodyText(): Promise<string> {
    return this.bodyLocator().innerText();
  }

  async close(): Promise<void> {
    await this.getButton({ label: 'Close' }).click();
    await waitForNoSpinner(this.page);
  }

  public getButton(opts: { label?: string | RegExp; ddpTestID?: string }): Button {
    const { label, ddpTestID } = opts;
    return new Button(this.page, { label, ddpTestID, root: this.toLocator() });
  }

  public getInput(opts: { label?: string | RegExp }): Input {
    const { label } = opts;
    return new Input(this.page, { label, root: this.toLocator() });
  }

  public getRadiobutton(label: string | RegExp): Radiobutton {
    return new Radiobutton(this.page, { label, root: this.toLocator() });
  }
}
