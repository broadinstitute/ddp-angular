import { UrlString } from './urlString';
import { FormSectionState } from './sectionState';

export interface IconConfig {
  state: FormSectionState;
  height: number;
  width: number;
  "1x": UrlString;
}
