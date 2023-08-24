import { expect, Page } from '@playwright/test';
import Button from 'dss/component/button';
import Table from 'dss/component/table';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class AtcpDashboardPage extends AtcpPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.page.locator('h1.title')).toHaveText('Thank you for joining the Global A-T Family Data Platform!');
    await waitForNoSpinner(this.page);
    await this.getTable().waitForReady();
  }

  getTable(): Table {
    return new Table(this.page, { cssClassAttribute: '.user-activities-table' });
  }

  public async addParticipantButton(): Promise<void> {
    await new Button(this.page, { label: 'Add a Participant', root: '.participants' }).click();
    await waitForNoSpinner(this.page);
  }

  async expand(): Promise<void> {
    return this.page.getByRole('button', { name: 'Expand' }).click();
  }
}
