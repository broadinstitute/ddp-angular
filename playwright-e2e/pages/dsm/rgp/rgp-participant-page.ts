import ParticipantPage from '../participant-page';
import { Locator, Page } from '@playwright/test';

/**
 * Captures the webelements in between profile section and the Family Member section
 */
export default class RgpParticipantPage extends ParticipantPage {
    constructor(page: Page) {
        super(page);
    }

    public getAddFamilyMemberButton(): Locator {
        return this.page.locator("//span[contains(text(), 'Add Family Member')]/preceding-sibling::button");
    }

    public getAddFamilyMemberPopup(): Locator {
        return this.page.locator("//mat-dialog-container//mat-dialog-content//div[@class='family-member-popup']");
    }

    public getFamilyMemberFirstName(): Locator {
        return this.page.locator("//mat-dialog-container//table[contains(@class, 'family-member-form')]" +
        "//td[contains(.,'First Name')]/following-sibling::td/input");
    }

    public getFamilyMemberLastName(): Locator {
        return this.page.locator("//mat-dialog-container//table[contains(@class, 'family-member-form')]" +
        "//td[contains(.,'Last Name')]/following-sibling::td/input");
    }

    public getFamilyMemberRelationshipID(): Locator {
        return this.page.locator("//mat-dialog-container//table[contains(@class, 'family-member-form')]" +
        "//td[contains(.,'Relationship ID')]/following-sibling::td/input");
    }

    public getFamilyMemberRelation(): Locator {
        return this.page.locator("//mat-dialog-container//table[contains(@class, 'family-member-form')]" +
        "//td[contains(.,'Relation')]/following-sibling::td/mat-select");
    }

    public getCopyProbandInfo(): Locator {
        return this.page.locator("//mat-dialog-container//table[contains(@class, 'family-member-form')]//td[contains(.,'Copy Proband Info')]" +
        "/following-sibling::td/mat-checkbox//span[contains(@class, 'mat-checkbox-inner-container')]");
    }

    public getAddFamilyMemberFormSubmitButton(): Locator {
        return this.page.locator("//mat-dialog-container//table[contains(@class, 'family-member-form')]//button[text()='Submit']");
    }

    public getAddFamilyMemberSuccessfulMessage(): Locator {
        return this.page.getByText('Successfully added family member');
    }

    /**
     * This only needs to be called once for the first instance of a dropdown being clicked as
     * dropdowns in the RGP participant page seem to have the same xpath
     * todo move function to better location if the xpath can be used elsewhere in DSM
     * @returns dropdown locator
     */
    public getDropdownOptions(): Locator {
        return this.page.locator("//div[@role='listbox']").locator('//mat-option');
    }

    public async inputFamilyNotes(notes: string): Promise<void> {
        await this.page.locator("//td[contains(text(), 'Family Notes')]/following-sibling::td/textarea").fill(`${notes}`);
    }

    public getSeqrProject(): Locator {
        return this.page.locator("//td[contains(text(), 'Seqr project')]/following-sibling::td/mat-select");
    }

    public getSpecialtyProjectR21(): Locator {
        return this.page.locator("//td[contains(text(), 'Specialty Project: R21')]/following-sibling::td/mat-checkbox");
    }

    public getSpecialtyProjectCagi2022(): Locator {
        return this.page.locator("//td[contains(text(), 'Specialty Project: CAGI 2022')]/following-sibling::td/mat-checkbox");
    }

    public getSpecialtyProjectCagi2023(): Locator {
        return this.page.locator("//td[contains(text(), 'Specialty Project: CAGI 2023')]/following-sibling::td/mat-checkbox");
    }

    public getSpecialtyProjectCZI(): Locator {
        return this.page.locator("//td[contains(text(), 'Specialty Project: CZI')]/following-sibling::td/mat-checkbox");
    }

    public getExpectedNumberToSequence(): Locator {
        return this.page.locator("//td[contains(text(), 'Expected # to Sequence')]/following-sibling::td/mat-select");
    }
}
