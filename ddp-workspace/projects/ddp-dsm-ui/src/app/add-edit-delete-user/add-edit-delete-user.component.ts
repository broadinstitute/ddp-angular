import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {RoleService} from '../services/role.service';
import {User} from '../user/user.model';
import {Result} from '../utils/result.model';
import {Statics} from '../utils/statics';

@Component( {
  selector: 'app-add-edit-delete-user',
  templateUrl: './add-edit-delete-user.component.html',
  styleUrls: [ './add-edit-delete-user.component.scss' ]
} )
export class AddEditDeleteUserComponent implements OnInit {

  realm: string;
  loading = false;
  errorMessage: string;
  additionalMessage: string;
  allowedToSeeInformation: boolean;
  newUser: User = new User( '', '', '', '' );
  currentUsers = [];
  notUniqueError: any;
  mailFormat = /^\w+([.\-+]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;

  constructor( private dsmService: DSMService, private auth: Auth, private role: RoleService, private compService: ComponentService,
               private route: ActivatedRoute ) {
    if (!auth.authenticated()) {
      auth.logout();
    }
    this.route.queryParams.subscribe( {
      next: params => {
        this.realm = params[ DSMService.REALM ] || null;
        if (this.realm != null) {
          //        this.compService.realmMenu = this.realm;
//          this.checkRight();
        }
      }
    } );

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
          }
        } );
        if (!this.allowedToSeeInformation) {
          this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
        }
      },
      error: () => null
    } );
  }

  @Input()


  ngOnInit(): void {
    if (localStorage.getItem( ComponentService.MENU_SELECTED_REALM ) != null) {
      this.realm = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
      this.additionalMessage = '';
//      this.checkRight();
    }
    else {
      this.additionalMessage = 'Please select a study';
    }
    window.scrollTo( 0, 0 );

  }


  addNewUser(): void {
    const json = JSON.stringify( this.newUser );
    this.dsmService.addNewUser( json, this.realm ).subscribe(
      data => {
        const result = Result.parse( data );
        if (result.code === 200) {
          this.currentUsers.push( this.newUser );
          this.newUser = new User( '', '', '', '' );

        }
      },
      err => {
      }
    );
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
}
