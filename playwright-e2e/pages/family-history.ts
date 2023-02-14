import { Page } from '@playwright/test';
import { booleanToYesOrNo } from 'utils/test-utils';
import { CancerSelector } from './cancer-selector';
import { BrainBasePage } from './brain/brain-base-page';

/**
 * CMI's family history
 */
export class FamilyHistory extends BrainBasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.page.getByText("Understanding the history of cancer in someone's biological family can help research").click();
    await this.page.getByText('Tell us about the history of cancer in your biological (blood-related) family').click();
  }

  async next(): Promise<void> {
    await this.page.getByRole('button').getByText('Next').click();
  }

  async parent(parentNumber: number, p: FamilyMember): Promise<void> {
    let i;
    await this.page
      .locator('mat-card-content')
      .filter({ hasText: `Biological / Birth Parent ${parentNumber}` })
      .getByRole('button', { name: 'Edit' })
      .click();
    const selectorBase = `FH_PARENT${parentNumber}`;

    await this.page.getByTestId(`answer:${selectorBase}_ALIAS`).fill(p.nickname);
    await this.page
      .locator(`.picklist-answer-${selectorBase}_LIVING`)
      .getByText(booleanToYesOrNo(p.currentlyLiving), { exact: true })
      .click();
    await this.page.locator(`.picklist-answer-${selectorBase}_AGE_RANGE`).getByRole('combobox').selectOption(p.ageRange);
    await this.page
      .locator(`.picklist-answer-${selectorBase}_HAD_CANCER`)
      .getByText(booleanToYesOrNo(p.cancers.length > 0), { exact: true })
      .click();

    for (let i = 0; i < p.cancers.length; i++) {
      if (i > 0) {
        await this.page.getByText(' + Add another cancer').click();
      }
      const selectedCancer = p.cancers[i];
      const cancerSelector = new CancerSelector(
        this.page,
        `.picklist-answer-${selectorBase}_CANCER_NAME`,
        `.picklist-answer-${selectorBase}_CANCER_AGE_RANGE`
      );
      await cancerSelector.chooseCancer(
        i,
        selectedCancer.cancerSearch,
        selectedCancer.numTimesToHitDownArrow,
        selectedCancer.expectedCancerResult
      );
      await cancerSelector.chooseDiagnosisAt(i, selectedCancer.time);
    }

    if (p.ancestry.length > 0) {
      await this.page.locator(`.picklist-answer-${selectorBase}_JEWISH_ANC`).getByText('Yes').click();
      for (i = 0; i < p.ancestry.length; i++) {
        await this.page.locator(`.picklist-answer-${selectorBase}_JEWISH_GROUP`).getByText(p.ancestry[i]).click();
      }
    }
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async clickAddParentSibling(): Promise<void> {
    await this.page
      .getByRole('button', {
        name: "Add a Parent's Sibling Add a Parent's Sibling"
      })
      .click();
  }

  async clickAddGrandParent(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add a Grandparent' }).click();
  }

  async clickAddSibling(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add a Sibling' }).click();
  }

  async clickAddHalfSibling(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add a Half-Sibling' }).click();
  }

  async clickAddChild(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add a Child' }).click();
  }

  async addFamilyMember(relationship: string, p: FamilyMember): Promise<void> {
    if (relationship === 'PARENT1') {
      await this.page
        .locator('mat-card-content')
        .filter({ hasText: 'Biological / Birth Parent 1' })
        .getByRole('button', { name: 'Edit' })
        .click();
    } else if (relationship === 'PARENT2') {
      await this.page
        .locator('mat-card-content')
        .filter({ hasText: 'Biological / Birth Parent 2' })
        .getByRole('button', { name: 'Edit' })
        .click();
    }
    const selectorBase = `FH_${relationship}`;

    await this.page.getByTestId(`answer:${selectorBase}_ALIAS`).fill(p.nickname);
    await this.page
      .locator(`.picklist-answer-${selectorBase}_LIVING`)
      .getByText(booleanToYesOrNo(p.currentlyLiving), { exact: true })
      .click();
    await this.page.locator(`.picklist-answer-${selectorBase}_AGE_RANGE`).getByRole('combobox').selectOption(p.ageRange);
    await this.page
      .locator(`.picklist-answer-${selectorBase}_HAD_CANCER`)
      .getByText(booleanToYesOrNo(p.cancers.length > 0), { exact: true })
      .click();

    for (let i = 0; i < p.cancers.length; i++) {
      if (i > 0) {
        await this.page.getByText(' + Add another cancer').click();
      }
      const selectedCancer = p.cancers[i];
      const cancerSelector = new CancerSelector(
        this.page,
        `.picklist-answer-${selectorBase}_CANCER_NAME`,
        `.picklist-answer-${selectorBase}_CANCER_AGE_RANGE`
      );
      await cancerSelector.chooseCancer(
        i,
        selectedCancer.cancerSearch,
        selectedCancer.numTimesToHitDownArrow,
        selectedCancer.expectedCancerResult
      );
      await cancerSelector.chooseDiagnosisAt(i, selectedCancer.time);
    }

    if (p.ancestry.length > 0) {
      await this.page.locator(`.picklist-answer-${selectorBase}_JEWISH_ANC`).getByText('Yes').click();
      for (let i = 0; i < p.ancestry.length; i++) {
        await this.page.locator(`.picklist-answer-${selectorBase}_JEWISH_GROUP`).getByText(p.ancestry[i]).click();
      }
    }

    if (p.sideOfFamily != null) {
      let sideOfFamilyClass = 'FAMILY_SIDE_Q_3';
      if (selectorBase.indexOf('GRAND') > 0) {
        sideOfFamilyClass = 'FAMILY_SIDE_Q_1';
      } else if (selectorBase.indexOf('HALF_SIBLING') > 0) {
        sideOfFamilyClass = 'FAMILY_SIDE_Q_2';
      }
      await this.page.locator(`.picklist-answer-${sideOfFamilyClass}`).getByRole('combobox').selectOption(p.sideOfFamily);
    }
    if (p.sexAtBirth != null) {
      await this.page.locator(`.picklist-answer-${selectorBase}_SEX_AT_BIRTH`).getByRole('combobox').selectOption(p.sexAtBirth);
    }
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForResponse((resp) => resp.url().includes('/summary') && resp.status() === 200);
  }
}
