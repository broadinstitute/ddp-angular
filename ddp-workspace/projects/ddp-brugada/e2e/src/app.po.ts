import { browser, by, element } from 'protractor';
import { promise } from 'selenium-webdriver';

export class AppPage {
  navigateTo(): promise.Promise<any> {
    return browser.get(browser.baseUrl);
  }

  getTitleText(): promise.Promise<string> {
    return element(by.css('app-root .content span')).getText();
  }
}
