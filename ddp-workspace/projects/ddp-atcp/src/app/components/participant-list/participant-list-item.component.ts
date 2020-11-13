import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SessionMementoService } from 'ddp-sdk';

import { COMPLETE } from '../workflow-progress/workflow-progress';
import { ActivityService } from '../../services/activity.service';
import * as RouterResources from '../../router-resources';
import { Participant } from './participant-list.component';

@Component({
  selector: 'atcp-participant-list-item',
  template: `
    <div class="participant-expandable">
      <div class="participant-expandable__header">
        <span class="participant-expandable__name">
          {{ participant.profile.firstName }} {{ participant.profile.lastName }}
        </span>

        <span
          *ngIf="surveysToCompleteCount"
          class="participant-expandable__status"
        >
          <ng-container
            *ngIf="surveysToCompleteCount === 1; else pluralSurveyCount"
          >
            {{ 'SDK.UserActivities.SurveysToComplete.Singular' | translate }}
          </ng-container>

          <ng-template #pluralSurveyCount>
            {{
              'SDK.UserActivities.SurveysToComplete.Plural'
                | translate: { count: surveysToCompleteCount }
            }}
          </ng-template>
        </span>

        <button
          class="participant-expandable__control"
          (click)="expanded = !expanded"
        >
          <span>{{ 'Common.Buttons.Expand.Title' | translate }}</span>
        </button>
      </div>

      <div *ngIf="expanded" class="participant-expandable__activities">
        <atcp-user-activities
          [activities]="participant.activities"
          [opaque]="true"
          (startActivity)="onStartActivity($event)"
          (continueActivity)="onStartActivity($event)"
          (viewActivity)="onStartActivity($event)"
        ></atcp-user-activities>
      </div>
    </div>
  `,
  styles: [
    `
      .participant-expandable__header {
        display: flex;
        align-items: center;

        padding: 0.9rem 1.2rem;
      }

      .participant-expandable__name {
        margin-right: auto;

        font-weight: bold;
        opacity: 0.8;
      }

      .participant-expandable__status {
        display: flex;
        align-items: center;

        font-style: italic;
        opacity: 0.6;

        margin-right: 1rem;
      }

      .participant-expandable__status::before {
        content: '';

        width: 8px;
        height: 8px;

        margin-right: 6px;

        background-color: #5c7a36;
        border-radius: 4px;
      }

      .participant-expandable__control {
        display: flex;
        align-items: center;

        font-family: inherit;
        font-weight: bold;
        color: #4274bc;

        background-color: transparent;
        border: none;
      }

      .participant-expandable__control::after {
        content: '';

        width: 12px;
        height: 10px;

        margin-top: -4px;
        margin-left: 4px;

        background-image: url('assets/images/blue-arrow.svg');
        background-position: center;
        background-size: cover;
      }

      .participant-expandable__activities {
        margin-bottom: -1px;

        background-color: black;
      }
    `,
  ],
})
export class ParticipantListItem {
  @Input() participant: Participant;

  expanded: boolean = false;

  constructor(
    private router: Router,
    private session: SessionMementoService,
    private activityService: ActivityService
  ) {}

  public onStartActivity(instanceGuid: string): void {
    this.session.setParticipant(this.participant.guid);
    this.activityService.currentActivityInstanceGuid = instanceGuid;

    this.router.navigateByUrl(RouterResources.Survey);
  }

  get surveysToCompleteCount(): number {
    return this.participant.activities.filter(
      activity => activity.statusCode !== COMPLETE
    ).length;
  }
}
