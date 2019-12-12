import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyInvitationServiceAgent } from '../../services/serviceAgents/verifyInvitationServiceAgent.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'ddp-verify-age-up',
    template: `<mat-spinner></mat-spinner>`
})
export class VerifyAgeUpComponent implements OnInit {
    private url: string;
    private readonly EMAIL_VERIFIED = 200;
    @Output() public error: EventEmitter<void> = new EventEmitter();
    @Output() public nextUrl: EventEmitter<string> = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private verifyService: VerifyInvitationServiceAgent) { }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.url = params['next'];
            this.verifyInvitation(params['invitation']);
        });
    }

    private verifyInvitation(invitationId: string): void {
        this.verifyService.verify(invitationId).pipe(
            take(1)
        ).subscribe(status => {
            if (status === this.EMAIL_VERIFIED) {
                this.nextUrl.emit(this.url);
            } else {
                this.error.emit();
            }
        });
    }
}
