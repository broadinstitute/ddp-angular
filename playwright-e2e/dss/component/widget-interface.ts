import { Locator } from '@playwright/test';

export interface WidgetInterface {
  toLocator(): Locator;
  toLocators(): Promise<Array<Locator>>;
  errorMessage(): Locator;
  toQuestion(): Locator;
  click(): Promise<void>;
  isDisabled(): Promise<boolean>;
  isVisible(): Promise<boolean>;
  getAttribute(attributeName: string): Promise<string | null>;
}
