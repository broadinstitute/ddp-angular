import { Locator } from '@playwright/test';

export interface WidgetInterface {
  toLocator(): Locator | undefined;
  errorMessage(): Locator;
  toQuestion(): Locator;
}
