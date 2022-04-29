import {Component, OnInit} from '@angular/core';

@Component( {
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: [ './admin-tools.component.scss' ]
} )
export class AdminToolsComponent implements OnInit {

  constructor() {
  }

  names = [ 'User 1', 'User 2', 'User 3' ];
  users = [ 'user1@broadinstitue.org', 'user2@broadinstitute.org', 'user3@broadinstitute.org' ];
  roles = [ 'admin', 'CRC', 'study PM', 'Normal User' ];
  selectedRoles = [ '', '', '' ];

  ngOnInit(): void {
  }

  public onclickDropDown( e ): void {
    e.stopPropagation();
  }

  addRole( event, i ):void {
    alert( event );
    this.selectedRoles[ i ] = event.value;
  }
}
