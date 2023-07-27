import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AdministrationUser} from '../../interfaces/administrationUser';
import {MatDialog} from '@angular/material/dialog';
import {ComparePermissionsComponent} from '../comparePermissions/comparePermissions.component';

@Component({
  selector: 'app-list-users',
  templateUrl: 'listAdministrationUsers.component.html',
  styleUrls: ['listAdministrationUsers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListAdministrationUsersComponent {
  @Input() usersList: AdministrationUser[];

  constructor(private readonly matDialog: MatDialog) {
  }

  public trackBy(index: number, {name, phone, email}: AdministrationUser): any {
    return name || phone || email;
  }

  public openPermissionsComparisonModal(firstUser: AdministrationUser): void {
    this.matDialog.open(ComparePermissionsComponent, {data: {
      firstUser,
      allUsers: this.usersList
      }, maxHeight: '50em', width: '70%'});
  }

}
