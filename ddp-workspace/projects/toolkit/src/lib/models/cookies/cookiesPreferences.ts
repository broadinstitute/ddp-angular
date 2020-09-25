import { CookiesConsentStatuses } from './cookiesConsentStatuses';

export interface CookiesPreferences {
  decision: boolean;
  status: CookiesConsentStatuses;
  cookies: {};
}
