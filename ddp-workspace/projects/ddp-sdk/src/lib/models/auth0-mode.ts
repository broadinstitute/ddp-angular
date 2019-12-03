/**
 * Options that control appearance of the auth0 login/signup modal.
 * These params are read by the hosted login page in the tenant
 * for the umbrella/study.
 */
export enum Auth0Mode {
    /**
     * Shows both the signup and login options
     */
    SignupAndLogin = 'both',

    /**
     * Shows only the signup option, no login
     */
    SignupOnly = 'signup',

    /**
     * Shows only the login option, no signup
     */
    LoginOnly = 'login'
}
