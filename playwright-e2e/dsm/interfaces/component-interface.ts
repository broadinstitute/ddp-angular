import { Locator } from '@playwright/test';

export default interface ComponentInterface {
  get toLocator(): Locator;
}
