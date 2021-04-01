import { Component, HostListener, OnInit } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

import { GovernedUserService } from '../../services/governed-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private sessionService: SessionMementoService,
    private governedUserService: GovernedUserService,
  ) {}

  public ngOnInit(): void {
    this.governedUserService.checkIfGoverned();
  }

  @HostListener('window:beforeunload')
  private beforeUnload(): void {
    this.sessionService.setParticipant(null);
  }
}
