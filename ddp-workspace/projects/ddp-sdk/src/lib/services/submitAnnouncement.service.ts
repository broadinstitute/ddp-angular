import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
    private submitAnnouncedSource = new Subject<void>();

    get submitAnnounced$(): Observable<void> {
      return this.submitAnnouncedSource.asObservable();
    }

    public announceSubmit(): void {
        this.submitAnnouncedSource.next();
    }
}
