import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AdministrationUser} from "../../interfaces/administrationUser";
import {MatSelectChange} from "@angular/material/select";
import {AdministrationUserRole} from "../../interfaces/AdministrationUserRole";

@Component({
  selector: 'app-compare-permissions',
  templateUrl: 'comparePermissions.component.html',
  styleUrls: ['comparePermissions.component.scss']
})
export class ComparePermissionsComponent implements OnInit {
  public displayedColumns = ['name', this.firstUser.email, 'selectUser'];
  public dataSource = []
  public secondUser: AdministrationUser;

  constructor(@Inject(MAT_DIALOG_DATA)
              private data: {firstUser: AdministrationUser, allUsers: AdministrationUser[]}) {}

  ngOnInit() {
    console.log(this.data, 'COMPARE_DATA')
    this.dataSource = [...this.firstUser.roles];

    console.log(this.dataSource, 'DATA_SOURCE')
  }

  public userSelected({value: selectedUserEmail}: MatSelectChange): void {
    const foundUser = this.data.allUsers.find(({email}) => email === selectedUserEmail);
    // this.dataSource.push(...foundUser.roles);
    this.displayedColumns = ['name', this.firstUser.email];
    this.displayedColumns.push(foundUser.email);

    for(let role of foundUser.roles) {
      if(this.dataSource.findIndex(r => r.roleGuid === role.roleGuid) === -1) {
        this.dataSource.push(role)
      }
    }
    // this.dataSource = [...this.dataSource, ...foundUser.roles];

    this.secondUser = foundUser;
    console.log(this.dataSource, 'AFTER_CHANGE')
  }

  public get firstUser(): AdministrationUser {
    return this.data.firstUser;
  }

  public get allUsers(): string[] {
    return this.data.allUsers.filter(user => user.email !== this.firstUser.email)
      .map((user) => user.email);
  }

  public findRoleForFirstUser(roleGuid: string): AdministrationUserRole {
    return this.firstUser.roles.find(role => role.roleGuid === roleGuid);
  }

  public findRoleForSecondUser(roleGuid: string): AdministrationUserRole {
    return this.secondUser.roles.find(role => role.roleGuid === roleGuid);
  }

}
