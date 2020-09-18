import { Component } from '@angular/core';
import { ActivityPageComponent } from 'toolkit';

@Component({
    selector: 'prion-activity-page',
    template: `
    <ng-container>
        <prion-header>
        </prion-header>
        <div class="ContainerSurvey-top row">
            <ddp-activity [studyGuid]="studyGuid"
                      [activityGuid]="(activityInstance$ | async)?.instanceGuid"
                      (submit)="raiseSubmit($event)"
                      class="ContainerSurvey col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
        </ddp-activity>
        </div>
     </ng-container>`
})
export class PrionActivityPageComponent extends ActivityPageComponent {

}
