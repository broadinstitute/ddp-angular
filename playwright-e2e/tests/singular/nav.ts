import { Locator, Page, Response } from '@playwright/test';
// import dotenv from 'dotenv';
// dotenv.config();

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
  const urlPath = typeof path === 'undefined' ? '' : path;

  return await page.goto(`${process.env.baseURL}/${urlPath}`, { waitUntil: 'networkidle' });
}

export async function visitHomePage(page: Page): Promise<Response | null> {
  return await goToPath(page);
}

export async function clickLogin(page: Page): Promise<void> {
  const loginLocator: Locator = page.locator(NavSelectors.Login);

  await loginLocator.click();
}

export async function login(
  page: Page,
  opts: { userEmail?: string | null; userPasswd?: string | null; expectErr?: boolean } = {}
): Promise<void> {
  // If parameter expectErr == true, login is expected to fail.
  const { userEmail, userPasswd, expectErr = false } = opts;

  await clickLogin(page);

  const emailInput = page.locator('input[type="email"]');

  if (typeof userEmail === 'string') {
    await emailInput.fill(userEmail);
  }

  const passwordInput = page.locator('input[type="password"]');

  if (typeof userPasswd === 'string') {
    await passwordInput.fill(userPasswd);
  }

  const submitButton = page.locator('button[name="submit"]');
  const loadingSpinner = page.locator(NavSelectors.LoadingSpinner);

  if (expectErr) {
    await submitButton.click();
  } else {
    await Promise.all([
      page.waitForNavigation(),
      loadingSpinner.first().waitFor({ state: 'visible' }),
      submitButton.click()
    ]);
    await loadingSpinner.waitFor({ state: 'hidden' });
  }
}

/**
 * On non-prod env, user must first enter the Site password
 * @param page
 * @param password
 */
export async function fillSitePassword(page: Page, password?: string): Promise<void> {
  const passwd: string = typeof password === 'undefined' ? (process.env.sitePassword as string) : password;

  if (!passwd) {
    throw new Error(`Site password is required.`);
  }
  await page.locator('input[type="password"]').fill(passwd);
  await Promise.all([page.waitForNavigation(), page.locator('button >> text=Submit').click()]);
}
