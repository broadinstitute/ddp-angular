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
    public confirmPlaceholder: string | null = null;
    public mismatchMessage: string | null = null;
    protected _confirmationAnswer: string | null = null;

    constructor() {
      super();
    }

    public get questionType(): QuestionType {
      return QuestionType.Text;
    }

    public get confirmationAnswer(): string | null {
      return this._confirmationAnswer;
    }

    public set confirmationAnswer(value: string | null) {
      this._confirmationAnswer = value;
    }

    public setConfirmationAnswer(value: string | null, doValidation = true): void {
      this._confirmationAnswer = value;

      if (doValidation) {
        this.validate();
      }
    }

    public hasAnswer(): boolean {
        return this.answer?.trim().length > 0;
    }
}
