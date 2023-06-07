import { expect, Page, APIRequestContext } from '@playwright/test';
import { MiscellaneousEnum } from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';

export default class ParticipantWithdrawalPage {
  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    expect(this.page.locator('h1')).toBe('Participant Withdrawal');
    await expect(this.withdrawButton().toLocator()).toBeDisabled();
  }

  public async goto(request: APIRequestContext): Promise<void> {
    const navigation = new Navigation(this.page, request);
    const [mailListResponse] = await Promise.all([
      waitForResponse(this.page, { uri: 'ui/exitParticipant/' }),
      navigation.selectMiscellaneous(MiscellaneousEnum.PARTICIPANT_WITHDRAWAL)
    ]);
  }

  public async withdrawParticipantId(id: string): Promise<void> {
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
}
