import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'app-users-and-permissions',
  templateUrl: 'usersAndPermissions.component.html',
  styleUrls: ['usersAndPermissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersAndPermissionsComponent {}
