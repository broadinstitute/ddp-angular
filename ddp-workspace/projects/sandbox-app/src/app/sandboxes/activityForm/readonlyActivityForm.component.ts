import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivityServiceAgent, ActivityComponent, CompositeDisposable } from 'ddp-sdk';
import { timer } from 'rxjs';
import { finalize, takeUntil, map } from 'rxjs/operators';

@Component({
    selector: 'app-readonly-activity-form',
    templateUrl: 'readonlyActivityForm.component.html'
})
export class ReadonlyActivityFormComponent implements OnDestroy {
    @ViewChild(ActivityComponent, { static: false }) private form: ActivityComponent;
    public instanceGuid: string;
    public activityGuid = 'READONLY01';
    public expiredInstanceGuid: string;
    public showExpired = false;
    public countdown: number;
    private anchor: CompositeDisposable;

    constructor(private serviceAgent: ActivityServiceAgent) {
        this.anchor = new CompositeDisposable();
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public create(): void {
        this.serviceAgent.createInstance('TESTSTUDY1', this.activityGuid)
            .subscribe(x => {
                !!x && (this.instanceGuid = x.instanceGuid);
                this.showExpired = false;
                this.startCountdownTimer();
            });
    }

    private startCountdownTimer(): void {
        const interval = 1000;
        const duration = 200 * 1000;
        const stream$ = timer(0, interval).pipe(
            finalize(() => {
                this.expiredInstanceGuid = this.instanceGuid;
                this.showExpired = true;
                this.form.refresh();
            }),
            takeUntil(timer(duration + interval)),
            map(value => (duration - value * interval) / 1000)
        );
        const stream = stream$.subscribe(value => this.countdown = value);
        this.anchor.addNew(stream);
    }
}
