import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input, OnInit, Output
} from "@angular/core";
import {AdministrationUser} from "../../interfaces/administrationUser";
import {AdministrationUserRole} from "../../interfaces/administrationUserRole";
import {cloneDeep} from 'lodash';
import {RoleService} from "../../../services/role.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-administration-user',
  templateUrl: 'administrationUser.component.html',
  styleUrls: ['administrationUser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdministrationUserComponent implements OnInit {
  public editUserForm: FormGroup;

  public user: AdministrationUser;
  private rolesBeforeChange: AdministrationUserRole[];

  /* Switchers */
  public arePermissionActionButtonsDisabled = true;
  public isUserEditing = false;
  public isEditUserLoading = false;
  public isEditPermissionsLoading = false;
  public isDeleteUserLoading = false;

  @Input('user') set administrationUser(user: AdministrationUser) {
    this.user = user;
    this.rolesBeforeChange = cloneDeep(user.roles);
  };

  @Output() comparingUser = new EventEmitter<AdministrationUser>();
  @Output() editingUser = new EventEmitter<AdministrationUser>();
  @Output() deletingUser = new EventEmitter<AdministrationUser>();

  constructor(private readonly cdr: ChangeDetectorRef,
              private readonly roleService: RoleService,
              private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.editUserForm = this.formBuilder.group({
      name: [this.user.name],
      phone: [this.user.phone]
    })
  }

  /* Event Handlers */

  public compareUser(event: Event, user: AdministrationUser): void {
    event.stopPropagation();
    console.log(user, 'COMPARE_USER')
    this.comparingUser.emit(user);
  }

  public editUser(event: Event, user: AdministrationUser): void {
    event.stopPropagation()
    console.log(user, 'EDIT_USER')
    this.isUserEditing = !this.isUserEditing;
  }

  public saveEditedUser(event: Event): void {
    event.stopPropagation();
    this.isEditUserLoading = true;
    this.editUserForm.disable();


    console.log(this.user, 'SAVED_EDITED')

    // mocking
    setTimeout(() => {
      this.editUserForm.enable();
      this.user.name = this.editUserForm.get('name').value;
      this.user.phone = this.editUserForm.get('phone').value;
      this.cdr.markForCheck()
      this.isEditUserLoading = false
    }, 3000)
  }

  public deleteUser(event: Event, user: AdministrationUser): void {
    event.stopPropagation();
    this.isDeleteUserLoading = true;

    console.log(user, 'SAVED_EDITED')

    // mocking
    setTimeout(() => {
      this.cdr.markForCheck();
      this.isDeleteUserLoading = false
    }, 3000)
  }

  public onCheckboxChanged(changedRole: AdministrationUserRole): void {
    this.user.roles = this.user.roles.map((role) =>
      changedRole.roleGuid === role.roleGuid ?
        {...role, isSelected: changedRole.isSelected} :
        role
    )

    this.changeActionButtonsState(!this.permissionsChanged);
  }

  public saveChanges(): void {
    this.rolesBeforeChange = this.user.roles;
    this.arePermissionActionButtonsDisabled = true;
    this.isEditPermissionsLoading = true;

    // mocking
    setTimeout(() => {
      this.cdr.markForCheck()
      this.isEditPermissionsLoading = false
    }, 3000)
  }

  public discardChanges(): void {
    this.user.roles = this.rolesBeforeChange;
    this.changeActionButtonsState(true);
  }

  /* Template methods */

  public get doNotAllowCollapse(): boolean {
    return this.permissionsChanged || this.disableUserActionButtons;
  }

  public get disableUserActionButtons(): boolean {
    return this.isEditUserLoading || this.isDeleteUserLoading || this.isEditPermissionsLoading;
  }

  public get activeUserEmail(): string {
    return this.roleService.userMail();
  }


  /* Helper functions */

  private get permissionsChanged(): boolean {
    return !this.rolesBeforeChange.every(({isSelected}, index) =>
      isSelected === this.user.roles[index].isSelected)
  }

  private changeActionButtonsState(isDisabled: boolean): void {
    this.arePermissionActionButtonsDisabled = isDisabled;
  }

}
