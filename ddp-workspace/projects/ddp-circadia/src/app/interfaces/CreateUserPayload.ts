import { CommonSleepLogProxyPayload } from './CommonSleepLogProxyPayload';

export interface CreateUserPayload extends CommonSleepLogProxyPayload {
  email: string;
  start: string;
  end: string;
}
