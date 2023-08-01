import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {User} from '../../interfaces/user';
import {MatDialog} from '@angular/material/dialog';
import {ComparePermissionsComponent} from '../comparePermissions/comparePermissions.component';

@Component({
  selector: 'app-list-users',
  templateUrl: 'listUsers.component.html',
  styleUrls: ['listUsers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListUsersComponent {
  @Input() usersList: User[];

  constructor(private readonly matDialog: MatDialog) {
  }

  public trackBy(index: number, {name, phone, email}: User): any {
    return name || phone || email;
  }

  public openPermissionsComparisonModal(firstUser: User): void {
    this.matDialog.open(ComparePermissionsComponent, {data: {
      firstUser,
      allUsers: this.usersList
      }, maxHeight: '50em', width: '70%'});
  }

}
