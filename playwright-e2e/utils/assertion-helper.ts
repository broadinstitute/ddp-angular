import { expect, Page } from '@playwright/test';

export const assertActivityHeader = async (page: Page, expectedText: string | RegExp) => {
  await expect(page.locator('h1.activity-header')).toHaveText(expectedText);
};

export const assertActivityProgress = async (page: Page, expectedText: string) => {
  await expect(page.locator('h3.progress-title')).toHaveText(expectedText);
};
