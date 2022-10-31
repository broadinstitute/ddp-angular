import { Page } from '@playwright/test';
import { fillEmailPassword } from 'authentication/auth-singular';

const { dsmUserEmail, dsmUserPassword, dsmBaseURL } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = dsmUserEmail, password = dsmUserPassword } = opts;
  if (email == null || password == null) {
    throw Error('Invalid parameters: DSM user email and password are undefined or null.');
  }
  await page.goto(dsmBaseURL as string);
  await fillEmailPassword(page, { email, password, waitForNavigation: false });
}
