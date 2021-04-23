import { Component, OnInit } from '@angular/core';
import { ActivityDefinitionEditorService } from '../services/activity-definition-editor.service';
import { FormBlockDef } from '../model/formBlockDef';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { QuestionBlockDef } from '../model/questionBlockDef';

@Component({
    selector: 'app-survey-component-editor',
    templateUrl: './survey-component-editor.component.html',
    styleUrls: ['./survey-component-editor.component.scss']
})
export class SurveyComponentEditorComponent implements OnInit {
    currentBlock$: Observable<FormBlockDef | null> = this.editorService.currentBlockDef$;
    currentQuestionBlock$: Observable<QuestionBlockDef | null> = this.currentBlock$.pipe(
        map(block => this.isQuestion(block) ? block as QuestionBlockDef : null));
    isTextQuestionBlock$: Observable<boolean> = this.currentBlock$.pipe(
        map(block => this.isQuestion(block) && block.question.questionType === 'TEXT'),
        share()
    );

    constructor(private editorService: ActivityDefinitionEditorService) {
    }

    ngOnInit(): void {
        this.isTextQuestionBlock$.subscribe(isTextQuestion => console.log('It is a text questionblco:%o', isTextQuestion));
    }


    // isTextQuestionBlock(): Observable<boolean> {
    //     return this.currentBlock$.pipe(map(block => this.isQuestion(block) && block.question.questionType === 'TEXT'));
    // }

    isQuestion(block: FormBlockDef): block is QuestionBlockDef {
        return block?.blockType === 'QUESTION';
    }

}
