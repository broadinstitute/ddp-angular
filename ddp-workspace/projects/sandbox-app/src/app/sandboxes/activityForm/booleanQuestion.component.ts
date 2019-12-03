import { Component } from '@angular/core';
import { ActivityBooleanQuestionBlock } from 'ddp-sdk';
import { QuestionComponent } from './questionComponent';
import { BooleanParameters } from '../../model/booleanParameters';

@Component({
    selector: 'app-sandbox-boolean-question',
    templateUrl: 'booleanQuestion.component.html'
})
export class BooleanQuestionComponent extends QuestionComponent<ActivityBooleanQuestionBlock> {
    constructor() {
        super();
        let parameters: BooleanParameters = {
            readonly: false,
            shown: true,
            trueContent: 'yes',
            falseContent: 'no'
        };

        this.inputParameters = JSON.stringify(parameters, null, '\t');
        this.readonly = parameters.readonly;
        this.question = new ActivityBooleanQuestionBlock();
        this.question.shown = parameters.shown;
        this.question.falseContent = parameters.falseContent;
        this.question.trueContent = parameters.trueContent;
    }

    public update(): void {
        try {
            let parameters: BooleanParameters = JSON.parse(this.inputParameters);
            this.readonly = parameters.readonly;
            this.question.shown = parameters.shown;
            this.question.falseContent = parameters.falseContent;
            this.question.trueContent = parameters.trueContent;
            this.validationMessage = null;
        } catch (error) {
            this.validationMessage = `invalid parameters: ${error}`;
        }
    }
}