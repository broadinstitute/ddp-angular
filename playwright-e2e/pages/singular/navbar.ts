import { Page, Response } from '@playwright/test';

const { SINGULAR_BASE_URL } = process.env;

export const NavSelectors = {
  Login: '.header button[data-ddp-test="signInButton"]:has-text("Log In")',
  LoadingSpinner: '.auth0-loading',
  AboutUs: '.header__nav >> text=About Us',
  StudyProgress: '.header__nav >> text=Study Progress',
  FAQs: '.header__nav >> text=FAQs',
  ForResearchers: '.header__nav >> text=For Researchers',
  ForClinicians: '.header__nav >> text=For Clinicians',
  SignMeUp: '.header__nav >> text=Sign me up!'
};

export async function goToAboutUs(page: Page): Promise<void> {
  const aboutUs = page.locator(NavSelectors.AboutUs);
  await Promise.all([page.waitForNavigation(), aboutUs.click()]);
}

/**
 *
 * @param page
 * @param path URL path (appended to baseURL)
 */
export async function goToPath(page: Page, path?: string): Promise<Response | null> {
  if (SINGULAR_BASE_URL == null) {
    throw Error('SINGULAR_BASE_URL is not valid. Check .env file in /playwright-e2e dir.');
  }
  const urlPath = typeof path === 'undefined' ? '' : path;
  return await page.goto(`${SINGULAR_BASE_URL}/${urlPath}`, { waitUntil: 'networkidle' });
}

export async function visitHomePage(page: Page): Promise<Response | null> {
  return await goToPath(page);
}

export async function signMeUp(page: Page): Promise<void> {
  const progressSpinner = 'mat-spinner[role="progressbar"]';
  await Promise.all([page.locator(NavSelectors.SignMeUp).click(), page.locator(progressSpinner).waitFor({ state: 'visible' })]);
  await page.locator(progressSpinner).waitFor({ state: 'detached', timeout: 30 * 1000 });
}

export async function clickLogin(page: Page): Promise<void> {
  await page.locator(NavSelectors.Login).click();
}
