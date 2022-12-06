import { Page } from '@playwright/test';
import { generateEmailAlias } from 'utils/faker-utils';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = RGP_USER_EMAIL, password = RGP_USER_PASSWORD } = opts;
  if (email == null) {
    throw Error('Invalid parameters: RGP user email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: RGP user password is undefined or null.');
  }
  await page.locator('.header a:has-text("Sign In")').click();
  await page.locator('input#signInEmail').fill(email);
  await page.locator('input#signInPassword').fill(password);
  await page.click('button#signInSubmit');
}

// Note: Cannot use same name function in auth-base because email and password locators are different in RGP
export async function createAccountWithEmailAlias(page: Page, opts: { email?: string; password?: string }): Promise<string> {
  const { email = RGP_USER_EMAIL, password = RGP_USER_PASSWORD } = opts;
  if (email == null) {
    throw Error('Invalid parameters: RGP user email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: RGP user password is undefined or null.');
  }

  const emailAlias = generateEmailAlias(email);
  await page.locator('input#signUpEmail').fill(emailAlias);
  await page.locator('input#signUpPassword').fill(password);
  await page.click('button#signUpSubmit');
  console.log(`Created RGP account with email: ${emailAlias}`);
  return emailAlias;
}
