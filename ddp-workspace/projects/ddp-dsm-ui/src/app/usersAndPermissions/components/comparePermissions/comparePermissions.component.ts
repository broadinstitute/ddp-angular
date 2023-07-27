import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AdministrationUser} from "../../interfaces/administrationUser";
import {MatSelectChange} from "@angular/material/select";
import {AdministrationUserRole} from "../../interfaces/administrationUserRole";

@Component({
  selector: 'app-compare-permissions',
  templateUrl: 'comparePermissions.component.html',
  styleUrls: ['comparePermissions.component.scss']
})
export class ComparePermissionsComponent implements OnInit {
  public displayedColumns = ['name', this.firstUser.email, 'selectUser'];
  public roles = []
  public secondUser: AdministrationUser;

  constructor(@Inject(MAT_DIALOG_DATA)
              private data: {firstUser: AdministrationUser, allUsers: AdministrationUser[]}) {}

  ngOnInit() {
    console.log(this.data, 'COMPARE_DATA')
    this.roles = [...this.firstUser.roles];

    console.log(this.roles, 'DATA_SOURCE')
  }

  public userSelected({value: selectedUserEmail}: MatSelectChange): void {
    const foundUser = this.data.allUsers.find(({email}) => email === selectedUserEmail);
    // this.dataSource.push(...foundUser.roles);
    this.displayedColumns = ['name', this.firstUser.email];
    this.displayedColumns.push(foundUser.email);
    this.roles = this.firstUser.roles;

    for(let role of foundUser.roles) {
      if(this.roles.findIndex(role => role.name === role.name) === -1) {
        this.roles.push(role)
      }
    }

    this.secondUser = foundUser;
    console.log(this.roles, 'AFTER_CHANGE')
  }

  public get firstUser(): AdministrationUser {
    return this.data.firstUser;
  }

  public get allUsers(): string[] {
    return this.data.allUsers.filter(user => user.email !== this.firstUser.email)
      .map((user) => user.email);
  }

  public findRoleForFirstUser(roleName: string): AdministrationUserRole {
    return this.firstUser.roles.find(role => role.name === roleName);
  }

  public findRoleForSecondUser(roleName: string): AdministrationUserRole {
    return this.secondUser.roles.find(role => role.name === roleName);
  }

}
