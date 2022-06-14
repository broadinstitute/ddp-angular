import {DateFieldModel} from './dateField.model';
import {OptionDetailModel} from './optionDetail.model';

export interface QuestionAnswerModel {
  stableId: string;
  questionType: string;
  text: string;
  date: string;
  answer: any;
  dateFields: DateFieldModel;
  optionDetails: OptionDetailModel[];
  groupedOptions: Map<string, string[]>;
  nestedOptions: string[];
}
