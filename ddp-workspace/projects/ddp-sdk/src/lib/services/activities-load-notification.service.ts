import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ActivitiesLoadNotificationService {
    private activityLoadNotifier: BehaviorSubject<boolean>;
    private loaded = false;

    constructor() {
        this.activityLoadNotifier = new BehaviorSubject<boolean>(false);
    }

    public getActivityLoadNotifier(): Observable<boolean> {
        return this.activityLoadNotifier.asObservable();
    }

    public addLoadNotification(loaded: boolean): void {
        this.activityLoadNotifier.next(loaded);
        this.loaded = loaded;
    }
}
