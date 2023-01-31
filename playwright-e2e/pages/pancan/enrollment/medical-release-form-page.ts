import { Page } from '@playwright/test';
import Institution from 'lib/component/institution';
import { PancanPageBase } from 'pages/pancan/pancan-page-base';
import * as user from 'data/fake-user.json';
import Question from 'lib/component/Question';

export default class MedicalReleaseFormPage extends PancanPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.agreeToAllowContactPhysician().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * By completing this information, you are agreeing to allow us to contact these
   *  physician(s) and hospital(s) / institution(s) to obtain your child’s records.
   * Type: Checkbox
   * @returns {Question}
   */
  agreeToAllowContactPhysician(): Question {
    return new Question(this.page, {
      prompt: 'I have already read and signed the informed consent document for this study'
    });
  }

  hospital(): Institution {
    return new Institution(this.page, {
      label: 'including any institutions'
    });
  }

  async fillInInPhysicianData(opts: { name?: string; hospital?: string; city?: string; state?: string } = {}): Promise<void> {
    const { name = user.doctor.name, hospital = user.doctor.hospital, city = user.doctor.city, state = user.doctor.state } = opts;
    const institution = this.hospital();
    await institution.input('Physician Name').fill(name);
    await institution.input('Hospital/Institution').fill(hospital);
    await institution.input('City').fill(city);
    await institution.input('State').fill(state);
  }
}
