import { expect, Page } from '@playwright/test';
import Input from 'lib/widget/input';

/**
 * Cancer selector widget used widely by CMI
 */
export class CancerSelector {
  constructor(readonly page: Page, readonly cancerSelector: string, readonly diagnosisTimeLabel: string) {
  }

  async chooseCancer(index: number, search: string, pressDownTimes: number, expectedResult: string): Promise<void> {
    const input = new Input(this.page, { root: this.cancerSelector, nth: index });
    await input.fill(search, { dropdownOption: expectedResult, type: true });
    await expect(input.toLocator()).toHaveValue(expectedResult);
  }

  async chooseDiagnosisAt(index: number, diagnosisAt: string): Promise<void> {
    await this.page.locator(this.diagnosisTimeLabel).getByRole('combobox').nth(index).selectOption(diagnosisAt);
  }
}
