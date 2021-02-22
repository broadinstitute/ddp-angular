import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvitationServiceAgent } from '../../services/serviceAgents/invitationServiceAgent.service';

@Component({
    selector: 'ddp-verify-age-up',
    template: `<mat-spinner></mat-spinner>`
})
export class VerifyAgeUpComponent implements OnInit {
    private url: string;
    @Output() public error: EventEmitter<void> = new EventEmitter();
    @Output() public nextUrl: EventEmitter<string> = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private invitationsService: InvitationServiceAgent) { }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.url = params['next'];
            this.verifyInvitation(params['invitation']);
        });
    }

    private verifyInvitation(invitationId: string): void {
        this.invitationsService.verify(invitationId).subscribe({
            complete: () => this.nextUrl.emit(this.url),
            error: () => this.error.emit()
        });
    }
}
