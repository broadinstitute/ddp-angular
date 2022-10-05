import { expect, Locator, Page } from '@playwright/test';
import Question from 'tests/lib/widget/Question';
import Checkbox from 'tests/lib/widget/checkbox';

import path from 'path';

export default class MedicalRecordReleaseForm {
  private readonly page: Page;
  readonly next: Locator;

  constructor(page: Page) {
    this.page = page;
    this.next = page.locator('button', { hasText: 'Next' });
  }

  physician(): Question {
    return new Question(this.page, 'Physician');
  }

  unableToProvideMedicalRecords(): Checkbox {
    return new Checkbox(this.page, 'Check here if none of the above options work');
  }

  name(): Question {
    return new Question(this.page, 'Name');
  }

  signature(): Question {
    return new Question(this.page, 'Signature:');
  }

  async uploadFile(filePath: string): Promise<void> {
    const fName = path.parse(filePath).name;
    await this.page.setInputFiles('input[class="file-input"]', path.resolve(__dirname, `../${filePath}`));
    await expect(this.page.locator('.uploaded-file .file-name')).toHaveText(new RegExp(fName));
  }

  async clickNext(): Promise<void> {
    await Promise.all([this.page.waitForNavigation(), this.next.click()]);
  }

  async submit(): Promise<void> {
    const submitButton = this.page.locator('button', { hasText: 'Submit' });
    await Promise.all([this.page.waitForNavigation(), this.page.waitForLoadState('load'), submitButton.click()]);
  }
}
