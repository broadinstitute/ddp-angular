import { Locator, Page } from '@playwright/test';
import Button from 'lib/widget/button';
import Input from 'lib/widget/input';

export default class Modal {
  private readonly rootSelector: Locator;

  constructor(private readonly page: Page) {
    this.page = page;
    this.rootSelector = this.page.locator('.modal-dialog');
  }

  toLocator(): Locator {
    return this.rootSelector;
  }

  private headerLocator(): Locator {
    return this.toLocator().locator('.modal-header');
  }

  private footerLocator(): Locator {
    return this.toLocator().locator('.modal-footer');
  }

  private bodyLocator(): Locator {
    return this.toLocator().locator('.modal-body');
  }

  async getHeader(): Promise<string> {
    return this.headerLocator().innerText();
  }

  getButton(opts: { label?: string | RegExp; ddpTestID?: string }): Button {
    const { label, ddpTestID } = opts;
    return new Button(this.page, { label, ddpTestID, root: this.toLocator() });
  }

  getInput(opts: { label?: string | RegExp }): Input {
    const { label } = opts;
    return new Input(this.page, { label, root: this.toLocator() });
  }
}
