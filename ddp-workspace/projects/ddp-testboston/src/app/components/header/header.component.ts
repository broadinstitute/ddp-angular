import { Component, HostListener, Inject, ViewChild, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SessionMementoService, WindowRef, LanguageService } from 'ddp-sdk';
import { HeaderConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { ScrollerService } from '../../services/scroller.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isPageScrolled = false;
  public isMenuOpened = false;
  public languageSelectorShown = true;
  public appRoutes = AppRoutes;
  public language: string;
  private anchor: Subscription;
  @ViewChild('overlay', { static: false }) private overlay: ElementRef;
  @ViewChild('menu', { static: false }) private menu: ElementRef;

  constructor(
    private languageService: LanguageService,
    private renderer: Renderer2,
    private session: SessionMementoService,
    private window: WindowRef,
    private scrollerService: ScrollerService,
    public headerConfig: HeaderConfigurationService,
    @Inject(DOCUMENT) private document: Document) { }

  public ngOnInit(): void {
    this.languageListener();
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe()
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public get isAdmin(): boolean {
    return this.session.isAuthenticatedAdminSession();
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

  public scrollToAnchor(anchor: string): void {
    this.scrollerService.scrollToAnchor(anchor);
  }

  public handleLanguageVisibility(visible: boolean): void {
    this.languageSelectorShown = visible;
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

  private languageListener(): void {
    this.language = this.languageService.getCurrentLanguage();
    this.anchor = this.languageService.onLanguageChange().subscribe((event) => {
      this.language = event.lang;
    });
  }
}
