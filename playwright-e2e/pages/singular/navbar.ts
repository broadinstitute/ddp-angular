import { Page, Response } from '@playwright/test';

// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '../.env.dev') });

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
  if (process.env.singularBaseURL === undefined) {
    throw Error('process.env.singularBaseURL is not valid. Check .env file in /playwright-e2e dir.');
  }
  const urlPath = typeof path === 'undefined' ? '' : path;
  return await page.goto(`${process.env.singularBaseURL}/${urlPath}`, { waitUntil: 'networkidle' });
}

export async function visitHomePage(page: Page): Promise<Response | null> {
  return await goToPath(page);
}

export async function signMeUp(page: Page): Promise<void> {
  return await page.locator(NavSelectors.SignMeUp).click();
}

export async function clickLogin(page: Page): Promise<void> {
  await page.locator(NavSelectors.Login).click();
}