import {Injectable} from '@angular/core';
import {UsersAndPermissionsHttpService} from './usersAndPermissionsHttp.service';
import {BehaviorSubject, mergeMap, Observable, tap} from 'rxjs';
import {map, pluck} from 'rxjs/operators';
import {AddUser, RemoveUsersRequest} from '../interfaces/addRemoveUsers';
import {User} from "../interfaces/user";
import {AvailableRole, EditUserRoles, Role} from "../interfaces/role";
import {EditUsers} from "../interfaces/editUsers";

@Injectable()
export class UsersAndPermissionsStateService {
  private readonly usersListSubject$ = new BehaviorSubject<User[]>([]);
  private readonly availableRolesSubject$ = new BehaviorSubject<AvailableRole[]>([]);

  public readonly usersList$ = this.usersListSubject$.asObservable()
    .pipe(
      map((users: User[]) =>
        users.map((user: User) =>
          ({
            ...user,
            roles: this.sortRoles(user.roles.slice())
          })
        )
      )
    );

  public readonly availableRoles$ = this.availableRolesSubject$.asObservable()
    .pipe(
      map((roles: Role[]) => this.sortRoles(roles))
    );


  constructor(private readonly httpService: UsersAndPermissionsHttpService) {
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

  public addUser(user: AddUser): Observable<any> {
    return this.httpService.addUsers({addUsers: [user]})
      .pipe(tap(() => this.pushUser(user)));
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
      .pipe(tap(() => this.editUser(editUsers.users[0])));
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

  private editUser(editedUser: Partial<User>): void {
    this.usersListSubject$.next(this.usersListSubject$.getValue().map((user) => {
      if (editedUser.email === user.email) {
        user.name = editedUser.name;
        user.phone = editedUser.phone;
      }
      return user
    }))
  }


  private removeUser(removedUsersEmails: string[]): void {
    this.usersListSubject$
      .next(this.usersListSubject$.getValue().filter(user => !removedUsersEmails.includes(user.email)))
  }

  private sortRoles(roles: Role[] | AvailableRole[]): Role[] | AvailableRole[] {
    return roles.sort(({displayText: role1}, {displayText: role2}) =>
      role1.localeCompare(role2));
  }
}
