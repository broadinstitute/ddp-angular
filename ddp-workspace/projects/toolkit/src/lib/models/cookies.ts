export interface Cookie {
  name: string;
  description: string;
  duration: string;
}

export type CookiesTypes = 'Functional' | 'Analytical';

export interface Cookies {
  data: Array<{
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
