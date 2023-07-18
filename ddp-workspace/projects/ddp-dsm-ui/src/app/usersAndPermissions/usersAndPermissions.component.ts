import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from "@angular/core";
import {UsersAndPermissionsHttpServiceService} from "./services/usersAndPermissionsHttpService.service";
import {availableRoles, testData} from "./testData";
import {MatDialog} from "@angular/material/dialog";
import {AddAdministrationUserComponent} from "./components/addAdministrationUser/addAdministrationUser.component";
import {Subject, takeUntil} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-users-and-permissions',
  templateUrl: 'usersAndPermissions.component.html',
  styleUrls: ['usersAndPermissions.component.scss'],
  providers: [UsersAndPermissionsHttpServiceService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersAndPermissionsComponent implements OnDestroy {
  public usersList = testData;
  private readonly subscriptionSubject = new Subject<void>();

  constructor(
    private readonly httpService: UsersAndPermissionsHttpServiceService,
    private readonly matDialog: MatDialog,
    private readonly cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

  public onAddUser(): void {
    const activeUserAddDialog = this.matDialog.open(AddAdministrationUserComponent, {data:{
      availableRoles: availableRoles,
      existingUsers: testData
      }});

    activeUserAddDialog.afterClosed()
      .pipe(
        take(1),
        takeUntil(this.subscriptionSubject)
      )
      .subscribe(user => {
        if (user) {
          this.usersList = [...this.usersList,
            {...user, roles: [...availableRoles.map(r => {
                return {
                  ...r,
                  isSelected: !!user.roles.find(rr => rr === r.roleGuid)
                }
              })]}
          ]
        }
        this.cdr.markForCheck();
        console.log(this.usersList, 'UPDATED_USER_LIST')
        console.log(user, 'AFTER_CLOSE')
      })
  }

}
