import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-loading-modal',
  template: `
    <mat-progress-bar mode="query"></mat-progress-bar>
    <mat-dialog-content>
        {{ data.message }}
    </mat-dialog-content>
  `,
  styles: [``]
})

export class LoadingModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {
  }
}
