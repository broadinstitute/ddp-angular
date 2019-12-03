import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivityServiceAgent, CompositeDisposable } from 'ddp-sdk';

@Component({
    selector: 'app-sandbox-essay-info',
    templateUrl: 'essayInfo.component.html',
    styles: [
        `.form-field {
            width: 50%;
        }`
    ]
})
export class EssayInfoComponent implements OnInit, OnDestroy {
    public instanceGuid: string;
    public activityGuid: string = "ACTIVITY_FOR_TESTING_ESSAY_TEXT_QUESTION";
    public essayOptions: any = [
        "ACTIVITY_FOR_TESTING_ESSAY_TEXT_QUESTION"
    ];
    private anchor: CompositeDisposable;

    constructor(private serviceAgent: ActivityServiceAgent) { }

    public ngOnInit(): void {
        this.anchor = new CompositeDisposable();
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public create(): void {
        const create = this.serviceAgent.createInstance('TESTSTUDY1', this.activityGuid)
            .subscribe(x => {
                !!x && (this.instanceGuid = x.instanceGuid);
            });
        this.anchor.addNew(create);
    }
}
