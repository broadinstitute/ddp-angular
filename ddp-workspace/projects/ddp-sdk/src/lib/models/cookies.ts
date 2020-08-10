export type CookiesTypes = 'Functional' | 'Analytical';

export interface Cookie {
  name: string;
  description: string;
  expiration: string;
}
export interface Cookies {
  cookies: Array<{
    type: CookiesTypes;
    actions: ['Accept', 'Reject'] | null;
    list: Array<Cookie>;
  }>;
}

export type CookiesConsentStatuses = 'default_accept' | 'default_reject' | 'managed';

export enum ConsentStatuses {
  defaultAccept= 'default_accept',
  defaultReject = 'default_reject',
  managed = 'managed'
}

export interface CookiesPreferences {
  decision: boolean;
  status: CookiesConsentStatuses;
  cookies: {};
}

