import { Locator, Response } from '@playwright/test';
import Question from 'lib/component/Question';

export interface PageInterface {
  gotoURL(url: string): Promise<Response | null>;
  gotoURLPath(urlPath?: string): Promise<Response | null>;
  waitForReady(): Promise<void>;
  getNextButton(): Locator;
  getBackButton(): Locator;
  getSubmitButton(): Locator;
  getIAgreeButton(): Locator;
  getIAmNotReadyToAgreeButton(): Locator;
  logOut(): Promise<void>;
  country(): Question;
  state(): Question;
}

export interface HomePageInterface extends PageInterface {
  logIn(): Promise<void>;
}
