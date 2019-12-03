import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { TextSuggestionProvider } from './textSuggestionProvider';

export class ActivityTextQuestionBlock extends ActivityQuestionBlock<string> {
    public minLength: number | null = null;
    public maxLength: number | null = null;
    public regexPattern: string | null = null;
    public inputType: string | null = null;
    public textSuggestionSource: TextSuggestionProvider | null = null;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Text;
    }
}
