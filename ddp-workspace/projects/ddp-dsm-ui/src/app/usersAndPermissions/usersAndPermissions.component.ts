import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UsersAndPermissionsHttpServiceService} from './services/usersAndPermissionsHttpService.service';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, mergeMap, Observable, of, Subject, takeUntil, tap} from 'rxjs';
import {finalize, pluck, withLatestFrom} from 'rxjs/operators';
import {AddAdministrationUserComponent} from './components/addAdministrationUser/addAdministrationUser.component';
import {AddAdministrationUserRequest} from './interfaces/addAdministrationUser';
import {UsersAndPermissionsStateService} from './services/usersAndPermissionsState.service';

@Component({
  selector: 'app-users-and-permissions',
  templateUrl: 'usersAndPermissions.component.html',
  styleUrls: ['usersAndPermissions.component.scss'],
  providers: [UsersAndPermissionsHttpServiceService, UsersAndPermissionsStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersAndPermissionsComponent implements OnDestroy, OnInit {
  public usersList$ = this.stateService.usersList$;
  public isLoading = false;

  private readonly subscriptionSubject = new Subject<void>();


  constructor(
    private readonly stateService: UsersAndPermissionsStateService,
    private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.stateService.initData()
      .pipe(
        takeUntil(this.subscriptionSubject),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.stateService.unsubscribe();
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

  public onAddUser(): void {
    this.stateService.addUser()
      .pipe(takeUntil(this.subscriptionSubject))
      .subscribe();
  }


}
