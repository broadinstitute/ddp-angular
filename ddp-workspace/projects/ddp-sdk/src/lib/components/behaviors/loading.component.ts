import { Component, Input } from '@angular/core';

@Component({
  selector: 'ddp-loading',
  template: `
  <mat-progress-bar data-ddp-test="loadingProgress" mode="indeterminate" *ngIf="!loaded">
  </mat-progress-bar>`
})
export class LoadingComponent {
    @Input() loaded: boolean;
}
