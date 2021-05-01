import { AgreementQuestionDef } from './agreementQuestionDef';
import { BooleanQuestionDef } from './booleanQuestionDef';
import { DateQuestionDef } from './dateQuestionDef';
import { PicklistQuestionDef } from './picklistQuestionDef';
import { TextQuestionDef } from './textQuestionDef';
import { CompositeQuestionDef } from './compositeQuestionDef';
import { NumericQuestionDef } from './numericQuestionDef';

export type QuestionDef = AgreementQuestionDef | BooleanQuestionDef | DateQuestionDef | PicklistQuestionDef | TextQuestionDef | CompositeQuestionDef | NumericQuestionDef;
