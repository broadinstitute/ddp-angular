import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from "@angular/core";
import {AdministrationUser} from "../../interfaces/administrationUser";
import {AdministrationUserRole} from "../../interfaces/AdministrationUserRole";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-administration-user',
  templateUrl: 'administrationUser.component.html',
  styleUrls: ['administrationUser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdministrationUserComponent {
  public user: AdministrationUser;
  private rolesBeforeChange: AdministrationUserRole[];

  /* Switchers */
  public areActionButtonsDisabled = true;
  public isUserEditing = false;
  public isEditUserLoading = false;
  public isEditPermissionsLoading = false;
  public isDeleteUserLoading = false;

  @Input('user') set administrationUser(user: AdministrationUser) {
    this.user = user;
    this.rolesBeforeChange = cloneDeep(user.roles);
  };

  constructor(private readonly cdr: ChangeDetectorRef) {
  }

  public compareUser(event: Event, user: AdministrationUser): void {
    event.stopPropagation();
    console.log(user, 'COMPARE_USER')
  }

  public editUser(event: Event, user: AdministrationUser): void {
    event.stopPropagation()
    console.log(user, 'EDIT_USER')
    this.isUserEditing = !this.isUserEditing;
  }

  public saveEditedUser(event: Event): void {
    event.stopPropagation();
    this.isEditUserLoading = true;

    console.log(this.user, 'SAVED_EDITED')

    // mocking
    setTimeout(() => {
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
      this.cdr.markForCheck()
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
    this.areActionButtonsDisabled = true;
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
    return this.permissionsChanged || this.isEditUserLoading ||
      this.isEditPermissionsLoading || this.isDeleteUserLoading;
  }


  /* Helper functions */

  private get permissionsChanged(): boolean {
    return !this.rolesBeforeChange.every(({isSelected}, index) =>
      isSelected === this.user.roles[index].isSelected)
  }

  private changeActionButtonsState(isDisabled: boolean): void {
    this.areActionButtonsDisabled = isDisabled;
  }

}
