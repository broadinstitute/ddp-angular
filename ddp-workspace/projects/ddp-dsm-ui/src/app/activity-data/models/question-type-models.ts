// Core interface
import {Option} from "./option.model";
import {Row} from "./question-definition.model";

export interface QuestionTypeModel {
  type: string;
  stableId: string;
  question?: string;
  // Answer Types
  answer?: string | number;
  picklistAnswer?: Partial<PicklistAnswersModel>;
  compositeAnswer?: MutualModel[];
  matrixAnswer?: MatrixAnswer[];
}

export interface MatrixAnswer {
  horizontalAnswer: Option;
  verticalAnswer: Row;
}

/* Models will be added as necessary */

// Composite Matrix Model
interface MutualModel {
  question: string;
  answer: string;
}

// Picklist
interface PicklistAnswersModel {
  multiple: {
    options: PicklistAnswers[];
    groups: PicklistAnswers[];
  };
  single: PicklistAnswers[];
}

interface PicklistAnswers {
  text: string;
  details: string | string[];
  optionText?: string | string[];
  nText?: string[];
}
