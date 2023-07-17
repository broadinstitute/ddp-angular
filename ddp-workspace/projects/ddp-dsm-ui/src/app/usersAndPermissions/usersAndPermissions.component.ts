import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UsersAndPermissionsHttpServiceService} from "./services/usersAndPermissionsHttpService.service";

@Component({
  selector: 'app-users-and-permissions',
  templateUrl: 'usersAndPermissions.component.html',
  styleUrls: ['usersAndPermissions.component.scss'],
  providers: [UsersAndPermissionsHttpServiceService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersAndPermissionsComponent {}
