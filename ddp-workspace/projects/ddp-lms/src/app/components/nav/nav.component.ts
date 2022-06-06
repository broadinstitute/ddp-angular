import { Component } from '@angular/core';
import { Route } from '../../constants/Route';
import { CommunicationService } from 'toolkit';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {

  constructor(private communicationService: CommunicationService,) {
  }


  readonly Route = Route;

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }
}
