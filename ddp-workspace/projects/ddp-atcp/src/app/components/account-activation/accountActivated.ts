import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Auth0AdapterService, CompositeDisposable, NGXTranslateService } from 'ddp-sdk';
import { PopupMessage } from '../../toolkit/models/popupMessage';
import { delay } from 'rxjs/operators';
import { ToolkitConfigurationService } from 'toolkit';
import { AtcpCommunicationService } from '../../toolkit/services/communication.service';
@Component({
    selector: 'app-account-activation',
    template: `<p></p>`
})
export class AccountActivatedComponent implements OnInit, OnDestroy {

  private anchor = new CompositeDisposable();

  constructor(
        private route: ActivatedRoute,
        private auth0: Auth0AdapterService,
        private communicationService: AtcpCommunicationService,
        private ngxTranslate: NGXTranslateService,
        private router: Router,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
      this.anchor.addNew(this.ngxTranslate.getTranslation('AccountActivation.EmailConfirmed')
        .subscribe((translationResult: string) => {
        this.communicationService
          .showPopupMessage(new PopupMessage(translationResult,
            false));
          of('').pipe(delay(4000)).toPromise().then(() => {
            this.communicationService.closePopupMessage();
            this.router.navigateByUrl(this.toolkitConfiguration.dashboardUrl);
          });
      }));
    }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
