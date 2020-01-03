import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { TextSuggestionProvider } from './textSuggestionProvider';

export class ActivityTextQuestionBlock extends ActivityQuestionBlock<string> {
    public minLength: number | null = null;
    public maxLength: number | null = null;
    public regexPattern: string | null = null;
    public inputType: string | null = null;
    public textSuggestionSource: TextSuggestionProvider | null = null;
    public confirmEntry: boolean;
    public confirmPrompt: string | null = null;
    public mismatchMessage: string | null = null;
    public confirmationValue: string | null;

    constructor() {
      super();
    }

    public get questionType(): QuestionType {
      return QuestionType.Text;
    }

    public get answer(): string | null {
        return this._answer;
    }

    public set answer(value: string | null) {
        this.setAnswer(value);
    }

    setAnswer(value: string | null, doValidation: boolean = true): void {
      this._answer = value;
      this.confirmEntry && (this.confirmationValue = value);
      doValidation && this.validate();
    }
}
