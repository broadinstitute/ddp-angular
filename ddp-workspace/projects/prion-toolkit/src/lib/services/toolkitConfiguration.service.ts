import { Injectable } from '@angular/core';

@Injectable()
export class ToolkitConfigurationService {
    studyGuid: string;
    prequalifierGuid: string;
    consentGuid: string;
    releaseGuid: string;
    dashboardGuid: string;
    thankYouGuid: string;
    tissueConsentGuid: string;
    tissueReleaseGuid: string;
    bloodConsentGuid: string;
    bloodReleaseGuid: string;
    followupGuid: string;
    aboutUsUrl: string;
    prequalifierUrl: string;
    lovedOneUrl: string;
    internationalPatientsUrl: string;
    consentUrl: string;
    releaseUrl: string;
    dashboardUrl: string;
    activityUrl: string;
    errorUrl: string;
    stayInformedUrl: string;
    thankYouUrl: string;
    moreDetailsUrl: string;
    tissueConsentUrl: string;
    tissueReleaseUrl: string;
    bloodConsentUrl: string;
    bloodReleaseUrl: string;
    followupUrl: string;
    phone: string;
    infoEmail: string;
    dataEmail: string;
    twitterAccountId: string;
    facebookGroupId: string;
    instagramId: string;
    cBioPortalLink: string;
    showDataRelease: boolean;
    showInfoForPhysicians: boolean;
    showBlog: boolean;
    blogUrl: string;
    enableRedesign = false;
    assetsBucketUrl: string;
}
