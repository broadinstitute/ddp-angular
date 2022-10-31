import { Page } from '@playwright/test';
import { clickLogin, NavSelectors } from 'pages/singular/navbar';
import { makeEmailAlias } from 'utils/string-utils';

const { singularUserEmail, singularUserPassword } = process.env;

export async function fillEmailPassword(
  page: Page,
  opts: { email: string; password: string; waitForNavigation?: boolean }
): Promise<void> {
  const { email, password, waitForNavigation = true } = opts;

  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill(email);
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill(password);

  const navPromise = waitForNavigation ? page.waitForNavigation({ waitUntil: 'domcontentloaded' }) : Promise.resolve();
  await Promise.all([
    page.locator(NavSelectors.LoadingSpinner).first().waitFor({ state: 'visible' }),
    navPromise,
    page.locator('button[name="submit"], button[type="submit"]').click()
  ]);
}

export async function login(
  page: Page,
  opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}
): Promise<void> {
  const { email = singularUserEmail, password = singularUserPassword, waitForNavigation } = opts;
  if (email == null || password == null) {
    throw Error('Invalid parameters: Email and Password are undefined or null.');
  }
  await clickLogin(page);
  await fillEmailPassword(page, { email, password, waitForNavigation });
}

export async function createAccountWithEmailAlias(
  page: Page,
  opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}
): Promise<string> {
  const {
    email = makeEmailAlias(singularUserEmail as string),
    password = singularUserPassword as string,
    waitForNavigation
  } = opts;
  await fillEmailPassword(page, { email, password, waitForNavigation });
  return email;
}
