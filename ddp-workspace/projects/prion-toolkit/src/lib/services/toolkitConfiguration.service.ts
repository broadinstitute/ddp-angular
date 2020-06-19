import { Injectable } from '@angular/core';
import { DashboardColumns } from 'ddp-sdk';

@Injectable()
export class ToolkitConfigurationService {
    // GUIDs
    studyGuid: string;
    aboutYouGuid: string;
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
    addressGuid: string;

    // URLs
    aboutUsUrl: string;
    aboutYouUrl: string;
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
    moreDetailsUrl: string;
    tissueConsentUrl: string;
    tissueReleaseUrl: string;
    bloodConsentUrl: string;
    bloodReleaseUrl: string;
    followupUrl: string;
    doneUrl: string;
    covidSurveyUrl: string;
    addressUrl: string;
    adminDashboardUrl: string | null = null;
    assetsBucketUrl: string;

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
}
