import {Injectable} from '@angular/core';
import {UsersAndPermissionsHttpServiceService} from './usersAndPermissionsHttpService.service';
import {BehaviorSubject, mergeMap, Observable, of, Subject, takeUntil, tap} from 'rxjs';
import {pluck} from 'rxjs/operators';
import {AddUserComponent} from '../components/addUser/addUser.component';
import {AddUser, AddUsersRequest, RemoveUsersRequest} from '../interfaces/addRemoveUsers';
import {MatDialog} from '@angular/material/dialog';
import {User} from "../interfaces/user";
import {AvailableRole, EditUserRoles} from "../interfaces/role";
import {EditUsers} from "../interfaces/editUsers";

@Injectable()
export class UsersAndPermissionsStateService {
  private usersListSubject$ = new BehaviorSubject<User[]>([]);
  private availableRolesSubject$ = new BehaviorSubject<AvailableRole[]>([]);
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
    );
  }

  public addUser(): Observable<any> {
    let newUser: AddUser;

    const activeUserAddDialog = this.matDialog.open(AddUserComponent, {data:{
        availableRoles: this.availableRolesSubject$.getValue(),
        existingUsers: this.usersListSubject$.getValue()
      }, height: '95%'});

    return activeUserAddDialog.afterClosed()
      .pipe(
        tap((user: AddUser) => newUser = user),
        mergeMap((addUser: AddUser) =>
          addUser ? this.httpService.addUsers({addUsers: [addUser]}) : of(addUser)
        ),
        tap(() => newUser && this.pushUser(newUser)),
        takeUntil(this.subscriptionSubject)
      );
  }

  public editUserRoles(userRoles: EditUserRoles): Observable<User[]> {
    return this.httpService.editUserRoles(userRoles);
  }

  public removeUsers(removeUsers: RemoveUsersRequest): Observable<any> {
    return this.httpService.removeUsers(removeUsers)
      .pipe(
        tap(() => this.removeUser(removeUsers.removeUsers))
      );
  }

  public editUsers(editUsers: EditUsers): Observable<any> {
    return this.httpService.editUsers(editUsers)
      .pipe(
        tap(() => this.editUser(editUsers))
      );
  }

  public unsubscribe(): void {
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

  /* Helper functions */

  private pushUser(newUser: AddUser): void {
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

  private editUser({users: [userToEdit]}: EditUsers): void {
    this.usersListSubject$.next([...this.usersListSubject$.getValue(), {...userToEdit} as User])
  }

  private removeUser(removedUsersEmails: string[]): void {
    this.usersListSubject$
      .next(this.usersListSubject$.getValue().filter(user => !removedUsersEmails.includes(user.email)))
  }
}
