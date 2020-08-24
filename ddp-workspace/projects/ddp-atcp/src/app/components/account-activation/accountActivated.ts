import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Auth0AdapterService, CompositeDisposable, NGXTranslateService, SessionMementoService } from 'ddp-sdk';
import { PopupMessage } from '../../toolkit/models/popupMessage';
import { delay } from 'rxjs/operators';
import { AtcpCommunicationService } from '../../toolkit/services/communication.service';
@Component({
    selector: 'app-account-activation',
    template: `<p></p>`
})
export class AccountActivatedComponent implements OnInit, OnDestroy {

  private anchor = new CompositeDisposable();

  constructor(
        private communicationService: AtcpCommunicationService,
        private ngxTranslate: NGXTranslateService,
        private router: Router,
        private session: SessionMementoService,
        private auth0: Auth0AdapterService) { }

    public ngOnInit(): void {
      this.anchor.addNew(this.ngxTranslate.getTranslation('AccountActivation.EmailConfirmed')
        .subscribe((translationResult: string) => {
        this.communicationService
          .showPopupMessage(new PopupMessage(translationResult,
            false));
          of('').pipe(delay(4000)).toPromise().then(() => {
            this.communicationService.closePopupMessage();

            const additionalParams = {};
            if (this.session.isTemporarySession()) {
              additionalParams['temp_user_guid'] = this.session.session.userGuid;
            }
            this.auth0.login(additionalParams);
          });
      }));
    }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
