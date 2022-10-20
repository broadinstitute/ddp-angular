import { Page, Response } from '@playwright/test';

export interface PageInterface {
  page: Page;
  gotoURL(url?: string): Promise<Response | null>;
  gotoURLPath(urlPath?: string): Promise<Response | null>;
  waitForReady(): Promise<void>;
}

export interface HomePageInterface extends PageInterface {
  logIn(): Promise<void>;
}
