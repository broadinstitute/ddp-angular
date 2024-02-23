import {test} from '@playwright/test';
import * as utils from 'utils/test-utils';
import * as user from 'data/fake-user.json';
import {generateUserName} from 'utils/faker-utils';
import {MBCHomePage} from 'dss/pages/mbc/mbc-home-page';
import {MBCJoinPage} from 'dss/pages/mbc/mbc-join-page';
import * as auth from 'authentication/auth-lms';
import {logParticipantCreated} from 'utils/log-utils';
import {MBCSurveyAboutPage} from 'dss/pages/mbc/mbc-survey-about-page';
import {MBCPatientsData} from 'dss/pages/mbc/mbc-patient-type';
import {MBCResearchConsentPage} from 'dss/pages/mbc/mbc-research-consent-page';
import {MBCMedicalReleasePage} from 'dss/pages/mbc/mbc-medical-release-page';
import {MBCFollowUpSurvey1} from 'dss/pages/mbc/mbc-follow-up-survey-1';

const {MBC_USER_EMAIL, MBC_USER_PASSWORD, MBC_BASE_URL, SITE_PASSWORD} = process.env;


test.describe.serial('MBC enrolment @mbc', () => {
  test('join the movement @dss @functional @mbc', async ({page}) => {
    const participant = user.adult;
    const firstName = generateUserName(participant.firstName);
    const lastName = generateUserName(participant.lastName);
    const fullName = `${firstName} ${lastName}`;

    await test.step('Create account with email', async () => {
      await page.goto(MBC_BASE_URL as string);
      await utils.fillSitePassword(page, SITE_PASSWORD);
      await page.waitForTimeout(1000);

      const homePage = new MBCHomePage(page);
      await homePage.waitForReady();
      await homePage.countMeIn();

      const joinPage = new MBCJoinPage(page);
      await joinPage.waitForReady();
      await joinPage.fillInName('testFirstName', 'testLastName');
      await joinPage.whoIsSigningUP().toRadiobutton().check(MBCPatientsData.patient.whoIsSigningUp);
      await joinPage.submit();

      const userEmail = await auth.createAccountWithEmailAlias(page, {
        email: MBC_USER_EMAIL,
        password: MBC_USER_PASSWORD
      });
      logParticipantCreated(userEmail, fullName);
    });

    await test.step('About you page', async () => {
      const aboutYouPage = new MBCSurveyAboutPage(page);
      await aboutYouPage.waitForReady();
      await aboutYouPage.firstBreastCancerDiagnosedDate('2', '2003');
      await aboutYouPage.firstMetastaticBreastCancerDiagnosedDate('3', '2004');
      await aboutYouPage.hrPositive('No');
      await aboutYouPage.hr2Positive('Yes');
      await aboutYouPage.tripleNegative("I don't know");
      await aboutYouPage.inflammatory('No');
      await aboutYouPage.therapies('No');
      await aboutYouPage.workedTherapies('No');
      await aboutYouPage.extraordinaryTherapy('Extra ordinary therapy test');
      await aboutYouPage.mostRecentBiopsyDate('5', '2021');
      await aboutYouPage.aboutYou('About you test');
      await aboutYouPage.birthYear('1993');
      await aboutYouPage.countryLiveIn('United States');
      await aboutYouPage.fillInZipCode('1932');
      await aboutYouPage.race('White', 'Polish');
      await aboutYouPage.gender('Man');
      await aboutYouPage.sex('Male');
      await aboutYouPage.howDidYouHear('How did you hear test');

      await aboutYouPage.submit();
    });

    await test.step('Research Consent Form page', async () => {
      const researchConsentPage = new MBCResearchConsentPage(page);
      await researchConsentPage.waitForReady();
      // Ket Points section
      await researchConsentPage.next();

      // Full Form section
      await researchConsentPage.next();

      // Sign Consent section
      await researchConsentPage.consentBlood();
      await researchConsentPage.consentTissue();
      await researchConsentPage.fullName('Test Full Name');
      await researchConsentPage.dateOfBirth('3', '12', '1993');
      await researchConsentPage.submit();
    });

    await test.step('Medical Release Form page', async () => {
      const medicalReleasePage = new MBCMedicalReleasePage(page);
      await medicalReleasePage.waitForReady();
      await medicalReleasePage.fillInContactAddress({
        fullName: 'Test Full Name'
      });
      await medicalReleasePage.yourPhysicianName();
      await medicalReleasePage.yourHospitalOrInstitution();
      await medicalReleasePage.addAndFillAnotherInstitution();

      await medicalReleasePage.agreeToAllowUsToContactPhysicianToObtainRecords();
      await medicalReleasePage.submit();

      await page.waitForTimeout(3000);
    });

    await test.step('Follow-up survey #1: Additional details about your cancer & treatments page',
      async () => {
        const followUpSurvey1 = new MBCFollowUpSurvey1(page);
        await followUpSurvey1.waitForReady();
        await followUpSurvey1.currentCancerLocation('Liver');
        await followUpSurvey1.diagnosisCancerLocation('Brain');
        await followUpSurvey1.anytimeCancerLocation('Skin');
        await followUpSurvey1.cancerIdentification("I don't know");
        await followUpSurvey1.currentlyMedicated('Yes', {
          medication: 'Test current medication',
          startDate: {
            month: '3',
            year: '2014',
          }
        });
        await followUpSurvey1.previouslyMedicated('Yes', {
          medication: 'Test past medication',
          startDate: {
            month: '4',
            year: '2015',
          },
          endDate: {
            month: '5',
            year: '2016',
          }
        });

        await followUpSurvey1.submit();

        await page.waitForTimeout(3000);
      })
  })
});
