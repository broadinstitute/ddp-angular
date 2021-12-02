import { Template } from './template';
import { BlockType } from './blockType';

export interface Block {
  blockType: BlockType;
  bodyTemplate: Template;
  titleTemplate: Template;
}
