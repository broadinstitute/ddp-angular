import { BrowserContext, Download, errors, expect, Locator, Page, Response } from '@playwright/test';
import Input from 'dss/component/input';
import Checkbox from 'dss/component/checkbox';
import Select from 'dss/component/select';
import axios from 'axios';
import { logError } from './log-utils';
import { MessageBodyResponseEnum } from 'dsm/pages/participant-page/enums/message-body-response-enum';
import { StudyName } from 'dsm/component/navigation';

export interface WaitForResponse {
  uri: string;
  status?: number;
  timeout?: number;
  messageBody?: MessageBodyResponseEnum[];
}

const { SITE_PASSWORD } = process.env;

export async function waitForNoSpinner(page: Page, opts: { timeout?: number } = {}): Promise<void> {
  const { timeout = 50 * 1000 } = opts;
  const spinner = page.locator('[data-icon="spinner"].fa-spin, mat-spinner[role="progressbar"]').first();
  const appError = page.locator('app-error-snackbar .snackbar-content').first();
  await page.waitForLoadState().catch((err) => logError(err));
  const pageStatus = await Promise.race([
    spinner.waitFor({ state: 'hidden' }).then(() => 'Ready'),
    appError.waitFor({ state: 'visible' }).then(() => 'Error'),
    new Promise((_, reject) => setTimeout(() => reject(Error('Time out waiting for loading spinner to stop or a app error.')), timeout)),
  ]);
  if (pageStatus === 'Ready') {
    // Check again for app error after spinner stopped
    const visible = await appError.isVisible();
    if (visible) {
      throw new Error(await appError.innerText());
    }
  }
  if (pageStatus === 'Error') {
    throw new Error(await appError.innerText());
  }
}

export async function waitForResponse(page: Page, { uri, status = 200, timeout, messageBody }: WaitForResponse): Promise<Response> {
  let response: any;
  try {
    if (messageBody) {
      response = await page.waitForResponse((response: Response) => response.url().includes(uri) &&
      messageBody.every(async message => (await response.text()).includes(message as string)), { timeout });
    } else {
      response = await page.waitForResponse((response: Response) => response.url().includes(uri), { timeout });
    }
    await response.finished();
  } catch (err) {
    if (err instanceof errors.TimeoutError) {
      throw new Error(`TimeoutError: waiting for URI: ${uri}: Timeout exceeded`);
    }
    throw err;
  }
  const respStatus = response.status();
  if (respStatus === status) {
    return response;
  }
  const url = response.url();
  const method = response.request().method().toUpperCase();
  const body = await response.text();
  const reqPayload = response.request().postData() || '';

  throw new Error(
    `Waiting for URI: ${uri} with status: ${status}.\n  ${method} ${url}\n  Status: ${respStatus}\n  Text: ${body}\n  Payload: ${reqPayload}`);
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
    throw Error(`Invalid parameter: password is null`);
  }
  await page.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 30 * 1000 });
  await page.locator('input[type="password"]').fill(password);

  await Promise.all([
    waitForResponse(page, { uri: '/irb-password-check' }),
    page.keyboard.press('Enter')
  ]);
  await expect(page.locator('app-root')).toBeAttached();
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
    case StudyName.OSTEO2:
      name = 'osteo2';
      break;
    case StudyName.LMS:
      name = 'cmi-lms';
      break;
    default:
      name = study;
  }
  const expectedFileName = `${name}_export.zip`;
  expect(actualFileName.toLowerCase()).toBe(expectedFileName.toLowerCase());
}

export function studyShortName(study: StudyName): {
  shortName: string | null;
  realm: string | null;
  collaboratorPrefix: string | null;
  playwrightPrefixAdult: string | null;
  playwrightPrefixChild: string | null} {
  const dsmEnv = getDsmEnv();
  let shortName = null;
  let realm = null;
  let collaboratorPrefix = null;
  let playwrightPrefixAdult = null;
  let playwrightPrefixChild = null;
  switch (study) {
    case StudyName.LMS:
      shortName = 'cmi-lms';
      realm = 'cmi-lms';
      collaboratorPrefix = 'PECGSProject';
      break;
    case StudyName.OSTEO:
      shortName = 'cmi-osteo';
      realm = 'Osteo';
      collaboratorPrefix = 'OSProject';
      break;
    case StudyName.OSTEO2:
      shortName = 'cmi-osteo';
      realm = 'osteo2';
      collaboratorPrefix = 'OSPECGS';
      playwrightPrefixAdult = 'OS';
      playwrightPrefixChild = 'KidFirst';
      break;
    case StudyName.AT:
      shortName = 'AT';
      realm = 'atcp';
      break;
    case StudyName.PANCAN:
      shortName = 'cmi-pancan';
      realm = 'PanCan';
      collaboratorPrefix = 'Project';
      break;
    case StudyName.RAREX:
      shortName = 'rarex';
      realm = 'RareX';
      break;
    case StudyName.MBC:
      shortName = 'cmi-mbc';
      realm = 'Pepper-MBC';
      collaboratorPrefix = 'MBCProject';
      break;
    case StudyName.BRAIN:
      shortName = 'cmi-brain';
      realm = 'Brain';
      collaboratorPrefix = 'BrainProject';
      break;
    case StudyName.ANGIO:
      shortName = 'angio';
      realm = dsmEnv === 'dsm-test' ? 'Pepper-Angio' : 'Angio';
      collaboratorPrefix = 'Project Pepper';
      break;
    case StudyName.PROSTATE:
      shortName = 'cmi-mpc';
      realm = 'Prostate';
      collaboratorPrefix = 'PCProject';
      break;
    case StudyName.ESC:
      shortName = 'cmi-esc';
      realm = 'GEC';
      collaboratorPrefix = 'GECProject';
      break;
    case StudyName.BASIL:
      shortName = 'basil';
      realm = 'BASIL';
      break;
    case StudyName.RGP:
      shortName = 'rgp';
      realm = 'RGP';
      break;
    default:
      throw new Error(`Study ${study} is undefined.`);
  }
  return { shortName, realm, collaboratorPrefix, playwrightPrefixAdult, playwrightPrefixChild };
}

export function isCMIStudy(study: StudyName): boolean {
  return (study === StudyName.ANGIO) ||
  (study === StudyName.BRAIN) ||
  (study === StudyName.ESC) ||
  (study === StudyName.MBC) ||
  (study === StudyName.OSTEO) ||
  (study === StudyName.PANCAN) ||
  (study === StudyName.PROSTATE);
}

export function isPECGSStudy(study: StudyName): boolean {
  return (study === StudyName.OSTEO2) || (study === StudyName.LMS);
}

export function shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function toHaveScreenshot(page: Page, locator: Locator | string, name: string): Promise<void> {
  // https://github.com/microsoft/playwright/issues/18827
  const loc = typeof locator === 'string' ? page.locator(locator) : locator;
  await expect.soft(loc).toHaveScreenshot(name);
}

// Validate date format is mm/dd/yyyy
export function assertDateFormat(value: string) {
  expect(value).toMatch(/^\d\d\/\d\d\/\d\d\d\d$/);
}

export function getDsmEnv(): string {
  const { DSM_BASE_URL } = process.env;
  return DSM_BASE_URL?.includes('dsm-test') ? 'dsm-test' : 'dsm-dev';
}
