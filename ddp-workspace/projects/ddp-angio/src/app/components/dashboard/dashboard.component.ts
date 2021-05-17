import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SearchParticipant, ParticipantsSearchServiceAgent } from 'ddp-sdk';

@Component({
    selector: 'app-dashboard',
    template: `
        <toolkit-dashboard *ngIf="selectedUser$ | async as selectedUser; else loading" [selectedUser]="selectedUser">
        </toolkit-dashboard>
        <ng-template #loading>
            <toolkit-header [showButtons]="false"></toolkit-header>
            <div class="Wrapper">
                <div class="PageHeader">
                    <div class="PageHeader-background"></div>
                </div>
                <div class="PageContent">
                    <div class="PageLayout PageLayout-prism">
                        <ddp-loader></ddp-loader>
                    </div>
                </div>
            </div>
        </ng-template>
    `,
})
export class DashboardComponent {
    public selectedUser$: Observable<SearchParticipant|null>;

    constructor(
        private route: ActivatedRoute,
        private participantsSearch: ParticipantsSearchServiceAgent,
        ) {
        this.selectedUser$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => this.participantsSearch.getParticipant(params.get('userGuid')))
        );
    }
}
