import { Component, HostListener } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

import { Route } from '../../constants/route';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  Route = Route;
  isSticky = false;

  constructor(private sessionService: SessionMementoService) {}

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }

  @HostListener('document:scroll')
  private onScroll(): void {
    this.isSticky = window.pageYOffset > 0;
  }
}
