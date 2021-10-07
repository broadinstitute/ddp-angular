import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '../app-routes';
import { AnalyticsEventActions, AnalyticsEventCategories, AnalyticsEventsService } from 'ddp-sdk';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {
    readonly AppRoutes = AppRoutes;

    constructor(private analytics: AnalyticsEventsService) { }

    public sendCountMeInAnalytics(): void {
        this.analytics.emitCustomEvent(AnalyticsEventCategories.ClickedCountMeIn, AnalyticsEventActions.FromMainPage);
    }
}
