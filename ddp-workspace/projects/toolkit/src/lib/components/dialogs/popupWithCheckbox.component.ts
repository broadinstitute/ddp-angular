import { Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { SessionMementoService } from 'ddp-sdk';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

@Component({
  selector: 'toolkit-popup-with-checkbox',
  template: `
    <button (click)="openModal()"
            class="SimpleButton"
            [disabled]="!isAuthenticated">
      Pref
    </button>
    <ng-template #modal>
      <div mat-dialog-content class="popup">
        <p class="popup--text" [innerHTML]="text | translate"></p>
      </div>
      <div mat-dialog-actions class="popup--actions">
        <mat-checkbox #checkbox autofocus>
          <p class="popup--checkboxText"
             [innerHTML]="checkboxText | translate"></p>
        </mat-checkbox>
        <button class="Button Button--primaryNeutralWithFocus"
                (click)="close(checkbox.checked)"
                [innerHTML]="buttonText | translate"></button>
      </div>
    </ng-template>
  `
})
export class PopupWithCheckboxComponent {
  @Input() text: string;
  @Input() checkboxText: string;
  @Input() buttonText: string;

  public isAuthenticated: boolean;
  @ViewChild('modal', {static: true}) private modalRef: TemplateRef<any>;

  constructor(public dialog: MatDialog,
              private session: SessionMementoService,
              @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) {
    this.isAuthenticated = this.session.isAuthenticatedSession();
  }

  openModal(): void {
    this.dialog.open(this.modalRef, {
      maxWidth: '400px',
      autoFocus: false,
      disableClose: true,
      panelClass: 'toolkit-popup-with-checkbox',
      backdropClass: 'toolkit-popup-with-checkbox',
      position: {top: '100px', left: 'calc(50% - 150px)'},
      scrollStrategy: new NoopScrollStrategy()
    });
  }

  public close(languageConfirmed: boolean): void  {
    console.log(languageConfirmed);
    this.dialog.closeAll();
  }
}
