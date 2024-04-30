import Select from 'dss/component/select';
import ParticipantPage from 'dsm/pages/participant-page';
import { Locator, Page, expect } from '@playwright/test';
import { FamilyMember } from 'dsm/enums';
import * as user from 'data/fake-user.json';

/**
 * Captures the webelements in between profile section and the Family Member section
 */
export default class RgpParticipantPage extends ParticipantPage {
    constructor(page: Page) {
        super(page);
    }

    public get addFamilyMemberDialog() {
        const page = this.page;
        const modal = '[role="dialog"]';
        const familyMemberAddedSuccessfullyModal = 'app-participant-update-result-dialog';

        return new class {
            async _open(): Promise<void> {
            await page.locator('.family-member-button button').click();
            await expect(page.locator(modal)).toBeVisible();
            }

            get _addFamilyMemberButton(): Locator {
                return page.locator('.family-member-button button');
            }

            get _rootLocator(): Locator {
            return page.locator(modal).locator('table.family-member-form');
            }

            get firstName(): Locator {
            return this._rootLocator.locator('input[name="first-name"]');
            }

            get lastName(): Locator {
            return this._rootLocator.locator('input[name="last-name"]');
            }

            get subjectId(): Locator {
            return this._rootLocator.locator('input[name="subjectId"]');
            }

            get relation(): Select {
            return new Select(page, { root: this._rootLocator.locator('//tr[.//text()[normalize-space()="Relation"]]') });
            }

            get copyProbandInfo(): Locator {
            return this._rootLocator.locator('tr', { hasText: 'Copy Proband Info' }).locator('mat-checkbox');
            }

            get submit(): Locator {
            return this._rootLocator.locator('text="Submit"');
            }

            async fillInfo(opts: {
            firstName: string,
            lastName: string,
            relationshipId: number,
            relation: string,
            copyProbandInfo?: boolean }): Promise<string> {
                const { firstName, lastName, relationshipId, relation, copyProbandInfo = true } = opts;

                await this._open();
                await this.firstName.fill(firstName);
                await this.lastName.fill(lastName);
                await this.subjectId.fill(relationshipId.toString());
                await this.relation.selectOption(relation);
                copyProbandInfo && await this.copyProbandInfo.click();

                const selectedRelation = await this.relation.toLocator().locator('.mat-select-value-text').innerText();
                await this.submit.click();

                await expect(page.locator(familyMemberAddedSuccessfullyModal)).toHaveText('Successfully added family member');
                await page.keyboard.press('Escape'); //Press Escape key to close the 'Successfully Added Family Member' dialog

                return selectedRelation;
            }
        }
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

    public async getNumberOfFamilyMembers(): Promise<number> {
      return this.page.locator(`//app-participant-page//tabset//span[contains(text(), 'RGP')]/ancestor::a`).count();
    }

    public getFamilyMember(instance: number): Locator {
      return this.page.locator(`(//app-participant-page//tabset//span[contains(text(), 'RGP')]/ancestor::a)[${instance}]`);
    }

    public async getFamilyMemberType(familyMember: Locator): Promise<FamilyMember> {
      const brotherFirstName = user.brother.firstName;
      const grandfatherFirstName = user.maternalGrandFather.firstName;
      let familyMemberType: FamilyMember;

      const buttonText = await familyMember.innerText();
      const [personName] = buttonText.split('-');
      const familyMemberName = personName.trim();

      switch (familyMemberName) {
        case brotherFirstName:
          familyMemberType = FamilyMember.BROTHER;
          break;
        case grandfatherFirstName:
          familyMemberType = FamilyMember.MATERNAL_GRANDFATHER;
          break;
        default:
          throw new Error(`Family member ${familyMemberName} is unexpected`);
          break;
      }
      return familyMemberType;
    }

    public getRelationshipID(familyMemberType: FamilyMember): string {
      let id = '';
      switch (familyMemberType) {
        case FamilyMember.BROTHER:
          id = user.brother.relationshipID;
          break;
        case FamilyMember.MATERNAL_GRANDFATHER:
          id = user.maternalGrandFather.relationshipID;
          break;
        default:
          break;
      }
      return id;
    }
}
