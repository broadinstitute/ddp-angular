import { Locator, Page } from '@playwright/test';
import Button from 'dss/component/button';
import Input from 'dss/component/input';

export default class Modal {
  private readonly rootSelector: Locator;

  constructor(private readonly page: Page) {
    this.rootSelector = this.page.locator('[aria-modal="true"][role="dialog"]');
  }

  toLocator(): Locator {
    return this.rootSelector;
  }

  getButton(opts: { label?: string; ddpTestID?: string }): Button {
    const { label, ddpTestID } = opts;
    return new Button(this.page, { label, ddpTestID, root: this.toLocator() });
  }

  getInput(opts: { label?: string | RegExp }): Input {
    const { label } = opts;
    return new Input(this.page, { label, root: this.toLocator() });
  }

  getContent(): Locator {
    return this.toLocator().locator('.mat-dialog-content');
  }
}
