import { expect, Page } from '@playwright/test';
import Button from 'dss/component/button';
import Question from 'dss/component/Question';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';

export default class AtcpRegistrationPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('app-workflow-progress .current .number')).toHaveText(/^1$/);
    await expect(this.page.locator('app-workflow-progress .current .name')).toHaveText('Registration');
  }

  get agreement(): Question {
    return new Question(this.page, { cssClassAttribute: '.Question--AGREEMENT'});
  }

  get participantFirstName(): Question {
    return new Question(this.page, { prompt: 'Participant\'s First Name'});
  }

  get participantLastName(): Question {
    return new Question(this.page, { prompt: 'Participant\'s Last Name'});
  }

  get participantGender(): Question {
    return new Question(this.page, { prompt: 'Participant\'s Gender'});
  }

  get participantDOB(): Question {
    return new Question(this.page, { prompt: 'Participant\'s DOB'});
  }

  get participantStreetAddress(): Question {
    return new Question(this.page, { prompt: 'Participant\'s Street Address'});
  }

  get participantCity(): Question {
    return new Question(this.page, { prompt: 'Participant\'s City'});
  }

  get participantStreetPostalCode(): Question {
    return new Question(this.page, { prompt: 'Participant\'s Postal Code'});
  }

  get register(): Button {
    return new Button(this.page, { label: 'Register', root: '.activity-buttons' });
  }
}
