import { ComponentType } from './componentType';
import { AbstractFormBlockDef } from './abstractFormBlockDef';

export interface ComponentBlockDef extends AbstractFormBlockDef {
  componentType: ComponentType;
  hideNumber: boolean;
  blockType: 'COMPONENT';
}
