import { Injectable, Inject } from '@angular/core';
import { RoleService } from './role.service';
import { ConfigurationService, SessionMementoService, StackdriverErrorReporterService } from 'ddp-sdk';

@Injectable({providedIn: 'root'})
export class StackdriverErrorReporterDsmService extends StackdriverErrorReporterService {

  constructor(
    @Inject('ddp.config') private _config: ConfigurationService,
    private _sessionService: SessionMementoService,
    private role: RoleService
  ) {
    super(_config, _sessionService);
  }

  protected getUserInfo(): string {
    return this.role?.userID() ? this.role.userID() : 'unknown';
  }
}
