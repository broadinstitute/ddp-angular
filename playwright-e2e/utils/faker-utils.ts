import { faker } from '@faker-js/faker';
import { Page } from '@playwright/test';
import * as user from 'data/fake-user.json';

export const generateAlphaNumeric = (length?: number): string => {
  return faker.string.alphanumeric(length ? length : 6);
};

export const generateUserName = (namePrefix: string): string => {
  return `${namePrefix}-${faker.person.lastName()}${faker.lorem.word()}`;
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

/**
 * Set the guid given a saved action that occurs on a page e.g. entering input
 * @param page The current page where an action is taken that may lead to the guid being retreived
 */
export const setPatientParticipantGuid = async (page: Page) => {
  const [response] = await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/participants') && resp.status() === 200)
  ]);

  const participantResponse = response.url();
  const urlArray = participantResponse.split('/');
  user.patient.participantGuid = urlArray[6];
};

/**
 * Set the user guid with a given parameter
 * @param guid The guid of a study participant
 */
export const saveParticipantGuid = (guid: string) => {
  user.patient.participantGuid = guid;
};

/**
 * Takes a short id that is presumed to have the study in it e.g. RGP_1234_56 and
 * returns the short id without the study name prefix e.g. 1234_56
 * @param shortId the short id
 * @param studyName the study name/alias used in the short id e.g. RGP
 * @returns simplified short id
 */
export const simplifyShortID = (shortId: string, studyName: string): string => {
  const shortIdParts = shortId.split(`${studyName}_`); // Use 'RGP_' to determine where to split
  const simplifiedShortID = shortIdParts[1]; //The subject id to be used as short id
  return simplifiedShortID;
};
