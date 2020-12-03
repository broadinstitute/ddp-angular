import { CookiesTypes } from './cookiesType';
import { Cookie } from './cookie';

export interface Cookies {
  data: Array<{
    type: CookiesTypes;
    actions: ['Accept', 'Reject'] | null;
    list: Array<Cookie>;
  }>;
}
