import { Component, Inject } from '@angular/core';
import { AppRedesignedBaseComponent, CommunicationService, ToolkitConfigurationService } from 'toolkit';
import { MatDialog } from '@angular/material/dialog';
import { RenewSessionNotifier } from 'ddp-sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent extends AppRedesignedBaseComponent {
    constructor(
        _communicationService: CommunicationService,
        _dialog: MatDialog,
        _renewNotifier: RenewSessionNotifier,
        _router: Router,
        @Inject('toolkit.toolkitConfig') _config: ToolkitConfigurationService) {
        super(_communicationService, _dialog, _renewNotifier, _router, _config);
    }
}
