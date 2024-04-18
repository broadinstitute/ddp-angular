import {Locator, Page} from '@playwright/test';
import { Tab } from 'dsm/enums';
import TabBase from './tab-base';

export default class InvitaeTab extends TabBase {
  constructor(page: Page) {
    super(page, Tab.INVITAE);
  }

  public get dateReportReceivedFromInvitae(): Locator {
    return this.page.locator(`//tabset//td[normalize-space(text())='Date Report received from Invitae']//following-sibling::td//input`);
  }

  public get bamFileReceivedFromInvitae(): Locator {
    return this.page.locator(`//tabset//td[normalize-space(text())='BAM file received from Invitae']//following-sibling::td//mat-select`);
  }

  public get dateBAMFileReceivedFromInvitae(): Locator {
    return this.page.locator(`//tabset//td[normalize-space(text())='Date BAM file received from Invitae']//following-sibling::td//input`);
  }

  public get germlineReturnNotesField(): Locator {
    return this.page.locator(`//tabset//td[normalize-space(text())='Germline return notes field']//following-sibling::td//textarea`);
  }
}
