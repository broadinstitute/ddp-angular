import { expect, Page } from '@playwright/test';
import PageBase from 'pages/page-base';


/**
 * Cancer selector widget used widely by CMI
 */
export class CancerSelector {

  private readonly page:Page;
  private readonly cancerSelector: string;
  private readonly diagnosisTimeLabel: string;

constructor(page: Page, cancerSelector: string, diagnosisTimeLabel:string) {
    this.page = page;  
    this.cancerSelector = cancerSelector;
    this.diagnosisTimeLabel = diagnosisTimeLabel;
  }

  async chooseCancer(index: number, search:string, pressDownTimes:number, expectedResult:string): Promise<void> {
    const cancerField = this.page.locator(this.cancerSelector).getByRole('combobox').nth(index);
    await cancerField.click();
    await cancerField.type(search, { delay: 200});

    for (var i = 0; i < pressDownTimes; i++) {
        await this.page.waitForTimeout(1000);
        await cancerField.press('ArrowDown'); 
    }
    await cancerField.press('Enter');
    await expect(cancerField).toHaveValue(expectedResult)
  }

  async chooseDiagnosisAt(index: number, diagnosisAt: string): Promise<void> {
    await this.page.locator(this.diagnosisTimeLabel).getByRole('combobox').nth(index).selectOption(diagnosisAt);
  }
}
