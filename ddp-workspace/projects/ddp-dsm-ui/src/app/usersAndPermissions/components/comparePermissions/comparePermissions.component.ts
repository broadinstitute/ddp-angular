import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {User} from '../../interfaces/user';
import {MatSelectChange} from '@angular/material/select';
import {Role} from '../../interfaces/role';

@Component({
  selector: 'app-compare-permissions',
  templateUrl: 'comparePermissions.component.html',
  styleUrls: ['comparePermissions.component.scss']
})
export class ComparePermissionsComponent implements OnInit {
  public displayedColumns = ['name', this.firstUser.email, 'selectUser'];
  public roles = [];
  public secondUser: User;

  constructor(@Inject(MAT_DIALOG_DATA)
              private data: {firstUser: User; allUsers: User[]}) {}

  ngOnInit(): void {
    this.roles = [...this.firstUser.roles];
  }

  public userSelected({value: selectedUserEmail}: MatSelectChange): void {
    const foundUser = this.data.allUsers.find(({email}) => email === selectedUserEmail);
    // this.dataSource.push(...foundUser.roles);
    this.displayedColumns = ['name', this.firstUser.email];
    this.displayedColumns.push(foundUser.email);
    this.roles = this.firstUser.roles;

    for(const role of foundUser.roles) {
      if(this.roles.findIndex(r => r.name === role.name) === -1) {
        this.roles.push(role);
      }
    }

    this.secondUser = foundUser;
  }

  public get firstUser(): User {
    return this.data.firstUser;
  }

  public get allUsers(): string[] {
    return this.data.allUsers.filter(user => user.email !== this.firstUser.email)
      .map((user) => user.email);
  }

  public findRoleForFirstUser(roleName: string): Role {
    return this.firstUser.roles.find(role => role.name === roleName);
  }

  public findRoleForSecondUser(roleName: string): Role {
    return this.secondUser.roles.find(role => role.name === roleName);
  }

}
