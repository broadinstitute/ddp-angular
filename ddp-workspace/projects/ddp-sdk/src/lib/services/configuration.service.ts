import { Injectable } from '@angular/core';
import { LogLevel } from '../models/logLevel';

@Injectable()
export class ConfigurationService {
    backendUrl: string;
    baseUrl: string;
    auth0ClientId: string;
    auth0CodeRedirect: string;
    // From Auth0 Applications configuration domain
    auth0Domain: string;
    auth0Audience: string;
    logLevel: LogLevel;
    auth0SilentRenewUrl: string;
    loginLandingUrl: string;
    localRegistrationUrl: string;
    // Registration of user is done either by Auth0 contacting server back-end (doLocalRegistration: false)
    // or by client application after being redirected back from Auth0 (doLocalRegistration: true)
    // doLocalRegistration: true meant only for development
    doLocalRegistration: boolean;
    // Google maps API key: https://developers.google.com/places/web-service/get-api-key
    mapsApiKey: string;
    projectGAToken: string;
    studyGuid: string;
    // country code if limiting app to just one country
    supportedCountry: string | null = null;
}
