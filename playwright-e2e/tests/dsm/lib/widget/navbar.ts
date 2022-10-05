import { Page } from '@playwright/test';
import Dropdown from 'tests/lib/widget/dropdown';

export async function selectStudy(page: Page, option: string): Promise<void> {
  const dropdown = new Dropdown(page, new RegExp('^Study$'));
  await Promise.all([page.waitForNavigation(), dropdown.select(option)]);
}
