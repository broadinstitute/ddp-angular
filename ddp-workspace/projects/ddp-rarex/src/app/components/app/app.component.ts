import { Component, OnInit } from '@angular/core';

import { GovernedUserService } from '../../services/governed-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private governedUserService: GovernedUserService) {}

  public ngOnInit(): void {
    this.governedUserService.checkIfGoverned();
  }
}
