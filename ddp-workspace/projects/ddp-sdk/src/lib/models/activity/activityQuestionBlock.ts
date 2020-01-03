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
}
