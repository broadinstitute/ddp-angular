import { expect, Page, APIRequestContext } from '@playwright/test';
import { Miscellaneous, Navigation } from 'dsm/navigation';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import Table from 'dss/component/table';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';

export default class ParticipantWithdrawalPage {
  /**
   * Select menu: Miscellaneous -> Participant Withdrawal
   * @param {Page} page
   * @param {APIRequestContext} request
   * @returns {Promise<ParticipantWithdrawalPage>}
   */
  public static async goto(page: Page, request: APIRequestContext): Promise<ParticipantWithdrawalPage> {
    const navigation = new Navigation(page, request);
    const [mailListResponse] = await Promise.all([
      waitForResponse(page, { uri: 'ui/exitParticipant/' }),
      navigation.selectFromMiscellaneous(Miscellaneous.PARTICIPANT_WITHDRAWAL)
    ]);
    return new ParticipantWithdrawalPage(page);
  }

  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    expect(this.page.locator('h1')).toBe('Participant Withdrawal');
    await expect(this.getWithdrawButton().toLocator()).toBeDisabled();
  }

  /*
   * Withdraw a participantEnter by GUID
   */
  public async withdrawParticipant(guid: string): Promise<void> {
    const input = new Input(this.page, { label: 'Participant ID' });
    await input.fill(guid);

    await Promise.all([
      waitForResponse(this.page, { uri: 'ui/exitParticipant' }),
      this.getWithdrawButton().click()
    ]);
    await waitForNoSpinner(this.page);
  }

  public getWithdrawButton(): Button {
    return new Button(this.page, { label: new RegExp('Withdraw Participant'), root: '//*' });
  }

  public withdrewTable(): Table {
    return new Table(this.page, { cssClassAttribute: '.table' });
  }
}
