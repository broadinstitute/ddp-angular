import { Component, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SessionMementoService, WindowRef } from 'ddp-sdk';
import { AppRoutes } from './../../app-routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public isPageScrolled = false;
  public appRoutes = AppRoutes;

  constructor(
    private session: SessionMementoService,
    private window: WindowRef,
    @Inject(DOCUMENT) private document: Document) { }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  @HostListener('window: scroll') public onWindowScroll(): void {
    const scrolledPixels = this.window.nativeWindow.pageYOffset
      || this.document.documentElement.scrollTop
      || this.document.body.scrollTop || 0;
    this.isPageScrolled = !!scrolledPixels;
  }
}
