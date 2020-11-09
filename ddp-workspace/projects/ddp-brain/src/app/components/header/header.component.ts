import { Component, HostListener, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { WindowRef, SessionMementoService } from 'ddp-sdk';
import { DOCUMENT } from '@angular/common';
import { AppRoutes } from '../../app-routes';
import { HeaderConfigurationService, CommunicationService } from 'toolkit';

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
    public headerConfig: HeaderConfigurationService,
    private window: WindowRef,
    private renderer: Renderer2,
    private session: SessionMementoService,
    private communicationService: CommunicationService,
    @Inject(DOCUMENT) private document: Document) { }

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }

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
    // To prevent showing right scroll while the animation works(weird artifacts are visible in chrome), we need to add
    // 'overlay_overflow' class when the animation ends. Overflow is needed for horizontal mobile screen orientation
    setTimeout(() => {
      this.renderer.addClass(this.overlay.nativeElement, 'overlay_overflow');
    }, 500);
  }

  public closeMenu(): void {
    if (this.isMenuOpened) {
      this.isMenuOpened = false;
      this.window.nativeWindow.requestAnimationFrame(() => {
        this.renderer.removeClass(this.overlay.nativeElement, 'overlay_overflow');
      });
      this.window.nativeWindow.requestAnimationFrame(() => {
        this.renderer.removeClass(this.overlay.nativeElement, 'overlay_visible');
      });
      this.window.nativeWindow.requestAnimationFrame(() => {
        this.renderer.removeClass(this.menu.nativeElement, 'menu_visible');
      });
    }
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
