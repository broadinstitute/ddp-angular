import { Page } from '@playwright/test';
import Input from 'lib/widget/input';
import { PancanPageBase } from 'pages/pancan/pancan-page-base';
import * as fake from 'data/fake-user.json';
import { PatientsData, TypePatient } from 'pages/patient-type';

export default class PreScreeningAgeLocationPage extends PancanPageBase {
  constructor(page: Page, private patient: TypePatient = 'adult') {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.age().toLocator().waitFor({ state: 'visible' });
    await this.country().toLocator().waitFor({ state: 'visible' });
  }

  age(): Input {
    return new Input(this.page, { ddpTestID: PatientsData[this.patient].ddpTestID.age });
  }

  async fillInAgeLocation(
    opts: {
      age?: string;
      country?: string;
      state?: string;
    } = {}
  ): Promise<void> {
    const { age = fake[this.patient].age, country = fake[this.patient].country.abbreviation, state = fake[this.patient].state.abbreviation } = opts;

    await this.age().fill(age);
    await Promise.all([
      this.page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200),
      this.country().toSelect().selectOption(country)
    ]);
    await Promise.all([
      this.page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200),
      this.state().toSelect().selectOption(state)
    ]);
    await this.submit();
  }
}
