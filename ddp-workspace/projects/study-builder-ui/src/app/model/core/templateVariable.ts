import { Translation } from './translation';

export interface TemplateVariable {
  name: string;
  translations: Array<Translation>;
}
