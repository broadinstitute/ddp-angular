import { Page } from '@playwright/test';
import AtcpRegistrationPage from 'dss/pages/atcp/atcp-registration-page';
import { generateEmailAlias } from 'utils/faker-utils';

const { ATCP_USER_EMAIL, ATCP_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = ATCP_USER_EMAIL, password = ATCP_USER_PASSWORD } = opts;
  if (!email) {
    throw Error('Invalid ATCP email');
  }
  if (!password) {
    throw Error('Invalid ATCP password');
  }
  const loginLocator = '.Header a >> text="Sign In"';
  await page.locator(loginLocator).click();

  await page.locator('#login input#email').fill(email);
  await page.locator('#login input#password').fill(password);
  await page.click('button >> text="Sign In"');
}

export async function createAccountWithEmailAlias(
  page: Page,
  opts: { email: string | undefined; password: string | undefined }
): Promise<string> {
  const { email, password } = opts;
  if (!email) {
    throw Error('Invalid parameters: User email is undefined or null.');
  }
  if (!password) {
    throw Error('Invalid parameters: User password is undefined or null.');
  }

  const emailInput = page.locator('.sign-up input[name="email"][id="email"]');
  const passwordInput = page.locator('.sign-up input[name="password"][id="password"]');
  const passwordConfirmInput = page.locator('.sign-up input[name="password_confirm"][id="password_confirm"]');

  const emailAlias = generateEmailAlias(email);
  await emailInput.fill(emailAlias);
  await passwordInput.fill(password);
  await passwordConfirmInput.fill(password);
  await page.locator('button#join-us').click();

  return emailAlias;
}
