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
  }

  getTable(): Table {
    return new Table(this.page, { cssClassAttribute: '.user-activities-table' });
  }

  public async addParticipantButton(): Promise<void> {
    await new Button(this.page, { label: 'Add a Participant', root: '.participants' }).click();
    await waitForNoSpinner(this.page);
  }

  async expandTable(): Promise<void> {
    await waitForNoSpinner(this.page);
    const expand = this.page.locator('.participant-expandable button.participant-expandable__control');

    const checkAndClick = async (): Promise<void> => {
      try {
        await expect(this.getTable().tableLocator()).toBeVisible({ timeout: 5 * 1000 });
      } catch (e) {
        await expand.click();
        await this.page.waitForTimeout(2000); // sometimes table collapse quickly automatically
      }
    };

    await expect(async () => {
      await checkAndClick();
      await expect(this.getTable().tableLocator()).toBeVisible({ timeout: 5000 });
    }).toPass();
  }
}
