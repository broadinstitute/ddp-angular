import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AdministrationUser} from "../interfaces/administrationUser";
import {DSMService} from "../../services/dsm.service";
import {SessionService} from "../../services/session.service";
import {AddAdministrationUserRequest} from "../interfaces/addAdministrationUser";

@Injectable()
export class UsersAndPermissionsHttpServiceService {

  constructor(private readonly dsmService: DSMService,
              private readonly sessionService: SessionService) {
  }

  public get users(): Observable<AdministrationUser[]> {
    return this.dsmService.getUsers(this.realm);
  }

  public addUser(user: AddAdministrationUserRequest): Observable<AdministrationUser[]> {
    return this.dsmService.addUser(this.realm, user);
  }

  private get realm(): string {
    return this.sessionService.selectedRealm;
  }
}
