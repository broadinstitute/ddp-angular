import { Component, Inject, OnInit, SimpleChanges } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { ActivityPicklistOption } from "../../../models/activity/activityPicklistOption";
import { ConfigurationService } from "../../../services/configuration.service";
import { NGXTranslateService } from "../../../services/internationalization/ngxTranslate.service";
import { PicklistSortingPolicy } from "../../../services/picklistSortingPolicy.service";
import { ActivityServiceAgent } from "../../../services/serviceAgents/activityServiceAgent.service";
import { SessionMementoService } from "../../../services/sessionMemento.service";
import { BaseActivityPicklistQuestion } from "./baseActivityPicklistQuestion.component";

@Component({
    selector: "ddp-activity-picklist-remote-auto-complete-options",
    templateUrl:
        "./activity-picklist-remote-auto-complete-options.component.html",
    styleUrls: [
        "./activity-picklist-remote-auto-complete-options.component.scss",
    ],
})
export class ActivityPicklistRemoteAutoCompleteOptionsComponent
    extends BaseActivityPicklistQuestion
    implements OnInit
{
    searchValue$ = new BehaviorSubject("");
    picklistOptions$: Observable<ActivityPicklistOption>;
    constructor(
        translate: NGXTranslateService,
        private sortPolicy: PicklistSortingPolicy,
        @Inject("ddp.config") public config: ConfigurationService,
        private activityService: ActivityServiceAgent
    ) {
        super(translate);
    }

    ngOnInit(): void {
       this.picklistOptions$ = this.searchValue$
            .pipe(
                switchMap((value) =>
                    this.activityService.getPickListOptions(this.block.stableId, value)
                )
            );
    }

    onInput(value) {
        this.searchValue$.next(value);
    }
}
