export abstract class QuestionComponent<TBlock> {
    public question: TBlock;
    public validationMessage: string | null;
    public inputParameters: string;
    public readonly: boolean;
    public currentValue: string;

    public valueChanged(value: any): void {
        this.currentValue = JSON.stringify(value);
    }
}
