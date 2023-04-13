import { expect, Locator, Page } from '@playwright/test';

//Inputting the various kit types that can be uploaded in DSM
//todo Update as needed as more kit upload tests are created
enum KitType {
    BLOOD = 'BLOOD',
    BLOOD_AND_RNA = 'BLOOD & RNA'
}

export default class KitUploadPage {
    private readonly PAGE_TITLE: string = 'Kit Upload';
    constructor(private readonly page: Page) {}

    public getPageTitle(): Locator {
        return this.page.locator('h1');
    }

    //looking into using the above enums for this - this was just jotted down
    public getKitTypeOption(kitType: string): Locator {
        return this.page.locator(`text='${kitType}'`);
    }

   public getSkipAddressValidationOption(): Locator {
        return this.page.locator('text=Skip address validation on upload');
   }

   //to-do add screenshot verification for the kit upload instructions
}
