import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<any>  {
    return browser.get(browser.baseUrl);
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-root h1')).getText();
  }
}
