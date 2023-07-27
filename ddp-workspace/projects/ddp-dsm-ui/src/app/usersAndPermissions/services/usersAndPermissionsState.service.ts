import {Injectable} from "@angular/core";
import {UsersAndPermissionsHttpServiceService} from "./usersAndPermissionsHttpService.service";
import {BehaviorSubject, mergeMap, Observable, of, Subject, takeUntil, tap} from "rxjs";
import {pluck} from "rxjs/operators";
import {AddAdministrationUserComponent} from "../components/addAdministrationUser/addAdministrationUser.component";
import {AddAdministrationUserRequest} from "../interfaces/addAdministrationUser";
import {MatDialog} from "@angular/material/dialog";

@Injectable()
export class UsersAndPermissionsStateService {
  private usersListSubject$ = new BehaviorSubject([]);
  private availableRolesSubject$ = new BehaviorSubject([]);
  private readonly subscriptionSubject = new Subject<void>();

  public usersList$ = this.usersListSubject$.asObservable();


  constructor(private readonly httpService: UsersAndPermissionsHttpServiceService,
              private readonly matDialog: MatDialog) {
  }

  /* Events */

  public initData(): Observable<any> {
    return this.httpService.users.pipe(
      pluck('users'),
      tap(users => this.usersListSubject$.next(users)),
      mergeMap(() => this.httpService.studyRoles
        .pipe(
          pluck('roles'),
          tap(roles => this.availableRolesSubject$.next(roles))
        ))
    )
  }

  public addUser(): Observable<any> {
    let newUser: AddAdministrationUserRequest;

    const activeUserAddDialog = this.matDialog.open(AddAdministrationUserComponent, {data:{
        availableRoles: this.availableRolesSubject$.getValue(),
        existingUsers: this.usersListSubject$.getValue()
      }, height: '95%'});

    return activeUserAddDialog.afterClosed()
      .pipe(
        tap((user: AddAdministrationUserRequest) => newUser = user),
        mergeMap((user: AddAdministrationUserRequest) =>
          user ? this.httpService.addUser(user) : of(user)
        ),
        tap(() => newUser && this.pushUser(newUser)),
        takeUntil(this.subscriptionSubject)
      )
  }

  public unsubscribe(): void {
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

  /* Helper functions */

  private pushUser(newUser: AddAdministrationUserRequest): void {
    this.usersListSubject$.next(
      [...this.usersListSubject$.getValue(),
        {
          ...newUser,
          roles: [
            ...this.availableRolesSubject$.getValue()
              .map(role => ({
                ...role,
                hasRole: !!newUser.roles.find(r => r === role.name)
              }))
          ]
        }]
    );
  }
}
