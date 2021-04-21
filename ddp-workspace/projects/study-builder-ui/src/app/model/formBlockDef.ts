import { QuestionBlockDef } from './questionBlockDef';
import { ComponentBlockDef } from './componentBlockDef';
import { ConditionalBlockDef } from './conditionalBlockDef';
import { GroupBlockDef } from './groupBlockDef';
import { ContentBlockDef } from './contentBlockDef';

export type FormBlockDef = ContentBlockDef | GroupBlockDef | QuestionBlockDef | ConditionalBlockDef | ComponentBlockDef;

