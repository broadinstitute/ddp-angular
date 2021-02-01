import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CookiesManagementService } from '../../../services/cookiesManagement.service';
import { ConsentStatuses } from '../../../models/cookies/consentStatuses';

@Component({
  selector: 'toolkit-cookies-preferences-modal',
  template: `
    <div class="cookiesModal cookiesModal--header">
      <img class="cookiesModal--logo" lazy-resource
           src="/assets/images/project-logo-dark.svg"
           [attr.alt]="'Toolkit.Common.LogoAlt' | translate">
      <h1 class="PageContent-title" translate>Toolkit.CookiesModal.Title</h1>
      <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
    </div>
    <div>
      <mat-tab-group>
        <mat-tab [label]="'Toolkit.CookiesModal.Privacy' | translate">
          <div class="cookiesModal--tabHeader">
            <h4 translate>Toolkit.CookiesModal.Privacy</h4>
          </div>
          <p translate>Toolkit.CookiesModal.Privacy_Text</p>
        </mat-tab>
        <!-- Create tabs for all cookie types -->
        <mat-tab *ngFor="let cookie of data.cookies.data" [label]="'Toolkit.CookiesModal.' + cookie.type | translate">
          <section>
            <div class="cookiesModal--tabHeader">
              <h4 translate>{{ 'Toolkit.CookiesModal.' + cookie.type }}</h4>
              <div  class="cookiesModal--tabActions">
                <mat-radio-group *ngIf="cookie.actions" aria-label="Select an option"
                                 (change)="this.onChange(cookie.type, $event.value)">
                  <mat-radio-button value="Accept" [checked]="this.cookies[cookie.type]">
                    <span translate>Toolkit.CookiesModal.Accept</span>
                  </mat-radio-button>
                  <mat-radio-button value="Reject" [checked]="!this.cookies[cookie.type]">
                    <span translate>Toolkit.CookiesModal.Reject</span>
                  </mat-radio-button>
                </mat-radio-group>
                <p *ngIf="!cookie.actions" translate>Toolkit.CookiesModal.AlwaysOn</p>
              </div>
            </div>
            <p translate>{{ 'Toolkit.CookiesModal.' + cookie.type + '_Text'}}</p>
          </section>
          <section *ngIf="cookie.list" class="cookiesModal--tabTable">
            <h4 class="cookiesModal--tableHeader" translate>Toolkit.CookiesModal.Details</h4>
            <mat-table [dataSource]="cookie.list" class="mat-elevation-z0">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <mat-header-cell *matHeaderCellDef translate>Toolkit.CookiesModal.Name</mat-header-cell>
                <mat-cell *matCellDef="let element" translate>
                  {{'Toolkit.CookiesModal.CookieName.' + element.name}}
                </mat-cell>
              </ng-container>
              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <mat-header-cell *matHeaderCellDef translate>Toolkit.CookiesModal.Description</mat-header-cell>
                <mat-cell *matCellDef="let element" translate>
                  {{element.description ? 'Toolkit.CookiesModal.CookieDescription.' + element.description : null}}
                </mat-cell>
              </ng-container>
              <!-- Duration Column -->
              <ng-container matColumnDef="duration">
                <mat-header-cell *matHeaderCellDef translate>Toolkit.CookiesModal.Duration </mat-header-cell>
                <mat-cell *matCellDef="let element" translate>
                  {{element.duration ? 'Toolkit.CookiesModal.CookieDuration.' + element.duration : null}}
                </mat-cell>
              </ng-container>
              <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumns; let element"
                       [ngClass]="{'cookiesModal--cookieSource' : !element.description}"></mat-row>
            </mat-table>
          </section>
        </mat-tab>
      </mat-tab-group>
    </div>
    <div mat-dialog-actions class="cookiesModal--actions">
      <toolkit-privacy-policy-button *ngIf="this.data.privacyPolicyLink" [className]="'cookiesModal--link'">
      </toolkit-privacy-policy-button>
      <button class="Button Button--primary col-lg-4 col-md-4 col-sm-8 col-xs-12"
              (click)="submit()"
              [innerText]="'Toolkit.CookiesModal.Submit' | translate">
      </button>
    </div>`,
})
export class CookiesPreferencesModalComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'description', 'duration'];
  public cookies;

  constructor(public dialogRef: MatDialogRef<CookiesPreferencesModalComponent>,
              private cookiesService: CookiesManagementService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    const initialCookiesAcceptance = this.cookiesService.getCurrentCookiesAcceptance();
    this.setDefaultAcceptance(initialCookiesAcceptance);
  }

  public onChange(cookieType, value): void {
    this.cookies[cookieType] = value === 'Accept';
  }

  public close(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    this.cookiesService.updatePreferences(ConsentStatuses.managed, this.cookies);
    this.dialogRef.close();
  }

  private setDefaultAcceptance(initialCookies): void {
    this.cookies = {...initialCookies};
    Object.keys(initialCookies).forEach(x => {
      if (initialCookies[x] === null) {
        this.cookies[x] = true;
      }
    });
  }
}
