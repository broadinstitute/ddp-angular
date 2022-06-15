import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {StoreService} from '../../../STORE/store.service';
import {MainConstants} from '../../constants/main-constants';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})

export class ActivitiesComponent implements OnInit {
  patientWithActivities: Observable<any>;
  panelOpenState = true;

  readonly PARENT = MainConstants.participantsListParent;

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {

    this.patientWithActivities = this.storeService.getParticipantActivities(params.guid).
      pipe(tap(data => !data && this.storeService.dispatchGetParticipant(params.guid, this.PARENT)));
    });

  }

}
