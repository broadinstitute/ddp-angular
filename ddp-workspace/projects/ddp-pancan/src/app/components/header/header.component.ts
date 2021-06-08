import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { WindowRef, SessionMementoService } from 'ddp-sdk';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public isPanelOpened = false;
    public isPageScrolled = false;

    constructor(
        private session: SessionMementoService,
        private window: WindowRef,
        private router: Router,
        @Inject(DOCUMENT) private document: any) { }

    public ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.isPanelOpened = false;
            }
        });
    }

    public openCloseMenu(): void {
        this.isPanelOpened = !this.isPanelOpened;
    }

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
