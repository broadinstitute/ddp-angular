import { Locator, Page } from '@playwright/test';
import ComponentInterface from 'dsm/interfaces/component-interface';

export default class ComponentBase implements ComponentInterface {
  protected root: Locator;

  protected constructor(protected readonly page: Page, opts: { readonly root?: Locator | string } = {}) {
    const { root = 'app-root app-all-studies' } = opts;
    this.root = typeof root === 'string' ? this.page.locator(root) : root;
  }

  get toLocator(): Locator {
    return this.root;
  }
}
