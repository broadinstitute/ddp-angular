import { Locator, Response } from '@playwright/test';
import Question from 'dss/component/Question';
import Input from 'dss/component/input';

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
  age(): Input;
}

export interface HomePageInterface extends PageInterface {
  logIn(): Promise<void>;
}