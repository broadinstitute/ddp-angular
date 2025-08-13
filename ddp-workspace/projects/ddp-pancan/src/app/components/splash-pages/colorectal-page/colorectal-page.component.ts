import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AppRoutes } from '../../app-routes';
import { ToolkitConfigurationService } from 'toolkit';
import {
    AnalyticsEventActions,
    AnalyticsEventCategories,
    AnalyticsEventsService,
    BrowserContentService,
    WindowRef
} from 'ddp-sdk';

@Component({
    selector: 'app-colorectal-page',
    templateUrl: './colorectal-page.component.html',
    styleUrls: ['./colorectal-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorectalPageComponent {
    phone: string;
    email: string;
    readonly AppRoutes = AppRoutes;
    public unsupportedBrowser: boolean;
    private readonly HEADER_HEIGHT: number = 70;

    constructor(@Inject('toolkit.toolkitConfig') config: ToolkitConfigurationService,  private windowRef: WindowRef,
        private analytics: AnalyticsEventsService,
        private browserContent: BrowserContentService) {
        this.phone = config.colorectalPagePhone;
        this.email = config.colorectalPageEmail;
    }

    public ngOnInit(): void {
        this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
    }
    public sendCountMeInAnalytics(): void {
        this.analytics.emitCustomEvent(AnalyticsEventCategories.ClickedCountMeIn, AnalyticsEventActions.FromMainPage);
    }
    public get showArrow(): boolean {
        return this.windowRef.nativeWindow.pageYOffset <= this.HEADER_HEIGHT;
    }

    public scrollTo(target: HTMLElement): void {
        if (this.isIE) {
            this.simpleScrolling(target);
        } else {
            this.smoothScrolling(target);
        }
    }

    private simpleScrolling(target: HTMLElement): void {
        this.windowRef.nativeWindow.scrollTo(0, target.offsetTop);
    }

    private smoothScrolling(target: HTMLElement): void {
        this.windowRef.nativeWindow.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
    }
     private get isIE(): boolean {
        return this.browserContent.unsupportedBrowser();
    }
}
