export enum Routes {
  Home = '',
  Password = 'password',
  Auth = 'auth',
  LoginLanding = 'login-landing',
  LoginLandingMode = 'login-landing/:mode',
  PasswordResetDone = 'password-reset-done',
  SessionExpired = 'session-expired',
  TellUsYourStory = 'tell-us-your-story',
  CountMeIn = 'count-me-in',
  StayInformed = 'stay-informed',
  Error = 'error',
  ActivityId = 'activity/:id',
  ActivityLink = 'activity-link/:id',
  Dashboard = 'dashboard',
  EmailVerifiedCallback = 'email-verified-callback',
  ThankYou = 'thank-you',

  /**
   * Static Content Pages
   */
  EligibilityCriteria = 'eligibility-criteria',
  HowItWorks = 'how-it-works',
  PrivacyAndYourData = 'privacy-and-your-data',
  ForYourPhysician = 'for-your-physician',
  DataSharing = 'data-sharing',
  LGMD = 'limb-girdle-muscular-dystrophy',
  Craniofacial = 'craniofacial',
  AboutUs = 'about-us',
  Faq = 'faq',
}
