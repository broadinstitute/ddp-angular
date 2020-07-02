import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivityResponse } from '../models/activity/activityResponse';

/**
 * Service provides way for a parent or ancestor in component hierarchy to let a child or descendant that
 * a submit event has occurred.
 * Event can be used to announce thing that have happened in children. This service announces the submit event
 * in the other direction.
 * Note that it is intended to be used in component scope, i.e., be declared in the the providers in a parent component
 * and can then be injected into any descendant.
 *
 * class SubmitAnnouncementService
 */
@Injectable()
export class SubmitAnnouncementService {
    private _submitAnnounced$: Observable<ActivityResponse>;
    private submitAnnouncedSource: Subject<ActivityResponse>;

    constructor() {
        this.submitAnnouncedSource = new Subject<ActivityResponse>();
        this._submitAnnounced$ = this.submitAnnouncedSource.asObservable();
    }
    get submitAnnounced$(): Observable<ActivityResponse> {
      return this._submitAnnounced$;
    }

    public announceSubmit(response: ActivityResponse): void {
        this.submitAnnouncedSource.next(response);
    }
}
