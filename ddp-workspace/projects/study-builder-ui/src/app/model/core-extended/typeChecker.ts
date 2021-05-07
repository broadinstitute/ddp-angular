import { Identifiable } from './identifiable';
import { AbstractFormBlockDef } from '../core/abstractFormBlockDef';
import { ContentBlockDef } from '../core/contentBlockDef';
import { QuestionBlockDef } from '../core/questionBlockDef';
import { TextQuestionDef } from '../core/textQuestionDef';
import { QuestionDef } from '../core/questionDef';

export const isIdentifiable = (obj: any): obj is Identifiable => obj instanceof Object
    && (obj.id instanceof String || typeof obj.id === 'string');
export const isBlock =  (obj: any): obj is AbstractFormBlockDef => obj instanceof Object && 'blockType' in obj;
export const isContentBlock = (obj: any): obj is ContentBlockDef => isBlock(obj) && obj.blockType === 'CONTENT';
export const isQuestionBlock = (obj: any): obj is QuestionBlockDef<QuestionDef> => isBlock(obj) && obj.blockType === 'QUESTION';
export const isTextQuestionBlock = (obj: any): obj is QuestionBlockDef<TextQuestionDef> =>
    isQuestionBlock(obj) && obj.question.questionType === 'TEXT';


