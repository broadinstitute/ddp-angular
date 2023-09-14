import { OnInit, OnDestroy, Inject, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { NavigationEnd, Router } from '@angular/router';
import { CommunicationService } from '../../services/communication.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { JoinMailingListComponent } from '../dialogs/joinMailingList.component';
import { SessionWillExpireComponent } from '../dialogs/sessionWillExpire.component';
import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';

@Component({
    template: ``
})
export class AppRedesignedBaseComponent implements OnInit, OnDestroy {
    private anchor = new CompositeDisposable();
    private readonly DIALOG_BASE_SETTINGS = {
        width: '740px',
        position: { top: '30px' },
        data: {},
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy()
    };

    constructor(
        private communicationService: CommunicationService,
        private dialog: MatDialog,
        private renewNotifier: RenewSessionNotifier,
        protected router: Router,
        @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.initMailingListDialogListener();
        this.initSessionExpiredDialogListener();
        this.initRouterListener();
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    private initMailingListDialogListener(): void {
        if(this.communicationService) {
            const modalOpen = this.communicationService.openJoinDialog$.subscribe(() => {
                this.dialog?.open(JoinMailingListComponent, this.DIALOG_BASE_SETTINGS);
            });
            this.anchor.addNew(modalOpen);
        }
    }

    private initSessionExpiredDialogListener(): void {
        if(this.renewNotifier) {
            const modalOpen = this.renewNotifier.openDialogEvents.subscribe(() => {
                this.dialog?.open(SessionWillExpireComponent, { ...this.DIALOG_BASE_SETTINGS, disableClose: true });
            });
            const modalClose = this.renewNotifier.closeDialogEvents.subscribe(() => {
                this.dialog?.closeAll();
            });
            this.anchor.addNew(modalOpen).addNew(modalClose);
        }
    }

    private initRouterListener(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd && event.url.includes(this.config.mailingListDialogUrl)) {
                this.communicationService.openJoinDialog();
            }
        });
    }
}
