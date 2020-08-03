import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Cookies } from '../../../models/cookies';
import { PrivacyPolicyModalComponent } from '../privacyPolicy/privacyPolicyModal.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'ddp-cookies-preferences-modal',
  template: `
    <div class="cookiesModal cookiesModal--header">
      <img class="cookiesModal--logo" lazy-resource
           [src]="this.data.logo"
           [attr.alt]="'SDK.Common.LogoAlt' | translate">
      <h1 class="PageContent-title" translate>SDK.CookiesModal.Title</h1>
      <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
    </div>
    <div mat-dialog-content>
      <mat-tab-group>
        <mat-tab [label]="'SDK.CookiesModal.Privacy' | translate">
          <div class="cookiesModal--tabHeader">
            <h4 translate>SDK.CookiesModal.Privacy</h4>
          </div>
          <p translate>SDK.CookiesModal.Privacy_Text</p>
        </mat-tab>

        <!-- Create tabs for all cookie types -->

        <mat-tab *ngFor="let cookie of data.cookies.cookies" [label]="'SDK.CookiesModal.' + cookie.type | translate">
          <section>
            <div class="cookiesModal--tabHeader">
              <h4 translate>{{ 'SDK.CookiesModal.' + cookie.type }}</h4>
              <div  class="cookiesModal--tabActions">
                <mat-radio-group *ngIf="cookie.actions" aria-label="Select an option">
                  <mat-radio-button value="Accept"><span translate>SDK.CookiesModal.Accept</span></mat-radio-button>
                  <mat-radio-button value="Reject"><span translate>SDK.CookiesModal.Reject</span></mat-radio-button>
                </mat-radio-group>
                <p *ngIf="!cookie.actions" translate>SDK.CookiesModal.AlwaysOn</p>
              </div>
            </div>
            <p translate>{{ 'SDK.CookiesModal.' + cookie.type + '_Text'}}</p>
          </section>
          <section *ngIf="cookie.list" class="cookiesModal--tabTable">
            <h4 class="cookiesModal--tableHeader" translate>SDK.CookiesModal.Details</h4>
            <mat-table [dataSource]="cookie.list" class="mat-elevation-z0">

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <mat-header-cell *matHeaderCellDef translate>SDK.CookiesModal.Name</mat-header-cell>
                <mat-cell *matCellDef="let element" translate> {{'SDK.CookiesModal.CookieName.' + element.name}} </mat-cell>
              </ng-container>

              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <mat-header-cell *matHeaderCellDef translate>SDK.CookiesModal.Description</mat-header-cell>
                <mat-cell *matCellDef="let element" translate> {{'SDK.CookiesModal.CookieDescription.' + element.description}} </mat-cell>
              </ng-container>

              <!-- Expiration Column -->
              <ng-container matColumnDef="expiration">
                <mat-header-cell *matHeaderCellDef translate>SDK.CookiesModal.Expiration </mat-header-cell>
                <mat-cell *matCellDef="let element" translate> {{'SDK.CookiesModal.CookieExpiration.' + element.expiration}} </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
            </mat-table>
          </section>
        </mat-tab>

      </mat-tab-group>
    </div>
    <div mat-dialog-actions class="cookiesModal--actions">
      <button class="cookiesModal--link"
              (click)="openPolicy()"
              [innerText]="'SDK.CookiesBanner.Policy' | translate"></button>
      <button class="Button Button--primary col-lg-4 col-md-4 col-sm-8 col-xs-8"
              (click)="submit()"
              [innerText]="'SDK.CookiesModal.Submit' | translate">
      </button>
    </div>`,
})
export class CookiesPreferencesModalComponent {
  public displayedColumns: string[] = ['name', 'description', 'expiration'];

  constructor(public dialogRef: MatDialogRef<CookiesPreferencesModalComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.dialogRef.close();
  }

  openPolicy(): void {
    this.dialog.open(PrivacyPolicyModalComponent, {
      width: '740px',
      data: this.data.logo,
      autoFocus: false,
      disableClose: false,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
