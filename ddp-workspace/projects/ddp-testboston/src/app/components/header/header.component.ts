import { Component, HostListener, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
  public isMenuOpened = false;
  public appRoutes = AppRoutes;
  @ViewChild('overlay', { static: false }) private overlay: ElementRef;
  @ViewChild('menu', { static: false }) private menu: ElementRef;

  constructor(
    private renderer: Renderer2,
    private session: SessionMementoService,
    private window: WindowRef,
    @Inject(DOCUMENT) private document: Document) { }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public openMenu(): void {
    this.isMenuOpened = true;
    this.window.nativeWindow.requestAnimationFrame(() => {
      this.renderer.addClass(this.menu.nativeElement, 'menu_visible');
    });
    this.window.nativeWindow.requestAnimationFrame(() => {
      this.renderer.addClass(this.overlay.nativeElement, 'overlay_visible');
    });
  }

  public closeMenu(): void {
    this.isMenuOpened = false;
    this.window.nativeWindow.requestAnimationFrame(() => {
      this.renderer.removeClass(this.overlay.nativeElement, 'overlay_visible');
    });
    this.window.nativeWindow.requestAnimationFrame(() => {
      this.renderer.removeClass(this.menu.nativeElement, 'menu_visible');
    });
  }

  @HostListener('window: scroll') public onWindowScroll(): void {
    const scrolledPixels = this.window.nativeWindow.pageYOffset
      || this.document.documentElement.scrollTop
      || this.document.body.scrollTop || 0;
    this.isPageScrolled = !!scrolledPixels;
  }

  @HostListener('window: resize') public onWindowResize(): void {
    this.closeMenu();
  }
}
