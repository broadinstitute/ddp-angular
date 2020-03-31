import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSidenav } from '@angular/material';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from './app.component.state';
import { JoinMailingListComponent } from '../dialogs/joinMailingList.component';
import { SessionWillExpireComponent } from '../dialogs/sessionWillExpire.component';
import { WarningComponent } from '../dialogs/warning.component';
import { CommunicationService } from '../../services/communication.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { distinctUntilChanged, filter, map, scan, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import {
    BrowserContentService,
    UserProfile,
    UserProfileDecorator,
    UserProfileServiceAgent,
    WindowRef,
    RenewSessionNotifier,
    CompositeDisposable
} from 'ddp-sdk';

declare global {
    interface Window {
        twttr: any;
    }
}

@Component({
    selector: 'app-root',
    template: `
    <toolkit-warning-message *ngIf="unsupportedBrowser" class="warning-message"></toolkit-warning-message>
    <mat-sidenav-container (backdropClick)="closeNav()" [ngClass]="{'warning-message-top': unsupportedBrowser}">
        <mat-sidenav #sidenav position="end" mode="over" (open)="sideNavTop.focus()">
            <ul class="PageContent-ul NoListStyle Sidenav">
                <li>
                    <a href #sideNavTop></a>
                </li>
                <li>
                    <a (click)="closeNav()" [routerLink]="['/']" class="Link" translate>App.Home</a>
                </li>
                <li *ngIf="showDataRelease">
                    <a (click)="closeNav()" [routerLink]="['/data-release']" class="Link" translate>App.Data</a>
                </li>
                <li>
                    <a (click)="closeNav()" [routerLink]="['/more-details']" class="Link" translate>App.FAQ</a>
                </li>
                <li>
                    <a (click)="closeNav()" [routerLink]="['/about-us']" class="Link" translate>App.About</a>
                </li>
                <li *ngIf="showBlog">
                    <a (click)="closeNav()" [href]="blogUrl" class="Link" translate>App.NewsBlog</a>
                </li>
                <li>
                    <a (click)="emitOpenJoinDialog()" class="Link" translate>App.Join</a>
                </li>
                <li *ngIf="showInfoForPhysicians">
                    <a [routerLink]="['physician.pdf']" target="_blank" class="Link" translate>App.Info</a>
                </li>
                <li class="NoPadding TopMarginMedium">
                    <a class="twitter-timeline" data-tweet-limit="20" data-theme="light" [href]="twitterUrl">App.Twitter</a>
                </li>
            </ul>
        </mat-sidenav>
        <mat-sidenav-content>
            <div class="MainContainer">
                <router-outlet></router-outlet>
                <toolkit-footer></toolkit-footer>
            </div>
        </mat-sidenav-content>
    </mat-sidenav-container>
    `
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    public twitterUrl: string;
    public unsupportedBrowser: boolean;
    public blogUrl: string;
    private anchor = new CompositeDisposable();
    private readonly dialogBaseSettings = {
        width: '740px',
        position: { top: '30px' },
        data: {},
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy()
    };
    private joinDialogObservable = new BehaviorSubject<MatDialogRef<JoinMailingListComponent> | null>(null);
    @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

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
        this.initUserActionsListeners();
        this.initBrowserWarningListener();
        this.initSessionWillExpireListener();
        this.initTranslate();
        this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
        this.blogUrl = this.toolkitConfiguration.blogUrl;
        this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
    }

    public ngAfterViewInit(): void {
        if (this.windowRef.nativeWindow.twttr && this.windowRef.nativeWindow.twttr.widgets) {
            this.windowRef.nativeWindow.twttr.widgets.load();
        }
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public closeNav(): void {
        this.sidenav.close();
    }

    public emitOpenJoinDialog(): void {
        this.communicationService.openJoinDialog();
    }

    private openJoinDialog(firstName: string | null, lastName: string | null): void {
        this.joinDialogObservable.next(this.dialog.open(JoinMailingListComponent, {
            ...this.dialogBaseSettings,
            data: {
                firstName: firstName ? firstName : '',
                lastName: lastName ? lastName : ''
            }
        }));
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

    public get showDataRelease(): boolean {
        return this.toolkitConfiguration.showDataRelease;
    }

    public get showInfoForPhysicians(): boolean {
        return this.toolkitConfiguration.showInfoForPhysicians;
    }

    public get showBlog(): boolean {
        return this.toolkitConfiguration.showBlog;
    }

    private initUserActionsListeners(): void {
        type Partial<T> = { [P in keyof T]?: T[P] };

        // get state from side nave directly from widget
        const sideNavStateChanges$: Observable<Partial<AppState>> = this.sidenav.openedChange.asObservable().pipe(
            startWith(this.sidenav.opened),
            distinctUntilChanged(),
            map(open => ({ sideNavOpen: open }))
        );

        // do same with dialog. A little more complicated
        const joinDialogStateChanges$: Observable<Partial<AppState>> = this.joinDialogObservable.pipe(
            switchMap(dialog => !dialog ?
                of({ joinDialogOpen: false }) :
                merge(
                    dialog.afterClosed().pipe(map(() => ({ joinDialogOpen: false }))),
                    dialog.afterOpen().pipe(map(() => ({ joinDialogOpen: true })))
                )),
            distinctUntilChanged()
        );

        // our joint view of the state
        const state$: Observable<AppState> = merge(sideNavStateChanges$, joinDialogStateChanges$).pipe(
            scan((acc: AppState, change) => ({ ...acc, ...change })),
            shareReplay(1)
        );

        // handle incoming events
        const openSideNav$ = this.communicationService.openSidePanel$.pipe(
            tap(() => this.sidenav.open())
        );

        const closeSideNav$ = this.communicationService.closeSidePanel$.pipe(
            tap(() => this.sidenav.close())
        );

        const userProfile$: Observable<UserProfile> = this.userProfile.profile.pipe(
            map((decorator: UserProfileDecorator | null) => decorator ? decorator.profile : new UserProfile())
        );

        const openJoinDialog$ = this.communicationService.openJoinDialog$.pipe(
            switchMap(() => state$.pipe(
                filter(state => !state.joinDialogOpen),
                take(1))),
            switchMap(() => userProfile$),
            tap((profile: UserProfile) => this.openJoinDialog(profile.firstName, profile.lastName))
        );

        // subscribe once to all the incoming events
        const ops$ = merge(openSideNav$, closeSideNav$, openJoinDialog$).subscribe();

        this.anchor.addNew(ops$);
    }

    private initBrowserWarningListener(): void {
        const modal = this.browserContent.events.subscribe(() => {
            this.openWarningDialog();
        });
        this.anchor.addNew(modal);
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
