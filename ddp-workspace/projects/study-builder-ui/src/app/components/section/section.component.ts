import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBlockDef } from '../../model/core/formBlockDef';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';
import { Observable } from 'rxjs';
import { ObservableFormSectionDef } from '../../model/core-extended/observableFormSectionDef';

@Component({
    selector: 'app-section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SectionComponent implements OnInit {
    @Input()
    section$: Observable<ObservableFormSectionDef>;
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

    blockSelected(block: FormBlockDef): void {
        this.editorService.setSelectedBlock(block);
    }
}
