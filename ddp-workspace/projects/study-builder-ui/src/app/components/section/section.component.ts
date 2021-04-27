import { Component, Input, OnInit } from '@angular/core';
import { FormSectionDef } from '../../model/formSectionDef';
import { FormBlockDef } from '../../model/formBlockDef';
import { ActivityDefinitionEditorService } from '../../services/activity-definition-editor.service';
import { Observable } from 'rxjs';

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
  public selectedBlock$: Observable<FormBlockDef | null>;

  constructor(private editorService: ActivityDefinitionEditorService) {
    this.selectedBlock$ = this.editorService.currentBlockDef$;
    this.section$ = this.editorService.currentSectionDef$;
  }

  ngOnInit(): void {
    this.selectedBlock$.subscribe(selected => console.log('the block selected is: %o', selected));
  }

    blockSelected(block: FormBlockDef): FormBlockDef {
      this.editorService.setCurrentBlock(block);
      return block;
    }
}
