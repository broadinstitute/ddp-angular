import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    OnDestroy,
    OnInit,
    Renderer2,
    Input
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { take } from 'rxjs/operators';

import { ActivityComponent } from '../activity.component';
import { WindowRef } from '../../../services/windowRef';
import { SubmitAnnouncementService } from '../../../services/submitAnnouncement.service';
import { AnalyticsEventsService } from '../../../services/analyticsEvents.service';
import { SubmissionManager } from '../../../services/serviceAgents/submissionManager.service';
import { LoggingService } from '../../../services/logging.service';

@Component({
    selector: 'ddp-activity-redesigned',
    templateUrl: './activity-redesigned.component.html',
    providers: [SubmitAnnouncementService, SubmissionManager]
})
export class ActivityRedesignedComponent extends ActivityComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() agreeConsent = false;
    @Input() activitiesWithVerticalProgress: string[] = [];

    public isVerticalProgress: boolean;
    private isAdminEditing = false;

    constructor(
        logger: LoggingService,
        windowRef: WindowRef,
        private changeRef: ChangeDetectorRef,
        renderer: Renderer2,
        submitService: SubmitAnnouncementService,
        analytics: AnalyticsEventsService,
        @Inject(DOCUMENT) document: any,
        injector: Injector
    ) {
        super(logger, windowRef, renderer, submitService, analytics, document, injector);
        this.isLoaded$.pipe(take(1))
            .subscribe(_ => {
                this.isVerticalProgress = this.activitiesWithVerticalProgress.includes(this.model.activityCode);
            });
    }

    public isAgree(): boolean {
        return this.model.formType === 'CONSENT' && this.agreeConsent;
    }

    public isReadonly(): boolean {
        return !this.isAdminEditing && this.model.readonly;
    }

    public updateIsAdminEditing(adminEditing: boolean): void {
        this.isAdminEditing = adminEditing;
        this.changeRef.detectChanges();
    }
}
