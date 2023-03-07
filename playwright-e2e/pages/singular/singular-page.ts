import { Page } from '@playwright/test';
import { User } from 'data/user';
import PageBase from 'pages/page-base';
import { SingularUser } from 'pages/singular/singular-user';
import { generateEmailAlias } from 'utils/faker-utils';

/**
 * Project Singular base page.
 */
export abstract class SingularPage extends PageBase {
  private user: User;

  protected constructor(page: Page) {
    const { SINGULAR_BASE_URL, SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;
    if (SINGULAR_USER_EMAIL == null || SINGULAR_USER_PASSWORD == null || SINGULAR_BASE_URL == null) {
      throw Error('Invalid parameters: Email and Password are undefined or null.');
    }
    super(page, SINGULAR_BASE_URL);
    const emailAlias = generateEmailAlias(SINGULAR_USER_EMAIL);
    this.user = new SingularUser(emailAlias, SINGULAR_USER_PASSWORD);
  }
}
