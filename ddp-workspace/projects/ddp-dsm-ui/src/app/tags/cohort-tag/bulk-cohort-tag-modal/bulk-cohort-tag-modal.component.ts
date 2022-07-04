import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { BulkCohortTag } from './bulk-cohort-tag-model';
import { DSMService } from '../../../services/dsm.service';
import { ComponentService } from '../../../services/component.service';
import { ParticipantUpdateResultDialogComponent } from '../../../dialogs/participant-update-result-dialog.component';
import { ViewFilter } from '../../../filter-column/models/view-filter.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bulk-cohort-tag-modal',
  templateUrl: './bulk-cohort-tag-modal.component.html',
  styleUrls: ['./bulk-cohort-tag-modal.component.scss']
})
export class BulkCohortTagModalComponent implements OnInit  {

  readonly OPTIONS = OPTIONS;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { manualFilter: string; savedFilter: ViewFilter; selectedPatients: [] },
    private matDialog: MatDialog, private dsmService: DSMService, private compService: ComponentService,
    public dialogRef: MatDialogRef<BulkCohortTagModalComponent>
  )
  { }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public tags: string[] = [];

  selectedOption: string;
  loadingDialogState: Subject<any> = new Subject();

  ngOnInit(): void {
    this.selectedOption = OPTIONS.selectedPatients;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  bulkCreateCohorts(): void {
    const bulkCohortTag =
        new BulkCohortTag(this.tags, this.data.manualFilter, this.data.savedFilter, this.data.selectedPatients, this.selectedOption);
    const dialogRef = this.matDialog;
    this.dsmService.bulkCreateCohortTags(bulkCohortTag, this.compService.getRealm()).subscribe({
      next: data => {
        this.dialogRef.close(data);
        this.loadingDialogState.next(true);
        this.matDialog.open(ParticipantUpdateResultDialogComponent, {data: {message: 'Cohort tags successfully created'}});
      }, error: () => {
        this.dialogRef.close();
        this.loadingDialogState.next(true);
        this.matDialog.open(ParticipantUpdateResultDialogComponent, {data: {message: 'Bulk creation of cohort tags was unsuccessful'}});
      }
    });
  }

  isTagsEmpty(): boolean {
    return this.tags.length === 0;
  }


}

export const OPTIONS = {
  selectedPatients: 'SELECTED_PATIENTS',
  allPatients: 'ALL_PATIENTS'
};