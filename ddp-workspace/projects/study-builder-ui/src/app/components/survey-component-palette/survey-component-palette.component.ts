import { Component } from '@angular/core';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';

@Component({
    selector: 'app-survey-component-palette',
    templateUrl: './survey-component-palette.component.html',
    styleUrls: ['./survey-component-palette.component.scss']
})
export class SurveyComponentPaletteComponent {

    constructor(private editorService: ActivityDefinitionEditorService) {
    }

    addContentBlock(): void {
        this.editorService.addBlankContentBlockToActivity();
    }

    addTextQuestionBlock(): void {
        this.editorService.addBlankTextQuestionBlockToActivity();
    }

    addPicklistQuestionBlock(): void {
        this.editorService.addBlankPicklistQuestionBlockToActivity();
    }
}
