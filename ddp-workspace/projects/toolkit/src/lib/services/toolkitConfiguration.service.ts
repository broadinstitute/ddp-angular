import { Injectable } from '@angular/core';
import { DashboardColumns } from 'ddp-sdk';
import { Cookies } from '../models/cookies/cookies';

@Injectable()
export class ToolkitConfigurationService {
    // GUIDs
    studyGuid: string;
    aboutYouGuid: string;
    aboutFamilyGuid: string;
    aboutChildGuid: string;
    consentGuid: string;
    consentAssentGuid: string;
    parentalConsentGuid: string;
    releaseGuid: string;
    releaseMinorGuid: string;
    dashboardGuid: string;
    lovedOneGuid: string;
    lovedOneThankYouGuid: string;
    tissueConsentGuid: string;
    tissueReleaseGuid: string;
    bloodConsentGuid: string;
    bloodReleaseGuid: string;
    followupGuid: string;
    covidSurveyGuid: string;
    symptomSurveyGuid: string;
    addressGuid: string;

    // URLs
    aboutUsUrl: string;
    aboutYouUrl: string;
    aboutFamily: string;
    aboutChildUrl: string;
    lovedOneUrl: string;
    internationalPatientsUrl: string;
    consentUrl: string;
    consentAssentUrl: string;
    parentalConsentUrl: string;
    releaseUrl: string;
    releaseMinorUrl: string;
    dashboardUrl: string;
    activityUrl: string;
    errorUrl: string;
    stayInformedUrl: string;
    lovedOneThankYouUrl: string;
    familyHistoryThankYouUrl: string;
    moreDetailsUrl: string;
    tissueConsentUrl: string;
    tissueReleaseUrl: string;
    bloodConsentUrl: string;
    bloodReleaseUrl: string;
    followupUrl: string;
    doneUrl: string;
    covidSurveyUrl: string;
    symptomSurveyUrl: string;
    addressUrl: string;
    adminDashboardUrl: string | null = null;
    mailingListDialogUrl: string;
    participantListUrl: string;

    // Social media and contacts
    phone: string;
    infoEmail: string;
    dataEmail: string;
    twitterAccountId: string;
    facebookGroupId: string;
    instagramId: string;
    cBioPortalLink: string;
    countMeInUrl: string;
    blogUrl: string;

    // Layout settings
    showDataRelease: boolean;
    showInfoForPhysicians: boolean;
    showBlog: boolean;
    agreeConsent: boolean;
    dashboardDisplayedColumns: Array<DashboardColumns> = ['name', 'summary', 'date', 'status', 'actions'];

    // Keys and tokens
    recaptchaSiteClientKey: string;
    lightswitchInstagramWidgetId: string;

    cookies: Cookies | null;
    usePrionPrivacyPolicyTemplate: boolean;
    useParticipantDashboard: boolean;
    addParticipantUrl: string;
}
