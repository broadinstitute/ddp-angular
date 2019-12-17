import { Injectable } from '@angular/core';

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

    // Social media and contacts
    phone: string;
    infoEmail: string;
    dataEmail: string;
    twitterAccountId: string;
    facebookGroupId: string;
    instagramId: string;
    cBioPortalLink: string;
    countMeInUrl: string;

    // Layout settings
    showDataRelease: boolean;
    showInfoForPhysicians: boolean;
    showBlog: boolean;
    blogUrl: string;
    enableRedesign = false;
}
