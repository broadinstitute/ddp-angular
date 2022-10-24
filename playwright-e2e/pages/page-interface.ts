import { Locator, Response } from '@playwright/test';

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
}

export interface HomePageInterface extends PageInterface {
  logIn(): Promise<void>;
}
