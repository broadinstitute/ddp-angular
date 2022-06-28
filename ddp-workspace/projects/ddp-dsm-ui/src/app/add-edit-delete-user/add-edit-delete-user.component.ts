import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Role} from '../access-models/role.model';
import {UserWithRole} from '../access-models/user-with-role.model';
import {User} from '../access-models/user.model';
import {ModalComponent} from '../modal/modal.component';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {RoleService} from '../services/role.service';
import {Result} from '../utils/result.model';
import {Statics} from '../utils/statics';

@Component( {
  selector: 'app-add-edit-delete-user',
  templateUrl: './add-edit-delete-user.component.html',
  styleUrls: [ './add-edit-delete-user.component.scss' ]
} )
export class AddEditDeleteUserComponent implements OnInit {

  @ViewChild( ModalComponent )
  public newUserModal: ModalComponent;

  realm: string;
  loading = false;
  errorMessage: string;
  additionalMessage: string;
  allowedToSeeInformation: boolean;
  newUser: UserWithRole = new UserWithRole( new User( '', '', '', '', -1, '' ),
    new Role( -1, '', '', -1 ) );
  currentUsers = [];
  roles = [];
  center = [];
  notUniqueError: any;
  mailFormat = /^\w+([.\-+]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
  isModify = false;

  constructor( private dsmService: DSMService, private auth: Auth, private roleService: RoleService, private compService: ComponentService,
               private route: ActivatedRoute ) {
    if (!auth.authenticated()) {
      auth.logout();
    }
    this.route.queryParams.subscribe( {
      next: params => {
        this.realm = params[ DSMService.REALM ] || null;
        if (this.realm != null) {
          this.checkRight();
        }
      }
    } );

  }

  ngOnInit(): void {
    if (localStorage.getItem( ComponentService.MENU_SELECTED_REALM ) != null) {
      this.realm = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
      this.additionalMessage = '';
      this.checkRight();
    }
    else {
      this.additionalMessage = 'Please select a study';
    }
    window.scrollTo( 0, 0 );

  }

  addNewUser( isModify: boolean ): void {
    const json = JSON.stringify( this.newUser );
    if (!isModify) {
      this.dsmService.addNewUser( json, this.realm ).subscribe(
        data => {
          const result = Result.parse( data );
          if (result.code === 200) {
            this.currentUsers.push( this.newUser );
            this.newUser = new UserWithRole( new User( '', '', '', '', -1, '' ),
              new Role( -1, '', '', -1 ) );
            this.newUserModal.hide();
          }
        },
        err => {
          this.errorMessage = 'error inserting new user';
        }
      );
    }
    this.closeAddUserModal();

  }

  validateEmail( email ): boolean {
    if (!email) {
      return false;
    }
    if (email.match( this.mailFormat )) {
      return true;
    }
    else {
      return false;
    }
  }

  openAddUserModal(): void {
    this.newUserModal.show();
  }

  closeAddUserModal(): void {
    this.isModify = false;
    this.newUserModal.hide();
  }

  openModifyUserModal( user: UserWithRole ): void {
    if (!this.roleService.hasAdminRights()) {
      return;
    }
    this.newUser = user;
    this.isModify = true;
    this.openAddUserModal();
  }

  removeThisUser( newUser: UserWithRole ): void {
    const conf = confirm( 'Are you sure you want to remove this user?' );
    if (conf) {
      const map = {};
      map[ 'userId' ] = newUser.user.userId;
      this.dsmService.removeUser( JSON.stringify( map ), this.realm ).subscribe(
        data => {
          this.closeAddUserModal();
          this.checkRight();
        },
        err => {
        }
      );
    }
  }

  modifyUser( user: UserWithRole ): void {
    this.dsmService.modifyUser( JSON.stringify( user ), this.realm ).subscribe(
      data => {
        this.newUser = new UserWithRole( new User( '', '', '', '', -1, '' ),
          new Role( -1, '', '', -1 ) );
        this.closeAddUserModal();
        this.isModify = false;
      },
      err => {
        this.errorMessage = 'Error assigning new role!';
      }
    );
  }

  private getUsers(): void {
    this.dsmService.getAllUsers( this.realm ).subscribe(
      data => {
        this.currentUsers = [];
        const jsonData = data;
        jsonData.forEach( ( val ) => {
          const user = UserWithRole.parse( val );
          this.currentUsers.push( user );
        } );
      },
      err => {
      }
    );
  }

  public getRoleService(): RoleService {
    return this.roleService;
  }

  private getRoles(): void {
    this.roles = [];
    this.dsmService.getAllRoles( this.realm ).subscribe(
      data => {
        this.roles = [];
        const jsonData = data;
        jsonData.forEach( ( val ) => {
          const role = Role.parse( val );
          this.roles.push( role );
        } );
      },
      err => {
      }
    );
  }

  private checkRight(): void {
    this.allowedToSeeInformation = false;
    this.additionalMessage = null;
    this.currentUsers = [];
    this.roles = [];
    this.isModify = false;
    this.newUser = new UserWithRole( new User( '', '', '', '', -1, '' ),
      new Role( -1, '', '', -1 ) );
    let jsonData: any[];
    this.dsmService.getRealmsAllowed( Statics.MEDICALRECORD ).subscribe( {
      next: data => {
        jsonData = data;
        jsonData.forEach( ( val ) => {
          if (this.realm === val) {
            this.allowedToSeeInformation = true;
            this.getUsers();
            this.getRoles();
          }
        } );
        if (!this.allowedToSeeInformation) {
          this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
        }
      },
      error: () => null
    } );
  }
}
