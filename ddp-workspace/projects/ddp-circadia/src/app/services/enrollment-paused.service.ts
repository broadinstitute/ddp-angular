import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EnrollmentPausedModalComponent } from '../components/enrollment-paused-modal/enrollment-paused-modal.component';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentPausedService {
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(EnrollmentPausedModalComponent, {
      width: '100%',
      maxWidth: '640px',
      disableClose: true,
      autoFocus: false,
    });
  }
}
