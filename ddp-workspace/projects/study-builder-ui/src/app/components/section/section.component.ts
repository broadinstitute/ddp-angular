import { Component, Input, OnInit } from '@angular/core';
import { FormSectionDef } from '../../model/formSectionDef';
import { FormBlockDef } from '../../model/formBlockDef';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObservableFormSectionDef } from '../../model/observableFormSectionDef';

@Component({
    selector: 'app-section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
    section1: BehaviorSubject<ObservableFormSectionDef> | undefined;
    @Input()
    set section(section: BehaviorSubject<ObservableFormSectionDef>) {
      console.log("section: %o", section);
      this.section1 = section;
    }
    public validationRequested = false;
    public readonly = true;
    public activityGuid = '';
    public studyGuid = '';
    public displayNumber = false;
    public selectedBlock$: Observable<FormBlockDef | null>;

    constructor(private editorService: ActivityDefinitionEditorService) {
        this.selectedBlock$ = this.editorService.currentBlockDef$;
    }

    ngOnInit(): void {
    }

    blockSubjectSelected(blockSubject: BehaviorSubject<FormBlockDef>): void {
        this.editorService.setCurrentBlockSubject(blockSubject);
    }
}
