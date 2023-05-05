import {Page} from "@playwright/test";

export default class SampleInformationTab {
  constructor(private readonly page: Page) {
  }

  /* XPaths */
  private getContactInfoXPath(infoName: string): string {
    return `//tab[@heading='Sample Information']/legend//table/tr[td[contains(text(),'${infoName}')]]`
  }
}
