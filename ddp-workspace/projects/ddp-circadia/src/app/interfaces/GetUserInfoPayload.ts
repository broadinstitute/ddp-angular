import { CommonSleepLogProxyPayload } from './CommonSleepLogProxyPayload';

export interface GetUserInfoPayload extends CommonSleepLogProxyPayload {
  email: string;
}
