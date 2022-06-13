import {Component, Inject} from '@angular/core';
import {AppRedesignedBaseComponent, CommunicationService, ToolkitConfigurationService} from 'toolkit';
import {MatDialog} from '@angular/material/dialog';
import {RenewSessionNotifier} from 'ddp-sdk';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends AppRedesignedBaseComponent {
  constructor(
    private _communicationService: CommunicationService,
    private _dialog: MatDialog,
    private _renewNotifier: RenewSessionNotifier,
    private _router: Router,
    @Inject('toolkit.toolkitConfig') private _config: ToolkitConfigurationService) {
    super(_communicationService, _dialog, _renewNotifier, _router, _config);
  }
}
