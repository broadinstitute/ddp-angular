import { Page } from '@playwright/test';
import Question from 'lib/component/Question';
import Input from 'lib/widget/input';
import { PancanPage } from 'pages/pancan/pancan-page';
import * as fake from 'data/fake-user.json';
import { TypePatient } from 'pages/patient-type';

export default class PreScreeningAgeLocationPage extends PancanPage {
  constructor(page: Page, private patient: TypePatient = 'adult') {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.age().toLocator().waitFor({ state: 'visible' });
    await this.country().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * <br> Question: How old are you?
   * <br> Type: Input
   */
  age(): Input {
    return new Input(this.page, { ddpTestID: 'answer:AGE' });
  }

  /**
   * <br> Question: Where do you live?
   * <br> Select Country
   * <br> Type: Select
   */
  country(): Question {
    return new Question(this.page, { prompt: 'Choose Country...' });
  }

  /**
   * <br> Question: Select State (US and Canada)
   * <br> Select State
   * <br> Type: Select
   */
  state(): Question {
    return new Question(this.page, { prompt: 'Choose State...' });
  }

  async enterInformationAboutAgeLocation(
    opts: {
      age?: string;
      country?: string;
      state?: string;
    } = {}
  ): Promise<void> {
    // Fake data from fake-user.json
    const {
      age = fake[this.patient].age,
      country = fake[this.patient].country.abbreviation,
      state = fake[this.patient].state.abbreviation
    } = opts;

    await this.age().fill(age);
    await this.country().select().selectOption(country);
    await this.state().toLocator().waitFor({ state: 'visible' });
    await this.state().select().selectOption(state);
    await this.submit();
  }
}
