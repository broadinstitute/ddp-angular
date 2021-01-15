import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  RenewSessionNotifier,
  LoggingService,
  StackdriverErrorReporterService
} from 'ddp-sdk';
import { AppRedesignedBaseComponent, CommunicationService, ToolkitConfigurationService } from 'toolkit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AppRedesignedBaseComponent {
  constructor(
    private _communicationService: CommunicationService,
    private _dialog: MatDialog,
    private _renewNotifier: RenewSessionNotifier,
    private _router: Router,
    @Inject('toolkit.toolkitConfig') private _config: ToolkitConfigurationService,
    private logger: LoggingService,
    private stackdriverErrorReporterService: StackdriverErrorReporterService) {
    super(_communicationService, _dialog, _renewNotifier, _router, _config);

    this.testIt();
  }

  private testIt() {
    this.logger.logError('test error 1 via logger.logError');

    try {
      throw new Error('Test error');
    } catch(e) {
      this.stackdriverErrorReporterService.handleError('test error 2 via stackdriverErrorReporterService.handleError: ' + e);
    }
  }
}
