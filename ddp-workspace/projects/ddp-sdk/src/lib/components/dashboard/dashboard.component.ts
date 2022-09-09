import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { DashboardParticipant } from "ddp-sdk";
import { filter, Observable, Subscription, tap } from "rxjs";
import {DashboardRedesignedComponent} from '../../../../../toolkit/src/lib/components/dashboard/dashboard-redesigned.component';

@Component({
    selector: 'ddp-common-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class CommonDashboardComponent extends DashboardRedesignedComponent implements OnInit, OnDestroy {
    @Input() participants$: Observable<DashboardParticipant[]> = new Observable<DashboardParticipant[]>();
    @Output() openEditDialog: EventEmitter<DashboardParticipant>=new EventEmitter<DashboardParticipant>();
    subscriptions$: Subscription[]=[];
    
    ngOnInit() {
        super.ngOnInit();
        let data = false;
        this.subscriptions$.push(this.participants$.pipe(filter(elem=>!!elem && elem.length > 0),tap(item => data=true)).subscribe());
        data && (this.dashboardParticipants$=this.participants$);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptions$.forEach((subscription) => subscription.unsubscribe());
    }
    openUserEditDialog(participant){
        this.toolkitConfig.customOpenUserEditDialog ? this.openEditDialog.emit(participant) : super.openUserEditDialog(participant);
    }
}