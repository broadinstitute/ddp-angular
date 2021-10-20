import { QuestionBlockDef } from './questionBlockDef';
import { ComponentBlockDef } from './componentBlockDef';
import { ConditionalBlockDef } from './conditionalBlockDef';
import { GroupBlockDef } from './groupBlockDef';
import { ContentBlockDef } from './contentBlockDef';
import { QuestionDef } from './questionDef';

export type FormBlockDef = ContentBlockDef | GroupBlockDef | QuestionBlockDef<QuestionDef> | ConditionalBlockDef | ComponentBlockDef;
