import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ActivityQuestionComponent } from 'ddp-sdk';

interface BaseQuestionBlock<T> {
    answer: T;
    setAnswer(answer: T, doValidation: boolean): void;
    validators: any[];
}

@Component({
    template: ''
})
export abstract class BaseBlockComponent<DefinitionBlockType, BlockType, AnswerType> {
    @Input() definitionBlock$: Observable<DefinitionBlockType>;
    angularClientBlock$: Observable<BlockType>;
    validationErrorMessages: string[] = [];
    protected abstract defaultAnswer: AnswerType | null;

    protected abstract buildFromDef(defBlock: DefinitionBlockType): BlockType;

    protected getAngularClientBlock$(): Observable<BlockType> {
        return this.definitionBlock$.pipe(
            tap(defBlock => console.log('getting defblock: %o', defBlock)),
            filter(block => !!block),
            map(defBlock => this.buildFromDef(defBlock))
        );
    }

    protected validate(block: (BlockType & BaseQuestionBlock<AnswerType>), answer: AnswerType = block.answer): void {
        block.setAnswer(answer || this.defaultAnswer, false);
        for (const validator of block.validators) {
            validator.recalculate();
        }
        this.validationErrorMessages = block.validators.map(validator => {
            const result = validator.result;
            return ActivityQuestionComponent.isActivityValidationResult(result) ? result.message : result;
        });
    }
}
