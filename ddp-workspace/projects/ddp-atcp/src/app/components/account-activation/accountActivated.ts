import { Component, OnInit } from '@angular/core';
import { delay, take, tap } from 'rxjs/operators';
import { Auth0AdapterService, NGXTranslateService, SessionMementoService } from 'ddp-sdk';
import { PopupMessage } from '../../toolkit/models/popupMessage';
import { AtcpCommunicationService } from '../../toolkit/services/communication.service';

@Component({
    selector: 'app-account-activation',
    template: `<p></p>`
})
export class AccountActivatedComponent implements OnInit {
    constructor(
        private communicationService: AtcpCommunicationService,
        private ngxTranslate: NGXTranslateService,
        private session: SessionMementoService,
        private auth0: Auth0AdapterService
    ) {}

    public ngOnInit(): void {
        this.ngxTranslate.getTranslation('AccountActivation.EmailConfirmed').pipe(
            tap((translationResult: string) => {
                this.communicationService.showPopupMessage(new PopupMessage(translationResult, false));
            }),
            delay(4000),
            take(1)
        ).subscribe(() => {
            this.communicationService.closePopupMessage();
            const additionalParams = {
                temp_user_guid: this.session.isTemporarySession() ? this.session.session.userGuid : undefined
            };
            this.auth0.login(additionalParams);
        });
    }
}
