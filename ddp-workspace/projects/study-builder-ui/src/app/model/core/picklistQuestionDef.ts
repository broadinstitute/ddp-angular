import { Template } from './template';
import { AbstractQuestionDef } from './abstractQuestionDef';
import { PicklistSelectMode } from './picklistSelectMode';
import { PicklistRenderMode } from './picklistRenderMode';
import { PicklistGroupDef } from './picklistGroupDef';
import { PicklistOptionDef } from './picklistOptionDef';

export interface PicklistQuestionDef extends AbstractQuestionDef {
  selectMode: PicklistSelectMode;
  renderMode: PicklistRenderMode;
  picklistLabelTemplate: Template | null;
  groups: Array<PicklistGroupDef>;
  picklistOptions: Array<PicklistOptionDef>;
  questionType: 'PICKLIST';
}
