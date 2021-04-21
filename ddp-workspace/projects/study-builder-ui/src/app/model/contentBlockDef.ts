import { Template } from './template';
import { AbstractFormBlockDef } from './abstractFormBlockDef';

export interface ContentBlockDef extends AbstractFormBlockDef {
  titleTemplate: Template | null;
  bodyTemplate: Template;
  blockType: 'CONTENT';
}
