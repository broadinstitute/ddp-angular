import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompositeDisposable, UserProfileDecorator, UserProfileServiceAgent } from 'ddp-sdk';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: `app-console`,
  styleUrls: ['./console.scss', '../../styles/common.scss'],
  template: `
  <div class="console" *ngIf="isLoaded">
    <h1 class="title title--grey" translate> Toolkit.Dashboard.Title </h1>
    <h2 class="subtitle subtitle--light" translate> Toolkit.Dashboard.Text </h2>
    <h2 class="title title--green" translate> SDK.Dashboard.Title </h2>

    <table mat-table [dataSource]="dataSource" class="console-table">

      <!-- Participant Column -->
      <ng-container matColumnDef="participant">
        <th mat-header-cell *matHeaderCellDef class="table-header" translate> Toolkit.Dashboard.Participant </th>
        <td mat-cell *matCellDef="let participant" class="table-row">
          <span [ngClass]="{'disabled' : !participant.enrollmentStatus, '' : participant.enrollmentStatus }" translate>
            {{ participant.enrollmentStatus  ? 'Toolkit.Dashboard.Self' : 'Toolkit.Dashboard.NoParticipants' }}
          </span>
        </td>
      </ng-container>

      <!-- Enrollment Status Column -->
      <ng-container matColumnDef="enrollmentStatus">
        <th mat-header-cell *matHeaderCellDef class="table-header" translate> Toolkit.Dashboard.EnrollmentStatus </th>
        <td mat-cell *matCellDef="let participant" class="table-row">
          <span [ngClass]="{'disabled' : !participant.enrollmentStatus, '' : participant.enrollmentStatus }" translate>
            {{ participant.enrollmentStatus ? participant.enrollmentStatus : 'Toolkit.Dashboard.NoData' }}
          </span>
        </td>
      </ng-container>

      <!-- Console Actions Column -->
      <ng-container matColumnDef="consoleActions">
        <th mat-header-cell *matHeaderCellDef class="table-header" translate> Toolkit.Dashboard.Actions </th>
        <td mat-cell *matCellDef="let participant" class="table-row">
          <span *ngIf="!participant.consoleActions" class="disabled" translate>Toolkit.Dashboard.NoData</span>
          <ng-container *ngFor="let action of participant.consoleActions">
            <a class="BtnFilled BtnFilled--blue" [href]=action.href>{{ action.name }}</a>
          </ng-container>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <a *ngIf="canAddSelf" class="BtnFilled BtnFilled--blue" href="/dashboard">
      <mat-icon>add</mat-icon>
      <span translate>Toolkit.Dashboard.AddSelf</span>
    </a>
  </div>
  `
})
export class ConsoleComponent implements OnDestroy, OnInit {
  private anchor = new CompositeDisposable();
  displayedColumns: string[] = ['participant', 'enrollmentStatus', 'consoleActions'];
  dataSource: Array<any> = [];
  isLoaded = false;
  canAddSelf = false;

  constructor(private userAgent: UserProfileServiceAgent) {
  }

  public ngOnInit(): void {
    this.anchor.addNew(this.userAgent.profile
      .pipe(filter((data: UserProfileDecorator) => !!data.profile), first())
      .subscribe((data: UserProfileDecorator) => {
        this.dataSource = [{
          participant: `${data.profile.firstName} ${data.profile.lastName}`,
          enrollmentStatus: data.profile.enrollmentStatus, // 'Submitted Enrollment/Pending Information'
          consoleActions: data.profile.consoleActions
           /*
           [{name: "View/Edit Profile", href: "/dashboard"},
           {name: "Take additional tests", href: "/dashboard"}]
           */
        }];
        this.canAddSelf = !data.profile.enrollmentStatus;
        this.isLoaded = true;
      }));
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
