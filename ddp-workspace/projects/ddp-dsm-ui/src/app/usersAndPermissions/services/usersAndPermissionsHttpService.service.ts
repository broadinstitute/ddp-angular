import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AdministrationUser} from "../interfaces/administrationUser";
import {DSMService} from "../../services/dsm.service";
import {SessionService} from "../../services/session.service";

@Injectable()
export class UsersAndPermissionsHttpServiceService {

  constructor(private readonly dsmService: DSMService,
              private readonly sessionService: SessionService) {
  }

  public get usersAndPermissions(): Observable<AdministrationUser[]> {
    return this.dsmService.getUsersAndPermissions(this.realm);
  }

  private get realm(): string {
    return this.sessionService.selectedRealm;
  }
}
