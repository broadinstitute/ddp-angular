import { expect, Locator, Page } from '@playwright/test';
import { KitType } from 'lib/component/dsm/samples/enums/kitType.enum'

export default class KitUploadPage {
    private readonly PAGE_TITLE: string = 'Kit Upload';
    constructor(private readonly page: Page) {}

    public getPageTitle(): Locator {
        return this.page.getByRole('heading', { name: this.PAGE_TITLE});
    }

    public getKitTypeOption(kitType: KitType): Locator {
     const kitOption = this.page.locator(`//mat-checkbox/label[span[normalize-space(text()) = '${kitType}']]`);
     return kitOption;
    }

    //This option only appears to some study admins based on permissions - so I have a getter here
    //so I can use it to verify display of option and also select option later
   public getSkipAddressValidationOption(): Locator {
        return this.page.locator('label').filter({ hasText: 'Skip address validation on upload' });
   }

   //todo add assertion for display of button
   public getBrowseButton(): Locator {
        return this.page.getByText('Browse...');
   }

   //todo add assertion for display of button
   private getUploadButton(): Locator {
        return this.page.getByRole('button', { name: 'Upload Kits' });
   }

   public async selectKitUploadButton(): Promise<void> {
        const kitUploadButton = this.getUploadButton();
        await kitUploadButton.click();
   }

   //todo maybe add assertion for the webelements of the popup
   public getKitUploadConfirmationPopUp(): Locator {
        return this.page.locator('app-modal div').filter({ hasText: 'Please select the participant for which you want to upload a new one'}).nth(3);
   }

   public async selectAddNewKitForParticipantOption(guid: string, shortID: string, firstName: string, lastName: string): Promise<void> {
        const participantKit = this.page.getByText(`Participant already has a kit. '${guid}' '${shortID}' '${firstName}' '${lastName}'`);
        await participantKit.check();
   }

   public async closeKitConfirmationPopUp(): Promise<void> {
        const closeButton = this.page.getByRole('button', { name: 'Close' });
        await closeButton.click();
   }

   public async confirmKitUpload(): Promise<void> {
        const updateKitsButton = this.page.getByRole('button', { name: 'Upload Kit', exact: true});
        await updateKitsButton.click();
   }

   public async assertKitUploadConfirmationMessage(): Promise<void> {
        const verficationMessage = this.page.getByRole('heading', { name: 'All participants were uploaded.'});
        await expect(verficationMessage).toBeVisible();
   }

   //to-do add screenshot verification for the kit upload instructions
}
