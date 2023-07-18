import {ChangeDetectionStrategy, Component, Inject} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdministrationUserRole} from "../../interfaces/administrationUserRole";
import {AddAdministrationUserModal, AddAdministrationUserRequest} from "../../interfaces/addAdministrationUser";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-addAdministrationUser',
  templateUrl: 'addAdministrationUser.component.html',
  styleUrls: ['addAdministrationUser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAdministrationUserComponent {
  public selectedUserRoles: AdministrationUserRole[];
  private chosenRoles: AdministrationUserRole[] = [];

  public readonly addUserForm = this.formBuilder.group({
    email: [null, Validators.required],
    name: [null, Validators.required],
    phone: [null, Validators.required],
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddAdministrationUserModal,
    private readonly matDialogRef: MatDialogRef<AddAdministrationUserComponent>,
    private readonly formBuilder: FormBuilder
  ) {}

  public addUser(): void {
    const userToAdd: AddAdministrationUserRequest = {
      ...this.addUserForm.getRawValue(),
      roles: this.chosenRoles.map(r => r.roleGuid)
    }
    this.matDialogRef.close(userToAdd);
  }

  public get roles(): AdministrationUserRole[] {
    return this.data.availableRoles as AdministrationUserRole[];
  }

  public get onlySelectedRoles(): AdministrationUserRole[] {
    return this.chosenRoles;
  }

  public roleSelected(role: AdministrationUserRole): void {
    const foundRoleIndex = this.chosenRoles.findIndex(r => r.roleGuid === role.roleGuid);
    if(foundRoleIndex > -1 && role.isSelected) {
      this.chosenRoles[foundRoleIndex] = role;
    } else if (foundRoleIndex == -1 && role.isSelected) {
      this.chosenRoles.push(role);
    } else if (foundRoleIndex > -1 && !role.isSelected) {
      this.chosenRoles.splice(foundRoleIndex, 1);
    }
  }

  public get existingUsersEmails(): string[] {
    return this.data.existingUsers.map(user => user.email);
  }

  public userSelected({value}:MatSelectChange): void {
    this.selectedUserRoles = this.data.existingUsers.find(({email}) => email === value).roles;
  }

  public applyRoles(): void {
    this.data.availableRoles = this.roles.map((role) => ({
      ...role,
      isSelected: this.selectedUserRoles.find(r => r.roleGuid === role.roleGuid)?.isSelected || false
    })) as any

    this.chosenRoles = (this.data.availableRoles as AdministrationUserRole[]).filter(r => r.isSelected);
  }
}
