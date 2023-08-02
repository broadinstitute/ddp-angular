import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {UsersAndPermissionsStateService} from './services/usersAndPermissionsState.service';
import {HttpErrorResponse} from "@angular/common/http";
import {AddUserComponent} from "./components/addUser/addUser.component";
import {MatDialog} from "@angular/material/dialog";
import {User} from "./interfaces/user";
import {Role} from "./interfaces/role";

@Component({
  selector: 'app-users-and-permissions',
  templateUrl: 'usersAndPermissions.component.html',
  styleUrls: ['usersAndPermissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersAndPermissionsComponent implements OnDestroy, OnInit {
  public usersList$ = this.stateService.usersList$;
  public availableRoles$ = this.stateService.availableRoles$;

  public isLoading = false;
  public errorMessage: string | null = null;

  private readonly subscriptionSubject$ = new Subject<void>();

  constructor(
    private readonly stateService: UsersAndPermissionsStateService,
    private readonly cdr: ChangeDetectorRef,
    private readonly matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initData()
      .pipe(takeUntil(this.subscriptionSubject$))
      .subscribe({
        error: (error) => this.handleError(error)
      })
  }

  ngOnDestroy(): void {
    this.subscriptionSubject$.next();
    this.subscriptionSubject$.complete();
  }

  public onAddUser(usersList: User[], availableRoles: Role[]): void {
    this.matDialog.open(AddUserComponent, {data:{
        existingUsers: usersList,
        availableRoles: availableRoles,
      }, height: '95%'});
  }

  private initData(): Observable<any> {
    this.isLoading = true;
    this.errorMessage = null;
    return this.stateService.initData()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
  }

  private handleError(error: any): void {
    if(error instanceof HttpErrorResponse) {
      this.errorMessage = error.error;
    }
  }


}
