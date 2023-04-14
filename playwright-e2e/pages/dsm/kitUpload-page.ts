import { expect, Locator, Page } from '@playwright/test';
import { KitType } from 'lib/component/dsm/samples/enums/kitType.enum'

export default class KitUploadPage {
    private readonly PAGE_TITLE: string = 'Kit Upload';
    constructor(private readonly page: Page) {}

    private getPageTitle(): Locator {
        return this.page.getByRole('heading', { name: this.PAGE_TITLE});
    }

    public async assertPageTitle(): Promise<void> {
        const title = this.getPageTitle();
        await expect(title).toBeVisible();
    }

    public async selectKitTypeOption(kitType: KitType): Promise<void> {
        const kitOption = this.page.locator(`//mat-checkbox/label[span[normalize-space(text()) = '${kitType}']]`);
        await kitOption.check();
    }

    //This option only appears to some study admins based on permissions - so I have a getter here
    //so I can use it to verify display of option and also select option later
   private getSkipAddressValidationOption(): Locator {
        return this.page.locator('label').filter({ hasText: 'Skip address validation on upload' });
   }

   //Assert that if the test study admin has the neccessary permissions - they can see the Skip Address Validation option
   //Assert that if they don't have permissions, they don't see it
   //Should probably be two different methods - could use a better function name
   public async assertSkipAddressValidationOptionDisplayed(hasPermissions: boolean): Promise<void> {
        const validationOption = this.getSkipAddressValidationOption();
        if (hasPermissions) {
            await expect(validationOption).toBeVisible();
        } else {
            await expect(validationOption).not.toBeVisible();
        }
   }

   public async selectSkipAddressValidationOption(): Promise<void> {
        const validationOption = this.getSkipAddressValidationOption();
        await validationOption.check();
   }

   //todo add assertion for display of button
   private getBrowseButton(): Locator {
        return this.page.getByText('Browse...');
   }

   public async selectBrowseButton(): Promise<void> {
        const browseButton = this.getBrowseButton();
        await browseButton.click();
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
