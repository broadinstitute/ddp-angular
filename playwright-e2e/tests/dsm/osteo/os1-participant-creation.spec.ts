import {expect} from '@playwright/test';
import { Navigation } from 'dsm/navigation';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { createNewOS1Participant, generateEmailAlias, generateUserName } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';

const OSTEO_USER_EMAIL = process.env.OSTEO_USER_EMAIL as string;

test.describe('description', () => {
  test('Create a OS1 participant @dsm @functional @osteo', async ({ page, request }) => {
    await test.step(`Create a new OS1 participant using the auth_token from DSM`, async () => {
    //Get auth_token from DSM
    const userIDToken = await page.evaluate(() => localStorage.getItem(`auth_token`)) as string;
    const firstName = generateUserName(`OS1-${user.patient.firstName}`);
    const lastName = generateUserName(user.patient.lastName);
    const month = user.patient.birthDate.MM;
    const day = user.patient.birthDate.DD;
    const year = user.patient.birthDate.YYYY;
    const dateOfBirth = `${year}-${month}-${day}`; //Must be in YYYY-MM-DD format
    const email = generateEmailAlias(OSTEO_USER_EMAIL);
    console.log(`Checking name: ${firstName} ${lastName}`);
    console.log(`Checking date of birth: ${dateOfBirth}`);
    console.log(`Checking email: ${email}`);
    await createNewOS1Participant(userIDToken, request, email, firstName, lastName, dateOfBirth);
    })
  })

  //Fill out workflow in DSS OS2

  //Go into DSM and check that ptp can be seen in OS1 & OS2
})
