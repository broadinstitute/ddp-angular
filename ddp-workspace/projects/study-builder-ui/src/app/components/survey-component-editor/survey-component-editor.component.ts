import { Component } from '@angular/core';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';
import { FormBlockDef } from '../../model/core/formBlockDef';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { QuestionBlockDef } from '../../model/core/questionBlockDef';
import { ContentBlockDef } from '../../model/core/contentBlockDef';
import { isContentBlock } from '../../model/core-extended/typeChecker';

@Component({
    selector: 'app-survey-component-editor',
    templateUrl: './survey-component-editor.component.html',
    styleUrls: ['./survey-component-editor.component.scss']
})
export class SurveyComponentEditorComponent {
    currentBlock$: Observable<FormBlockDef | null> = this.editorService.currentBlockDef$;
    isTextQuestionBlock$: Observable<boolean> = this.currentBlock$.pipe(
        map(block => this.isQuestion(block) && block.question.questionType === 'TEXT'),
        share()
    );
    // TODO: can we refactor type checking into one injectable object or service?
    constructor(private editorService: ActivityDefinitionEditorService) {
    }

    isQuestion(block: FormBlockDef): block is QuestionBlockDef<any> {
        return block?.blockType === 'QUESTION';
    }
    isContentBlock(block: FormBlockDef): block is ContentBlockDef {
        return isContentBlock(block);
    }

    blockChanged(block: FormBlockDef): void {
        this.editorService.updateCurrentBlock(block);
    }
}
