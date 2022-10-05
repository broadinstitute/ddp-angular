import { Page } from '@playwright/test';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

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

export async function login(page: Page, opts: { email: string; password: string }): Promise<void> {
  const { email, password } = opts;
  await page.goto(process.env.baseURL as string);
  // Login popup is automatically loaded
  await fillEmailPassword(page, { email, password });
}
