import { Injectable } from '@angular/core';
import { LogLevel } from '../models/logLevel';
import { QuestionType } from '../models/activity/questionType';
import { UserProfileField } from '../models/userProfileFieldType';
import { MailAddressFormErrorFormatter } from '../models/mailAddressFormErrorFormatter';
import { InstitutionAdditionalFields, InstitutionType } from '../models/activity/institutionType';

@Injectable()
export class ConfigurationService {
    backendUrl: string;
    backendUrlDSS: string;
    baseUrl: string;
    auth0ClientId: string;
    auth0CodeRedirect: string;
    // From Auth0 Applications configuration domain
    auth0Domain: string;
    auth0Audience: string;
    logLevel: LogLevel;
    auth0SilentRenewUrl: string;
    loginLandingUrl: string;
    // Auth0 client used for administrative purposes in the app.
    adminClientId: string | null = null;
    adminLoginLandingUrl: string | null = null;
    localRegistrationUrl: string;
    // Registration of user is done either by Auth0 contacting server back-end (doLocalRegistration: false)
    // or by client application after being redirected back from Auth0 (doLocalRegistration: true)
    // doLocalRegistration: true meant only for development
    doLocalRegistration: boolean;
    // Google maps API key: https://developers.google.com/places/web-service/get-api-key
    mapsApiKey: string;
    errorReportingApiKey: string;
    // projectId of your project in GCP
    projectGcpId: string;
    projectGAToken: string;
    studyGuid: string;
    // Validate only visible sections
    validateOnlyVisibleSections = false;
    // country code if limiting app to just one country
    supportedCountry: string | null = null;
    // whether dashboard status should display a count of questions
    dashboardShowQuestionCount = false;
    // if dashboardShowQuestionCount is true, exclude activity guids listed here from showing
    // their question count
    dashboardShowQuestionCountExceptions: string[] = [];
    // if activity status added here, buttons text will be changed on custom
    dashboardActivitiesCompletedStatuses: string[] = [];
    // if activity status added here, buttons text will be changed on custom
    dashboardActivitiesStartedStatuses: string[] = [];
    // if activity added here, the status column will show activitySummary message and will be shown a custom button
    dashboardSummaryInsteadOfStatus: string[] = [];
    // if activity added here, for this activity will be shown another button
    dashboardReportActivities: string[] = [];
    tooltipIconUrl = '';
    // must be a 24x24 svg icon.  To make sure colors match, do not specify a stroke color
    languageSelectorIconURL: string | null = null;
    // urls for app pages
    lookupPageUrl: string | null = null;
    sessionExpiredUrl = 'session-expired';
    adminSessionExpiredUrl = 'admin-session-expired';
    errorPageUrl = 'error';
    dashboardPageUrl = 'dashboard';
    passwordPageUrl = 'password';
    // if questions inside of composite questions shouldn't show asterisk at the end, add question type here
    compositeRequiredFieldExceptions: QuestionType[] = [];
    // whether address validation enforces that required fields need to be entered (as opposed to just accepting EasyPost validation)
    addressEnforceRequiredFields = false;
    // this property reflects offset from the top of the page when we scroll to invalid question
    scrollToErrorOffset = 100;
    defaultLanguageCode: string;
    rtlLanguages: string[] = [];
    // The flag indicates whether we need report JS errors to Google Cloud Error Report API
    // It set (and can be overridden for any single app) in pepperConfig
    doGcpErrorReporting: boolean;
    cloudLoggingUrl: string;
    // The flag indicates whether we need google cloud logging
    doCloudLogging: boolean;
    // activities which should use a vertical progress indicator
    usesVerticalStepper: string[] = [];
    // if steps with circle should be used
    useStepsWithCircle: boolean;
    prismColumns: string[] = [];
    prismDashboardRoute: string;
    prismRoute: string;
    picklistsWithNoSorting: string[] = [];
    /*
     * This flag indicates whether we enable fix for missing house numbers.
     * When user selects an address in suggestion list from Google autocomplete
     * and this address doesn't exist street field won't include a house number (if user selected an address with one)
     * Enabling this flag potentially fixes this problem although it's not yet tested properly and may cause strange behavior
     */
    fixMissingHouseNumberInAddressForm = false;
    // autocompletePicklists which don't need to be sorted
    notSortedPicklistAutocompleteStableIds: string[] = [];
    // symbols which should be ignored in autocompletePicklist query (treat as a space)
    picklistAutocompleteIgnoredSymbols: string[] = ['-', '/', '(', ')'];
    /**
     * If there are only 2 supported languages enabling this flag won't show a dropdown but only a toggle button.
     */
    useBinaryLanguageSelector = false;
    /**
     * Used in combination with `useBinaryLanguageSelector`.
     * Reverses 2 supported languages.
     * Example: a study supports English and Spanish.
     * Default behavior: English is selected => shows English in language selector.
     * Behavior with this flag enabled: English is selected => shows Spanish in language selector.
     */
    reverseBinaryLanguageSelector = false;
    /**
     * List of user fields which will be displayed for editing in User Preferences component
     */
    userProfileFieldsForEditing: UserProfileField[] = [];
    /**
     * Can be used to customize which i18n key is used
     * to display an error for each field in mailing address form.
     */
    mailAddressFormErrorFormatter: MailAddressFormErrorFormatter | null = null;
    /**
     * Can be used to show answered questions count instead of "Complete" message
     * when all questions in nested modal activity are answered
     */
    alwaysShowQuestionsCountInModalNestedActivity = false;
    auth0ClaimNameSpace: string;
    /**
     * Configure additional fields to show for institutions
     */
    institutionsAdditionalFields: Partial<Record<InstitutionType, InstitutionAdditionalFields[]>> = {};
}
