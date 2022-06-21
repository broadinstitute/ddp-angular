import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    OnDestroy,
    OnInit,
    Renderer2,
    Input,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { ActivityComponent } from './activity.component';
import { WindowRef } from '../../services/windowRef';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { AnalyticsEventsService } from '../../services/analyticsEvents.service';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { LoggingService } from '../../services/logging.service';
import { ParticipantsSearchServiceAgent } from '../../services/serviceAgents/participantsSearchServiceAgent.service';

@Component({
    selector: 'ddp-activity-redesigned',
    templateUrl: './activity-redesigned.component.html',
    providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityRedesignedComponent
    extends ActivityComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    @Input() agreeConsent = false;

    public isVerticalProgress: boolean;
    private subscription: Subscription;

    constructor(
        logger: LoggingService,
        windowRef: WindowRef,
        changeRef: ChangeDetectorRef,
        renderer: Renderer2,
        submitService: SubmitAnnouncementService,
        analytics: AnalyticsEventsService,
        participantsSearch: ParticipantsSearchServiceAgent,
        @Inject(DOCUMENT) document: any,
        injector: Injector
    ) {
        super(
            logger,
            windowRef,
            renderer,
            submitService,
            analytics,
            participantsSearch,
            changeRef,
            document,
            injector
        );
        this.subscription = this.getIsLoaded$().subscribe((loaded) => {
            const activitiesWithVerticalProgress: string[] =
                this.config.usesVerticalStepper;
            console.log(
                this.model,
                activitiesWithVerticalProgress
            );
            this.isVerticalProgress =
                this.model &&
                activitiesWithVerticalProgress.includes(
                    this.model.activityCode
                );
        });
    }

    public isAgree(): boolean {
        return this.model.formType === 'CONSENT' && this.agreeConsent;
    }

    public get useStepsWithCircle(): boolean {
        return this.config.useStepsWithCircle;
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        super.ngOnDestroy();
    }
}
