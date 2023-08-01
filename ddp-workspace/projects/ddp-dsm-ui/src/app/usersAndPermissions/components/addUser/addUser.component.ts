import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Role} from '../../interfaces/role';
import {AddUser, AddUserModal, AddUsersRequest} from '../../interfaces/addRemoveUsers';
import {MatSelectChange} from '@angular/material/select';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-add-administration-user',
  templateUrl: 'addUser.component.html',
  styleUrls: ['addUser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserComponent {
  public availableRoles = cloneDeep(this.data.availableRoles).map(role => ({...role, hasRole: false}));
  public selectedUserRoles: Role[];

  public readonly addUserForm = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    name: [null, Validators.required],
    phone: [null, Validators.required],
  });

  private onlySelectedRoles: Role[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddUserModal,
    private readonly matDialogRef: MatDialogRef<AddUserComponent>,
    private readonly formBuilder: FormBuilder
  ) {}

  public addUser(): void {
    if (this.allowAddingUser) {
      const userToAdd: AddUser = {
        ...this.addUserForm.getRawValue(),
        roles: this.onlySelectedRoles.map(r => r.name)
      };
      this.matDialogRef.close(userToAdd);
    }
  }


  public get allowAddingUser(): boolean {
    return this.addUserForm.valid && !!this.onlySelectedRoles?.length;
  }

  public roleSelected(role: Role): void {
    const foundRoleIndex = this.onlySelectedRoles.findIndex(r => r.name === role.name);
    if(foundRoleIndex > -1 && role.hasRole) {
      this.onlySelectedRoles[foundRoleIndex] = role;
    } else if (foundRoleIndex === -1 && role.hasRole) {
      this.onlySelectedRoles.push(role);
    } else if (foundRoleIndex > -1 && !role.hasRole) {
      this.onlySelectedRoles.splice(foundRoleIndex, 1);
    }
  }

  public get existingUsersEmails(): string[] {
    return this.data.existingUsers.map(user => user.email);
  }

  public userSelected({value}: MatSelectChange): void {
    this.selectedUserRoles = this.data.existingUsers.find(({email}) => email === value).roles;
  }

  public applyRoles(): void {
    this.availableRoles = this.availableRoles.map((role: Role) => ({
      ...role,
      hasRole: this.selectedUserRoles.find(r => r.name === role.name)?.hasRole || false
    })) as any;

    this.onlySelectedRoles = this.availableRoles.filter(r => r.hasRole);
  }
}
