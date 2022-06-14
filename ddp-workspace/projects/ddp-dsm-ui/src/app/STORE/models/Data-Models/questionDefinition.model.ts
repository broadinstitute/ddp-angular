import {OptionModel} from "./option.model";
import {GroupModel} from "./group.model";

export interface QuestionDefinitionModel {
  stableId: string;
  questionType: string;
  questionText: string;
  options: OptionModel[];
  groups: GroupModel[];
  childQuestions: QuestionDefinitionModel[];
  selectMode: string;
  allowMultiple: boolean;
}
