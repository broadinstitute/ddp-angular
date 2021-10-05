import { ActivatedRoute } from '@angular/router';
import { WorkflowBuilderService } from 'toolkit';
import { MatDialog } from '@angular/material/dialog';
import { filter, first, pluck, tap } from 'rxjs/operators';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationsDialogComponent } from '../../notifications-dialog/notifications-dialog.component';
import { ActivityResponse, AnnouncementMessage, AnnouncementsServiceAgent, CompositeDisposable, ConfigurationService } from 'ddp-sdk';


@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.scss']
})
export class ActivityPageComponent implements OnInit, OnDestroy {

  studyGuid: string;
  instanceGuid: string;

  private subs = new CompositeDisposable();

  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly workflowBuilderService: WorkflowBuilderService,
    @Inject('ddp.config') private readonly config: ConfigurationService,
    private readonly announcementsServiceAgent: AnnouncementsServiceAgent,
  ) {}

  onSubmit(response: ActivityResponse): void {
    this.checkAnnouncement();

    this.workflowBuilderService.getCommand(response).execute();
  }

  ngOnInit(): void {
    this.studyGuid = this.config.studyGuid;

    const sub = this.route.params.pipe(pluck('id')).subscribe(instanceGuid => {
      this.instanceGuid = instanceGuid;
    });

    this.subs.addNew(sub);
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  private checkAnnouncement(): void {
    this.announcementsServiceAgent.getMessages(this.config.studyGuid).pipe(
      first(),
      filter((messages: AnnouncementMessage[]) => !!messages.length),
      tap((messages: AnnouncementMessage[]) => this.dialog.open(
        NotificationsDialogComponent,
        {
          data: {
            messages: messages.map(({ message }: AnnouncementMessage) => message)
          }
        }
      ))
    ).subscribe();
  }
}
