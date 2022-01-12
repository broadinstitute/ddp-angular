import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBlockDef } from '../../model/core/formBlockDef';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ObservableFormSectionDef } from '../../model/core-extended/observableFormSectionDef';
import { IdentifiableFormBlockDef } from '../../model/core-extended/identifiableFormBlockDef';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SectionComponent {
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

    blockSelected(block: FormBlockDef): void {
        this.editorService.setSelectedBlock(block);
    }

    blockDrop(
        event: CdkDragDrop<BehaviorSubject<IdentifiableFormBlockDef>[]>,
        blocksSubjects: BehaviorSubject<IdentifiableFormBlockDef>[]): void {
        moveItemInArray(blocksSubjects, event.previousIndex, event.currentIndex);
    }
}
