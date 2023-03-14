import { expect, Locator, Page } from '@playwright/test';

export const assertHeader = async (page: Page, expectedText: string | RegExp) => {
  await expect(page.locator('h1')).toHaveText(expectedText);
};

export const assertActivityHeader = async (page: Page, expectedText: string | RegExp) => {
  await expect(page.locator('h1.activity-header')).toHaveText(expectedText);
};

export const assertActivityProgress = async (page: Page, expectedText: string) => {
  await expect(page.locator('h3.progress-title')).toHaveText(expectedText);
};

export const assertActivityStep = async (page: Page, expectedText: string) => {
  await expect(page.locator('.activity-steps .active .activity-step__number')).toHaveText(expectedText);
};

/**
 * Asserting selected option matches expected string in a Select web element.
 * Note: Works for Select
 *
 * @param {Locator} locator
 * @param {string} expectedOption
 * @returns {Promise<void>}
 */
export const assertSelectedOption = async (locator: Locator, expectedOption: string) => {
  await expect(async (): Promise<boolean> => {
    const selectedOption = await locator.evaluate<string, HTMLSelectElement>((node) => node.value);
    return selectedOption === expectedOption;
  }).toPass();
};
