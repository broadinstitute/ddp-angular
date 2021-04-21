import { TemplateType } from './templateType';
import { TemplateVariable } from './templateVariable';

export interface Template {
  templateType: TemplateType;
  templateCode?: string | null;
  templateText: string;
  variables: Array<TemplateVariable>;
}
