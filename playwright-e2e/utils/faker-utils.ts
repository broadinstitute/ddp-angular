import { faker } from '@faker-js/faker';
import { APIRequestContext, expect, Page } from '@playwright/test';
import * as user from 'data/fake-user.json';
import { logInfo } from './log-utils';
import { Label } from 'dsm/enums';

const { API_BASE_URL } = process.env;

export const generateAlphaNumeric = (length?: number): string => {
  return faker.string.alphanumeric(length ? length : 6);
};

export const generateUserName = (namePrefix: string): string => {
  return `${namePrefix}-${faker.person.lastName()}${faker.lorem.word()}`;
};

// Generate US phone number (9 digits) with dashes
export const generateRandomPhoneNum = (): string => {
  const rand = Math.random().toString().slice(2, 12);
  return rand.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

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
  return shortIdParts[1]; //The subject id to be used as short id
};

export const createNewOS1Participant = async (
  authToken: string,
  request: APIRequestContext,
  participantEmail: string,
  participantFirstName: string,
  participantLastName: string,
  participantDateOfBirth: string,
  opts: { returnedIDType: Label.SHORT_ID | Label.PARTICIPANT_ID }
): Promise<string> => {
  const { returnedIDType } = opts;
  if (!authToken) {
    throw Error(`Invalid parameter: DSM auth_token not provided`);
  }

  const participantCreationResponse = await request.post(`${API_BASE_URL}/pepper/v1/dsm/studies/cmi-osteo/ddp/osteo1user`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    data: {
      email: participantEmail,
      firstName: participantFirstName,
      lastName: participantLastName,
      birthDate: participantDateOfBirth
    },
  });

  expect(participantCreationResponse.ok()).toBeTruthy();
  const responseAsJSON = await participantCreationResponse.json();
  logInfo(`Participant Creation Info: ${JSON.stringify(responseAsJSON)}`);
  expect(responseAsJSON).toHaveProperty('email', participantEmail);
  expect(responseAsJSON).toHaveProperty('profile.firstName', participantFirstName);
  expect(responseAsJSON).toHaveProperty('profile.lastName', participantLastName);
  expect(responseAsJSON).toHaveProperty('profile.birthDate', participantDateOfBirth);

  let participantID = '';
  if (returnedIDType === Label.SHORT_ID) {
    participantID = responseAsJSON.hruid;
  } else if (returnedIDType === Label.PARTICIPANT_ID) {
    participantID = responseAsJSON.guid;
  }
  console.log(`Returning OS1 participant with ID: ${participantID}`);
  return participantID;
}
