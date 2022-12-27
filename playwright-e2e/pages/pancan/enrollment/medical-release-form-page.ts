import { Page } from '@playwright/test';
import Input from 'lib/widget/Input';
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

  contactPhysician(): Question {
    return new Question(this.page, {
      prompt: 'I have already read and signed the informed consent document for this study, which describes the use of'
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
