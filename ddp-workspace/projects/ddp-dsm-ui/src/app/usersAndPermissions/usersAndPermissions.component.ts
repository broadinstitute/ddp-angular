import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from "@angular/core";
import {UsersAndPermissionsHttpServiceService} from "./services/usersAndPermissionsHttpService.service";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject, mergeMap, of, Subject, takeUntil, tap} from "rxjs";
import {pluck, withLatestFrom} from "rxjs/operators";
import {AddAdministrationUserComponent} from "./components/addAdministrationUser/addAdministrationUser.component";
import {AddAdministrationUserRequest} from "./interfaces/addAdministrationUser";

@Component({
  selector: 'app-users-and-permissions',
  templateUrl: 'usersAndPermissions.component.html',
  styleUrls: ['usersAndPermissions.component.scss'],
  providers: [UsersAndPermissionsHttpServiceService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersAndPermissionsComponent implements OnDestroy, OnInit {
  public usersList$ = new BehaviorSubject([]);
  private availableRoles$ = new BehaviorSubject([]);

  private readonly subscriptionSubject = new Subject<void>();


  constructor(
    private readonly httpService: UsersAndPermissionsHttpServiceService,
    private readonly matDialog: MatDialog) {
  }

  ngOnInit() {
    this.httpService.users.pipe(
      pluck('users'),
      withLatestFrom(
        this.httpService.studyRoles
        .pipe(pluck('roles'), takeUntil(this.subscriptionSubject))
      ),
      takeUntil(this.subscriptionSubject),
      tap(([users, availableRoles]) => {
        this.usersList$.next(users);
        this.availableRoles$.next(availableRoles);

        console.log(users, availableRoles, 'USERS & AVAILABLE_ROLES')
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

  public onAddUser(): void {
    const activeUserAddDialog = this.matDialog.open(AddAdministrationUserComponent, {data:{
      availableRoles: this.availableRoles$.getValue(),
      existingUsers: this.usersList$.getValue()
      }, height: '95%'});

    let newUser: AddAdministrationUserRequest;

    activeUserAddDialog.afterClosed()
      .pipe(
        tap((user: AddAdministrationUserRequest) => newUser = user),
        mergeMap((user: AddAdministrationUserRequest) =>
          user ? this.httpService.addUser(user) : of(user)
        ),
        takeUntil(this.subscriptionSubject)
      )
      .subscribe(_ => {
        if (newUser) {
          this.usersList$.next(
            [...this.usersList$.getValue(),
              {
                ...newUser,
                roles: [
                  ...this.availableRoles$.getValue()
                    .map(role => ({
                      ...role,
                      hasRole: !!newUser.roles.find(r => r === role.name)
                    }))
                ]
              }]
          );
        }
      })
  }

}
