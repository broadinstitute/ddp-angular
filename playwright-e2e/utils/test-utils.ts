import { Locator, Page } from '@playwright/test';
import Input from 'lib/widget/Input';
import Checkbox from 'lib/widget/checkbox';
import Radiobutton from 'lib/widget/radiobutton';
import Select from 'lib/widget/select';

export async function getTextValue(locator: Locator): Promise<string | null> {
  return await locator.evaluate<string, HTMLSelectElement>((node) => node.value);
}

/**
 * Find a web element by the value of "data-ddp-test". Currently, not all web elements have it.
 * @param page
 * @param opts
 */
export function findElement(page: Page, opts: { dataDdpTest: string }): Locator {
  const { dataDdpTest } = opts;
  return page.locator(`[data-ddp-test="${dataDdpTest}"]`);
}

// Why not call findElement()?
export function findTextInput(page: Page, dataDdpTest: string): Locator {
  return page.locator(`input[data-ddp-test="${dataDdpTest}"]`);
}

export function findCheckbox(page: Page, dataDdpTest: string): Locator {
  return page.locator(`mat-checkbox[data-ddp-test="${dataDdpTest}"] label`);
}

export function findRadioButton(dataDdpTest: string) {
  return `mat-radio-button[data-ddp-test="${dataDdpTest}"] label`;
}

export function findSelect(dataDdpTest: string) {
  return `mat-select[data-ddp-test="${dataDdpTest}"]`;
}

export function findDateMonth(dataDdpTest: string) {
  return `input[data-ddp-test="${dataDdpTest}" and data-placeholder="MM"]`;
}

export function findDateDay(dataDdpTest: string) {
  return `input[data-ddp-test="${dataDdpTest}" and data-placeholder="DD"]`;
}

export function findDateYear(dataDdpTest: string) {
  return `input[data-ddp-test="${dataDdpTest}" and data-placeholder="YYYY"]`;
}

export function findLink(dataDdpTest: string) {
  return `a[data-ddp-test="${dataDdpTest}"]`;
}

// Buttons on a page, in a table cell, etc.
export function findButton(dataDdpTest: string) {
  return `button[data-ddp-test="${dataDdpTest}"]`;
}

// Seen wrapped inside a button
export function findIcon(dataDdpTest: string) {
  return `mat-icon[data-ddp-test="${dataDdpTest}"]`;
}

// Fill in input
const fillIn = async (page: Page, stableID: string, value: string): Promise<void> => {
  await new Input(page, { ddpTestID: stableID }).fill(value);
};

const check = async (page: Page, stableID: string): Promise<void> => {
  await new Checkbox(page, { ddpTestID: stableID }).check();
};

const checkRadioButton = async (page: Page, stableID: string): Promise<void> => {
  await new Radiobutton(page, { ddpTestID: stableID }).check();
};

const select = async (page: Page, stableID: string, option: string): Promise<void> => {
  await new Select(page, { ddpTestID: stableID }).selectOption(option);
};

const click = async (page: Page, stableID: string, option: string): Promise<void> => {
  await page.locator(`[data-ddp-test="${stableID}"]`).selectOption(option);
};

module.exports = {
  fillIn,
  check,
  checkRadioButton,
  select,
  click
};
