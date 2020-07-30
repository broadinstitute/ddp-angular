export interface Cookie {
  name: string;
  description: string;
  expiration: string;
}

export type CookiesTypes = 'Functional' | 'Analytical';

export interface Cookies {
  cookies: Array<{
    type: CookiesTypes;
    actions: ['Accept', 'Reject'] | null;
    list: Array<Cookie>;
  }>;
}
