import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PrequalifierServiceAgent, CompositeDisposable } from 'ddp-sdk';
import { UserStateService } from './services/userState.service';
import { UserState } from './model/userState';

@Component({
    selector: 'app-prequalifier',
    templateUrl: './prequalifier.component.html',
})
export class PrequalifierComponent implements OnDestroy {
    @Output() submit: EventEmitter<void> = new EventEmitter();
    public id: string;
    private anchor: CompositeDisposable;
    static STUDY_GUID: string = 'TESTSTUDY1';
    static PREQUALIFIER_GUID: string = '7A838F4669';

    constructor(
        private state: UserStateService,
        private prequalifierServiceAgent: PrequalifierServiceAgent,
        private router: Router) {
        this.anchor = new CompositeDisposable();
        const get = this.prequalifierServiceAgent.getPrequalifier(PrequalifierComponent.STUDY_GUID)
            .subscribe(x => {
                this.id = x;
            });
        this.anchor.addNew(get);
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public raiseSubmit(): void {
        const refresh = this.state.refreshState().subscribe(x => {
            if (x == UserState.NotQualified) {
                this.router.navigateByUrl('not-qualified');
            } else {
                this.router.navigateByUrl('consent');
            }
        });
        this.anchor.addNew(refresh);
    }
}
