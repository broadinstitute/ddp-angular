import { BlockType } from './blockType';

export interface AbstractFormBlockDef {
  blockType: BlockType;
  // @todo is this OK? blockguid generated when inserted. ShownExpr seems optional
  blockGuid?: string | null;
  shownExpr?: string | null;
}
