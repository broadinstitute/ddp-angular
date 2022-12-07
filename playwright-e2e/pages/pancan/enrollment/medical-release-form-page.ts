import { Page } from '@playwright/test';
import Input from 'lib/widget/Input';
import { PancanPage } from '../pancan-page';
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

  contactPhysician(): Question{
    return new Question(this.page,{prompt: 'I have already read and signed the informed consent document for this study, which describes the use of my personal health information (Section O: Authorization to use your health information for research purposes), and hereby grant permission to Nikhil Wagle, MD, Dana-Farber Cancer Institute, 450 Brookline Ave, Boston, MA, 02215, or a member of the study team to examine copies of my medical records pertaining to my cancer diagnosis and treatment, and, if I elected on the informed consent document, to obtain cancer samples and/or blood samples for research studies. I acknowledge that a copy of this completed form will be accessible via my project account.'});
  }
  async enterPhysicianData(opts: { name?: string; hospital?: string; city?: string; state?: string; } = {}): Promise<void> {
    const {
      name = user.doctor.name,
      hospital = user.doctor.hospital,
      city = user.doctor.city,
      state = user.doctor.state
    } = opts;
    await this.physicianName().fill(name);
    await this.hospitalOrInstitution().fill(hospital);
    await this.city().fill(city);
    await this.state().fill(state);
  }

}