import { Locator } from '@playwright/test';

export interface WidgetInterface {
  toLocator(): Locator;
  errorMessage(): Locator;
  toQuestion(): Locator;
}
