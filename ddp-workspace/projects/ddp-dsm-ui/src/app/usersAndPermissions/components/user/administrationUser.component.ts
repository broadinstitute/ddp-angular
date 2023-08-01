import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input, OnDestroy, OnInit, Output
} from '@angular/core';
import {User} from '../../interfaces/user';
import {Role} from '../../interfaces/role';
import {cloneDeep} from 'lodash';
import {RoleService} from '../../../services/role.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UsersAndPermissionsStateService} from "../../services/usersAndPermissionsState.service";
import {RemoveUsersRequest} from "../../interfaces/addRemoveUsers";
import {Subject, takeUntil} from "rxjs";
import {finalize} from "rxjs/operators";
import {EditUsers} from "../../interfaces/editUsers";

@Component({
  selector: 'app-administration-user',
  templateUrl: 'administrationUser.component.html',
  styleUrls: ['administrationUser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdministrationUserComponent implements OnInit, OnDestroy {
  public editUserForm: FormGroup;

  public user: User;
  private rolesBeforeChange: Role[];
  private subscriptionSubject$ = new Subject<void>();

  /* Switchers */
  public arePermissionActionButtonsDisabled = true;
  public isUserEditing = false;
  public isEditUserLoading = false;
  public isEditPermissionsLoading = false;
  public isDeleteUserLoading = false;

  @Input('user') set administrationUser(user: User) {
    this.user = user;
    this.rolesBeforeChange = cloneDeep(user.roles);
  }

  @Output() comparingUser = new EventEmitter<User>();

  constructor(private readonly cdr: ChangeDetectorRef,
              private readonly roleService: RoleService,
              private readonly formBuilder: FormBuilder,
              private readonly stateService: UsersAndPermissionsStateService) {
  }

  ngOnInit(): void {
    this.editUserForm = this.formBuilder.group({
      name: [this.user.name],
      phone: [this.user.phone]
    });
  }

  ngOnDestroy(): void {
    this.subscriptionSubject$.next();
    this.subscriptionSubject$.complete();
  }

  /* Event Handlers */

  public compareUser(event: Event): void {
    event.stopPropagation();
    this.comparingUser.emit(this.user);
  }

  public editUser(event: Event): void {
    event.stopPropagation();
    this.isUserEditing = !this.isUserEditing;
  }

  public saveEditedUser(event: Event): void {
    event.stopPropagation();
    this.isEditUserLoading = true;
    this.editUserForm.disable();
    const userToEdit: EditUsers = {
      users: [
        {email: this.user.email, ...this.editUserForm.getRawValue()}
      ]
    }

    this.stateService.editUsers(userToEdit)
      .pipe(
        takeUntil(this.subscriptionSubject$),
        finalize(() => {
          this.cdr.markForCheck();
          this.isEditUserLoading = false;
          this.editUserForm.enable();
        })
      )
      .subscribe();
  }

  public removeUser(event: Event): void {
    event.stopPropagation();
    this.isDeleteUserLoading = true;

    const usersToRemove: RemoveUsersRequest = {
      removeUsers: [this.user.email]
    }

    this.stateService.removeUsers(usersToRemove)
      .pipe(
        takeUntil(this.subscriptionSubject$),
        finalize(() => {
          this.cdr.markForCheck();
          this.isDeleteUserLoading = false;
        })
      )
      .subscribe();
  }

  public onCheckboxChanged(changedRole: Role): void {
    this.user.roles = this.user.roles.map((role) =>
      changedRole.name === role.name ?
        {...role, hasRole: changedRole.hasRole} :
        role
    );

    this.changeActionButtonsState(!this.hasPermissionsChanged);
  }

  public saveChanges(): void {
    this.isEditPermissionsLoading = true;

    const userRolesToEdit = {
      users: [this.user.email],
      roles: this.user.roles.filter(role => role.hasRole).map(role => role.name)
    }

    this.stateService.editUserRoles(userRolesToEdit)
      .pipe(
        takeUntil(this.subscriptionSubject$),
        finalize(() => {
          this.cdr.markForCheck();
          this.isEditPermissionsLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.rolesBeforeChange = this.user.roles;
          this.arePermissionActionButtonsDisabled = true;
        },
        error: () => {
          // @TODO handle error
        }
      })
  }

  public discardChanges(): void {
    this.user.roles = this.rolesBeforeChange;
    this.changeActionButtonsState(true);
  }

  /* Template methods */

  public get doNotAllowCollapse(): boolean {
    return this.hasPermissionsChanged || this.disableUserActionButtons;
  }

  public get disableUserActionButtons(): boolean {
    return this.isEditUserLoading || this.isDeleteUserLoading || this.isEditPermissionsLoading;
  }

  public get activeUserEmail(): string {
    return this.roleService.userMail();
  }


  /* Helper functions */

  private get hasPermissionsChanged(): boolean {
    return !this.rolesBeforeChange.every(({hasRole}, index) =>
      hasRole === this.user.roles[index].hasRole);
  }

  private changeActionButtonsState(isDisabled: boolean): void {
    this.arePermissionActionButtonsDisabled = isDisabled;
  }

}
