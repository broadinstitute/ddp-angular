import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-cohort-tag-modal',
  templateUrl: './bulk-cohort-tag-modal.component.html',
  styleUrls: ['./bulk-cohort-tag-modal.component.scss']
})
export class BulkCohortTagModalComponent {

  constructor(private matDialog: MatDialog) { }

}
