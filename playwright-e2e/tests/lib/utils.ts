import { Locator } from '@playwright/test';

export function makeRandomNum(min = 1, max = 99): number {
  const num = Math.random() * (max - min) + min;
  return Math.floor(num);
}

export function makeEmailAlias(originalEmail: string): string {
  const splintedEmail = originalEmail.split('@');
  const name = splintedEmail[0];
  const domain = splintedEmail[1];
  return `${name}+${Math.floor(Math.random() * 100000000)}@${domain}`;
}

export async function getTextValue(locator: Locator): Promise<string | null> {
  return await locator.evaluate<string, HTMLSelectElement>((node) => node.value);
}
