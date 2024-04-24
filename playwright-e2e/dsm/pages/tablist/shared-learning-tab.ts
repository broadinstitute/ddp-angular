import {Locator, Page} from '@playwright/test';
import TabBase from './tab-base';
import { Tab } from 'dsm/enums';

export default class SharedLearningTab extends TabBase {
  constructor(page: Page) {
    super(page, Tab.SHARED_LEARNINGS);
  }

  public get selectPDFButton(): Locator {
    return this.page.getByRole('button', { name: 'Select a PDF' });
  }

  public get selectedFileSection(): Locator {
    return this.page.locator(`//app-upload-files//span[@class='upload-selectedFileName']`);
  }

  public get uploadButton(): Locator {
    return this.page.getByRole('button', { name: 'Upload' });
  }

  //Use screenshot comparison for the 'Upload Shared LEarnings Letter here...' section

  public async getUploadedFileCount(): Promise<number> {
    return this.page.locator(`//app-files-table//table//tbody[@role='rowgroup']//tr//td[contains(@class, 'mat-column-Name')]`).count();
  }
}
