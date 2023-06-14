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
 * Takes a date and formats it into MM/DD/YYYY
 * @param date The date to format into a string that's MM/DD/YYYY
 * @returns Re-formatted date
 */
export const getDateInMonthDayYearFormat = (date: Date): string => {
  const month = date.getMonth() + 1;
  let monthAdjusted = false;
  let paddedMonth = '';

  const day = date.getDate();
  let dayAdjusted = false;
  let paddedDay = '';

  const year = date.getFullYear();
  let formattedYear: string;

  //Adjust month to expected format
  if (month < 10) {
    paddedMonth = `0${month}`;
    monthAdjusted = true;
  }

  //Adjust day to expected format
  if (day < 10) {
    paddedDay = `0${day}`;
    dayAdjusted = true;
  }

  //Return the date in MM/DD/YYYY format given various scenarios
  if (monthAdjusted && dayAdjusted) {
    formattedYear = `${paddedMonth}/${paddedDay}/${year}`;
  } else if (!monthAdjusted && dayAdjusted) {
    formattedYear = `${month}/${paddedDay}/${year}`;
  } else if (monthAdjusted && !dayAdjusted) {
    formattedYear = `${paddedMonth}/${day}/${year}`;
  } else {
    formattedYear = `${month}/${day}/${year}`;
  }

  return formattedYear;
}
