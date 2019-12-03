import { Component } from '@angular/core';
import { ActivityAgreementQuestionBlock } from 'ddp-sdk';
import { QuestionComponent } from './questionComponent';
import { AgreementParameters } from '../../model/agreementParameters';

@Component({
    selector: 'app-sandbox-agreement-question',
    templateUrl: 'agreementQuestion.component.html'
})
export class AgreementQuestionComponent extends QuestionComponent<ActivityAgreementQuestionBlock> {
    constructor() {
        super();
        let parameters: AgreementParameters = {
            readonly: false,
            shown: true,
            question: "I understand that my data... and I agree researchers can..."
        };

        this.inputParameters = JSON.stringify(parameters, null, '\t');
        this.readonly = parameters.readonly;
        this.question = new ActivityAgreementQuestionBlock();
        this.question.shown = parameters.shown;
        this.question.question = parameters.question;
    }

    public update(): void {
        try {
            let parameters: AgreementParameters = JSON.parse(this.inputParameters);
            this.readonly = parameters.readonly;
            this.question.shown = parameters.shown;
            this.question.question = parameters.question;
            this.validationMessage = null;
        } catch (error) {
            this.validationMessage = `invalid parameters: ${error}`;
        }
    }
}