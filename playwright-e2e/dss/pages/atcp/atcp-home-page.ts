import { expect, Locator, Page } from '@playwright/test';
import * as auth from 'authentication/auth-atcp';
import { APP } from 'data/constants';
import AtcpJoinUsPage from 'dss/pages/atcp/atcp-join-us-page';
import { AtcpPageBase } from 'dss/pages/atcp/atcp-page-base';
import { HomePageInterface } from 'dss/pages/page-interface';
import { setAuth0UserEmailVerified } from 'utils/api-utils';
import { logParticipantCreated } from 'utils/log-utils';

export enum EnrollmentReason {
  PARENT_GUARDIAN = "I'm a parent/legal guardian of someone who has A-T",
  SELF = 'I have A-T',
}

export default class AtcpHomePage extends AtcpPageBase implements HomePageInterface {
  readonly joinUsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.joinUsButton = this.page.locator('a#join-us-nav');
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.joinUsButton).toBeVisible();
  }

  async logIn(): Promise<void> {
    await auth.login(this.page);
  }

  async joinUs(): Promise<AtcpJoinUsPage> {
    await Promise.all([
      this.page.waitForURL(/\/join-us/),
      this.joinUsButton.click()
    ]);
    const joinUsPage = new AtcpJoinUsPage(this.page);
    await joinUsPage.waitForReady();
    return joinUsPage;
  }

  async createNewAcct(firstName: string, lastName: string, reason: EnrollmentReason): Promise<string> {
    const fullName = `${firstName} ${lastName}`;

    const joinUsPage = await this.joinUs();
    await joinUsPage.fillInName(firstName, lastName,
      { firstNameTestId: 'answer:PREQUAL_FIRST_NAME', lastNameTestId: 'answer:PREQUAL_LAST_NAME' });

    await joinUsPage.prequalSelfDescribe.toRadiobutton().check(reason);
    await joinUsPage.clickJoinUs();

    const userEmail = await auth.createAccountWithEmailAlias(this.page, {
      email: process.env.ATCP_USER_EMAIL,
      password: process.env.ATCP_USER_PASSWORD
    });
    logParticipantCreated(userEmail, fullName);

    await expect(this.page.locator('text="Account Activation"')).toBeVisible();
    await expect(this.page.locator('.activate-account h2.Subtitle')).toHaveText(
      `You are almost done! Please check your email: ${userEmail}. An email has been sent there with the guidelines to activate your account.`
    );

    // Send Auth0 request to verify user email
    await setAuth0UserEmailVerified(APP.AT, userEmail, { isEmailVerified: true });
    await this.page.waitForTimeout(2000); // short sleep after set email-verified true

    return userEmail;
  }
}
