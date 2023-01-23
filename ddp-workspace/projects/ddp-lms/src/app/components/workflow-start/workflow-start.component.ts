import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
  HeaderConfigurationService,
  ToolkitConfigurationService,
  WorkflowBuilderService,
  WorkflowStartActivityRedesignedComponent,
} from 'toolkit';
import {
  ActivityResponse,
  ConfigurationService,
  SessionMementoService,
  SessionStorageService,
  TemporaryUserServiceAgent,
  WindowRef,
  WorkflowServiceAgent,
} from 'ddp-sdk';
import { IS_REGISTERING } from '../../types';
import {finalize, take} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-workflow-start',
  templateUrl: './workflow-start.component.html',
})
export class WorkflowStartComponent extends WorkflowStartActivityRedesignedComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(
    private _headerConfig: HeaderConfigurationService,
    private __workflowBuilder: WorkflowBuilderService,
    private __temporaryUserService: TemporaryUserServiceAgent,
    private __session: SessionMementoService,
    private __workflow: WorkflowServiceAgent,
    private __windowRef: WindowRef,
    private __cdr: ChangeDetectorRef,
    _sessionStorageService: SessionStorageService,
    @Inject('ddp.config') private __configuration: ConfigurationService,
    @Inject('toolkit.toolkitConfig') public __toolkitConfiguration: ToolkitConfigurationService
  ) {
    super(
      _headerConfig,
      __workflowBuilder,
      __temporaryUserService,
      __session,
      __workflow,
      __windowRef,
      __cdr,
      _sessionStorageService,
      __configuration,
      __toolkitConfiguration
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.observeSessionChanges();
  }

  ngOnDestroy(): vod {
    super.ngOnDestroy();
    !this.subscription.closed && this.subscription.unsubscribe();
  }

  onSubmit(response: ActivityResponse): void {
    if (!('allowUnauthenticated' in response)) {
      response.allowUnauthenticated = false;
    }
    if (this.__session.isTemporarySession() && response.allowUnauthenticated === false) {
      localStorage.setItem(IS_REGISTERING, 'true');
    }
    super.navigate(response);
  }

  private observeSessionChanges(): void {
    this.subscription = this.__session.sessionObservable
      .pipe(
        take(2),
        finalize(this.resetHeaderNavigation.bind(this)))
      .subscribe();
  }

  private resetHeaderNavigation(): void {
    if (this.__session.isTemporarySession()) {
      this._headerConfig.showBreadcrumbs = false;
      this._headerConfig.showMainButtons = true;
    }
  }
}
