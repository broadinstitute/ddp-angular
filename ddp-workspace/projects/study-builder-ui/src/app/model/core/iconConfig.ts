import { UrlString } from './urlString';
import { FormSectionState } from './formSectionState';

export interface IconConfig {
  state: FormSectionState;
  height: number;
  width: number;
  "1x": UrlString;
}
