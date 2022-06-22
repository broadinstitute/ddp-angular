import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {StoreService} from '../../../STORE/store.service';
import {MainConstants} from '../../constants/main-constants';
import {sectionGuids} from './utils/sections_guids';
import {MatExpansionPanel} from "@angular/material/expansion";

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActivitiesComponent implements OnInit {
  patientWithActivities$: Observable<any>;
  panelOpenState = true;
  sectionsArray = sectionGuids;

  activeRoute = this.activatedRoute.snapshot.url[0].path;
  readonly PARENT = MainConstants.participantsListParent;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.patientWithActivities$ = this.storeService.getParticipantActivities(params.guid)
        .pipe(
          tap(data => !data && this.storeService.dispatchGetParticipant(params.guid, this.PARENT)),
          tap(result => {
            const openActivityGuid = this.activatedRoute.snapshot.firstChild?.params.activity;
            if(!openActivityGuid && result) {
              const activityGuid = result.activities['ENROLLMENT_FORMS'].activities[0].activityGuid;
              this.router.navigate(['./', activityGuid], {relativeTo: this.activatedRoute});
            }
          })
        );
    });
  }

  isOpen(activities: any): boolean {
    const openActivityGuid = this.activatedRoute.snapshot.firstChild?.params.activity;
    if(openActivityGuid) {
      return activities.some(activity => activity.activityGuid === openActivityGuid);
    }
    return;
  }

}
