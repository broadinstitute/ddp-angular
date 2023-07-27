import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AdministrationUserRole} from '../../interfaces/administrationUserRole';
import {AddAdministrationUserModal, AddAdministrationUserRequest} from '../../interfaces/addAdministrationUser';
import {MatSelectChange} from '@angular/material/select';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-add-administration-user',
  templateUrl: 'addAdministrationUser.component.html',
  styleUrls: ['addAdministrationUser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAdministrationUserComponent {
  public availableRoles = cloneDeep(this.data.availableRoles).map(role => ({...role, hasRole: false}));
  public selectedUserRoles: AdministrationUserRole[];

  public readonly addUserForm = this.formBuilder.group({
    email: [null, Validators.required],
    name: [null, Validators.required],
    phone: [null, Validators.required],
  });

  private onlySelectedRoles: AdministrationUserRole[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddAdministrationUserModal,
    private readonly matDialogRef: MatDialogRef<AddAdministrationUserComponent>,
    private readonly formBuilder: FormBuilder
  ) {}

  public addUser(): void {
    if (this.allowAddingUser) {
      const userToAdd: AddAdministrationUserRequest = {
        ...this.addUserForm.getRawValue(),
        roles: this.onlySelectedRoles.map(r => r.name)
      };
      this.matDialogRef.close(userToAdd);
    }
  }


  public get allowAddingUser(): boolean {
    return this.addUserForm.valid && !!this.onlySelectedRoles?.length;
  }

  public roleSelected(role: AdministrationUserRole): void {
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
    this.availableRoles = this.availableRoles.map((role: AdministrationUserRole) => ({
      ...role,
      hasRole: this.selectedUserRoles.find(r => r.name === role.name)?.hasRole || false
    })) as any;

    this.onlySelectedRoles = this.availableRoles.filter(r => r.hasRole);
  }
}
