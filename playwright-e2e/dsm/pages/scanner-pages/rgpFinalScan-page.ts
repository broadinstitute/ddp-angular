import {expect, Page, Locator} from '@playwright/test';

type inputField = 'Kit Label' | 'RNA' | 'DSM Label';

export default class RgpFinalScanPage {
    private readonly PAGE_TITLE = 'RGP Final Scan';

    constructor(private readonly page: Page) {}

    public async fillScanTrio(kitLabel: string, rna:string, dsmLabel: string, rowNumber: number): Promise<void> {
        //First check if the number row is valid
        const totalAmountOfRows = await this.getNumberOfScannableRows();
        expect(rowNumber, 'RGP Final Scan Page: More scannable rows displayed than expected').toBeLessThanOrEqual(totalAmountOfRows);

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
        return this.page.locator('//form/div').count();
    }

    private getSaveScanPairsButton(): Locator {
        return this.page.getByRole('button', { name: 'Save Scan Pairs' });
    }

    public async save(): Promise<void> {
        const scanPairButton = this.getSaveScanPairsButton();
        await expect(scanPairButton, 'RGP Final Scan page - Save Scan Pairs button is not enabled like expected').toBeEnabled();
        await scanPairButton.focus();
        await scanPairButton.click();
    }

    public async assertPageTitle(): Promise<void> {
        const heading = this.page.locator(`//h1[contains(., '${this.PAGE_TITLE}')]`);
        await expect(heading, 'RGP Final Scan page header is not visible').toBeVisible();
    }
}
