import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User, AdministrationUsersResponse} from '../interfaces/user';
import {DSMService} from '../../services/dsm.service';
import {SessionService} from '../../services/session.service';
import {AddUsersRequest, RemoveUsersRequest} from '../interfaces/addRemoveUsers';
import {AvailableStudyRolesResponse, EditUserRoles} from '../interfaces/role';
import {EditUsers} from "../interfaces/editUsers";

@Injectable()
export class UsersAndPermissionsHttpServiceService {

  constructor(private readonly dsmService: DSMService,
              private readonly sessionService: SessionService) {
  }

  public get users(): Observable<AdministrationUsersResponse> {
    return this.dsmService.getUsers(this.realm);
  }

  public get studyRoles(): Observable<AvailableStudyRolesResponse> {
    return this.dsmService.availableRoles(this.realm);
  }

  public addUsers(addUsers: AddUsersRequest): Observable<User[]> {
    return this.dsmService.addUser(this.realm, addUsers);
  }

  public editUserRoles(userRoles: EditUserRoles): Observable<User[]> {
    return this.dsmService.editUsersRoles(this.realm, userRoles);
  }

  public editUsers(editUsers: EditUsers): Observable<User[]> {
    return this.dsmService.editUsers(this.realm, editUsers);
  }

  public removeUsers(removeUsers: RemoveUsersRequest): Observable<User[]> {
    return this.dsmService.removeUser(this.realm, removeUsers);
  }

  private get realm(): string {
    return this.sessionService.selectedRealm;
  }
}
