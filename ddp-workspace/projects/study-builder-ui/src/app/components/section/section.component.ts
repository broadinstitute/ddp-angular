import { Component, Input, OnInit } from '@angular/core';
import { FormSectionDef } from '../../model/formSectionDef';
import { FormBlockDef } from '../../model/formBlockDef';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  // @Input() section: FormSectionDef | undefined;
  section$: Observable<FormSectionDef | null>;
  public validationRequested = false;
  public readonly = true;
  public activityGuid = '';
  public studyGuid = '';
  public displayNumber = false;
  blockSubjects: Array<BehaviorSubject<FormBlockDef>> = [];
  public selectedBlock$: Observable<FormBlockDef | null>;

  constructor(private editorService: ActivityDefinitionEditorService) {
    this.selectedBlock$ = this.editorService.currentBlockDef$;
    this.section$ = this.editorService.currentSectionDef$;
  }

  ngOnInit(): void {
        this.section$.pipe(
            tap(section =>
            section && (this.blockSubjects = section.blocks.map(block => new BehaviorSubject<FormBlockDef>(block))))
        ).subscribe();
  }

    blockSelected(block: BehaviorSubject<FormBlockDef>): void {
      this.editorService.setCurrentBlock(block.value);
    }
}
