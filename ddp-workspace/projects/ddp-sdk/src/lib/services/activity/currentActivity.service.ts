import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {ActivityServiceAgent} from "../serviceAgents/activityServiceAgent.service";
import {ActivityForm} from "../../models/activity/activityForm";
import {filter, tap} from "rxjs/operators";
import {ActivityCodes} from '../../constants/activityCodes';

@Injectable()
export class CurrentActivityService {
  private activity = new BehaviorSubject(null);

  constructor(private activityServiceAgent: ActivityServiceAgent) {
    this.activity
      .pipe(filter(x => x !== null));
  }

  public getActivity(studyGuid: Observable<string | null>,
                     activityGuid: Observable<string | null>): Observable<ActivityForm> {
    return this.activityServiceAgent.getActivity(studyGuid, activityGuid).pipe(tap(x => this.saveCurrentActivity(x)));
  }

  public saveCurrentActivity(value) {
    this.activity.next(value);
  }

  public getCurrentActivity(): Observable<ActivityForm | null> {
    return this.activity.asObservable();
  }
}
