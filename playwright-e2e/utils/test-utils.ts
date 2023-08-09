import {BrowserContext, Download, expect, Locator, Page, Response} from '@playwright/test';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import Input from 'dss/component/input';
import Checkbox from 'dss/component/checkbox';
import Select from 'dss/component/select';
import axios from 'axios';

export interface WaitForResponse {
  uri: string;
  status?: number;
  timeout?: number;
}

const { SITE_PASSWORD } = process.env;

export async function waitForNoSpinner(page: Page, opts: { timeout?: number } = {}): Promise<void> {
  const { timeout = 60 * 1000 } = opts;
  const locator = page.locator('[data-icon="spinner"].fa-spin, mat-spinner[role="progressbar"]');
  await locator.first().waitFor({ state: 'hidden', timeout }); // if more than one spinners are found, only wait for first one to disappear.
}

export async function waitForResponse(page: Page, {uri, status = 200, timeout = 30000}: WaitForResponse): Promise<Response> {
  try {
    return page.waitForResponse(
      (response: Response) => response.url().includes(uri) && response.status() === status,
      {timeout}
    )
  } catch (error: any) {
    throw new Error(`Timeout ${timeout}ms exceeded while waiting for ${uri} URI response with status - ${status}`)
  }
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
  await page.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 30 * 1000 });
  await page.locator('input[type="password"]').fill(password);

  const passwordCheckRequestPromise = waitForResponse(page, { uri: '/irb-password-check' });
  await Promise.all([
    passwordCheckRequestPromise,
    page.keyboard.press('Enter')
  ]);
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

/**
 * Verify DSM Participant List download file name with a fixed pattern.
 * @param {Download} download
 * @param {string} study
 */
export function assertParticipantListDownloadFileName(download: Download, study: string) {
  const actualFileName = download.suggestedFilename();
  let name;
  switch (study) {
    case StudyEnum.OSTEO2:
      name = 'osteo2';
      break;
    case StudyEnum.LMS:
      name = 'cmi-lms';
      break;
    default:
      name = study;
  }
  const expectedFileName = `${name}_export.zip`;
  expect(actualFileName.toLowerCase()).toEqual(expectedFileName.toLowerCase());
}

export function studyShortName(study: StudyEnum): {shortName: string | null; realm: string | null} {
  let shortName = null;
  let realm = null;
  switch (study) {
    case StudyEnum.LMS:
      shortName = 'cmi-lms';
      realm = 'cmi-lms';
      break;
    case StudyEnum.OSTEO2:
      shortName = 'cmi-osteo';
      realm = 'osteo2';
      break;
    case StudyEnum.AT:
      shortName = 'AT';
      realm = 'atcp';
      break;
    case StudyEnum.PANCAN:
      shortName = 'cmi-pancan';
      realm = 'PanCan';
      break;
    case StudyEnum.RAREX:
      shortName = 'rarex';
      realm = 'RareX';
      break;
    case StudyEnum.MBC:
      shortName = 'cmi-mbc';
      realm = 'Pepper-MBC';
      break;
    case StudyEnum.BRAIN:
      shortName = 'cmi-brain';
      realm = 'Brain';
      break;
    case StudyEnum.ANGIO:
      shortName = 'angio';
      realm = 'Angio';
      break;
    default:
      break;
  }
  return {shortName, realm};
}
