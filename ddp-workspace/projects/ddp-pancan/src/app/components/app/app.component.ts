import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import {
    AppRedesignedBaseComponent,
    CommunicationService,
    ToolkitConfigurationService
} from 'toolkit';
import { RenewSessionNotifier } from 'ddp-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent extends AppRedesignedBaseComponent {
    phone: string;
    email: string;
    isSplashPage: boolean;
    private readonly splashPageUrls = ['colorectal', 'lms'];

    constructor(
        _communicationService: CommunicationService,
        _dialog: MatDialog,
        _renewNotifier: RenewSessionNotifier,
        _router: Router,
        @Inject('toolkit.toolkitConfig') _config: ToolkitConfigurationService
    ) {
        super(_communicationService, _dialog, _renewNotifier, _router, _config);
        this.phone = _config.phone;
        this.email = _config.infoEmail;
        this.initRouterEvents();
    }

    private initRouterEvents(): void {
        this.router.events.subscribe(event => {
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            this.isSplashPage = this.splashPageUrls.some(url => event.url.includes(url));
        });
    }
}
