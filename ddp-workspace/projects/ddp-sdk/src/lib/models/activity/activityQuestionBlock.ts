import { AbstractActivityQuestionBlock } from './abstractActivityQuestionBlock';

export abstract class ActivityQuestionBlock<T> extends AbstractActivityQuestionBlock {
    protected _answer: T | null = null;
    public isRequired: boolean;
    public displayNumber: number | null;

    public get answer(): T | null {
        return this._answer;
    }

    public set answer(value: T | null) {
        this._answer = value;
        this.validate();
    }

    public setAnswer(value: T | null, doValidation: boolean = true): void {
        this._answer = value;
        doValidation && this.validate();
    }

    public convertToString(value: T): string {
        return String(value);
    }

    /**
     *  Whether the question is able to change (and emit) its answer value
     *  Most of questions generate answers
     *  except ActivityEquationQuestionBlock that has a special behavior
     */
    public generatesAnswers(): boolean {
        return true;
    }

    /**
     *  Whether the question has a valid answer
     *  in case when the question validators include ActivityRequiredValidationRule
     */
    public abstract hasAnswer(): boolean;
}
