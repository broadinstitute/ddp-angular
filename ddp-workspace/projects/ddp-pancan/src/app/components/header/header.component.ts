import { Component, Inject, HostListener, OnInit, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { WindowRef } from 'ddp-sdk';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input() isColorectalTheme: boolean;
    @Input() isPediHCCTheme: boolean;

    public isPanelOpened = false;
    public isPageScrolled = false;

    constructor(
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

    @HostListener('window: scroll') public onWindowScroll(): void {
        const scrolledPixels = this.window.nativeWindow.pageYOffset
            || this.document.documentElement.scrollTop
            || this.document.body.scrollTop || 0;
        this.isPageScrolled = !!scrolledPixels;
    }

    @HostListener('window: resize') public onWindowResize(): void {
        this.isPanelOpened = false;
    }
}
