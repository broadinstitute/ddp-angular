import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EnrollmentPausedModalComponent } from '../components/enrollment-paused-modal/enrollment-paused-modal.component';

declare const DDP_ENV: Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class EnrollmentPausedService {
  isEnrollmentPaused: boolean = !!DDP_ENV.enrollmentPaused;

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
