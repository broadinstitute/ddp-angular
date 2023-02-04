import { BrowserContext, Download, expect, Locator, Page } from '@playwright/test';
import Input from 'lib/widget/Input';
import Checkbox from 'lib/widget/checkbox';
import Radiobutton from 'lib/widget/radiobutton';
import Select from 'lib/widget/select';
import axios from 'axios';

const { SITE_PASSWORD } = process.env;

export async function waitForNoSpinner(page: Page): Promise<void> {
  await page
    .locator('[data-icon="spinner"].fa-spin, mat-spinner[role="progressbar"]')
    .waitFor({ state: 'hidden', timeout: 30 * 1000 });
}

export async function waitUntilRemoved(locator: Locator): Promise<void> {
  await expect(locator).toHaveCount(0);
}

export async function getTextValue(locator: Locator): Promise<string | null> {
  return locator.evaluate<string, HTMLSelectElement>((node) => node.value);
}

/**
 * Download (fake) Consent form
 * @param context
 * @param locator
 */
export async function downloadConsentPdf(context: BrowserContext, locator: Locator): Promise<Download | void> {
  // Use axis to fetch pdf directly
  const downloadHref = await locator.getAttribute('href');
  expect(downloadHref).not.toBeNull();
  expect(downloadHref).toMatch(new RegExp(/https:\/\/storage\.googleapis\.com\/singular-(dev|staging)-assets\/consent_self.pdf/));
  const response = await axios.get(downloadHref as string);
  const fileData = Buffer.from(response.data);
  expect(fileData && fileData.length).toBeTruthy();

  // Ensure new page opens when click on link
  await Promise.all([context.waitForEvent('page'), locator.click()]);
  expect(context.pages()).toHaveLength(2);
  const [, newPage] = context.pages();
  await newPage.close();
}

/**
 * On non-prod env, user must first enter the Site password
 * @param page
 * @param password
 */
export async function fillSitePassword(page: Page, password = SITE_PASSWORD): Promise<void> {
  if (password == null) {
    throw Error(`Invalid parameter: password is "${SITE_PASSWORD}"`);
  }
  await page.locator('input[type="password"]').fill(password);
  await Promise.all([page.waitForNavigation(), page.locator('button >> text=Submit').click()]);
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
export function findButton(page: Page, dataDdpTest: string) {
  return page.locator(`button[data-ddp-test="${dataDdpTest}"]`);
}

// Seen wrapped inside a button
export function findIcon(dataDdpTest: string) {
  return `mat-icon[data-ddp-test="${dataDdpTest}"]`;
}

// Fill in input
export async function fillIn(page: Page, stableID: string, value: string): Promise<void> {
  await new Input(page, { ddpTestID: stableID }).fill(value);
}

export async function check(page: Page, stableID: string): Promise<void> {
  await new Checkbox(page, { ddpTestID: stableID }).check();
}

export async function checkRadioButton(page: Page, stableID: string): Promise<void> {
  await new Radiobutton(page, { ddpTestID: stableID }).check();
}

export async function select(page: Page, stableID: string, option: string): Promise<void> {
  await new Select(page, { ddpTestID: stableID }).selectOption(option);
}

export async function click(page: Page, stableID: string, option: string): Promise<void> {
  await page.locator(`[data-ddp-test="${stableID}"]`).selectOption(option);
}

export function booleanToYesOrNo(val: boolean) {
  return val ? 'Yes' : 'No';
}
/**
 * Returns the default value if value is null, empty or undefined.
 * @param value
 * @param defaultValue
 */
export const getEnv = (value: string | undefined, defaultValue: string): string => {
  if (value == null && defaultValue == null) {
    throw Error('Invalid Parameters: Value and defaultValue are both undefined or null.');
  }
  return value == null ? defaultValue : value;
};

