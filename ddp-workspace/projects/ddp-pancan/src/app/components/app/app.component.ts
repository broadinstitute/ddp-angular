import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import {
    AppRedesignedBaseComponent,
    CommunicationService,
    ToolkitConfigurationService
} from 'toolkit';
import { RenewSessionNotifier } from 'ddp-sdk';
import { AppRoutes } from '../app-routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent extends AppRedesignedBaseComponent {
    phone: string;
    email: string;
    isSplashPage: boolean;
    isColorectalPage: boolean;
    isLmsPage: boolean;
    isPediHCCPage: boolean;

    constructor(
        _communicationService: CommunicationService,
        _dialog: MatDialog,
        _renewNotifier: RenewSessionNotifier,
        _router: Router,
        @Inject('toolkit.toolkitConfig') private _config: ToolkitConfigurationService
    ) {
        super(_communicationService, _dialog, _renewNotifier, _router, _config);
        this.initRouterEvents();
    }

    private initRouterEvents(): void {
        this.router.events.subscribe(event => {
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            this.isColorectalPage = event.url.includes(AppRoutes.ColorectalPage);
            this.isPediHCCPage = event.url.includes(AppRoutes.PediHCCPage);
            this.isLmsPage = event.url.includes(AppRoutes.LMS);
            this.isSplashPage = this.isColorectalPage || this.isLmsPage;

            this.phone = this.isPediHCCPage ?  this._config.pediHCCPagePhone : this._config.phone;
            this.email = this.isPediHCCPage ? this._config.pediHCCPageEmail : this._config.infoEmail;
        });
    }
}
