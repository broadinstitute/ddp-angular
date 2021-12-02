import { FormSectionState } from './formSectionState';

export interface SectionIcon {
  width: number;
  height: number;
  state: FormSectionState;
  sources: {[key: string]: string};
}
