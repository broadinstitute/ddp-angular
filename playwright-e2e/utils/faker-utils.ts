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

export const setPatientParticipantGuid = async (page: Page) => {
  const [response] = await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/participants') && resp.status() === 200)
  ]);

  const participantResponse = response.url();
  const urlArray = participantResponse.split('/');
  user.patient.participantGuid = urlArray[6];
};

export const calculateBirthDate = (month: string, day: string, year: string): number => {
  const dateOfBirth = new Date(Number(year), Number(month), Number(day));
  const today = new Date();

  let resultAge = today.getFullYear() - dateOfBirth.getFullYear();
  const resultMonth = today.getMonth() - dateOfBirth.getMonth();

  //Adjust age result depending on if birthday has not yet occurred for the year
  if (resultMonth < 0 || (resultMonth === 0 && today.getDate() < dateOfBirth.getDate())) {
    resultAge--;
  }

  return resultAge;
};

//Mostly planned for use with tissue sample ids to make them unique and useful in case something
//needs to be manually checked
export const getRandomInteger = (maxNumber: number): number => {
  return Math.floor(Math.random() * maxNumber);
}

/**
 * Takes a short id that is presumed to have the study in it e.g. RGP_1234_56 and
 * returns the short id without the study name prefix e.g. 1234_56
 * @param shortId the short id
 * @param studyName the study name/alias used in the short id e.g. RGP
 * @returns simplified short id
 */
export const simplifyShortID = (shortId: string, studyName: string): string => {
  console.log(`short id: ${shortId}`);
  const shortIdParts = shortId.split(`${studyName}_`); // Use 'RGP_' to determine where to split
  const partOne = shortIdParts[0];
  const partTwo = shortIdParts[1];
  console.log(`first part: ${partOne}`);
  console.log(`second part: ${partTwo}`);
  const simplifiedShortID = shortIdParts[1];
  return simplifiedShortID;
}

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

