import { Page } from '@playwright/test';
import Dropdown from 'lib/widget/dropdown';

export function study(page: Page): Dropdown {
  return new Dropdown(page, 'Study');
}

export function sample(page: Page): Dropdown {
  return new Dropdown(page, new RegExp("^Samples$"));
}
