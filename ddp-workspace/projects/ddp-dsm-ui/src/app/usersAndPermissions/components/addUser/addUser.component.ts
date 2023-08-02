import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Role} from '../../interfaces/role';
import {AddUser, AddUserModal} from '../../interfaces/addRemoveUsers';
import {MatSelectChange} from '@angular/material/select';
import {cloneDeep} from 'lodash';
import {UsersAndPermissionsStateService} from "../../services/usersAndPermissionsState.service";
import {Subject, takeUntil} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-add-administration-user',
  templateUrl: 'addUser.component.html',
  styleUrls: ['addUser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserComponent {
  public availableRoles = cloneDeep(this.data.availableRoles).map(role => ({...role, hasRole: false}));
  public selectedUserRoles: Role[];
  public errorMessage: string | null = null;
  public isLoading: boolean = false;

  public readonly addUserForm = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    name: [null, Validators.required],
    phone: [null, Validators.required],
  });

  private onlySelectedRoles: Role[] = [];
  private subscriptionSubject$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddUserModal,
    private readonly matDialogRef: MatDialogRef<AddUserComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly stateService: UsersAndPermissionsStateService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public addUser(): void {
    if (this.allowAddingUser) {
      this.isLoading = true;
      this.errorMessage = null;
      const userToAdd: AddUser = {
        ...this.addUserForm.getRawValue(),
        roles: this.onlySelectedRoles.map(r => r.name)
      };
      this.stateService.addUser(userToAdd)
        .pipe(
          takeUntil(this.subscriptionSubject$),
          finalize(() => {
            this.cdr.markForCheck();
            this.isLoading = false
          })
          )
        .subscribe({
          next: () => this.matDialogRef.close(userToAdd),
          error: (error) => this.handleError(error)
        })
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

  private handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.errorMessage = error.error;
    }
  }
}
