import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { AnnouncementsServiceAgent } from 'ddp-sdk';
import { Subscription } from 'rxjs';

@Component({
    selector: 'toolkit-dashboard',
    template: `
    <toolkit-header>
    </toolkit-header>
    <div class="Wrapper">
        <article class="PageContent">
            <div class="PageLayout PageLayout-dashboard">
                <div class="row NoMargin">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <!--TODO: Might need to move this-->
                    <h1 translate>Toolkit.Dashboard.Title</h1>
                        <section *ngIf="announcementsText && showMessage" class="PageContent-section Dashboard-info-section">
                            <mat-icon (click)="closeMessage()" class="close">clear</mat-icon>
                            <div class="Announcements-section" [innerHTML]="announcementsText">
                            </div>
                        </section>
                        <section class="PageContent-section">
                            <ddp-dashboard [studyGuid]="studyGuid"
                                           (open)="navigate($event)">
                            </ddp-dashboard>
                        </section>
                    </div>
                </div>
            </div>
        </article>
    </div>`
})
export class DashboardComponent implements OnInit, OnDestroy {
    public studyGuid: string;
    public welcomeText: string;
    public announcementsText: string | null;
    public showMessage = true;
    private anchor: Subscription;

    constructor(
        private router: Router,
        private announcements: AnnouncementsServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
        this.anchor = new Subscription();
    }

    public ngOnInit(): void {
        this.studyGuid = this.toolkitConfiguration.studyGuid;
        const anno = this.announcements.getMessage(this.studyGuid).subscribe(x => {
            if (x !== null && x.length) {
                this.announcementsText = x[0].message;
            }
        });
        this.anchor.add(anno);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public closeMessage(): void {
        this.showMessage = false;
    }

    public navigate(id: string): void {
        this.router.navigate([this.toolkitConfiguration.activityUrl, id]);
    }
}
