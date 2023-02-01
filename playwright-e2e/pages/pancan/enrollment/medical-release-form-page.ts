import { Page } from '@playwright/test';
import Input from 'lib/widget/input';
import { PancanPage } from 'pages/pancan/pancan-page';
import * as user from 'data/fake-user.json';
import Question from 'lib/component/Question';

export default class MedicalReleaseFormPage extends PancanPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.physicianName().toLocator().waitFor({ state: 'visible' });
  }

  physicianName(): Input {
    return new Input(this.page, { label: 'Physician Name (if applicable)' });
  }

  hospitalOrInstitution(): Input {
    return new Input(this.page, { label: 'Hospital/Institution (if any)' });
  }

  city(): Input {
    return new Input(this.page, { label: 'City' });
  }

  state(): Input {
    return new Input(this.page, { label: 'State' });
  }

  /**
   * By completing this information, you are agreeing to allow us to contact these
   *  physician(s) and hospital(s) / institution(s) to obtain your child’s records.
   * Type: Checkbox
   * @returns {Question}
   */
  contactPhysician(): Question {
    return new Question(this.page, {
      prompt: 'I have already read and signed the informed consent document for this study'
    });
  }

  async enterPhysicianData(opts: { name?: string; hospital?: string; city?: string; state?: string } = {}): Promise<void> {
    const { name = user.doctor.name, hospital = user.doctor.hospital, city = user.doctor.city, state = user.doctor.state } = opts;
    await this.physicianName().fill(name);
    await this.hospitalOrInstitution().fill(hospital);
    await this.city().fill(city);
    await this.state().fill(state);
  }
}
