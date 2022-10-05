import { Page } from '@playwright/test';
import Dropdown from 'tests/lib/widget/dropdown';

export function study(page: Page): Dropdown {
  return new Dropdown(page, new RegExp('^Study$'));
}
