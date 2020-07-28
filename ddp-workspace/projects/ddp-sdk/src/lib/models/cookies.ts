export interface Cookie {
  name: string;
  description: string;
  expiration: string;
}

export interface Cookies {
  cookies: Array<{
    type: 'Functional' | 'Analytical';
    actions: ['Accept', 'Reject'] | null;
    list: Array<Cookie>;
  }>;
}
