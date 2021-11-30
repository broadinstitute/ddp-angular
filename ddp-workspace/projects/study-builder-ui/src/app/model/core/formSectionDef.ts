import { Template } from './template';
import { SectionIcon } from './sectionIcon';
import { FormBlockDef } from './formBlockDef';

export interface FormSectionDef {
  // @todo: Does not appear be used
  sectionCode?: string;
  // appears to be used for wizard UI
  nameTemplate: Template | null;
  icons: Array<SectionIcon>;
  blocks: Array<FormBlockDef>;
}
