import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Role} from '../access-models/role.model';
import {UserWithRole} from '../access-models/user-with-role.model';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {RoleService} from '../services/role.service';
import {Statics} from '../utils/statics';

@Component( {
  selector: 'app-assign-roles',
  templateUrl: './assign-roles.component.html',
  styleUrls: [ './assign-roles.component.scss' ]
} )
export class AssignRolesComponent implements OnInit {
  realm: string;

  loading = false;

  errorMessage: string;
  additionalMessage: string;
  currentUsers = [];
  roles = [];
  private allowedToSeeInformation: boolean;

  constructor( private dsmService: DSMService, private auth: Auth, private role: RoleService, private compService: ComponentService,
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

  public onclickDropDown( e ): void {
    e.stopPropagation();
  }

  assignRole( role: Role, userId: any ): void {
    let map = {};
    map[ 'userId' ] = userId;
    map[ 'roleId' ] = role.roleId;
    map[ 'umbrellaId' ] = role.umbrellaId;
    this.dsmService.assignRoleToUser( JSON.stringify( map ), this.realm ).subscribe(
      data => {
      },
      err => {
        this.errorMessage = 'Error assigning new role!';
      }
    );
  }

  private checkRight(): void {
    this.allowedToSeeInformation = false;
    this.additionalMessage = null;
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

  private getUsers() {
    this.currentUsers = [];
    this.dsmService.getAllUsers( this.realm ).subscribe(
      data => {
        let jsonData = data;
        jsonData.forEach( ( val ) => {
          const user = UserWithRole.parse( val );
          this.currentUsers.push( user );
        } );
      },
      err => {
      }
    );
  }

  private getRoles() {
    this.roles = [];
    this.dsmService.getAllRoles( this.realm ).subscribe(
      data => {
        let jsonData = data;
        jsonData.forEach( ( val ) => {
          const role = Role.parse( val );
          this.roles.push( role );
        } );
      },
      err => {
      }
    );
  }
}
