import { Component, OnInit } from '@angular/core';
import { Route } from '../../../constants/Route';
import { CommunicationService } from 'toolkit';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['footer-nav.component.scss'],
})
export class FooterNavComponent implements OnInit {
  readonly Route = Route;

  constructor(private communicationService: CommunicationService) {}

  ngOnInit(): void {}

  public scrollTop(): void {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }
}
