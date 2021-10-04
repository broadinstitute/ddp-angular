import { HttpMethod } from '../constants/http-method';

export interface CommonSleepLogProxyPayload {
  auth0ClientId: string;
  auth0Domain: string;
  url: string;
  method: HttpMethod;
}
