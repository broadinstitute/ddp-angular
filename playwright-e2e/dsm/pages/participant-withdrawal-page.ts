import { expect, Page, APIRequestContext } from '@playwright/test';
import { MiscellaneousEnum } from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
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
      navigation.selectMiscellaneous(MiscellaneousEnum.PARTICIPANT_WITHDRAWAL)
    ]);
    return new ParticipantWithdrawalPage(page);
  }

  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    expect(this.page.locator('h1')).toBe('Participant Withdrawal');
    await expect(this.withdrawButton().toLocator()).toBeDisabled();
  }

  public async withdrawParticipant(id: string): Promise<void> {
    const input = new Input(this.page, { label: 'Participant ID' });
    await input.fill(id);

    await Promise.all([
      waitForResponse(this.page, { uri: 'ui/exitParticipant' }),
      this.withdrawButton().click()
    ]);
  }

  public withdrawButton(): Button {
    return new Button(this.page, { label: 'Withdraw Participant' });
  }

  public withdrewTable(): Table {
    return new Table(this.page, { cssClassAttribute: '.table' });
  }
}
