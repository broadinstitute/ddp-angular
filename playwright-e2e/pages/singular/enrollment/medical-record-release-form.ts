import { expect, Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';

import Checkbox from 'lib/widget/checkbox';

import path from 'path';
import Input from 'lib/widget/input';
import Select from 'lib/widget/select';
import * as user from 'data/fake-user.json';

export default class MedicalRecordReleaseForm extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.physicianName().toLocator().waitFor({ state: 'visible' });
  }

  physicianName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_NAME' });
  }

  physicianHospital(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_INSTITUTION' });
  }

  physicianAddress(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_ADDRESS' });
  }

  physicianPhone(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PHYSICIAN_PHONE' });
  }

  physicianSpecialty(): Select {
    return new Select(this.page, { label: 'Please specify your doctor’s specialty:' });
  }

  unableToProvideMedicalRecords(): Checkbox {
    return new Checkbox(this.page, { label: 'Check here if none of the above options work' });
  }

  name(): Input {
    return new Input(this.page, { ddpTestID: 'answer:MRR_NAME' });
  }

  signature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:MRR_SIGNATURE' });
  }

  async uploadFile(filePath: string): Promise<void> {
    const fName = path.parse(filePath).name;
    await this.page.setInputFiles('input[class="file-input"]', path.resolve(process.env.ROOT_DIR as string, filePath));
    await expect(this.page.locator('.uploaded-file .file-name')).toHaveText(new RegExp(fName));
    await this.page.waitForTimeout(2000); // Short delay needed when uploading file
  }

  /**
   * Enroll My Child workflow
   */
  parentName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:MRR_NAME' });
  }

  /**
   * Enroll My Adult Dependent workflow
   */
  patientName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:MRR_PATIENT_NAME' });
  }

  dependentParentName(): Input {
    return new Input(this.page, { ddpTestID: 'answer:MRR_PARENT_NAME' });
  }

  parentSignature(): Input {
    return new Input(this.page, { ddpTestID: 'answer:MRR_PARENT_SIGNATURE' });
  }

  async enterInformationAboutPhysician(
    opts: { name?: string; hospital?: string; address?: string; phone?: string; specialty?: string } = {}
  ): Promise<void> {
    const {
      name = user.doctor.name,
      hospital = user.doctor.hospital,
      address = user.doctor.address,
      phone = user.doctor.phone,
      specialty = user.doctor.specialty
    } = opts;

    await this.physicianName().fill(name);
    await this.physicianHospital().fill(hospital);
    await this.physicianAddress().fill(address);
    await this.physicianPhone().fill(phone);
    await this.physicianSpecialty().selectOption(specialty);
  }
}
