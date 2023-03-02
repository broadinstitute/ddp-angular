import { faker } from '@faker-js/faker';
import { Page } from '@playwright/test';
import * as user from 'data/fake-user.json';

export const generateUserName = (namePrefix: string): string => {
  return `${namePrefix}-${faker.name.lastName()}${faker.random.word()}`;
};

export const generateRandomPhoneNum = (): string => Math.random().toString().slice(2, 11);

export const generateRandomNum = (min = 1, max = 99): number => Math.floor(Math.random() * (max - min) + min);

export const generateEmailAlias = (email: string | undefined): string => {
  if (email == null || email.length === 0 || !email.includes('@')) {
    throw Error(`Invalid Parameter: Email "${email}"`);
  }
  const splintedEmail = email.split('@');
  const name = splintedEmail[0];
  const domain = splintedEmail[1];
  return `${name}+${Math.floor(Math.random() * 1000000000)}@${domain}`;
};

export const setPatientParticipantGuid =  async (page: Page) => {

  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/participants') && resp.status() === 200)
  ]);

  let participantResponse = response.url();
  var urlArray = participantResponse.split("/");
  user.patient.participantGuid = urlArray[6];
}

