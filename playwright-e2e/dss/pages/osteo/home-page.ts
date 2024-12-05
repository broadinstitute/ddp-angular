import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { OsteoPageBase } from 'dss/pages/osteo/osteo-page-base';
import { ORGANIZATIONS as ORGANIZATION } from 'dss/enum';

export default class HomePage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.no-margin');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toContainText(/Together, the osteosarcoma community has the power to move research forward/);
    await waitForNoSpinner(this.page);
  }

  async clickCountMeIn(): Promise<void> {
    await this.page.getByRole('banner').getByRole('link', { name: 'Count Me In' }).click();
  }

  async clickLogin(): Promise<void> {
    await this.page.getByRole('button', { name: 'Log In' }).click();
  }

  async assertOrganizationLogoDisplayed(organization: ORGANIZATION): Promise<void> {
    const organizationLogo = this.page.locator(`//app-welcome//section[@class='organizations-section']//img[contains(@alt, '${organization}')]`);
    await expect(organizationLogo).toBeVisible();
  }
}
