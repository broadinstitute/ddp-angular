import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {AdministrationUser} from "../../interfaces/administrationUser";
import {MatDialog} from "@angular/material/dialog";
import {ComparePermissionsComponent} from "../comparePermissions/comparePermissions.component";
import {UsersAndPermissionsHttpServiceService} from "../../services/usersAndPermissionsHttpService.service";

@Component({
  selector: 'app-list-users',
  templateUrl: 'listAdministrationUsers.component.html',
  styleUrls: ['listAdministrationUsers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListAdministrationUsersComponent implements OnInit {
  @Input() usersList: AdministrationUser[];

  constructor(private readonly matDialog: MatDialog,
              private readonly httpService: UsersAndPermissionsHttpServiceService) {
  }

  ngOnInit() {
    // this.httpService.usersAndPermissions.subscribe(data => console.log(data, 'HTTP-RESPONSE'))
  }

  public trackBy(index: number, {name, phone, email}: AdministrationUser): any {
    return name || phone || email;
  }

  public openPermissionsComparisonModal(firstUser: AdministrationUser) {
    this.matDialog.open(ComparePermissionsComponent, {data: {
      firstUser,
      allUsers: this.usersList
      }, maxHeight: '50em', width: '70%'})
  }

}
