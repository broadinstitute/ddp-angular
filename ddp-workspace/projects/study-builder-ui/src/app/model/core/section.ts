import { Block } from './block';
import { IconConfig } from './iconConfig';
import { Template } from './template';

export interface Section {
  blocks: Block[];
  icons: IconConfig[];
  nameTemplate: Template;
}
