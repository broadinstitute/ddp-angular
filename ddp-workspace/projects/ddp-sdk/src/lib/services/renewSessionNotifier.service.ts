import { Injectable, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NGXTranslateService } from './internationalization/ngxTranslate.service';
import { CompositeDisposable } from '../compositeDisposable';
import { ReplaySubject, Subject, Observable } from 'rxjs';

@Injectable()
export class RenewSessionNotifier implements OnDestroy {
    public openDialogEvents: Observable<void>;
    public closeDialogEvents: Observable<void>;
    private anchor: CompositeDisposable = new CompositeDisposable();
    private openDialog: ReplaySubject<void> = new ReplaySubject<void>(1);
    private closeDialog: Subject<void> = new Subject<void>();

    constructor(
        private titleService: Title,
        private ngxTranslate: NGXTranslateService,
        @Inject(DOCUMENT) private document: any) {

        this.openDialogEvents = this.openDialog.asObservable();
        this.closeDialogEvents = this.closeDialog.asObservable();
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public showSessionExpirationNotifications(): void {
        this.setTabFavicon('favicon-alert');
        this.setTabTitle('SDK.Title.Alert');
        this.emitOpenSessionWillExpireDialog();
    }

    public hideSessionExpirationNotifications(): void {
        this.setTabFavicon('favicon');
        this.setTabTitle('SDK.Title.Default');
        this.emitCloseSessionWillExpireDialog();
    }

    private setTabFavicon(icon: string): void {
        const iconHash = Date.now();
        this.document.getElementById('app-favicon')?.setAttribute('href', `${icon}.ico?v=${iconHash}`);
    }

    private setTabTitle(key: string): void {
        const text = this.ngxTranslate.getTranslation(key).subscribe((title: string) => {
            this.titleService.setTitle(title);
        });
        this.anchor.addNew(text);
    }

    private emitOpenSessionWillExpireDialog(): void {
        this.openDialog.next();
    }

    private emitCloseSessionWillExpireDialog(): void {
        this.closeDialog.next();
    }
}
