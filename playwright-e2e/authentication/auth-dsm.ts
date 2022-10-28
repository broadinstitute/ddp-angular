import { Page } from '@playwright/test';

// DSM_USER_EMAIL and DSM_USER_PASSWORD are set in circleci config.yml
const { dsmUserEmail, dsmUserPassword, DSM_USER_EMAIL, DSM_USER_PASSWORD } = process.env;

export async function fillEmailPassword(
  page: Page,
  opts: { email: string | undefined; password: string | undefined }
): Promise<void> {
  const { email, password } = opts;

  const emailInput = page.locator('input[type="email"]');
  if (typeof email === 'string') {
    await emailInput.fill(email);
  }

  const passwordInput = page.locator('input[type="password"]');
  if (typeof password === 'string') {
    await passwordInput.fill(password);
  }

  await page.locator('button[type="submit"]').click();
}

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const {
    email = dsmUserEmail ? dsmUserEmail : DSM_USER_EMAIL,
    password = dsmUserPassword ? dsmUserPassword : DSM_USER_PASSWORD
  } = opts;
  await page.goto(process.env.dsmBaseURL as string);
  await fillEmailPassword(page, { email, password });
}
