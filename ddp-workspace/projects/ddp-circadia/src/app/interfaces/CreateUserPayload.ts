import { CommonSleepLogProxyPayload } from './CommonSleepLogProxyPayload';

export interface CreateUserPayload extends CommonSleepLogProxyPayload {
  email: string;
}
