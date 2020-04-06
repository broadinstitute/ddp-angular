import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSidenav } from '@angular/material';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from './app.component.state';
import { SessionWillExpireComponent } from '../dialogs/sessionWillExpire.component';
import { WarningComponent } from '../dialogs/warning.component';
import { CommunicationService } from '../../services/communication.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { distinctUntilChanged, filter, map, scan, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, merge, Observable, of, Subscription } from 'rxjs';
import { BrowserContentService, UserProfile, UserProfileDecorator, UserProfileServiceAgent, WindowRef, RenewSessionNotifier } from 'ddp-sdk';

@Component({
    selector: 'app-root',
    template: `
      <toolkit-warning-message *ngIf="unsupportedBrowser" class="warning-message"></toolkit-warning-message>
      <div class="MainContainer">
        <router-outlet></router-outlet>
      </div>
      <toolkit-footer></toolkit-footer>
    `
})
export class AppComponent implements OnInit, OnDestroy {
    public unsupportedBrowser: boolean;
    private anchor: Subscription = new Subscription();
    private readonly dialogBaseSettings = {
        width: '740px',
        position: { top: '30px' },
        data: {},
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy()
    };

    constructor(
        private translate: TranslateService,
        private communicationService: CommunicationService,
        private dialog: MatDialog,
        private browserContent: BrowserContentService,
        private renewNotifier: RenewSessionNotifier,
        private windowRef: WindowRef,
        private userProfile: UserProfileServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.initBrowserWarningListener();
        this.initSessionWillExpireListener();
        this.initTranslate();
        this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public openWarningDialog(): void {
        this.dialog.open(WarningComponent, this.dialogBaseSettings);
    }

    public openSessionWillExpireDialog(): void {
        this.dialog.open(SessionWillExpireComponent, this.dialogBaseSettings);
    }

    public closeSessionWillExpireDialog(): void {
        this.dialog.closeAll();
    }

    private initBrowserWarningListener(): void {
        const modal = this.browserContent.events.subscribe(() => {
            this.openWarningDialog();
        });
        this.anchor.add(modal);
    }

    private initSessionWillExpireListener(): void {
        const modalOpen = this.renewNotifier.openDialogEvents.subscribe(() => {
            this.openSessionWillExpireDialog();
        });
        const modalClose = this.renewNotifier.closeDialogEvents.subscribe(() => {
            this.closeSessionWillExpireDialog();
        });
        this.anchor.add(modalOpen).add(modalClose);
    }

    private initTranslate(): void {
        const session = localStorage.getItem('session_key');
        if (session != null) {
            const locale = JSON.parse(session).locale;
            this.translate.use(locale);
        }
    }
}
