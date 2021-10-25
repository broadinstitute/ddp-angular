import { FormBlockDef } from './formBlockDef';
import { PresentationHint } from './presentationHint';
import { Template } from './template';
import { ListStyleHint } from './listStyleHint';
import { AbstractFormBlockDef } from './abstractFormBlockDef';

export interface GroupBlockDef extends AbstractFormBlockDef {
  listStyleHint: ListStyleHint;
  presentationHint: PresentationHint;
  title: Template;
  nested: Array<FormBlockDef>;
  blockType: 'GROUP';
}
