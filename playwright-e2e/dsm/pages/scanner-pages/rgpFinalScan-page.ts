import {expect, Page, Locator} from '@playwright/test';

type inputField = 'Kit Label' | 'RNA' | 'DSM Label';

export default class RgpFinalScanPage {
    private readonly PAGE_TITLE = 'RGP Final Scan';

    constructor(private readonly page: Page) {}

    public async fillScanTrio(kitLabel: string, rna:string, dsmLabel: string, rowNumber: number): Promise<void> {
        //Setup which row will be filled with info
        const kitLabelLocator = this.page.locator(`(//mat-form-field//input[contains(@data-placeholder, 'Kit Label')])[${rowNumber}]`);
        const rnaLocator = this.page.locator(`(//mat-form-field//input[contains(@data-placeholder, 'RNA')])[${rowNumber}]`);
        const dsmLabelLocator = this.page.locator(`(//mat-form-field//input[contains(@data-placeholder, 'DSM Label')])[${rowNumber}]`);

        //Input info
        await kitLabelLocator.fill(kitLabel);
        await kitLabelLocator.blur();

        await rnaLocator.fill(rna);
        await rnaLocator.blur();

        await dsmLabelLocator.fill(dsmLabel);
        await dsmLabelLocator.blur();
    }

    public async getNumberOfScannableRows(): Promise<number> {
        const numberOfRows = this.page.locator('//form/div').count();
        return numberOfRows;
    }

    public getSaveScanPairsButton(): Locator {
        const scanPairButton = this.page.getByRole('button', { name: 'Save Scan Pairs' });
        return scanPairButton;
    }
}
