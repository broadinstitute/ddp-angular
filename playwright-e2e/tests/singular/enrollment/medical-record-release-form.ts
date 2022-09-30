import { Locator, Page } from '@playwright/test';

export default class MedicalRecordReleaseForm {
  private readonly page: Page;
  private readonly nextButton: Locator;
  private readonly physicianName: Locator;
  private readonly hospital: Locator;
  private readonly address: Locator;
  private readonly phone: Locator;
  private readonly doctorSpecialty: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nextButton = page.locator('button', { hasText: 'Next' });
    this.submitButton = page.locator('button', { hasText: 'Submit' });
    this.physicianName = page.locator('input[data-placeholder="PHYSICIAN NAME: *"]');
    this.hospital = page.locator('input[data-placeholder="HOSPITAL, CLINIC, OR PROVIDER NAME (if any):"]');
    this.address = page.locator('input[data-placeholder="ADDRESS:"]');
    this.phone = page.locator('input[data-placeholder="PHONE NUMBER: *"]');
    this.doctorSpecialty = page.locator('.picklist-answer-PHYSICIAN_SPECIALITY select');
  }

  get submit(): Locator {
    return this.submitButton;
  }

  get next(): Locator {
    return this.nextButton;
  }

  async checkNoneOfOptionsWork(): Promise<void> {
    const checkbox = this.page
      .locator('.ddp-activity-question')
      .filter({ hasText: 'Check here if none of the above options work' })
      .filter({ has: this.page.locator('input[type="checkbox"]') });
    await checkbox.click();
  }

  async fillPhysicianName(name: string): Promise<void> {
    await this.physicianName.fill(name);
  }

  async fillPhoneNumber(num = 1112223333): Promise<void> {
    await this.phone.fill(num.toString());
  }

  async selectDoctorSpecialty(value: string): Promise<Array<string>> {
    return await this.doctorSpecialty.selectOption(value);
  }
}
