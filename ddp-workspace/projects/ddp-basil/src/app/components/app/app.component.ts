import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';
import { SessionWillExpireComponent } from 'toolkit';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    private anchor = new CompositeDisposable();
    private readonly DIALOG_BASE_SETTINGS = {
        width: '740px',
        position: { top: '30px' },
        data: {},
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy()
    };

    constructor(
        private dialog: MatDialog,
        private renewNotifier: RenewSessionNotifier,
        private translate: TranslateService) { }

    ngOnInit(): void {
        this.initSessionWillExpireListener();
        this.initTranslate();
    }

    ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public openSessionWillExpireDialog(): void {
        this.dialog.open(SessionWillExpireComponent, { ...this.DIALOG_BASE_SETTINGS, disableClose: true });
    }

    public closeSessionWillExpireDialog(): void {
        this.dialog.closeAll();
    }

    private initSessionWillExpireListener(): void {
        const modalOpen = this.renewNotifier.openDialogEvents.subscribe(() => {
            this.openSessionWillExpireDialog();
        });
        const modalClose = this.renewNotifier.closeDialogEvents.subscribe(() => {
            this.closeSessionWillExpireDialog();
        });
        this.anchor.addNew(modalOpen).addNew(modalClose);
    }

    private initTranslate(): void {
        const session = localStorage.getItem('session_key');
        if (session != null) {
            const locale = JSON.parse(session).locale;
            this.translate.use(locale);
        }
    }
}
